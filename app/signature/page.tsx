'use client'
 
import SignatureDialog from '@/components/signature-dialog'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const signature = searchParams.get("signature")
  const account = searchParams.get("account")
  const timestamp = searchParams.get("timestamp")
  const signatureProp = {
    signature: signature,
    account: account,
    timestamp: timestamp
  }
  return (
    <div className="flex flex-col gap-12 items-center">
      <SignatureDialog signatureObject={signatureProp} />
    </div>
  );
}