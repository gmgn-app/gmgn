export const GMGN_NETWORKS = [
  "kaia-kairos",
  "kaia",
  "arbitrum-sepolia",
  "base-sepolia",
  "ethereum-sepolia",
  "abstract-testnet",
  "fraxtal-testnet",
  "bartio-testnet",
  "lukso-testnet",
  "moonbase-alpha-testnet",
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
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
        decimals: 6,
      },
      {
        id: 2,
        name: "Mocked USDT",
        symbol: "mUSDT",
        address: "0x6c3f90f043a72fa612cbac8115ee7e52bde6e490",
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