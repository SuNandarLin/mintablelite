import type { AWS } from '@serverless/typescript';

import { createItem, mintItem, listMintItems, getItemDetails, updateMetaData } from '@functions/mintablelite';

const serverlessConfiguration: AWS = {
  service: 'mintablelite-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    timeout: 30,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MINOLOGY_BASE_URL: 'https://api.mintology.dev/v1/',
      MINOLOGY_API_KEY: 'ZDljMmVmZDAtYjk0NC0xMWVlLTk1MzItYTU4NmZiOTJmNmFmOiQyYSQxMCRLcXhzRGpsMm9LOUpCcTR2c3RJLzNPL0xuWkwzR1U2NmFoVkhVV0drQXJtbTlVTGtJWnFUbQ',
      MINOLOGY_PROJECT_ID: 'd04ecbc0-bced-11ee-984e-533354039427',
      DYNAMODB_TABLE_NAME: 'MintLiteTable',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: "arn:aws:dynamodb:ap-southeast-1:*:table/MintLiteTable",
        },
        { 
          Effect: "Allow",
          Action: [
            "cognito-idp:AdminInitiateAuth",
            "cognito-idp:AdminCreateUser",
            "cognito-idp:AdminSetUserPassword"
          ],
          Resource: "*" 
        }
      ],
      },
    },
  },
  // import the function via paths
  functions: { createItem ,mintItem, listMintItems, getItemDetails, updateMetaData },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb:{
      start:{
        port: 5000,
        inMemory: true,
        migrate: true,
      },
      stages: "dev"
    }
  },
  resources: {
    Resources: {
      MintLiteTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "MintLiteTable",
          AttributeDefinitions: [{
            AttributeName: "itemId",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "itemId",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      UserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "mint-auth-pool",
          Schema: [{
            Name: "email",
            Required: true,
            Mutable: true
          }],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6
            }
          },
        AutoVerifiedAttributes: ["email"]
        }
      },
      UserClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "mint-client",
          GenerateSecret: false,
          UserPoolId: { 'Fn::GetAtt': ['UserPool', 'UserPoolId'] },
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: ["ALLOW_CUSTOM_AUTH","ALLOW_REFRESH_TOKEN_AUTH","ALLOW_USER_SRP_AUTH","ALLOW_USER_PASSWORD_AUTH"],
          CallbackURLs: ["https://oauth.pstmn.io/v1/browser-callback"],
          SupportedIdentityProviders: ["COGNITO"],
          AllowedOAuthScopes: ["openid","email"],
          AllowedOAuthFlows: ["code","implicit"],
        }
      },
      UserPoolDomain: {
        Type: "AWS::Cognito::UserPoolDomain",
        Properties: {
          Domain: "mint-auth",
          UserPoolId: { 'Fn::GetAtt': ['UserPool', 'UserPoolId'] },
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
