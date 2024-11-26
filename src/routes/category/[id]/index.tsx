import { component$, Resource, useResource$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Caption, Mic } from "~/components/Icons";
import { cache } from "~/lib/cache";

export const head: DocumentHead = () => {
  return { title: " Home" };
};

export default component$(() => {
  const category = useLocation().params.id;
  const resource = useResource$(async () => {
    const cacheKey = `category-${category}`;
    
    const existing = cache.get(cacheKey) as string | null;
    if (existing) {
      return JSON.parse(existing) as AniwatchCategories;
    }
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianime/category/${category}?page=1`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(`Search failed in Categories`);
    }
    const data = (await response.json()) as AniwatchCategories;
    cache.set(cacheKey, JSON.stringify(data));
    return data;
  });
  return (
    <Resource
      value={resource}
      onRejected={() => <div class="m-4">Error: Failed to load data</div>}
      onPending={() => <div class="m-4">Loading... </div>}
      onResolved={(data) => (
        <>
          <h1 class="mt-4 px-4 py-2 text-3xl font-semibold capitalize">
            {category.split("-").join(" ")}
          </h1>

          <div class="mt-4 grid grid-cols-2 gap-4 px-4 text-end sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {data.data.animes.map((episode) => (
              <Link prefetch={false}
                key={episode.id}
                href={`/watch/${episode.id}`}
                class="group relative h-[300px] min-w-[190px] overflow-hidden rounded-md  text-end lg:w-full"
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
                  <h1 class="text-xl font-semibold">{episode.name}</h1>
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
        </>
      )}
    />
  );
});
