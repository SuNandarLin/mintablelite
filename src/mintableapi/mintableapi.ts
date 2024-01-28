import fetch from 'node-fetch';
import { AuthorizeRequest, AuthorizeResponse, MintRequest, MintResponse } from 'src/model/mintableitem';

const minologyURL = process.env.MINOLOGY_BASE_URL + process.env.MINOLOGY_PROJECT_ID ;

export const mint = async (request: MintRequest): Promise<MintResponse> => {
    try{
        const responseData = await fetch(
            (minologyURL+"/mint"),
            {
                method: 'post',
	            body: JSON.stringify(request),
	            headers: {
                    'Content-Type': 'application/json',
                    'API-Key': process.env.MINOLOGY_API_KEY,
                }
            }
        );
        const response = await responseData.json();
        return response as MintResponse;

    }catch(e){
        console.error(e);
        throw new Error("Failed in calling Minology Mint API");
    }
};

export const authorize = async (request: AuthorizeRequest): Promise<AuthorizeResponse> => {
    try{
        const responseData = await fetch(
            (minologyURL+"/authorize"),
            {
                method: 'post',
	            body: JSON.stringify(request),
	            headers: {
                    'Content-Type': 'application/json',
                    'API-Key': process.env.MINOLOGY_API_KEY,
                }
            }
        );
        const response = await responseData.json();
        return response as AuthorizeResponse;

    }catch(e){
        console.error(e);
        throw new Error("Failed in calling Minology Authorize API");
    }
};
