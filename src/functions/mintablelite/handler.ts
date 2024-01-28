import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 } from "uuid";
import mintableItemService from "src/service";
import schema from "./schema";

const createItemHandler : ValidatedEventAPIGatewayProxyEvent<typeof schema> = 
    async (event) => {
    try {
        const id = v4();
        const mintableItem = await mintableItemService.createItem({
            itemId: id,
            name: `${event.body.name}`,
            image: `${event.body.image}`,
            email: `${event.body.email}`,
            description: `${event.body.description}`,
            title: `${event.body.title}`,
            walletAddress: `${event.body.walletAddress}`,
        })
        return formatJSONResponse({
            mintableItem
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
};

const mintItemHandler : ValidatedEventAPIGatewayProxyEvent<typeof schema> = 
    async (event) => {
    try {
        const mintableItem = await mintableItemService.mintItem({
            itemId: `${event.body.itemId ?? null}`,
            name: `${event.body.name}`,
            image: `${event.body.image}`,
            email: `${event.body.email}`,
            description: `${event.body.description}`,
            title: `${event.body.title}`,
            walletAddress: `${event.body.walletAddress}`,
        })
        return formatJSONResponse({
            mintableItem
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
};

const listMintItemsHandler = async () => {
    const mintableItems = await mintableItemService.listMintItems();
    return formatJSONResponse ({
        mintableItems
    })
};

const getItemDetailsHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.id;
    try {
        const mintableItem = await mintableItemService.getItemDetails(id)
        return formatJSONResponse({
            mintableItem, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
}

const updateMetaDataHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.id;
    try {
        const mintableItem = await mintableItemService.updateMetaData(id,event.body);
        return formatJSONResponse({
            mintableItem, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
};

export const createItem = middyfy(createItemHandler);
export const mintItem = middyfy(mintItemHandler);
export const listMintItems = middyfy(listMintItemsHandler);
export const getItemDetails = middyfy(getItemDetailsHandler);
export const updateMetaData = middyfy(updateMetaDataHandler);

