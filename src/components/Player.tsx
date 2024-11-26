import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import Artplayer from "artplayer";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import Hls from "hls.js";

export default component$(
  ({
    src,
    track,
  }: {
    src: string;
    track: {
      file: string;
      kind: string;
      label: string;
      default: boolean;
    }[];
  }) => {
    const artRef = useSignal<HTMLDivElement>();
    useVisibleTask$(({ cleanup, track: depTrack }) => {
      depTrack(() => {
        src;
      });
      if (!artRef.value) return;
      const art = new Artplayer({
        url: src,
        container: artRef.value,
        setting: true,
        fullscreen: true,
        fullscreenWeb: true,
        playbackRate: true,
        autoPlayback: true,
        volume: 0.5,
        muted: false,
        autoplay: true,
        moreVideoAttr: {
          crossOrigin: "anonymous",
        },
        plugins: [
          artplayerPluginHlsQuality({
            control: true,
            setting: true,
            getResolution: (level) => level.height + "P",
            title: "Quality",
            auto: "Auto",
          }),
        ],
        settings: [
          {
            width: 200,
            html: "Subtitle",
            tooltip: "Subtitle",
            selector: [
              {
                html: "Display",
                tooltip: "Show",
                switch: false,
                onSwitch: function (item) {
                  item.tooltip = item.switch ? "Hide" : "Show";
                  art.subtitle.show = !item.switch;
                  return !item.switch;
                },
              },
              ...track.map((sub) => {
                return {
                  html: sub.label,
                  url: sub.file,
                };
              }),
            ],
            onSelect: function (item) {
              art.subtitle.switch(item.url, {
                name: item.html,
              });
              return item.html;
            },
          },
        ],
        subtitle: {
          url: track.filter((sub) => sub.label === "English")[0]?.file || "",
          escape: true,
          name: "English",
          onVttLoad: (vtt) => {
            return vtt.replace(/<[^>]+>/g, "");
          },
          type: "vtt",
          encoding: "utf-8",
          style: {
            fontWeight: "600",
            fontSize: "28px",
          },
        },
        customType: {
          m3u8: function playM3u8(video, url, art) {
            if (Hls.isSupported()) {
              if (art.hls) art.hls.destroy();
              const hls = new Hls({
                fragLoadingMaxRetry: 200,
                fragLoadingRetryDelay: 500,
                fragLoadingTimeOut: 30000,
                fragLoadingMaxRetryTimeout: 1000,
                maxBufferLength: 300,
                maxMaxBufferLength: 300,
                maxBufferHole: 0.5,
              });
              hls.loadSource(url);
              hls.attachMedia(video);
              art.hls = hls;
              art.on("destroy", () => hls.destroy());
              video.addEventListener("ended", () => {
                if (hls) {
                  hls.destroy();
                  console.log("HLS instance destroyed");
                }
              });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = url;
            } else {
              art.notice.show = "Unsupported playback format: m3u8";
            }
          },
        },
      });
      cleanup(() => {
        if (art && art.destroy) {
          art.destroy(false);
        }
      });
    });
    return (
      <div
        ref={artRef}
        class="sm:h-[350px ] h-[300px] w-full sm:p-4 md:h-[450px] lg:h-[550px] xl:h-[600px]"
      ></div>
    );
  },
);
