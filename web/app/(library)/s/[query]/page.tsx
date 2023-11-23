import { Generate } from "@/library/generate"

export default function SearchPage({ params }: {
  params: {
    query: string
  }
}) {
  const { query: _query } = params
  const query = decodeURIComponent(_query)

  return (
    <main className="p-10">
      <h1 className="text-5xl font-bold">No results for &quot;{query}&quot;</h1>
      <div className="mt-40 flex flex-col gap-8">
        <h2 className="text-3xl font-bold">
          Generate render image with &quot;{query}&quot;
        </h2>
        <Generate defaultValue={query} />
      </div>
    </main>
  )
}