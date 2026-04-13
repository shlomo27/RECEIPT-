export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
            <div className="h-4 w-10 bg-gray-200 rounded" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-4" />
          <div className="flex items-center gap-3">
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
