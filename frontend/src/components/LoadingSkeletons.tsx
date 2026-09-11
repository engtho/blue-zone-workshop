import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const TicketCardSkeleton = () => (
    <Card className="relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1 bg-muted" aria-hidden="true" />
        <CardHeader className="space-y-0 p-4 pb-3 pl-5">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 flex-1 basis-60 space-y-2">
                    <Skeleton className="h-3 w-40 max-w-full" />
                    <Skeleton className="h-5 w-64 max-w-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4 pl-5">
            <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-4 w-32 max-w-full" />
                <Skeleton className="h-3 w-28 max-w-full" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <Skeleton className="h-3 w-56 max-w-full" />
                <Skeleton className="h-9 w-32 max-w-full" />
            </div>
        </CardContent>
    </Card>
);

export const TicketListSkeleton = () => (
    <Card>
        <CardHeader className="gap-4 space-y-0 border-b p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 basis-44 space-y-2">
                    <Skeleton className="h-6 w-44 max-w-full" />
                    <Skeleton className="h-4 w-64 max-w-full" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-0 space-y-2 px-3 even:border-l sm:border-l sm:first:border-l-0">
                        <Skeleton className="h-3 w-20 max-w-full" />
                        <Skeleton className="h-7 w-8" />
                    </div>
                ))}
            </div>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <TicketCardSkeleton key={i} />
            ))}
        </CardContent>
    </Card>
);

export const AlarmCreatorSkeleton = () => (
    <Card className="w-full">
        <CardHeader className="border-b">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <Skeleton className="h-10 w-full" />
        </CardContent>
    </Card>
);
