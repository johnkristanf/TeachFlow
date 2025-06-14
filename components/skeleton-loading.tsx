import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonLoader({ msg }: { msg: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center space-x-4 ">
            <h1 className="font-semibold text-2xl mb-3 text-blue-600">{msg}</h1>
            <div className="w-full space-y-2">
                <Skeleton className="h-6 w-full !bg-blue-300" />
                <Skeleton className="h-6 w-[60%] !bg-blue-300" />
                <Skeleton className="h-6 w-[80%] !bg-blue-300" />
            </div>
        </div>
    )
}
