export default function BooksLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center">
        <div className="h-10 w-48 animate-pulse rounded-md bg-border-light" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded-md bg-border-light" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex h-[400px] flex-col overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
            <div className="h-64 w-full animate-pulse bg-border-light" />
            <div className="p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-border-light" />
              <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-border-light" />
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-border-light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}