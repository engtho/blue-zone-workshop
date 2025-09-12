import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const TicketListSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-5 w-32" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Skeleton className="h-4 w-20 mb-1" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-12 mb-1" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="pt-3 border-t">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </CardContent>
    </Card>
);

export const AlarmCreatorSkeleton = () => (
    <Card className="w-full">
        <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
        </CardContent>
    </Card>
);
