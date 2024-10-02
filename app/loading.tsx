import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <div className="flex flex-row gap-2 items-center justify-between">
        <Skeleton className="w-[40px] h-[40px] rounded-md" />
        <div className="flex flex-row gap-2">
          <Skeleton className="w-[200px] h-[40px] rounded-md" />
          <Skeleton className="w-[40px] h-[40px] rounded-md" />
        </div>
      </div>
      <Skeleton className="w-[200px] h-[40px] rounded-md" />
      <Skeleton className="w-[100px] h-[40px] rounded-md" />
      <Skeleton className="w-full h-[600px] rounded-md" />
    </div>
  )
}