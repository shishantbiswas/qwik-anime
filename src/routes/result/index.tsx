import { component$, useSignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  Link,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import { Caption, Mic } from "~/components/Icons";
import { cache } from "~/lib/cache";

export const useSearchData = routeLoader$(async ({ url, redirect }) => {
  const query = url.searchParams.get("q") as string | null;
  if (!query) {
    throw redirect(302, "/");
  }

  const cacheKey = `search-${query}`;
  const existing = cache.get(cacheKey) as string | null;
  if (existing) {
    return JSON.parse(existing) as AniwatchSearch;
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/search?q=${query}&page=1`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Fetch failed at Anime Slider`);
  }

  const data = (await response.json()) as AniwatchSearch;
  cache.set(cacheKey, JSON.stringify(data));
  return data;
});

export const head: DocumentHead = ({ url }) => {
  const searchTerm = url.searchParams.get("q");

  return { title: `"${searchTerm}" in Search` || "Search" };
};

export default component$(() => {
  const searchTerm = useLocation().url.searchParams.get("q");

  const search = useSearchData();

  return (
    <div class=" min-h-screen ">
      <div class="flex flex-col gap-4 p-4 pb-24 md:flex-row">
        <AnimeSearchSidebar
          data={search.value}
          search={searchTerm || "Search"}
        />
        <AniwatchSearchList
          data={search.value}
          search={searchTerm || "Search"}
        />
      </div>
    </div>
  );
});

const AniwatchSearchList = component$(
  ({ data, search }: { data: AniwatchSearch; search: string }) => {
    const location = useLocation();
    const type = location.url.searchParams.get("type");

    return (
      <div class="w-full">
        <h1 class="mb-4 text-3xl font-semibold">
          Search Result for <span class="italic">"{search}"</span>
        </h1>
        <div class="grid w-full grid-cols-2  gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  ">
          {data.data.animes
            .filter((ep) => (!type ? ep : ep.type == type))
            .map((episode, i) => (
              <Link prefetch={false}
                key={episode.id + i}
                href={`/watch/${episode.id}`}
                class="group relative h-[300px] w-full min-w-[150px] overflow-hidden rounded-md  text-end lg:w-full"
              >
                <img
                  height={100}
                  width={100}
                  loading="lazy"
                  class="absolute top-0 h-full w-full object-cover transition-all group-hover:scale-105"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div class=" absolute bottom-0 left-0 flex size-full flex-col items-end justify-end bg-gradient-to-br from-transparent to-black/80 p-2 capitalize transition-all group-hover:backdrop-blur-md">
                  <h1 class="text-lg font-semibold leading-tight">
                    {episode.name}
                  </h1>
                  <h1 class="my-1.5 text-sm leading-tight">{episode.jname}</h1>
                  <div class="flex gap-1 text-sm">
                    <p>{episode.type}</p>
                    <p class="flex items-center gap-1 rounded-sm bg-purple-500/70  px-1">
                      <Mic size={10} />
                      {episode.episodes.dub || "NA"}
                    </p>
                    <p class="flex items-center gap-1 rounded-sm bg-yellow-500/80  px-1">
                      <Caption size={10} />
                      {episode.episodes.sub}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  },
);

const AnimeSearchSidebar = component$(
  ({ data, search }: { data: AniwatchSearch; search: string }) => {
    const types = ["ONA", "Special", "Movie", "TV", "OVA"];
    const location = useLocation();
    const contentType = location.url.searchParams.get("type");
    const type = useSignal("");

    return (
      <div class="top-4 flex h-fit w-full flex-col rounded bg-black/30 p-4 pb-4 md:sticky md:w-[300px]">
        <h1 class="mb-2 text-3xl font-semibold">Filter</h1>
        <select
          onInput$={(eve, elem) => {
            type.value = elem.value;
          }}
          class="rounded-sm bg-black/50 p-2 capitalize"
        >
          {types.map((type, i) => (
            <option value={type} key={type + i} class="capitalize">
              {type}
            </option>
          ))}
        </select>

        <Link prefetch={false}
          class="w-full text-center"
          href={`/result?q=${search}${type.value ? `&type=${type.value}` : ""}`}
        >
          <button class="my-2 w-full rounded-md border p-2">Filter</button>
        </Link>
        {contentType && (
          <Link prefetch={false} href={`/result?q=${search}`}>
            <button class="my-2 w-full rounded-md bg-white p-2 text-black">
              Clear
            </button>
          </Link>
        )}
        <h1 class="my-2 text-3xl font-semibold">Most Popular</h1>
        <div class="flex max-h-[50vh] flex-col gap-2 overflow-y-scroll ">
          {data.data.mostPopularAnimes.map((episode) => (
            <div
              key={episode.id}
              class="mr-2 rounded p-2 leading-tight hover:bg-white/30"
            >
              <h1 class="font-semibold">{episode.name}</h1>
              <div class="flex gap-2 opacity-70">
                <p>{episode.episodes.dub}</p>
                <p>{episode.episodes.sub}</p>
                <p>{episode.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
