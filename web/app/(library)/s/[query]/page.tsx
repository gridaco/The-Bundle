export default function SearchPage({ params }: {
  params: {
    query: string
  }
}) {
  const { query } = params
  return (
    <main className="p-10">
      <h1 className="text-5xl font-bold">No results for &quot;{query}&quot;</h1>
    </main>
  )
}