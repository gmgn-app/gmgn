import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";
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
import { GMGN_NETWORKS } from "@/lib/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Truncate the address for display.
export function truncateAddress(
  address: Address | undefined,
  numberOfChars: number
) {
  if (!address) return "--------------";
  let convertedAddress = address.toString();
  return `${convertedAddress.slice(
    0,
    numberOfChars
  )}...${convertedAddress.slice(-4)}`;
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
  if (!token) {
    switch (network) {
      case "kaia":
        return "KLAY";
      case "kaia-kairos":
        return "KLAY";
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
        return "KLAY";
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
      JSON.stringify(GMGN_NETWORKS)
    );
    return GMGN_NETWORKS;
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
