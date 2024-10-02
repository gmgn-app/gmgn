import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col gap-6 p-4 w-screen md:w-[768px]">
      <div className="flex flex-row gap-2 items-center justify-between">
        <Skeleton className="w-[40px] h-[40px] rounded-md" />
        <div className="flex flex-row gap-2">
          <Skeleton className="w-[250px] h-[40px] rounded-md" />
          <Skeleton className="w-[40px] h-[40px] rounded-md" />
        </div>
      </div>
      <Skeleton className="w-full h-[210px] rounded-md" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Skeleton className="h-[40px] rounded-md" />
        <Skeleton className="h-[40px] rounded-md" />
        <Skeleton className="h-[40px] rounded-md" />
        <Skeleton className="h-[40px] rounded-md" />
      </div>
      <Skeleton className="w-full h-[300px] rounded-md" />
      <Skeleton className="fixed bottom-0 left-0 w-full md:w-[768px] h-[80px] rounded-md" />
    </div>
  )
}