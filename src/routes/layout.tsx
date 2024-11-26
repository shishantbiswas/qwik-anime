import { component$, Slot } from "@builder.io/qwik";
import Navbar from "~/components/Navbar";

// export const onGet: RequestHandler = async ({ cacheControl }) => {
//   cacheControl({
//     staleWhileRevalidate: 60 * 60 * 12,
//     maxAge: 5,
//   });
// };

export default component$(() => {
  return (
    <div>
      <Navbar />
      <Slot />
    </div>
  );
});
