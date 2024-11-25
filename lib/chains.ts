export const AVAILABLE_NETWORKS = [
  "eip155:11155111", // ethereum sepolia
  "eip155:1001", // kaia kairos
  "eip155:8217", // kaia
  "eip155:421614", // arbitrum sepolia
  "eip155:84532", // base sepolia
  "eip155:11124", // abstract testnet
  "eip155:2522", // fraxtal testnet
  "eip155:80084", // berachain testnet bartio
  "eip155:4201", // lukso testnet
  "eip155:1287", // moonbase alpha testnet
  "eip155:2710", // morph testnet
  "eip155:534351", // scroll sepolia
  "eip155:420420421", // westend asset hub polkadot "
  "polkadot:94220" // polkadot passeo testnet
];


export const CHAINS_INFO = [
  {
    id: 1,
    name: "Kaia Kairos",
    slug: "kaia-kairos",
    chainId: 1001,
    defaultBlockExplorer: "https://kairos.kaiascan.io",
    nativeSymbol: "KLAY",
    stablecoins: [
      {
        id: 1,
        name: "Mocked USDC",
        symbol: "mUSDC",
        address: "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746",
        decimals: 6,
      },
      {
        id: 2,
        name: "Mocked USDT",
        symbol: "mUSDT",
        address: "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d",
        decimals: 6,
      },
    ]
  },
  {
    id: 2,
    name: "Arbitrum Sepolia",
    slug: "arbitrum-sepolia",
    chainId: 421611,
    defaultBlockExplorer: "https://sepolia.arbiscan.io",
    nativeSymbol: "ETH",
    stablecoins: [
      {
        id: 1,
        name: "USDC",
        symbol: "USDC",
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        decimals: 6,
      },
      {
        id: 2,
        name: "USDT",
        symbol: "USDT",
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        decimals: 6,
      },
    ]
  },
  {
    id: 3,
    name: "Base Sepolia",
    slug: "base-sepolia",
    chainId: 42161,
    defaultBlockExplorer: "https://sepolia.basescan.org",
    nativeSymbol: "ETH",
    stablecoins: [
      {
        id: 1,
        name: "USDC",
        symbol: "USDC",
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        decimals: 6,
      },
      {
        id: 2,
        name: "USDT",
        symbol: "USDT",
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        decimals: 6,
      },
    ]
  }
]

export const CHAIN_NAMES = CHAINS_INFO.map((chain) => chain.slug);