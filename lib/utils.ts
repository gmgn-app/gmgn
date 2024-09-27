import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";
import { sepolia, arbitrumSepolia, baseSepolia, klaytnBaobab } from "viem/chains";
import { JsonRpcProvider } from "@kaiachain/ethers-ext";


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

export function selectChainNameFromNetwork(network: string | null) {
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
    default:
      return "Unknown Network";
  }
}

export function selectViemChainFromNetwork(network: string | undefined | null) {
  switch (network) {
    case "kaia-kairos":
      return klaytnBaobab;
    case "arbitrum-sepolia":
      return arbitrumSepolia;
    case "base-sepolia":
      return baseSepolia;
    case "ethereum-sepolia":
      return sepolia;
    default:
      return sepolia;
  }
}

export function selectBlockExplorer(network: string | undefined) {
  switch (network) {
    case "kaia":
      return "https://kaiascan.io";
    case "kaia-kairos":
      return "https://kairos.kaiascan.io";
    default:
      return "https://kairos.kaiascan.io";
  }
}

export function selectNativeAssetSymbol(network: string | undefined) {
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
    default:
      return "ETH";
  }
}

export function selectJsonRpcProvider(network: string | undefined) {
  switch (network) {
    case "kaia":
      return new JsonRpcProvider("https://public-en-kaia.node.kaia.io");
    case "kaia-kairos":
      return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
    default:
      return new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
  }
}