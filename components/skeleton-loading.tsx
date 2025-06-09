import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonLoader({ msg }: { msg: string }) {
    return (
        <div className="flex flex-col items-center space-x-4 ">
            <h1 className="font-semibold text-2xl mb-3 text-blue-600">{msg}</h1>
            <div className="space-y-2">
                <Skeleton className="h-6 w-[550px] !bg-blue-300" />
                <Skeleton className="h-6 w-[350px] !bg-blue-300" />
                <Skeleton className="h-6 w-[470px] !bg-blue-300" />
            </div>
        </div>
    )
}
