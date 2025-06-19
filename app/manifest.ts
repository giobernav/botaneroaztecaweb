import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Botanero Azteca",
    short_name: "B Azteca",
    description: "El autentico sabor de México en Madrid",
    start_url: "https://www.botaneroazteca.es/?utm_source=web_app_manifest",
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
    shortcuts: [
      {
        name: "Programa de Lealtad",
        short_name: "Lealtad",
        description:
          "Gana puntos y canjea recompensas con nuestro programa de lealtad.",
        url: "https://www.botaneroazteca.es/loyalty",
      },
    ],
  };
}
