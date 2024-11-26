import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Slider = component$(({ data }: { data: AniwatchHome }) => {
  const imageindex = useSignal(0);

  const ref = useSignal<HTMLDivElement>();

  useVisibleTask$(
    async ({ cleanup, track }) => {
      track(() => imageindex.value);
      const shownext = () => {
        if (imageindex.value == data.data.spotlightAnimes.length - 1) {
          imageindex.value = 0;
          ref.value?.scrollBy({ behavior: "smooth", top: -9999 });
        } else {
          imageindex.value = imageindex.value + 1;
          ref.value?.scrollBy({ behavior: "smooth", top: 128 });
        }
      };
      // shownext();
      const intervalId = setInterval(() => shownext(), 8000);

      cleanup(() => clearInterval(intervalId));
    },
    { strategy: "document-ready" },
  );

  return (
    <div class="flex w-full">
      <section class="w-full p-4  lg:p-6">
        <div class="relative flex h-[250px] w-full sm:h-[350px] md:h-[400px] lg:h-[500px]">
          {data.data.spotlightAnimes.map((res, i) => (
            <Link prefetch={false}
              href={`/watch/${res.id}`}
              key={res.id}
              style={{
                pointerEvents: i === imageindex.value ? "all" : "none",
              }}
              class="absolute size-full cursor-pointer overflow-hidden rounded-md bg-gradient-to-br from-transparent to-black/20"
            >
              <img
                height={100}
                width={100}
                loading="lazy"
                style={{
                  height: i === imageindex.value ? "" : "50%",
                  opacity: i === imageindex.value ? "100%" : "0%",
                }}
                class="h-full w-full object-cover transition-all duration-500"
                src={res.poster}
                alt={res.name}
              />
              <div
                style={{
                  opacity: i === imageindex.value ? "" : "0%",
                }}
                class="absolute bottom-8 right-0 z-10 w-[80%] space-y-1 px-6 text-right opacity-80"
              >
                <h1 class="text-lg font-bold md:text-2xl">{res.name}</h1>
                <p class="line-clamp-2 text-sm lg:line-clamp-4">
                  {res.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div
        ref={ref}
        class=" m-4 ml-0 flex h-[250px] w-[250px] flex-col gap-4 overflow-scroll overflow-x-scroll scrollbar-hide sm:h-[350px] md:h-[400px] lg:m-6 lg:ml-0 lg:h-[500px]  "
      >
        {data.data.spotlightAnimes.map((res, i) => (
          <div
            style={{
              border:
                imageindex.value === i ? "2px solid rgb(185 28 28 / 0.8)" : "",
            }}
            key={res.id}
            onClick$={() => (imageindex.value = i)}
            class="relative flex min-h-28  w-full cursor-pointer overflow-hidden rounded-md  transition-all duration-500 "
          >
            <img
              height={100}
              width={100}
              loading="lazy"
              src={res.poster}
              class="h-full w-full object-cover"
              alt=""
            />
            <div
              style={{
                animation: `${
                  i === imageindex.value ? "timer 8s forwards linear" : ""
                }`,
              }}
              class="absolute bottom-0 h-2 w-0 bg-red-700/80"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
});
