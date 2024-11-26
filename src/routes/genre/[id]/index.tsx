import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { Caption, Mic } from "~/components/Icons";
import { cache } from "~/lib/cache";

export const head: DocumentHead = ({ params }) => {
  const genreName = decodeURIComponent(params.id)
    .replace("-", " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: genreName + " | Genre",
  };
};

export const useGenreData = routeLoader$(async ({ params }) => {
  const kababCased = decodeURIComponent(params.id).replace(/\s+/g, "-");
  const cacheKey = `genre-${kababCased}`;
  
  const existing = cache.get(cacheKey) as string | null;
  if (existing) {
    return JSON.parse(existing) as AniwatchGenre;
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/genre/${kababCased}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Fetch failed at Anime Slider`);
  }

  const data = (await response.json()) as AniwatchGenre;
  cache.set(cacheKey, JSON.stringify(data));
  return data;
});

export default component$(() => {
  const data = useGenreData().value;
  return (
    <div class="min-h-screen  p-4 pb-24">
      <h1 class="text-3xl font-semibold capitalize">{data.data.genreName}</h1>
      <div class="mt-4 grid grid-cols-2 gap-4 text-end sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {data.data.animes.map((show) => (
          <div
            class="group relative h-full min-h-[300px] w-full overflow-hidden   rounded-md"
            key={show.id}
          >
            <Link prefetch={false} href={`/watch/${show.id}`}>
              <img
                height={100}
                width={100}
                loading="lazy"
                class="size-full object-cover transition-all group-hover:scale-105"
                src={show.poster}
                alt={show.name}
              />

              <div class=" absolute bottom-0 left-0 flex size-full flex-col items-end justify-end bg-gradient-to-br from-transparent to-black/80 p-2 capitalize transition-all group-hover:backdrop-blur-md">
                <h1 class="text-xl font-semibold">{show.name}</h1>
                <p>{show.duration}</p>
                <div class="flex gap-2 text-sm">
                  <p>{show.type}</p>
                  <p class="flex items-center gap-1 rounded-sm bg-yellow-500/70 px-1 py-0.5">
                    <Mic size={12} />
                    {show.episodes.dub || "NA"}
                  </p>
                  <p class="flex items-center gap-1 rounded-sm bg-purple-500/80 px-1 py-0.5">
                    <Caption size={12} />
                    {show.episodes.sub}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
});
