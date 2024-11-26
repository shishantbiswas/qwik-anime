import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { AniwatchPlayer } from "~/components/AniwatchPlayer";
import { Caption, Mic } from "~/components/Icons";
import { cache } from "~/lib/cache";

export const head: DocumentHead = ({ resolveValue }) => {
  const { animeDate } = resolveValue(useAnime);
  return { title: animeDate?.data?.anime?.info?.name || "Watch" };
};

export const useAnime = routeLoader$(async ({ params, url, redirect }) => {
  const animeId = params.id;
  const episode = await fetchAniwatchEpisode(animeId);

  if (!url.searchParams.get("ep")) {
    throw redirect(
      301,
      `/watch/${episode.data.episodes[0].episodeId}&lang=japanesse&num=1`,
    );
  }
  const data = await fetchAniwatchId(animeId);

  return { episode: episode, animeId: animeId, animeDate: data };
});

export default component$(() => {
  const anime = useAnime().value;
  const location = useLocation();
  const num = location.url.searchParams.get("num");
  const ep = location.url.searchParams.get("ep") as string;
  const lang = location.url.searchParams.get("lang") as "english" | "japanesse";
  return (
    <div class="min-h-screen space-y-6 bg-black/60 pb-24">
      <div class="flex flex-col lg:flex-row">
        <AniwatchPlayer episodeId={anime.animeId} lang={lang} ep={ep} />
        <EpisodeSelector
          lang={lang}
          episode={anime.episode}
          currentEpisodeNum={num ? num : anime.episode.data.episodes[0].number}
          data={anime.animeDate}
        />
      </div>

      <AniwatchInfo data={anime.animeDate} />
    </div>
  );
});

