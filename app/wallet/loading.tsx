import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col gap-12">
      <Skeleton className="w-[100px] h-[20px] rounded-md mb-8" />
      <Skeleton className="w-[350px] h-[600px] rounded-md mb-4" />
      <Skeleton className="w-[350px] h-[100px] rounded-md" />
    </div>
  )
}