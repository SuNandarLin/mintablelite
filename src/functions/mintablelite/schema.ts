export default {
    type: "object",
    properties: {
      itemId: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      email: { type: 'string' },
      walletAddress: { type: 'string' },
      contractAddress: { type: 'string' },
      tokenId: { type: 'string' },
      tokenName: { type: 'string' },
    },
} as const;
  