import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function EventCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Image skeleton */}
            <div className="relative aspect-[3/2] overflow-hidden flex-shrink-0 bg-muted animate-pulse" />

            <CardContent className="p-4 space-y-3 flex-grow">
                {/* Title skeleton */}
                <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />

                <div className="space-y-2">
                    {/* Date skeleton */}
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                    {/* Location skeleton */}
                    <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    {/* Participants skeleton */}
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                </div>

                {/* Badges skeleton */}
                <div className="flex gap-2 pt-2">
                    <div className="h-5 w-10 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </CardFooter>
        </Card>
    )
}

export function EventCardSkeletonGrid({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <EventCardSkeleton key={i} />
            ))}
        </>
    )
}
