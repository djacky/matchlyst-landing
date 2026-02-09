import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Matchlyst — AI-Powered Freelancer Screening",
    short_name: "Matchlyst",
    description:
      "An AI-powered platform that generates job-specific interviews and ranks freelancers based on real capability.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
