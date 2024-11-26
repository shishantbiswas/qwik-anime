import type { RequestEvent } from "@builder.io/qwik-city";
import { cache } from "~/lib/cache";

export const onRequest = ({ json }: RequestEvent) => {
  json(200, { success: true, data: cache.data });
};
