"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Droplets, Loader2 } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { createPublicClient, http, Address, formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  formatBalance,
  selectViemChainFromNetwork,
  selectNativeAssetSymbol,
} from "@/lib/utils";

type CloudflareTurnstileStatus =
  | "not-started"
  | "error"
  | "solved"
  | "expired"
  | "loading";

export default function FaucetForm() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  // Get the address from the search params.
  const address = searchParams.get("address");
  // Get the network from the search params.
  const network = searchParams.get("network") || "kaia-kairos";
  const { toast } = useToast();
  const [currentBalance, setCurrentBalance] = useState<string | null>(null);
  const [cloudflareTurnstileStatus, setCloudflareTurnstileStatus] =
    useState<CloudflareTurnstileStatus>("not-started");
  const [token, setToken] = useState<string | null>(null);
  const [requestFaucetLoading, setRequestFaucetLoading] = useState(false);

  // Fetch the current balance upon page load
  useEffect(() => {
    if (address) {
      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network as string),
        transport: http(),
      });
      const fetchBalance = async () => {
        const balance = await publicClient.getBalance({
          address: address as Address,
        });
        setCurrentBalance(formatEther(balance).toString());
      };
      // call the function
      fetchBalance()
        // make sure to catch any error
        .catch(console.error);
    }
  }, [address, network]);

  // public client for balance refresh
  const publicClient = createPublicClient({
    chain: selectViemChainFromNetwork(network!),
    transport: http(),
  });

  // Function to fetch balance
  async function fetchBalance() {
    const balance = await publicClient.getBalance({
      address: address as Address,
    });
    setCurrentBalance(formatEther(balance).toString());
  }

  async function requestFaucet() {
    setRequestFaucetLoading(true);
    const res = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await res.json()
    if (data.success) {
      await fetch(
        "https://api-baobab.wallet.klaytn.com/faucet/run?address=" + address,
        { method: "POST" }
      )
        .then((response: any) => response.json())
        .then((data: any) => {
          if (data.result === "SUCCESS") {
            toast({
              className:
                "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
              description: "Request faucet success. Refresh balance.",
            });
          } else {
            toast({
              className:
                "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
              variant: "destructive",
              description: "Already requested faucet",
            });
          }
        })
        .catch((error) =>
          toast({
            className:
              "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
            variant: "destructive",
            description: `There was a problem with your request. Log: ${error}`,
          })
        );
    } else {
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        description: "Failed to solve the challenge",
      });
    }
    setRequestFaucetLoading(false);
  }

  function handleCloudflareTurnstileSuccess(token: string) {
    setToken(token);
    setCloudflareTurnstileStatus("solved");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-xl">Balance</h2>
        <div className="flex flex-row items-center justify-between">
          <p className="text-2xl">
            {currentBalance ? formatBalance(currentBalance, 4) : "-/-"}{" "}
            <span className="text-lg">{selectNativeAssetSymbol(network)}</span>
          </p>
          <Button onClick={fetchBalance} size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {requestFaucetLoading ? (
          <Button className="w-[200px]" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            onClick={requestFaucet}
            disabled={cloudflareTurnstileStatus === "solved" ? false : true}
            className="w-[200px]"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Request faucet
          </Button>
        )}
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
          onError={() => setCloudflareTurnstileStatus("error")}
          onExpire={() => setCloudflareTurnstileStatus("expired")}
          onSuccess={handleCloudflareTurnstileSuccess}
        />
      </div>
    </div>
  );
}
