import { handlerPath } from '@libs/handler-resolver';

export const createItem = {
    handler: `${handlerPath(__dirname)}/handler.createItem`,
    events: [
        {
            http: {
                method: 'post',
                path: 'mintableitem',
                authorizer: {
                    name: "CognitoAuthorizer",
                    type: "COGNITO_USER_POOLS",
                    arn: { 
                        'Fn::GetAtt': ['UserPool', 'Arn'] 
                    }
                }
            },
        },
    ],
};

export const mintItem = {
    handler: `${handlerPath(__dirname)}/handler.mintItem`,
    events: [
        {
            http: {
                method: 'post',
                path: 'mintableitem/mint',
                authorizer: {
                    name: "CognitoAuthorizer",
                    type: "COGNITO_USER_POOLS",
                    arn: { 
                        'Fn::GetAtt': ['UserPool', 'Arn'] 
                    }
                }
            },
        },
    ],
};

export const listMintItems = {
    handler: `${handlerPath(__dirname)}/handler.listMintItems`,
    events: [
        {
            http: {
                method: 'get',
                path: 'mintableitem/',
                authorizer: {
                    name: "CognitoAuthorizer",
                    type: "COGNITO_USER_POOLS",
                    arn: { 
                        'Fn::GetAtt': ['UserPool', 'Arn'] 
                    }
                }
            },
        },
    ],
};

export const getItemDetails = {
    handler: `${handlerPath(__dirname)}/handler.getItemDetails`,
    events: [
        {
            http: {
                method: 'get',
                path: 'mintableitem/{id}',
                authorizer: {
                    name: "CognitoAuthorizer",
                    type: "COGNITO_USER_POOLS",
                    arn: { 
                        'Fn::GetAtt': ['UserPool', 'Arn'] 
                    }
                }
            },
        },
    ],
};

export const updateMetaData = {
    handler: `${handlerPath(__dirname)}/handler.updateMetaData`,
    events: [
        {
            http: {
                method: 'put',
                path: 'mintableitem/{id}',
                authorizer: {
                    name: "CognitoAuthorizer",
                    type: "COGNITO_USER_POOLS",
                    arn: { 
                        'Fn::GetAtt': ['UserPool', 'Arn'] 
                    }
                }
            },
        },
    ],
};
