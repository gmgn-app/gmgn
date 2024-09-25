'use client'

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go back
    </Button>
  );
}