import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AuthorizeResponse, MintItemRequest, MintRequest, MintableItem, SuccessMessage } from "src/model/mintableitem";
import { mint, authorize } from "src/mintableapi/mintableapi";
import { v4 } from "uuid";

export default class MintableItemService {

    private Tablename: string = process.env.DYNAMODB_TABLE_NAME;

    constructor(private docClient: DocumentClient) { }

    async createItem(mintableItem: MintableItem): Promise<MintableItem> {
        const mintedItem = await this.docClient.put({
            TableName: this.Tablename,
            Item: mintableItem
        }).promise()
        return mintedItem.Attributes as MintableItem;
    }

    async mintItem(request: MintItemRequest): Promise<SuccessMessage> {
        try{
            let item: MintRequest;
            if((request.itemId) && (request.itemId !== 'null')){
                const premintItem: MintableItem = await this.getItemDetails(request.itemId);
                item = {
                    email: premintItem.email,
                    metadata: {
                        name: premintItem.name,
                        image: premintItem.image,
                    },
                    wallet_address: premintItem.walletAddress,
                }
                const mintResponse = await mint(item);
    
                if((mintResponse.data.token_id) && (mintResponse.data.token_id !== 'null')){
                    await this.docClient
                        .update({
                            TableName: this.Tablename,
                            Key: { itemId: premintItem.itemId },
                            UpdateExpression:
                                "SET #tokenId = :tokenId, #updatedAt = :updatedAt",
                            ExpressionAttributeNames: {
                                "#tokenId": "tokenId",
                                "#updatedAt": "updatedAt"
                            },
                            ExpressionAttributeValues: {
                                ":tokenId": mintResponse.data.token_id,
                                ":updatedAt": new Date().toISOString(),
                            },
                            ReturnValues: "UPDATED_NEW",
                        })
                        .promise();
    
                    return { message: "Success minting the item"};
                }   
            }else{
                item = {
                    email: request.email,
                    metadata: {
                        name: request.name,
                        image: request.image
                    },
                    wallet_address: request.walletAddress
                }
                const mintResponse = await mint(item);
                if((mintResponse.data.token_id) && (mintResponse.data.token_id !== 'null')){
                    const id = v4();
                    const mintableItem: MintableItem = {
                        itemId: id,
                        name: request.name,
                        image: request.image,
                        email: request.email,
                        tokenId: mintResponse.data.token_id,
                        walletAddress: request.walletAddress,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                    await this.docClient.put({
                        TableName: this.Tablename,
                        Item: mintableItem
                    }).promise();
                    return { message: "Success creating and minting the item"};
                }
            }
        }catch(e){
            console.error(e);
            throw new Error("Error in minting item!");
        }     
    }
   
    async listMintItems(): Promise<MintableItem[]> {
        const mintableItems = await this.docClient.scan({
            TableName: this.Tablename,
            FilterExpression: 'attribute_exists(tokenId) AND tokenId <> :value',
            ExpressionAttributeValues: {
                ":value": ""
            }
        }).promise()
        return mintableItems.Items as MintableItem[];
     }

    async getItemDetails(id: string): Promise<any> {
        const mintableItem = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                itemId: id
            }
        }).promise()
        if (!mintableItem.Item) {
            throw new Error("Id does not exit");
        }
        return mintableItem.Item as MintableItem;
    }

    async updateMetaData(id: string, mintableItem: Partial<MintableItem>): Promise<MintableItem> {
        const item: MintableItem = await this.getItemDetails(id);
        const itemTokenId = item.tokenId;

        let authResponse: AuthorizeResponse;
        if(itemTokenId && (itemTokenId!=='')){
            authResponse = await authorize({
                token_id: itemTokenId,
                wallet_address: item.walletAddress,
            });
        }

        if(authResponse.data.authorized){
            const updated = await this.docClient
                .update({
                    TableName: this.Tablename,
                    Key: { itemId: id },
                    UpdateExpression:
                        "SET #name = :name, #image = :image, #description = :description, "
                        + "#updatedAt = :updatedAt",
                    ExpressionAttributeNames: {
                        "#name": "name",
                        "#image": "image",
                        "#description": "description",
                        "#updatedAt": "updatedAt"
                    },
                    ExpressionAttributeValues: {
                        ":name": mintableItem.name,
                        ":image": mintableItem.image,
                        ":description": mintableItem.description,
                        ":updatedAt": new Date().toISOString(),
                    },
                    ReturnValues: "UPDATED_NEW",
                })
                .promise();
            return updated.Attributes as MintableItem;
        }else{
            throw new Error("Not Authorized to the item");
        }
    }
}
