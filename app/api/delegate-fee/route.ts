import { Wallet, JsonRpcProvider } from "@kaiachain/ethers-ext";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const req = await request.json();

  function selectJsonRpcProvider(network: string | undefined) {
    switch (network) {
      case "kaia":
        return "https://public-en.node.kaia.io";
      case "kaia-kairos":
        return "https://public-en-kairos.node.kaia.io";
      default:
        return "https://public-en-kairos.node.kaia.io";
    }
  }

  try {
    const feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    const provider = new JsonRpcProvider({
      fetchOptions: {
        referrer: "https://gmgn.app",
      },
      url: selectJsonRpcProvider(req.network),
  });
    const feePayerWallet = new Wallet(feePayerPrivateKey!, provider);
    const sentTx = await feePayerWallet.sendTransactionAsFeePayer(req.signature);
    const receipt = await sentTx.wait();
    return NextResponse.json(
      {
        receipt: receipt,
        status: "success",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        transactionHash: "none",
        status: "error",
      },
      {
        status: 400,
      }
    );
  }
}
