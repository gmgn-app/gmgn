"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import BackButton from "@/components/back-button";
import NavBar from "@/components/navbar";
import { constructNavUrl } from "@/lib/utils";
import Header from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tokens } from "@/lib/tokens";
import { parseEther, formatEther } from "viem";
import { Info, Plus, Trash2, Loader2, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AirdropItem = {
  address: string;
  amount: string;
};

export default function MultisendAppPage() {
  // Get the search params from the URL.
  const searchParams = useSearchParams();
  // Get the address and network from the search params.
  const address = searchParams.get("address");
  const network = searchParams.get("network");

  // State for the airdrop list.
  const [airdropList, setAirdropList] = useState<AirdropItem[]>([]);

  // State for the pending status.
  const [submitButtonIsPending, setSubmitButtonIsPending] = useState(false);

  // Total airdrop amount.
  const totalAirdropAmount = useMemo(() => {
    return airdropList.reduce((acc, item) => {
      return acc + BigInt(parseEther(item.amount));
    }, BigInt(0));
  }, [airdropList]);

  // state for file input
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.onload = function (e: ProgressEvent<FileReader>) {
      if (e.target) {
        const text = e.target.result;
        csvFileToArray(text);
      }
    };
    if (file) {
      fileReader.readAsText(file);
    }
  }, [file]);

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  // function to convert the csv file to airdropList
  function csvFileToArray(text: string | ArrayBuffer | null) {
    if (typeof text === "string") {
      const rows = text.split("\n").filter((item) => item !== "");
      const airdropList = rows.map((row) => {
        const [address, amount] = row.split(",");
        return { address, amount };
      });
      setAirdropList(airdropList);
    }
  }

  // Add a new airdrop items
  function handleAddAirdropList() {
    setAirdropList(airdropList.concat({ address: "", amount: "" }));
  }

  // Reset the airdrop list.
  function handleResetAirdropList() {
    setAirdropList([]);
  }

  // Change the address of the airdrop item.
  function handleAddressChange(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAirdropList = [...airdropList];
      newAirdropList[index].address = e.target.value;
      setAirdropList(newAirdropList);
    };
  }

  // Change the amount of the airdrop item.
  function handleAmountChange(index: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAirdropList = [...airdropList];
      newAirdropList[index].amount = e.target.value;
      setAirdropList(newAirdropList);
    };
  }

  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <Header />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Multisend
      </h1>
      <BackButton route={constructNavUrl("/apps", network, address)} />
      <NavBar />
      <Tabs defaultValue="native" className="w-full">
        {
          // Multisend different types
        }
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="native">Native</TabsTrigger>
          <TabsTrigger value="erc20">ERC20</TabsTrigger>
          <TabsTrigger value="nft">NFTs</TabsTrigger>
        </TabsList>
        {
          // Multisend native token form
        }
        <TabsContent value="native" className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">Step 1</h2>
            <div className="flex flex-row gap-2 items-center">
              <CornerDownRight className="h-4 w-4" />
              <p className="text-lg">Create an airdrop list</p>
            </div>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="file-input">File</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="flex flex-col gap-4">
                <p>
                  <span className="inline-block mr-2">
                    <Info className="h-4 w-4" />
                  </span>
                  Input addresses and corresponding amounts manually. Best for
                  airdropping to small amount of addreses
                </p>
                {
                  // if airdropList is empty, show the message
                  airdropList.length === 0 ? (
                    <p className="text-md text-muted-foreground">
                      No addresses added. Click the + button below to add.
                    </p>
                  ) : (
                    // if airdropList is not empty, show the list
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <h2>Addresses</h2>
                        <h2>Amounts</h2>
                      </div>
                      {airdropList.map((item, index) => (
                        <div key={index} className="flex flex-row gap-4">
                          <Input
                            placeholder="Enter an address"
                            value={item.address}
                            onChange={handleAddressChange(index)}
                          />
                          <Input
                            placeholder="Enter an amount"
                            value={item.amount}
                            onChange={handleAmountChange(index)}
                          />
                        </div>
                      ))}
                    </div>
                  )
                }
                <div className="flex flex-row gap-2">
                  <Button
                    onClick={handleAddAirdropList}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleResetAirdropList}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4" value="file-input">
                <p>
                  <span className="inline-block mr-2">
                    <Info className="h-4 w-4" />
                  </span>
                  Upload a .csv file containing addresses and amounts.
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleImportFile}
                  className="w-full"
                />
                {
                  // if airdropList is empty, show the message
                  airdropList.length === 0 ? (
                    <p className="text-md text-muted-foreground">
                      No addresses uploaded.
                    </p>
                  ) : (
                    // if airdropList is not empty, show the list
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <h2>Addresses</h2>
                        <h2>Amounts</h2>
                      </div>
                      {airdropList.map((item, index) => (
                        <div key={index} className="flex flex-row gap-4">
                          <Input
                            placeholder="Enter an address"
                            value={item.address}
                            readOnly
                          />
                          <Input
                            placeholder="Enter an amount"
                            value={item.amount}
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  )
                }
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Step 2
            </h2>
            <div className="flex flex-row gap-2 items-center">
              <CornerDownRight className="h-4 w-4" />
              <p>Check and confirm the total airdrop amount</p>
            </div>
            <p className="font-semibold text-2xl">
              {formatEther(totalAirdropAmount).toString()}
              <span className="inline-block align-baseline text-sm ml-2">
                KAIA
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Step 3
            </h2>
            <div className="flex flex-row gap-2 items-center">
              <CornerDownRight className="h-4 w-4" />
              <p>Execute the airdrop</p>
            </div>
            {submitButtonIsPending ? (
              <Button className="w-[300px]" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please confirm in your wallet
              </Button>
            ) : (
              <Button className="w-[300px]">Airdrop KAIA</Button>
            )}
          </div>
        </TabsContent>
        {
          // Multisend ERC20 token form
        }
        <TabsContent value="erc20">ERC20</TabsContent>
        {
          // Multisend ERC20 token form
        }
        <TabsContent value="nft">NFTs</TabsContent>
      </Tabs>
    </div>
  );
}
