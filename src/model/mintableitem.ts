export interface MintableItem { //to change - name of interface
    itemId?: string
    email?: string
    name: string
    image: string
    animationUrl?: string
    description?: string
    title?: string
    subtitle?: string
    tokenId?: string
    tokenName?: string
    walletAddress?: string
    createdAt?: string
    updatedAt?: string
}

export interface MintItemRequest {
    itemId?: string
    email?: string
    name?: string
    image?: string
    walletAddress?: string
}

export interface MintRequest {
    email: string
    metadata?: {
        name: string
        image: string
        animation_url?: string
        description?: string
        attributes?: {
            trait_type: string
            value: string
        }
        title?: string
        subtitle?: string
    }
    wallet_address?: string
    premint_id?: string
}

export interface MintResponse {
    data: {
        token_id: string
    }
}

export interface AuthorizeRequest {
    contract_address?: string
    token_id?: string
    wallet_address: string
    email?: string
}

export interface AuthorizeResponse {
    data: {
        authorized: boolean
        next_token?: string
    }
}

export interface SuccessMessage {
    message: string
}