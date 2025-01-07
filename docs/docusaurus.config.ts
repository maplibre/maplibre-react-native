import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "MapLibre React Native",
  tagline:
    "React Native library for creating maps with MapLibre Native for Android & iOS.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "maplibre", // Usually your GitHub org/user name.
  projectName: "maplibre-react-native", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // TODO: Test
          editUrl:
            "https://github.com/maplibre/maplibre-react-native/tree/main/docs/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "MapLibre React Native",
      logo: {
        alt: "MapLibre Logo",
        src: "logos/maplibre-logo-square-for-light-bg.svg",
      },
      items: [
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "setup",
          label: "Setup",
        },
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "guides",
          label: "Guides",
        },
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "components",
          label: "Components",
        },
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "modules",
          label: "Modules",
        },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "X",
              href: "https://x.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/maplibre/maplibre-react-native",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
