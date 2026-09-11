import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const TicketCardSkeleton = () => (
    <Card className="relative overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1 bg-muted" aria-hidden="true" />
        <CardHeader className="gap-3 pb-4 pl-7">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pl-7">
            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t pt-4">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-9 w-32" />
            </div>
        </CardContent>
    </Card>
);

export const TicketListSkeleton = () => (
    <Card>
        <CardHeader className="gap-4 border-b">
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[70px] w-full rounded-lg" />
                ))}
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
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
