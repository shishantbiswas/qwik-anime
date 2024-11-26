import { component$, useResource$, Resource } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Home } from "~/components/Home";
import { Caption, Mic } from "~/components/Icons";
import { Slider } from "~/components/Slider";
import { cache } from "~/lib/cache";

export const useHomeData = routeLoader$(async () => {
  const cacheKey = "home";
  
  const existing = cache.get(cacheKey) as string | null;
  if (existing) {
    return JSON.parse(existing) as AniwatchHome;
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/home`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Fetch failed at Anime Slider`);
  }

  const data = (await response.json()) as AniwatchHome;
  cache.set(cacheKey, JSON.stringify(data));
  return data;
});

export default component$(() => {
  const data = useHomeData();

  return (
    <>
      <Slider data={data.value} />
      <Home data={data.value} />
      <AnimeCategoryList category="most-popular" />
      <AnimeCategoryList category="most-favorite" />
      <AniwatchCategories anime={data.value} />
    </>
  );
});

const AniwatchCategories = component$(({ anime }: { anime: AniwatchHome }) => {
  const categories = [
    "most-favorite",
    "most-popular",
    "subbed-anime",
    "dubbed-anime",
    "recently-updated",
    "recently-added",
    "top-upcoming",
    "top-airing",
    "movie",
    "special",
    "ova",
    "ona",
    "tv",
    "completed",
  ];

  return (
    <section class="grid-cols-2 p-4 md:grid">
      <div>
        <h2 class="mt-4 py-2 text-2xl font-semibold">Genres</h2>
        <div class="flex flex-wrap gap-2">
          {anime.data.genres.map((genre, index) => (
            <Link
              key={genre + index}
              class=" rounded-md bg-white/10 px-2 py-1 hover:bg-red-700"
              href={`/genre/${genre.toLowerCase().replace(" ", "-")}`}
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 class="mt-4 py-2 text-2xl font-semibold">Categories</h2>
        <div class="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Link
              key={category + index}
              class="rounded-md bg-white/10 px-2 py-1 capitalize hover:bg-red-700"
              href={`/category/${category.toLowerCase()}`}
            >
              {category.replace(/-/, " ")}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

export const AnimeCategoryList = component$(
  ({ category }: { category: AniwatchCategoriesName }) => {
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

            <div class="flex gap-3  overflow-x-scroll px-4 scrollbar-hide">
              {data.data.animes.map((episode) => (
                <Link
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
  },
);

export const head: DocumentHead = {
  title: " Home",
};
