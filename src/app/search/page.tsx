import { SearchPage } from "../../screens/movies/search-page";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ query?: string | string[] }>;
}) {
  const { query } = await searchParams;
  const searchQuery = typeof query === "string" ? query : undefined;

  return <SearchPage key={searchQuery ?? ""} query={searchQuery} />;
}
