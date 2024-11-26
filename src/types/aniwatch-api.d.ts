type AniwatchHome = {
  success: boolean;
  data: {
    spotlightAnimes: SpotlightAnimes[];
    trendingAnimes: TrendingAnimes[];
    latestEpisodeAnimes: LatestEpisodeAnimes[];
    topUpcomingAnimes: TopUpcomingAnimes[];
    top10Animes: Top10Animes;
    TopAiringAnimes: TopAiringAnimes[];
    genres: string[];
  };
};

type TopAiringAnimes = {
  id: string;
  name: string;
  jname?: string;
  type?: string;
  description: string;
  poster: string;
  otherInfo: string[];
};

type Top10Animes = {
  today: Top10AnimesResult[];
  week: Top10AnimesResult[];
  month: Top10AnimesResult[];
};

type Top10AnimesResult = {
  id: string;
  name: string;
  description: string;
  poster: string;
  episodes: { sub: number; dub: number };
};

type TopUpcomingAnimes = {
  id: string;
  name: string;
  duration: string;
  poster: string;
  type: string;
  rating: string | null;
  episodes: { sub: number; dub: number };
};

type LatestEpisodeAnimes = {
  id: string;
  name: string;
  description: string;
  poster: string;
  type: string;
  rating: string | null;
  episodes: { sub: number; dub: number };
};

type TrendingAnimes = {
  rank: number;
  id: string;
  name: string;
  poster: string;
};

type SpotlightAnimes = {
  rank: number;
  id: string;
  name: string;
  description: string;
  poster: string;
  jname: string;
  episodes: { sub: number; dub: number };
  otherInfo: [string, string, string, string];
};

type AniwatchInfo = {
  data: {
    anime: {
      info: {
        id: string;
        anilistId: number;
        malId: number;
        name: string;
        poster: string;
        description: string;
        stats: {
          rating: string;
          quality: string;
          episodes: { sub: string | number; dub: string | number };
          type: string;
          duration: string;
        };
      };
      moreInfo: {
        japanese: string;
        synonyms: string;
        aired: string;
        premiered: string;
        duration: string;
        status: string;
        malscore: string;
        genres: string[];
        studios: string;
        producers: string[];
      };
    };
    seasons: {
      id: string;
      name: string;
      title: string;
      poster: string;
      isCurrent: boolean;
    }[];
    mostPopularAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: {
        sub: number;
        dub: number;
      };
      type: string;
    }[];
    relatedAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: {
        sub: number;
        dub: number;
      };
      type: Special;
    }[];
    recommendedAnimes: {
      id: string;
      name: string;
      jname?: string;
      poster: string;
      duration: string;
      type: string;
      rating: string;
      episodes: {
        sub: number;
        dub: number;
      };
    }[];
  };
};

type AniwatchEpisodeData = {
  success: boolean;
  data: {
    totalEpisodes: number;
    episodes: {
      title: string;
      episodeId: string;
      number: string;
      isFiller: boolean;
    }[];
  };
};

type AniwatchSearch = {
  data: {
    animes: Anime[];
    mostPopularAnimes: {
      id: string;
      name: string;
      poster: string;
      jname: string;
      episodes: { sub: number; dub: number };
      type: string;
    }[];
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    searchQuery: string;
    searchFilters: {};
  };
};

type Anime = {
  id: string;
  name: string;
  poster: string;
  duration: string;
  type: string;
  jname?: string;
  rating: string;
  episodes: { sub: number; dub: number };
};

type AniwatchEpisodeSrc = {
  data: {
    tracks: { file: string; kind: string; label: string; default: boolean }[];
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    sources: { url: string; type: string }[];
    anilistID: [];
    malID: [];
  };
};

type AniwatchGenre = {
  data: {
    genreName: string;
    animes: Anime[];
    genres: string[];
    TopAiringAnimes: TopAiringAnimes[];
    totalPages: number;
    hasNextPage: boolean;
    currentPage: number;
  };
};

type AniwatchStudio = {
  producerName: string;
  animes: Anime[];
  genres: string[];
  TopAiringAnimes: TopAiringAnimes[];
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
};

type AniwatchCategories = {
  success: boolean;
  data: {
    genres: string[];
    animes: Anime[];
    top10Animes: top10Animes;
    category: string;
    totalPages: number;
    hasNextPage: boolean;
    currentPage: number;
  };
};

type AniwatchCategoriesName =
  | "most-favorite"
  | "most-popular"
  | "subbed-anime"
  | "dubbed-anime"
  | "recently-updated"
  | "recently-added"
  | "top-upcoming"
  | "top-airing"
  | "movie"
  | "special"
  | "ova"
  | "ona"
  | "tv"
  | "completed";
