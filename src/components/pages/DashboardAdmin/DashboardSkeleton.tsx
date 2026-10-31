export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Welcome */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-primary/8 animate-pulse" />
      </div>

      {/* KPI Cards */}
      <div className="grid w-full gap-4 md:grid-cols-3">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>

      {/* Bottom sections */}
      <div className="mt-10 flex w-full flex-col justify-between gap-8 md:flex-row">
        <div className="w-full md:w-1/2">
          <TrainingProgramSkeleton />
        </div>

        <div className="w-full md:w-1/2">
          <InscriptionListSkeleton />
        </div>
      </div>
    </div>
  );
}

function DashboardCardSkeleton() {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        border border-primary/8
        bg-300
        p-6
        shadow-sm
      "
    >
      <div className="flex h-full flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className="
              size-14 shrink-0 rounded-2xl
              bg-primary/8
              animate-pulse
            "
          />

          {/* Title */}
          <div className="flex-1 space-y-2">
            <div className="h-5 w-28 rounded-md bg-primary/10 animate-pulse" />

            <div className="h-4 w-48 max-w-full rounded-md bg-primary/6 animate-pulse" />
          </div>
        </div>

        {/* Main statistic */}
        <div className="space-y-2">
          <div className="h-10 w-20 rounded-lg bg-primary/10 animate-pulse" />

          <div className="h-4 w-32 rounded-md bg-primary/6 animate-pulse" />
        </div>

        {/* Stats */}
        <div className="flex gap-3 overflow-hidden">
          <div
            className="
              h-16 min-w-24 flex-1
              rounded-xl
              bg-primary/5
              animate-pulse
            "
          />

          <div
            className="
              h-16 min-w-24 flex-1
              rounded-xl
              bg-primary/5
              animate-pulse
            "
          />

          <div
            className="
              h-16 min-w-24 flex-1
              rounded-xl
              bg-primary/5
              animate-pulse
            "
          />
        </div>

        {/* Footer */}
        <div className="h-5 w-28 rounded-md bg-primary/8 animate-pulse" />
      </div>
    </div>
  );
}

function TrainingProgramSkeleton() {
  return (
    <div
      className="
        rounded-2xl
        border border-primary/8
        bg-200
        p-6
        shadow-sm
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-primary/10 animate-pulse" />

          <div className="h-4 w-64 rounded-md bg-primary/6 animate-pulse" />
        </div>

        <div className="size-10 rounded-xl bg-primary/8 animate-pulse" />
      </div>

      {/* Items */}
      <div className="space-y-4">
        <TrainingItemSkeleton />
        <TrainingItemSkeleton />
        <TrainingItemSkeleton />
        <TrainingItemSkeleton />
      </div>
    </div>
  );
}

function TrainingItemSkeleton() {
  return (
    <div
      className="
        flex items-center gap-4
        rounded-xl
        border border-primary/6
        bg-base-200
        p-3
      "
    >
      {/* Image */}
      <div className="size-12 shrink-0 rounded-lg bg-primary/8 animate-pulse" />

      {/* Text */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-40 max-w-full rounded-md bg-primary/8 animate-pulse" />

        <div className="h-3 w-24 rounded-md bg-primary/5 animate-pulse" />
      </div>

      {/* Number */}
      <div className="h-8 w-12 rounded-lg bg-secondary/15 animate-pulse" />
    </div>
  );
}

function InscriptionListSkeleton() {
  return (
    <div
      className="
        rounded-2xl
        border border-primary/8
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-primary/10 animate-pulse" />

          <div className="h-4 w-56 rounded-md bg-primary/6 animate-pulse" />
        </div>

        <div className="size-10 rounded-xl bg-primary/8 animate-pulse" />
      </div>

      {/* List */}
      <div className="space-y-3">
        <InscriptionItemSkeleton />
        <InscriptionItemSkeleton />
        <InscriptionItemSkeleton />
        <InscriptionItemSkeleton />
        <InscriptionItemSkeleton />
      </div>
    </div>
  );
}

function InscriptionItemSkeleton() {
  return (
    <div
      className="
        flex items-center gap-4
        rounded-xl
        border border-primary/6
        bg-base-100
        p-3
      "
    >
      {/* Avatar */}
      <div className="size-11 shrink-0 rounded-full bg-primary/8 animate-pulse" />

      {/* Information */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-40 max-w-full rounded-md bg-primary/8 animate-pulse" />

        <div className="h-3 w-28 rounded-md bg-primary/5 animate-pulse" />
      </div>

      {/* Status */}
      <div className="h-7 w-20 rounded-full bg-secondary/15 animate-pulse" />
    </div>
  );
}
