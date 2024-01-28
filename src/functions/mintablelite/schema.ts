export default {
    type: "object",
    properties: {
      itemId: { type: 'string' },
      email: { type: 'string' },
      name: { type: 'string' },
      image: { type: 'string' },
      description: { type: 'string' },
      walletAddress: { type: 'string' },
      title: { type: 'string' },
      tokenId: { type: 'string' },
      tokenName: { type: 'string' },
    },
} as const;
  