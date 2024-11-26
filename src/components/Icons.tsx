import { component$ } from "@builder.io/qwik";

export const Caption = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
        <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
      </svg>
    );
  },
);

export const Mic = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    );
  },
);

export const Search = component$(
  ({
    size,
    color,
    className,
    opacity,
  }: {
    size?: number;
    color?: string;
    className?: string;
    opacity?: number;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        opacity={opacity}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
  },
);

export const X = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  },
);

export const CircleX = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    );
  },
);

export const FileWarning = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  },
);

export const History = component$(
  ({
    size,
    color,
    className,
  }: {
    size?: number;
    color?: string;
    className?: string;
  }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color || "none"}
        class={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    );
  },
);
