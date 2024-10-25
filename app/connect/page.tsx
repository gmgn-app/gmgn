"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import BackButton from "@/components/back-button";
import { Core } from "@walletconnect/core";
import { WalletKit, WalletKitTypes } from "@reown/walletkit";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { getOrThrow } from "@/lib/passkey-auth";

import {
  createPublicClient,
  createWalletClient,
  hexToBigInt,
  http,
  fromHex,
  formatEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Address, fromBytes } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GlobeLock,
  Check,
  X,
  Loader2,
  Trash2,
  ChevronsLeftRightEllipsis,
  ScanLine,
  ThumbsUp,
  ClipboardPaste,
  Unplug,
  RotateCcw,
  CircleX,
} from "lucide-react";
import {
  selectNativeAssetSymbol,
  truncateAddress,
  selectViemChainFromNetwork,
  truncateHash,
  selectBlockExplorer,
  constructNavUrl,
} from "@/lib/utils";
import { Scanner } from "@yudiel/react-qr-scanner";
import { get } from "http";

export default function ConnectPage() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  if (!network || !address) {
    redirect(constructNavUrl("/", network, address));
  }

  const router = useRouter();
  // Get the toast function from the useToast hook.
  const { toast } = useToast();

  const [approveButtonLoading, setApproveButtonLoading] = useState(false);
  const [
    approveSessionRequestButtonLoading,
    setApproveSessionRequestButtonLoading,
  ] = useState(false);
  const [rejectButtonLoading, setRejectButtonLoading] = useState(false);
  const [wcWalletKit, setWcWalletKit] = useState<any>(null);
  const [wcSessionString, setWcSessionString] = useState<string>("");
  const [wcId, setWcId] = useState<number>(0);
  const [wcParams, setWcParams] = useState<any>(null);
  const [sessionRequestTopic, setSessionRequestTopic] = useState<string>("");
  const [sessionRequestId, setSessionRequestId] = useState<number>(0);
  const [sessionRequestParams, setSessionRequestParams] = useState<any>(null);
  const [sessionRequestVerifyContext, setSessionRequestVerifyContext] =
    useState<any>(null);
  const [sessionRequestChainId, setSessionRequestChainId] =
    useState<string>("");
  const [wcApprovedNamespaces, setWcApprovedNamespaces] = useState<any>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isSessionRequestDialogOpen, setIsSessionRequestDialogOpen] =
    useState(false);
  const [activeSessionsDialogOpen, setActiveSessionsDialogOpen] =
    useState(false);
  const [activeSessions, setActiveSessions] = useState<Object>({});

  const [isPasted, setIsPasted] = useState(false);

  // QR Scan for input
  const [qrScanSuccess, setQrScanSuccess] = useState(false);

  // QR Scan open/close state
  const [isQrScanOpen, setIsQrScanOpen] = useState(false);

  const core = useMemo(
    () =>
      new Core({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      }),
    []
  );

  const metadata = useMemo(
    () => ({
      name: "GMGN-wallet",
      description: "Vox Populi",
      url: "https://www.gmgn.app",
      icons: ["/gmgn-logo.svg"],
    }),
    []
  );

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return; // Skip if already initialized

    async function initWalletKit() {
      if (!core || !metadata) return; // Ensure dependencies are available
      const walletKit = await WalletKit.init({
        core,
        metadata,
      });
      console.log("init walletkit");
      setWcWalletKit(walletKit);
    }

    initWalletKit();
    initRef.current = true; // Mark as initialized
  }, [core, metadata]); // Dependencies that should be


  // call the function to get active sessions at page load, after pairing, and after disconnecting
  useEffect(() => {
    getActiveSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wcWalletKit]);


  // Function to paste from clipboard
  const paste = async () => {
    setWcSessionString(await navigator.clipboard.readText());
    setIsPasted(true);

    setTimeout(() => {
      setIsPasted(false);
    }, 1000);
  };

  function getActiveSessions() {
    const activeSessions = wcWalletKit?.getActiveSessions();
    setActiveSessions(activeSessions);
  }

  async function onSessionProposal({
    id,
    params,
  }: WalletKitTypes.SessionProposal) {
    console.log(id);
    setWcId(id);
    console.log(params);
    setWcParams(params);

    try {
      // ------- namespaces builder util ------------ //
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: [
              "eip155:1",
              "eip155:10",
              "eip155:56",
              "eip155:100",
              "eip155:137",
              "eip155:196",
              "eip155:252",
              "eip155:324",
              "eip155:1284",
              "eip155:2222",
              "eip155:5000",
              "eip155:8453",
              "eip155:42161",
              "eip155:42220",
              "eip155:43114",
              "eip155:1313161554",
              "eip155:8217",
              "eip155:1001",
            ],
            methods: [
              "eth_accounts",
              "eth_requestAccounts",
              "eth_sendRawTransaction",
              "eth_sign",
              "eth_signTransaction",
              "eth_signTypedData",
              "eth_signTypedData_v3",
              "eth_signTypedData_v4",
              "eth_sendTransaction",
              "personal_sign",
              "wallet_switchEthereumChain",
              "wallet_addEthereumChain",
              "wallet_getPermissions",
              "wallet_requestPermissions",
              "wallet_registerOnboarding",
              "wallet_watchAsset",
              "wallet_scanQRCode",
              "wallet_sendCalls",
              "wallet_getCallsStatus",
              "wallet_showCallsStatus",
              "wallet_getCapabilities",
            ],
            events: [
              "chainChanged",
              "accountsChanged",
              "message",
              "disconnect",
              "connect",
            ],
            accounts: [
              `eip155:1:${address}`,
              `eip155:10:${address}`,
              `eip155:56:${address}`,
              `eip155:100:${address}`,
              `eip155:137:${address}`,
              `eip155:196:${address}`,
              `eip155:252:${address}`,
              `eip155:324:${address}`,
              `eip155:1284:${address}`,
              `eip155:2222:${address}`,
              `eip155:5000:${address}`,
              `eip155:8453:${address}`,
              `eip155:42161:${address}`,
              `eip155:42220:${address}`,
              `eip155:43114:${address}`,
              `eip155:1313161554:${address}`,
              `eip155:8217:${address}`,
              `eip155:1001:${address}`,
            ],
          },
        },
      });
      setWcApprovedNamespaces(approvedNamespaces);
      // ------- end namespaces builder util ------------ //

      setIsConnectDialogOpen(true);
    } catch (error) {
      await wcWalletKit.rejectSession({
        id: wcWalletKit.id,
        reason: getSdkError("USER_REJECTED"),
      });
    }
  }

  const handleSessionRequest = useCallback(
    async (event: any) => {
      const { topic, params, id, verifyContext } = event;
      const { chainId, request } = params;
      const requestParamsMessage = request.params[0];

      try {
        console.log("paramsMessage:", requestParamsMessage);
        console.log("type of paramsMessage:", typeof requestParamsMessage);
        console.log("request:", request);
        console.log("verifyContext:", verifyContext);
        console.log("chainId:", chainId);

        setSessionRequestTopic(topic);
        setSessionRequestId(id);
        setSessionRequestParams(requestParamsMessage);
        setSessionRequestVerifyContext(verifyContext);
        setSessionRequestChainId(chainId);
        setIsSessionRequestDialogOpen(true);
      } catch (error) {
        console.error("Error handling session request:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign the message. Please try again.",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    if (wcWalletKit) {
      wcWalletKit.on("session_request", handleSessionRequest);

      // Clean up the event listener when the component unmounts
      return () => {
        wcWalletKit.off("session_request", handleSessionRequest);
      };
    }
  }, [wcWalletKit, handleSessionRequest]);


  async function handlePairing() {
    if (!wcWalletKit) {
      console.error("WalletKit not initialized");
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Error",
        description: "WalletKit not initialized. Please initialize first.",
      });
      return;
    }
    try {
      wcWalletKit.on("session_proposal", onSessionProposal);
      console.log("Attempting to pair with URI:", wcSessionString);
      await wcWalletKit.pair({ uri: wcSessionString });
      console.log("Pairing successful");
      setApproveButtonLoading(false);
      setRejectButtonLoading(false);
    } catch (error) {
      console.error("Pairing error:", error);
      setApproveButtonLoading(false);
      setRejectButtonLoading(false);
      toast({
        className:
          "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
        variant: "destructive",
        title: "Pairing Error",
        description: "Failed to pair. Please try again.",
      });
    }
  }

  // Function to handle QR scan
  function handleQrScan(data: string) {
    setWcSessionString(data);
    setQrScanSuccess(true);
    // delay the success message for 2 seconds
    setTimeout(() => {
      setQrScanSuccess(false);
      setIsQrScanOpen(false);
    }, 500);
  }

  async function handleApproveSession() {
    setApproveButtonLoading(true);
    const session = await wcWalletKit.approveSession({
      id: wcId,
      namespaces: wcApprovedNamespaces,
    });
    console.log(session);
    setIsConnectDialogOpen(false);
    setApproveButtonLoading(false);
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      title: "Wallet connected!",
      description: "You can start interacting with the DApp now.",
    });
  }

  async function handleRejectSession() {
    setRejectButtonLoading(true);
    const session = await wcWalletKit.rejectSession({
      id: wcId,
      reason: getSdkError("USER_REJECTED"),
    });
    console.log(session);
    setIsConnectDialogOpen(false);
    setRejectButtonLoading(false);
    toast({
      className:
        "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
      variant: "destructive",
      title: "You rejected the connection request.",
      description: "Reconnect or try again later.",
    });
  }

  async function handleApproveSessionRequest() {
    setApproveSessionRequestButtonLoading(true);
    /**
     * Retrieve the handle to the private key from some unauthenticated storage
     */
    const cache = await caches.open("gmgn-storage");
    const request = new Request("gmgn-wallet");
    const response = await cache.match(request);
    const handle = response
      ? new Uint8Array(await response.arrayBuffer())
      : new Uint8Array();
    /**
     * Retrieve the private key from authenticated storage
     */
    const bytes = await getOrThrow(handle);
    const privateKey = fromBytes(bytes, "hex");
    if (privateKey) {
      const account = privateKeyToAccount(privateKey as Address);

      const walletClient = createWalletClient({
        account: account,
        chain: selectViemChainFromNetwork(network),
        transport: http(),
      });

      const publicClient = createPublicClient({
        chain: selectViemChainFromNetwork(network),
        transport: http(),
      });

      // sign the message
      const hash = await walletClient.sendTransaction({
        account,
        to: sessionRequestParams.to,
        value: hexToBigInt(sessionRequestParams.value),
        data: sessionRequestParams.data,
      });

      const response = { id: sessionRequestId, result: hash, jsonrpc: "2.0" };
      await wcWalletKit.respondSessionRequest({
        topic: sessionRequestTopic,
        response,
      });
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });

      if (transaction) {
        toast({
          className:
            "bottom-0 right-0 flex fixed md:max-h-[300px] md:max-w-[420px] md:bottom-4 md:right-4",
          title: "Transaction sent!",
          description: "Hash: " + truncateHash(hash ?? undefined, 6),
          action: (
            <ToastAction altText="view">
              <a
                target="_blank"
                href={`${selectBlockExplorer(network!)}/tx/${hash}`}
              >
                View
              </a>
            </ToastAction>
          ),
        });
      }
      setApproveSessionRequestButtonLoading(false);
      setIsSessionRequestDialogOpen(false);
    }
  }

  async function handleDisconnectSession(topic: string) {
    await wcWalletKit.disconnectSession({
      topic,
      reason: getSdkError("USER_DISCONNECTED"),
    });
    getActiveSessions();
  }

  async function handleDisconnectAllSessions() {
    Object.keys(activeSessions).forEach(async (topic) => {
      await wcWalletKit.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    })
    getActiveSessions();
  }


  function WalletConnectEip155IdToName(eip155Id: string) {
    switch (eip155Id) {
      case "eip155:1":
        return "Ethereum";
      case "eip155:10":
        return "Optimism";
      case "eip155:56":
        return "Binance Smart Chain";
      case "eip155:100":
        return "Poketwork";
      case "eip155:137":
        return "Polygon";
      case "eip155:196":
        return "Avalanche";
      case "eip155:252":
        return "Cronos";
      case "eip155:324":
        return "Base";
      case "eip155:8217":
        return "Kaia";
      case "eip155:1001":
        return "Kaia Kairos";
      default:
        return "Unknown";
    }
  }

  function truncateTopic(topic: string | undefined | null) {
    if (!topic) {
      return "------";
    }
    return topic.slice(0, 4) + "..." + topic.slice(-4);
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Connect
      </h1>
      <BackButton route={constructNavUrl("/", network, address)} />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Dialog
            open={isConnectDialogOpen}
            onOpenChange={setIsConnectDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <Image
                  src="/walletconnect-logo.svg"
                  alt="walletconnect logo"
                  width={24}
                  height={24}
                />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center mb-2 pr-4">
                  Connect
                </DialogTitle>
                <DialogDescription className="text-center">
                  Connecting DApp via WalletConnect
                </DialogDescription>
                <div className="flex flex-col gap-4 pr-4 mt-4 items-center text-left">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      wcParams
                        ? wcParams.proposer.metadata.icons[0]
                        : "gmgn-logo.svg"
                    }
                    alt={
                      wcParams ? wcParams.proposer.metadata.name : "GM GN logo"
                    }
                    width="100"
                    height="100"
                    className="rounded-md"
                  />
                  <div>
                    {wcParams
                      ? wcParams.proposer.metadata.name
                      : "No connection request"}
                  </div>
                  <div>{wcParams ? "wants to connect" : null}</div>
                  <Badge
                    className="w-fit text-blue-600 p-2"
                    variant="secondary"
                  >
                    <GlobeLock className="w-4 h-4 mr-2" />
                    {wcParams ? wcParams.proposer.metadata.url : "------"}
                  </Badge>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <h2 className="border-t pt-4 text-lg font-semibold tracking-tight">
                  Requested permissions
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="w-4 h-4" />
                    View your balance and activity
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="w-4 h-4" />
                    Send approval requests
                  </div>
                  <div className="flex flex-row gap-2 items-center text-red-500">
                    <X className="w-4 h-4" />
                    Move funds without permission
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-b pb-4">
                <div className="flex flex-row justify-between">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Account
                  </h2>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Network
                  </h2>
                </div>
                <div className="flex flex-col gap-2 h-[150px] overflow-y-auto">
                  {
                    // if wcParams.optionalNamespaces.eip155.chains is not empty, loop through the chains and display the account and network for each
                    wcParams?.optionalNamespaces.eip155.chains ? (
                      wcParams.optionalNamespaces.eip155.chains.map(
                        (chain: any) => (
                          <div
                            className="flex flex-row justify-between"
                            key={chain}
                          >
                            <p>{truncateAddress(address as Address, 4)}</p>
                            <p className="mr-2">{chain}</p>
                          </div>
                        )
                      )
                    ) : (
                      <div className="flex flex-row justify-between">
                        <p>{truncateAddress(address as Address, 4)}</p>
                        <p>------</p>
                      </div>
                    )
                  }
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-row justify-between w-full">
                  {wcParams && rejectButtonLoading ? (
                    <Button
                      disabled
                      className="w-[150px]"
                      variant="destructive"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : wcParams && !rejectButtonLoading ? (
                    <Button
                      className="w-[150px]"
                      variant="destructive"
                      onClick={handleRejectSession}
                    >
                      Reject
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-[150px]"
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  )}
                  {wcParams && approveButtonLoading ? (
                    <Button disabled className="w-[150px]">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : wcParams && !approveButtonLoading ? (
                    <Button
                      className="w-[150px]"
                      onClick={handleApproveSession}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button disabled className="w-[150px]">
                      Approve
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isSessionRequestDialogOpen}
            onOpenChange={setIsSessionRequestDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <ChevronsLeftRightEllipsis className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center mb-2 pr-4">
                  Request
                </DialogTitle>
                <DialogDescription className="text-center">
                  Responding to DApp request
                </DialogDescription>
                <div className="flex flex-col items-center gap-2">
                  <Badge
                    className="w-fit text-blue-600 p-2"
                    variant="secondary"
                  >
                    <GlobeLock className="w-4 h-4 mr-2" />
                    {sessionRequestVerifyContext
                      ? sessionRequestVerifyContext.verified.origin
                      : "------"}
                  </Badge>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <h2 className="border-t pt-4 text-lg font-semibold tracking-tight">
                  Requested signature data
                </h2>
                <div className="flex flex-col gap-2 h-[150px] overflow-y-auto border-b pb-4">
                  <div className="underline underline-offset-2">From (you)</div>
                  <div className="text-sm font-mono break-all">
                    {sessionRequestParams
                      ? sessionRequestParams.from
                      : "------"}
                  </div>
                  <div className="underline underline-offset-2">To (DApp)</div>
                  <div className="text-sm font-mono break-all">
                    {sessionRequestParams ? sessionRequestParams.to : "------"}
                  </div>
                  <div className="underline underline-offset-2">Value</div>
                  <div className="text-sm font-mono break-all">
                    {sessionRequestParams
                      ? formatEther(
                          fromHex(sessionRequestParams.value, "bigint")
                        )
                      : "------"}{" "}
                    {selectNativeAssetSymbol(
                      network,
                      "0x0000000000000000000000000000000000000000"
                    )}
                  </div>
                  <div className="underline underline-offset-2">Data</div>
                  <div className="text-sm font-mono break-all">
                    {sessionRequestParams
                      ? sessionRequestParams.data
                      : "------"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-b pb-4">
                <div className="flex flex-row justify-between">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Account
                  </h2>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Network
                  </h2>
                </div>
                <div className="flex flex-row justify-between">
                  <p>
                    {address
                      ? truncateAddress(address as Address, 4)
                      : "------"}
                  </p>
                  <p className="mr-2">
                    {sessionRequestChainId
                      ? WalletConnectEip155IdToName(sessionRequestChainId)
                      : "------"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-row justify-between w-full">
                  {wcParams && rejectButtonLoading ? (
                    <Button
                      disabled
                      className="w-[150px]"
                      variant="destructive"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : wcParams && !rejectButtonLoading ? (
                    <Button
                      className="w-[150px]"
                      variant="destructive"
                      onClick={handleRejectSession}
                    >
                      Reject
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="w-[150px]"
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  )}
                  {sessionRequestParams &&
                  approveSessionRequestButtonLoading ? (
                    <Button disabled className="w-[150px]">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : sessionRequestParams &&
                    !approveSessionRequestButtonLoading ? (
                    <Button
                      className="w-[150px]"
                      onClick={handleApproveSessionRequest}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button disabled className="w-[150px]">
                      Approve
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="wcSessionString">WalletConnect Session</Label>
        <div className="flex flex-row gap-2 items-center justify-center">
          <Input
            id="wcSessionString"
            className="rounded-none w-full border-primary border-2 p-2.5"
            value={wcSessionString}
            onChange={(e) => setWcSessionString(e.target.value)}
            required
          />
          <Button
            variant="secondary"
            size="icon"
            disabled={isPasted}
            onClick={paste}
          >
            {isPasted ? (
              <Check className="h-4 w-4" />
            ) : (
              <ClipboardPaste className="h-4 w-4" />
            )}
          </Button>
          <Dialog open={isQrScanOpen} onOpenChange={setIsQrScanOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <ScanLine className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>QR Scanner</DialogTitle>
                <DialogDescription>Scan QR code to autofill</DialogDescription>
              </DialogHeader>
              <Scanner onScan={(result) => handleQrScan(result[0].rawValue)} />
              <DialogFooter>
                <div className="flex flex-col items-center justify-center">
                  {qrScanSuccess ? (
                    <p className="flex flex-row gap-2 text-blue-600">
                      <ThumbsUp className="h-6 w-6" />
                      Scan completed. Exit to continue.
                    </p>
                  ) : (
                    <p className="flex flex-row gap-2 text-yellow-600">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Scanning...
                    </p>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Button className="w-[200px] self-end" onClick={handlePairing}>
        <Unplug className="w-4 h-4 mr-2" />
        Connect
      </Button>
      <div className="flex flex-row items-center justify-between mt-8">
        <h2 className="text-xl">Active sessions</h2>
        <div className="flex flex-row gap-2">
          <Button onClick={getActiveSessions} size="icon" variant="secondary">
            <RotateCcw className="w-4 h-4" />
          </Button>
          {activeSessions ? (
            <Button
              onClick={handleDisconnectAllSessions}
              size="icon"
              variant="secondary"
            >
              <CircleX className="w-4 h-4" />
            </Button>
          ) : (
            <Button disabled size="icon" variant="secondary">
              <CircleX className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-between font-semibold border-b-2 pb-2">
          <p>Session</p>
          <p>Action</p>
        </div>
        <div className="flex flex-col gap-2 justify-between">
          {activeSessions ? Object.entries(activeSessions).map((session) => (
            <div key={session[0]} className="flex flex-row gap-2 items-center justify-between">
              <div className="flex flex-row gap-4 items-center">
                <div>{truncateTopic(session[0])}</div>
                <div className="font-mono bg-secondary p-1 text-sm">{session[1].expiry ? new Date(session[1].expiry * 1000).toLocaleString() : null}</div> 
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDisconnectSession(session[0])}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )) : <p>No active sessions</p>}
        </div>
      </div>
    </div>
  );
}
