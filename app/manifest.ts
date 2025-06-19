import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Botanero Azteca",
    short_name: "B Azteca",
    description: "El autentico sabor de México en Valdebebas, Madrid",
    start_url: "./?utm_source=web_app_manifest",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#3A86FF",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
