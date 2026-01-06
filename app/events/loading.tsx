import { EventCardSkeletonGrid } from '@/components/EventCardSkeleton'

export default function EventsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-4"></div>
          <div className="h-6 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <EventCardSkeletonGrid count={8} />
      </div>
    </div>
  )
}
