"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BackButton({ route }: { route: string | null }) {
  const router = useRouter();
  if (!route) {
    return (
      <Button variant="outline" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go back
      </Button>
    );
  }

  return (
    <Button variant="outline" className="w-fit" onClick={() => router.push(route)}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Go back
    </Button>
  );
}
