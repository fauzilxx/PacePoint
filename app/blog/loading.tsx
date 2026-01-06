export default function BlogLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="mb-12">
          <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4"></div>
          <div className="h-6 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
