
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl animate-pulse">


        <section className="mb-10 rounded-2xl bg-gray-200 p-8 sm:p-12">
          <div className="mb-4 h-5 w-32 rounded bg-gray-300" />
          <div className="mb-3 h-9 max-w-md rounded bg-gray-300" />
          <div className="mb-6 h-4 max-w-lg rounded bg-gray-300" />
          <div className="h-11 w-36 rounded-lg bg-gray-300" />
        </section>

    
        <section className="mb-6">
          <div className="mb-3 h-7 w-48 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
        </section>

  
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="mb-4 aspect-square rounded-lg bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mb-3 h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-8 w-full rounded-lg bg-gray-200" />
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}
