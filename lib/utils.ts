import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address as EvmAddress } from "viem";
import {
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  kairos,
  abstractTestnet,
  fraxtalTestnet,
  berachainTestnetbArtio,
  luksoTestnet,
  kaia,
  moonbaseAlpha,
  morphHolesky,
  scrollSepolia,
} from "viem/chains";
import { defineChain } from 'viem';
import { JsonRpcProvider } from "@kaiachain/ethers-ext";
import { AVAILABLE_NETWORKS } from "@/lib/chains";
// polkadot
import { Keyring } from '@polkadot/keyring';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

export const westendAssetHubPolkadot = defineChain({
  id: 420420421,
  name: "Asset-Hub Westend Testnet",
  nativeCurrency: {
    decimals: 18,
    name: 'Westend',
    symbol: 'WND',
  },
  rpcUrls: {
    default: {
      http: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
      webSocket: ['wss://westend-asset-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://assethub-westend.subscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5882,
    },
  },
})

// Truncate the address for display.
export function truncateAddress(
  address: EvmAddress | string | undefined | null,
  numberOfChars: number
) {
  if (!address) return "--------------";
  let convertedAddress = address.toString();
  return `${convertedAddress.slice(
    0,
    numberOfChars
  )}...${convertedAddress.slice(-numberOfChars)}`;
}

// Truncate the hash for display
export function truncateHash(
  address: String | undefined,
  numberOfChars: number
) {
  if (!address) return "--------------";
  let convertedAddress = address.toString();
  return `${convertedAddress.slice(
    0,
    numberOfChars
  )}...${convertedAddress.slice(-numberOfChars)}`;
}

// Format the balance for display
export function formatBalance(number: string, maxDecimal: number) {
  if (number === "" || number === "0") return "0";
  // if whole number, return the number
  if (!number.includes(".")) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  // split the number base on the decimal point, then take only maxDecimals character from the decimal part
  const [whole, decimal] = number.split(".");
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedWhole}.${decimal.slice(0, maxDecimal)}`;
}


export function selectViemObjectFromChainId(chainId: string) {
  switch (chainId) {
    case "eip155:1001":
      return kairos;
    case "eip155:8217":
      return kaia;
    case "eip155:421614":
      return arbitrumSepolia;
    case "eip155:84532":
      return baseSepolia;
    case "eip155:11155111":
      return sepolia;
    case "eip155:11124":
      return abstractTestnet;
    case "eip155:2522":
      return fraxtalTestnet;
    case "eip155:80084":
      return berachainTestnetbArtio;
    case "eip155:4201":
      return luksoTestnet;
    case "eip155:1287":
      return moonbaseAlpha;
    case "eip155:2710":
      return morphHolesky;
    case "eip155:534351":
      return scrollSepolia;
    case "eip155:420420421":
      return westendAssetHubPolkadot;
    default:
      return kairos;
  }
}


export function selectBlockExplorerFromChainId(chainId: string | undefined | null) {
  switch (chainId) {
    case "eip155:8217":
      return "https://kaiascan.io";
    case "eip155:1001":
      return "https://kairos.kaiascan.io";
    case "eip155:421614":
      return "https://sepolia.arbiscan.io";
    case "eip155:84532":
      return "https://sepolia.basescan.org";
    case "eip155:11155111":
      return "https://sepolia.etherscan.io";
    case "eip155:11124":
      return "https://explorer.testnet.abs.xyz";
    case "eip155:2522":
      return "https://holesky.fraxscan.com";
    case "eip155:80084":
      return "https://bartio.beratrail.io";
    case "eip155:4201":
      return "https://explorer.execution.testnet.lukso.network";
    case "eip155:1287":
      return "https://moonbase.moonscan.io";
    case "eip155:2710":
      return "https://explorer-holesky.morphl2.io";
    case "eip155:534351":
      return "https://sepolia.scrollscan.com";
    case "polkadot:94220":
      return "https://paseo.subscan.io";
    case "polkadot:0":
      return "https://subscan.io";
    case "polkadot:6":
      return "https://bifrost.subscan.io";
    default:
      return "https://kairos.kaiascan.io";
  }
}


// Function to change the explorer URL based on the chainId
function selectBlockExplorerAccountFormatFromChainId(chainId: string, evmAddress: EvmAddress, polkadotAddress: string) {
  const chainType = chainId.split(":")[0]
  const chainIdNumber = chainId.split(":")[1]

  switch (chainType) {
    case "eip155":
      return `address/${evmAddress}`
    case "polkadot":
      return `account/${polkadotAddress}`
    default:
      return "n/a"
  }
}


export function selectNativeAssetLogoFromChainId(chainId: string | undefined | null) {
  const chainType = chainId?.split(":")[0];
  const chainIdNumber = chainId?.split(":")[1];
  if (chainType === "eip155") {
    switch (chainIdNumber) {
      case "1001":
        return "/logos/kaia.svg";
      case "8217":
        return "/logos/kaia.svg";
      case "421614":
        return "/logos/eth.svg";
      case "84532":
        return "/logos/eth.svg";
      case "11155111":
        return "/logos/eth.svg";
      case "11124":
        return "/logos/eth.svg";
      case "2522":
        return "/logos/eth.svg";
      case "80084":
        return "/logos/bera.svg";
      case "4201":
        return "/logos/lyxt.svg";
      case "1287":
        return "/logos/moonbeam.svg";
      case "2710":
        return "/logos/eth.svg";
      case "534351":
        return "/logos/eth.svg";
      case "420420421":
        return "/logos/wnd.svg";
      default:
        return "/logos/kaia.svg";
    }
  } 
  if (chainType === "polkadot") {
    switch (chainIdNumber) {
      case "94220":
        return "/logos/paseo.svg";
      case "0":
        return "/logos/polkadot.svg";
      case "6":
        return "/logos/bifrost.svg";
      default:
        return "/logos/polkadot.svg";
    }
  }
}

export function selectChainNameFromChainId(chainId: string | undefined | null) {
  const chainType = chainId?.split(":")[0];
  const chainIdNumber = chainId?.split(":")[1];
  if (chainType === "eip155") {
    switch (chainIdNumber) {
      case "1001":
        return "Kaia Kairos";
      case "8217":
        return "Kaia";
      case "421614":
        return "Arbitrum Sepolia";
      case "84532":
        return "Base Sepolia";
      case "11155111":
        return "Ethereum Sepolia";
      case "11124":
        return "Abstract Testnet";
      case "2522":
        return "Fraxtal Testnet";
      case "80084":
        return "bArtio Testnet";
      case "4201":
        return "Lukso Testnet";
      case "1287":
        return "Moonbase Alpha";
      case "2710":
        return "Morph Testnet";
      case "534351":
        return "Scroll Sepolia";
      case "420420421":
        return "Westend Asset Hub";
      default:
        return "Kaia Kairos";
    }
  }

  if (chainType === "polkadot") {
    switch (chainIdNumber) {
      case "94220":
        return "Paseo";
      case "0":
        return "Polkadot";
      case "6":
        return "Bifrost";
      default:
        return "Polkadot";
    }
  }
}

export function selectNativeAssetInfoFromChainId(chainId: string | undefined | null) {
  const chainType = chainId?.split(":")[0];
  const chainIdNumber = chainId?.split(":")[1];
  if (chainType === "eip155") {
    switch (chainIdNumber) {
      case "1001":
        return "Kaia Kairos:Kaia:KAIA";
      case "8217":
        return "Kaia:Kaia:KAIA";
      case "421614":
        return "Arbitrum Sepolia:Ether:ETH";
      case "84532":
        return "Base Sepolia:Ether:ETH";
      case "11155111":
        return "Ethereum Sepolia:Ether:ETH";
      case "11124":
        return "Abstract Testnet:Ether:ETH";
      case "2522":
        return "Fraxtal Testnet:Frax Ether:frxETH";
      case "80084":
        return "bArtio Testnet:Bera Token:BERA";
      case "4201":
        return "Lukso Testnet:Lyxt Token:LYXT";
      case "1287":
        return "Moonbase Alpha:Dev Token:DEV";
      case "2710":
        return "Morph Testnet:Ether:ETH";
      case "534351":
        return "Scroll Sepolia:Ether:ETH";
      case "420420421":
        return "Westend Asset Hub:Westend:WND";
      default:
        return "Kaia Kairos:Kaia:KAIA";
    }
  }
  if (chainType === "polkadot") {
    switch (chainIdNumber) {
      case "94220":
        return "Paseo:Paseo:PAS";
      case "0":
        return "Polkadot:Polkadot:DOT";
      case "6":
        return "Bifrost:Bifrost:BNC";
      default:
        return "Polkadot:Polkadot:DOT";
    }
  }

  return "Kaia Kairos:Kaia:KAIA";
}



export function selectAssetInfoFromAssetId(assetId: string | undefined | null) {

  switch (assetId) {
    case "eip155:1001/erc20:0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746":
      return "Kaia Kairos:Test USDC:tUSDC:/logos/usdc.svg";
    case "eip155:1001/erc20:0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d":
      return "Kaia Kairos:Test USDT:tUSDT:/logos/usdt.svg";
    case "eip155:1001/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Kaia Kairos:Kaia:KAIA:/logos/kaia.svg";
    case "eip155:8217/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Kaia:Kaia:KAIA:/logos/kaia.svg";
    case "eip155:421614/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Arbitrum Sepolia:Ether:ETH:/logos/eth.svg";
    case "eip155:84532/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Base Sepolia:Ether:ETH:/logos/eth.svg";
    case "eip155:11155111/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Ethereum Sepolia:Ether:ETH:/logos/eth.svg";
    case "eip155:11124/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Abstract Testnet:Ether:ETH:/logos/eth.svg";
    case "eip155:2522/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Fraxtal Testnet:Frax Ether:frxETH:/logos/eth.svg";
    case "eip155:80084/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "bArtio Testnet:Bera Token:BERA:/logos/bera.svg";
    case "eip155:4201/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Lukso Testnet:Lyxt Token:LYXT:/logos/lyxt.svg";
    case "eip155:1287/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Moonbase Alpha:Dev Token:DEV:/logos/moonbeam.svg";
    case "eip155:2710/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Morph Testnet:Ether:ETH:/logos/eth.svg";
    case "eip155:534351/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Scroll Sepolia:Ether:ETH:/logos/eth.svg";
    case "eip155:420420421/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Westend Asset Hub:Westend:WND:/logos/wnd.svg";
    case "polkadot:94220/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Paseo:Paseo:PAS:/logos/paseo.svg";
    case "polkadot:0/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Polkadot:Polkadot:DOT:/logos/polkadot.svg";
    case "polkadot:6/slip44:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":
      return "Bifrost:Bifrost:BNC:/logos/bifrost.svg";
    default:
      return "Kaia Kairos:Kaia:KAIA:/logos/kaia.svg";
  }
}

export function selectJsonRpcProvider(network: string | undefined | null) {
  switch (network) {
    case "kaia":
      return new JsonRpcProvider("https://public-en.node.kaia.io");
    case "kaia-kairos":
      return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
    default:
      return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
  }
}

export function constructNavUrl(
  path: string,
  network: string | undefined | null,
  address: string | undefined | null,
  token?: string | undefined | null
) {
  if (address === null || address === undefined || address === "null") {
    return `${path}?network=${network}`;
  } else if (token === null || token === undefined || token === "null") {
    return `${path}?network=${network}&address=${address}`;
  } else {
    return `${path}?network=${network}&address=${address}&token=${token}`;
  }
}