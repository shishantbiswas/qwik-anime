"use client";

import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Caption, Mic } from "./Icons";

export const Home = component$(({ data }: { data: AniwatchHome }) => {
  const date = useSignal(data.data.top10Animes.week);

  return (
    <div class="pl-5 pr-3">
      <h1 class="py-2 text-3xl font-semibold ">Newly Added</h1>
      <div class="lg:flex">
        <div class="grid w-full grid-cols-2 gap-4 self-start py-4 align-top sm:grid-cols-3  md:grid-cols-4 md:gap-3 xl:grid-cols-6">
          {data.data.latestEpisodeAnimes.map((episode) => (
            <Link prefetch={false}
              key={episode.id}
              href={`/watch/${episode.id}`}
              class="group relative h-[300px] min-w-[150px] overflow-hidden rounded-md  text-end lg:w-full"
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

        <div class="sticky top-4 flex h-fit flex-col gap-2  pb-4 lg:px-4">
          <h1 class="py-2 text-3xl font-semibold ">Popular Anime</h1>
          <div class="my-1 flex gap-2">
            <button
              onClick$={() => (date.value = data.data.top10Animes.today)}
              style={{
                backgroundColor:
                  date.value === data.data.top10Animes.today ? "white" : "",
                color:
                  date.value === data.data.top10Animes.today ? "black" : "",
              }}
              class="rounded px-2 py-1 transition-all hover:bg-red-600"
            >
              Daily
            </button>
            <button
              style={{
                backgroundColor:
                  date.value === data.data.top10Animes.week ? "white" : "",
                color: date.value === data.data.top10Animes.week ? "black" : "",
              }}
              class="rounded px-2 py-1 transition-all hover:bg-red-600"
              onClick$={() => (date.value = data.data.top10Animes.week)}
            >
              Weekly
            </button>
            <button
              class="rounded px-2 py-1 transition-all hover:bg-red-600"
              style={{
                backgroundColor:
                  date.value === data.data.top10Animes.month ? "white" : "",
                color:
                  date.value === data.data.top10Animes.month ? "black" : "",
              }}
              onClick$={() => (date.value = data.data.top10Animes.month)}
            >
              Monthly
            </button>
          </div>

          <div class="flex w-full flex-col gap-2 lg:w-[350px] lg:max-w-[350px]">
            {date.value.splice(0, 4).map((episode) => (
              <Link prefetch={false}
                key={episode.id}
                href={`/watch/${episode.id}`}
                class="flex rounded-lg bg-black/30 p-2 "
              >
                <img
                  height={50}
                  width={50}
                  loading="lazy"
                  class="aspect-square rounded-md object-cover"
                  src={episode.poster}
                  alt={episode.name}
                />
                <div class="px-2">
                  <p class="text-sm">{episode.name}</p>
                  <div class="flex gap-1 text-sm">
                    <span class="flex w-fit items-center gap-2 rounded bg-purple-500/70 px-1">
                      <Mic size={10} />
                      {episode.episodes.dub || "NA"}
                    </span>
                    <span class="flex w-fit items-center gap-2 rounded bg-yellow-500/70 px-2">
                      <Caption size={10} />
                      {episode.episodes.sub}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
