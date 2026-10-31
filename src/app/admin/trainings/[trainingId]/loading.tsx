export default function TrainingDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 h-40 bg-base-200" />
          <div className="flex-1 p-6 space-y-3">
            <div className="h-5 w-1/2 bg-base-200 rounded" />
            <div className="h-3 w-full bg-base-200 rounded" />
            <div className="h-3 w-2/3 bg-base-200 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-base-200" />
        ))}
      </div>
    </div>
  );
}
