import type { JSX } from "@builder.io/qwik";
import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { Search } from "./Icons";

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const links = [
    {
      id: 1,
      linkName: "Home",
      href: "/",
      currentRoute: location.url.pathname === "/",
    },
    {
      id: 4,
      linkName: "Recently Added",
      href: "/category/recently-added",
    },
    {
      id: 2,
      linkName: "Fan Favorite",
      href: "/category/most-favorite",
    },
    {
      id: 3,
      linkName: "Movie",
      href: "/category/movie",
    },
  ];

  const inputText = useSignal("");
  const debouncedValue = useSignal("");

  //debounce
  useTask$(({ track, cleanup }) => {
    track(() => inputText.value);

    const debounced = setTimeout(() => {
      debouncedValue.value = inputText.value;
    }, 1000);
    cleanup(() => clearTimeout(debounced));
  });

  useVisibleTask$(async ({ track }) => {
    track(() => {
      debouncedValue.value;
    });

    if (debouncedValue.value.length > 0) {
      await nav(`/result?q=${encodeURIComponent(debouncedValue.value)}`);
    }
  });

  return (
    <section class="relative h-20 w-full bg-black/80">
      <nav class="fixed top-0 z-[500] mb-20 flex h-20 w-full items-center justify-between bg-black/30 px-6 backdrop-blur">
        <div class="flex items-center">
          <img
            src="/favicon.ico"
            class="mr-4 size-4"
            height={100}
            width={100}
            loading="lazy"
            alt="favicon"
          />
          <div
            //   ref={linkref}
            class="group flex"
          >
            {links.map((link) => (
              <NavLink
                key={link.id}
                currentRoute={link.currentRoute}
                href={link.href}
                linkName={link.linkName}
              />
            ))}

            {/* <div
              style={{
                translate: `${
                  (linkref.current?.children[navIndex]?.getBoundingClientRect()
                    .left ?? 0) - 16
                }px`,
                width:
                  linkref.current?.children[navIndex]?.getBoundingClientRect()
                    .width,
              }}
              class="group-hover:bg-white h-2 bottom-2 left-4 absolute transition-all  ease-in-out"
            /> */}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex h-[40px] w-fit flex-row-reverse overflow-hidden rounded-xl bg-gray-600/50 px-3">
            <input
              type="text"
              class=" h-full w-[180px] bg-transparent px-2 placeholder:text-white/50 focus:outline-none "
              placeholder="Ctrl+K"
              value={""}
              // onInput$={$(async (event, elem) => {
              //   searchQuery.value = elem.value.trim();
              //   //
              // })}
              bind:value={inputText}
            />
            <button>
              <Search size={20} color="none" opacity={0.5} />
            </button>
          </div>
          <Link prefetch={false}
            target="_blank"
            href="https://github.com/shishantbiswas/bunflix"
            class="flex items-center gap-2 text-nowrap"
          >
            <svg
              class=" size-6 fill-white"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </div>
      </nav>
    </section>
  );
});

const NavLink = component$(
  ({
    icon,
    linkName,
    href,
    currentRoute,
    showIcon,
  }: {
    icon?: JSX.Element;
    linkName: string;
    href: string;
    currentRoute?: boolean;
    showIcon?: boolean;
  }) => {
    return (
      <Link prefetch={false}
        href={href}
        style={{
          backgroundColor: currentRoute ? "#dc2626" : "",
          borderRadius: "10px",
        }}
      >
        <button>
          <div class="group relative flex w-fit items-center gap-2 px-3 py-1.5">
            {showIcon ? icon : currentRoute ? icon : null}
            <h1 class="text-nowrap">{linkName}</h1>
          </div>
        </button>
      </Link>
    );
  },
);
