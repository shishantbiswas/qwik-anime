import { component$, Resource, useResource$ } from "@builder.io/qwik";
import Player from "./Player";
import { cache } from "~/lib/cache";

export const AniwatchPlayer = component$(
  ({
    episodeId,
    ep,
    lang,
  }: {
    episodeId: string;
    ep: string;
    lang: "english" | "japanesse";
  }) => {
    const resource = useResource$(async () => {
      // useLocation();
      if (lang === "english") {
        const server = await fetchAniwatchEpisodeServer(episodeId, ep);

        return await fetchAniwatchEpisodeSrcDub(
          episodeId,
          ep,
          server.data.dub[0].serverName,
        );
      } else {
        const server = await fetchAniwatchEpisodeServer(episodeId, ep);
        if (server.data.sub.length === 0) {
          // redirect(`/anime/${episodeId}?ep=${ep}&lang=english&num=1`)
        }

        return await fetchAniwatchEpisodeSrc(
          episodeId,
          ep,
          server.data.sub[0].serverName,
        );
      }
    });
    return (
      <Resource
        onResolved={(res) => (
          // <p>{JSON.stringify(res)}</p>
          <Player src={`${res.data.sources[0]?.url}`} track={res.data.tracks} />
        )}
        value={resource}
      />
    );
  },
);

async function fetchAniwatchEpisodeSrc(id: string, ep: string, server: string) {
  const cacheKey = `episode-server-${id}-${ep}-${server}`;
  const existing = cache.get(cacheKey) as string | null;
  if (existing) {
    return JSON.parse(existing) as AniwatchEpisodeSrc;
  }
  const response = await fetch(
    `${process.env.ANIWATCH_API}/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${
      server ? server : "vidstreaming"
    }`,
    { cache: "force-cache" },
  );

  const data = (await response.json()) as AniwatchEpisodeSrc;
  cache.set(cacheKey, JSON.stringify(data));

  return data;
}

async function fetchAniwatchEpisodeSrcDub(
  id: string,
  ep: string,
  server: string,
) {
  const cacheKey = `episode-server-dub-${id}-${ep}-${server}`;
  try {
    const existing = cache.get(cacheKey) as
      | string
      | null;
    if (existing) {
      return JSON.parse(existing) as AniwatchEpisodeSrc;
    }
    const response = await fetch(
      `${
        process.env.ANIWATCH_API
      }/api/v2/hianime/episode/sources?animeEpisodeId=${id}?ep=${ep}&server=${
        server ? server : "vidstreaming"
      }&category=dub`,
      { cache: "no-store" },
    );
    const data = (await response.json()) as AniwatchEpisodeSrc;
    cache.set(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(`Fetch failed Episode Sources english`);
  }
}

async function fetchAniwatchEpisodeServer(id: string, ep: string) {
  const cacheKey = `episode-server-${id}-${ep}`;
  try {
    const existing = cache.get(cacheKey) as string | null;
    if (existing) {
      return JSON.parse(existing) as AniwatchEpisodeData;
    }
    const response = await fetch(
      `${process.env.ANIWATCH_API}/api/v2/hianime/episode/servers?animeEpisodeId=${id}?ep=${ep}`,
      { cache: "no-store" },
    );
    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    throw new Error(`Fetch failed Episode Sources english`);
  }
}