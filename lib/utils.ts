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
  moonbaseAlpha
} from "viem/chains";
import { JsonRpcProvider } from "@kaiachain/ethers-ext";
import { AVAILABLE_NETWORKS } from "@/lib/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 

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

export function selectChainNameFromNetwork(network: string | undefined | null) {
  if (!network) return "Unknown Network";
  switch (network) {
    case "ethereum-sepolia":
      return "Ethereum Sepolia";
    case "arbitrum-sepolia":
      return "Arbitrum Sepolia";
    case "base-sepolia":
      return "Base Sepolia";
    case "kaia-kairos":
      return "Kaia Kairos";
    case "kaia":
      return "Kaia";
    case "abstract-testnet":
      return "Abstract Testnet";
    case "fraxtal-testnet":
      return "Fraxtal Testnet";
    case "bartio-testnet":
      return "bArtio Testnet";
    case "lukso-testnet":
      return "Lukso Testnet";
    case "moonbase-alpha-testnet":
      return "Moonbase Alpha";
    default:
      return "Unknown Network";
  }
}

export function selectViemChainFromNetwork(network: string | undefined | null) {
  switch (network) {
    case "kaia-kairos":
      return kairos;
    case "kaia":
      return kaia;
    case "arbitrum-sepolia":
      return arbitrumSepolia;
    case "base-sepolia":
      return baseSepolia;
    case "ethereum-sepolia":
      return sepolia;
    case "abstract-testnet":
      return abstractTestnet;
    case "fraxtal-testnet":
      return fraxtalTestnet;
    case "bartio-testnet":
      return berachainTestnetbArtio;
    case "lukso-testnet":
      return luksoTestnet;
    case "moonbase-alpha-testnet":
      return moonbaseAlpha;
    default:
      return kairos;
  }
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
    default:
      return kairos;
  }
}

export function selectBlockExplorer(network: string | undefined | null) {
  switch (network) {
    case "kaia":
      return "https://kaiascan.io";
    case "kaia-kairos":
      return "https://kairos.kaiascan.io";
    case "arbitrum-sepolia":
      return "https://sepolia.arbiscan.io";
    case "base-sepolia":
      return "https://sepolia.basescan.org";
    case "ethereum-sepolia":
      return "https://sepolia.etherscan.io";
    case "abstract-testnet":
      return "https://explorer.testnet.abs.xyz";
    case "fraxtal-testnet":
      return "https://holesky.fraxscan.com";
    case "bartio-testnet":
      return "https://bartio.beratrail.io";
    case "lukso-testnet":
      return "https://explorer.execution.testnet.lukso.network";
    case "moonbase-alpha-testnet":
      return "https://moonbase.moonscan.io";
    default:
      return "https://kairos.kaiascan.io";
  }
}

export function selectNativeAssetSymbol(network: string | undefined | null, token?: string | undefined | null) {
  if (!token || token === "0x0000000000000000000000000000000000000000") {
    switch (network) {
      case "kaia":
        return "KAIA";
      case "kaia-kairos":
        return "KAIA";
      case "arbitrum-sepolia":
        return "ETH";
      case "base-sepolia":
        return "ETH";
      case "ethereum-sepolia":
        return "ETH";
      case "abstract-testnet":
        return "ETH";
      case "fraxtal-testnet":
        return "frxETH";
      case "bartio-testnet":
        return "BERA";
      case "lukso-testnet":
        return "LYXt";
      case "moonbase-alpha-testnet":
        return "DEV";
      default:
        return "KAIA";
    }
  } else {
    switch (token) {
      case "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746":
        return "tUSDC";
      case "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d":
        return "tUSDT";
      default:
        return "Unknown Token";
    }
  }
}

export function selectAssetLogo(network: string | undefined | null, token?: string | undefined | null) {
  if (!token || token === "0x0000000000000000000000000000000000000000") {
    switch (network) {
      case "kaia":
        return "/logos/kaia.svg";
      case "kaia-kairos":
        return "/logos/kaia.svg";
      case "arbitrum-sepolia":
        return "/logos/eth.svg";
      case "base-sepolia":
        return "/logos/eth.svg";
      case "ethereum-sepolia":
        return "/logos/eth.svg";
      case "abstract-testnet":
        return "/logos/eth.svg";
      case "fraxtal-testnet":
        return "/logos/eth.svg";
      case "bartio-testnet":
        return "/logos/bera.svg";
      case "lukso-testnet":
        return "/logos/lyxt.svg";
      case "moonbase-alpha-testnet":
        return "/logos/moonbeam.svg";
      default:
        return "/logos/kaia.svg";
    }
  } else {
    switch (token) {
      case "0x8cfA6aC9c5ae72faec3A0aEefEd1bFB12c8cC746":
        return "/logos/usdc.svg";
      case "0x0076e4cE0E5428d7fc05eBaFbd644Ee74BDE624d":
        return "/logos/usdt.svg";
      default:
        return "/logos/unknown.svg";
    }
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
      default:
        return "/logos/kaia.svg";
    }
  } else {
    return "/logos/kaia.svg";
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
      default:
        return "Kaia Kairos";
    }
  } else {
    return "Kaia Kairos";
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
      default:
        return "Kaia Kairos:Kaia:KAIA";
    }
  } else {
    return "Kaia Kairos:Kaia:KAIA";
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


export function manageAvailableNetworksInLocalStorage() {
  // if the user has not set the GMGN_NETWORKS in the local storage, set it.
  if (!localStorage.getItem("gmgn-available-networks")) {
    localStorage.setItem(
      "gmgn-available-networks",
      JSON.stringify(AVAILABLE_NETWORKS)
    );
    return AVAILABLE_NETWORKS;
  }

  // get the GMGN_NETWORKS from the local storage
  const GMGN_NETWORKS_FROM_LOCAL_STORAGE = localStorage.getItem(
    "gmgn-available-networks"
  );
  if (GMGN_NETWORKS_FROM_LOCAL_STORAGE) {
    const GMGN_AVAILABLE_NETWORKS = JSON.parse(
      GMGN_NETWORKS_FROM_LOCAL_STORAGE!
    );
    return GMGN_AVAILABLE_NETWORKS;
  }
}