const EpisodeSelector = component$(
  ({
    currentEpisodeNum,
    data,
    episode,
    lang,
  }: {
    currentEpisodeNum: string;
    data: AniwatchInfo;
    episode: AniwatchEpisodeData;
    lang: "english" | "japanesse";
  }) => {
    const audio = useSignal<"english" | "japanesse">(lang ? lang : "japanesse");
    const ref = useSignal<HTMLUListElement>();

    useVisibleTask$(() => {
      ref.value?.scrollBy(0, 80 * (Number(currentEpisodeNum) - 1));
    });

    return (
      <div class="p-4 lg:w-1/4 lg:p-2 lg:pl-0">
        <div class="flex items-center  py-4 ">
          <label class="inline-flex cursor-pointer items-center gap-2">
            <span class=" text-sm font-medium dark:text-gray-300">English</span>
            <input
              type="checkbox"
              checked={lang === "english" ? false : true}
              onInput$={() => {
                audio.value =
                  audio.value === "english" ? "japanesse" : "english";
              }}
              class="peer sr-only"
            />
            <div
              class="peer-focus:ring- peer relative h-[25px] w-11 rounded-full border-none bg-gray-200 outline-none duration-200 after:absolute after:start-[2px] after:top-[2px]  after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-[95%] peer-focus:outline-none peer-focus:ring-transparent  rtl:peer-checked:after:-translate-x-full 
             dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-red-800"
            ></div>
            <span class=" text-sm font-medium dark:text-gray-300">
              Japanesse
            </span>
          </label>
        </div>
        <div class="mb-6 flex items-center text-sm">
          <ul
            ref={ref}
            class="max-h-[70vh] w-full overflow-y-scroll rounded-lg bg-slate-500 lg:w-[500px]"
          >
            {episode.data.episodes.map((episode, index) => (
              <Link
                prefetch={false}
                key={episode.episodeId}
                href={`watch/${episode.episodeId}&lang=${audio.value}&num=${episode.number}`}
                style={{
                  pointerEvents:
                    audio.value === "english"
                      ? data.data.anime.info.stats.episodes.dub < episode.number
                        ? "none"
                        : "all"
                      : "all",
                }}
              >
                <button
                  disabled={
                    audio.value === "english"
                      ? data.data.anime.info.stats.episodes.dub < episode.number
                      : data.data.anime.info.stats.episodes.sub < episode.number
                  }
                  style={{
                    backgroundColor:
                      Number(currentEpisodeNum) == Number(episode.number) &&
                      audio.value === lang
                        ? "#b91c1c"
                        : audio.value === "english"
                          ? index % 2 === 0
                            ? "#1f2937"
                            : "#374151"
                          : index % 2 === 0
                            ? "#1e293b"
                            : "#334155",
                  }}
                  class="flex h-20 w-full items-center justify-between px-4 text-start text-[14px] leading-4 transition-all duration-200 disabled:opacity-35"
                >
                  {episode.number}. {episode.title}
                  {audio.value === "english" && (
                    <span class="ml-2 hidden  w-fit items-center gap-2 text-nowrap rounded bg-white/20 p-2 sm:flex">
                      <Mic size={15} />
                      {data.data.anime.info.stats.episodes.dub < episode.number
                        ? "Not available"
                        : `EN`}
                    </span>
                  )}
                  {audio.value === "japanesse" && (
                    <span class="ml-2 hidden  w-fit items-center gap-2 text-nowrap rounded bg-white/20 p-2 sm:flex">
                      <Caption size={15} />
                      {data.data.anime.info.stats.episodes.sub < episode.number
                        ? "Not available"
                        : `JP`}
                    </span>
                  )}
                </button>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

const AniwatchInfo = component$(({ data }: { data: AniwatchInfo }) => {
  return (
    <div class="p-4">
      <div>
        <img
          height={100}
          width={100}
          loading="lazy"
          class="fixed top-0 -z-10 size-full object-cover blur-2xl "
          src={data.data.anime.info.poster}
          alt={data.data.anime.info.name}
        />
        <div class=" lg:flex ">
          <div class=" mt-6 lg:mt-0 lg:px-4">
            <h1 class=" my-2 text-4xl font-semibold">
              {data.data.anime.info.name}
            </h1>
            <h2 class=" my-2 flex gap-2 text-xl italic opacity-70">
              {data.data.anime.moreInfo.japanese}
            </h2>
            <p class=" text-[18px] leading-6">
              {data.data.anime.info.description}
            </p>
            <div class=" my-4 flex flex-col gap-2 opacity-70">
              {data.data.anime.moreInfo.genres && (
                <div class="flex flex-wrap items-center gap-2">
                  Genres :
                  {data.data.anime.moreInfo.genres.map((e) => (
                    <Link
                      prefetch={false}
                      target="_blank"
                      href={`/genre/${e.toLowerCase()}`}
                      class="flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 text-sm underline"
                      key={e}
                    >
                      <span class=" flex gap-2">{e}</span>
                    </Link>
                  ))}
                </div>
              )}
              {data.data.anime.moreInfo.studios && (
                <p class=" flex flex-wrap gap-2">
                  Studio :
                  {data.data.anime.moreInfo.studios
                    .split(",")
                    .map((studio: string) => (
                      <Link
                        prefetch={false}
                        key={studio}
                        target="_blank"
                        class="flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 text-sm underline"
                        href={`watch-studio/${studio.toLowerCase()}`}
                      >
                        {studio}
                      </Link>
                    ))}
                </p>
              )}
              {data.data.anime.moreInfo.producers && (
                <p class=" flex flex-wrap gap-2">
                  Producers :
                  {data.data.anime.moreInfo.producers.map((studio: string) => (
                    <Link
                      prefetch={false}
                      key={studio}
                      target="_blank"
                      class="flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 text-sm underline"
                      href={`watch-producers?type=${studio.toLowerCase()}`}
                    >
                      {studio}
                    </Link>
                  ))}
                </p>
              )}
              <p class=" flex gap-2">
                Release Date : {data.data.anime.moreInfo.aired}
              </p>
              <p class=" flex gap-2">
                Premiered : {data.data.anime.moreInfo.premiered}
              </p>
              <p class=" flex gap-2">
                Duration : {data.data.anime.moreInfo.duration}
              </p>
              <p class=" flex gap-2">
                Status : {data.data.anime.moreInfo.status}
              </p>

              <div class="flex gap-2">
                <p class=" flex gap-2">
                  Sub : {data.data.anime.info.stats.episodes.sub}
                </p>
                <p class=" flex gap-2">
                  Dub :{" "}
                  {data.data.anime.info.stats.episodes.dub || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:flex">
        <div class="flex w-full flex-col">
          <h1 class="my-4 text-3xl font-semibold">More Like This</h1>

          <div class="grid w-full grid-cols-2  gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  ">
            {data.data.recommendedAnimes.map((episode, i) => (
              <Link
                prefetch={false}
                key={episode.id + i}
                href={`watch/${episode.id}`}
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
          <h1 class="my-4 text-3xl font-semibold">Most Popular</h1>

          <div class="grid w-full grid-cols-2  gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  ">
            {data.data.mostPopularAnimes.map((episode, i) => (
              <Link
                prefetch={false}
                key={episode.id + i}
                href={`watch/${episode.id}`}
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
        <div class="p-4 lg:w-1/3">
          {data.data.seasons.length > 0 && (
            <>
              <h1 class="my-4 text-3xl font-semibold">Seasons</h1>
              <div class="flex flex-col gap-3 rounded-sm bg-black/30 p-2">
                {data.data.seasons.map((episode) => (
                  <Link
                    prefetch={false}
                    href={`watch/${episode.id}`}
                    key={episode.id}
                    class="flex gap-2"
                  >
                    <img
                      height={50}
                      width={100}
                      loading="lazy"
                      src={episode.poster}
                      class="h-20 rounded-sm"
                      alt={episode.name}
                    />
                    <div class="">
                      <h1>{episode.name}</h1>
                      <div class="flex gap-1 text-sm">
                        <p>{episode.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h1 class="my-4 text-3xl font-semibold">Related Animes</h1>

          <div class="flex flex-col gap-3 rounded-sm p-2">
            {data.data.relatedAnimes.map((episode) => (
              <Link
                prefetch={false}
                href={`watch/${episode.id}`}
                key={episode.id}
                class="flex gap-2"
              >
                <img
                  height={50}
                  width={50}
                  loading="lazy"
                  src={episode.poster}
                  class="h-20 rounded-sm"
                  alt={episode.name}
                />
                <div class="">
                  <h1>{episode.name}</h1>
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
      </div>
    </div>
  );
});

async function fetchAniwatchEpisode(animeId: string) {
  const cacheKey = `anime-episode-${animeId}`;
  try {
    const existing = cache.get(cacheKey) as string | null;
    if (existing) {
      return JSON.parse(existing) as AniwatchEpisodeData;
    }
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianimewatch/${animeId}/episodes`,
      { cache: "no-store" },
    );
    const data = (await response.json()) as AniwatchEpisodeData;
    cache.set(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(`Fetch failed for Season`);
  }
}

async function fetchAniwatchId(id: string): Promise<AniwatchInfo> {
  const cacheKey = `anime-${id}`;
  try {
    const existing = cache.get(cacheKey) as string | null;
    if (existing) {
      return JSON.parse(existing) as AniwatchInfo;
    }
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianimewatch/${id}`,
      { cache: "no-store" },
    );

    const data: AniwatchInfo = await response.json();
    cache.set(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(`Failed fetching details for Anime`);
  }
}
