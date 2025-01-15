import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "MapLibre React Native",
  tagline:
    "React Native library for creating maps with MapLibre Native for Android & iOS.",
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/maplibre-react-native/favicons/light.svg",
        type: "image/svg+xml",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/maplibre-react-native/favicons/light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/maplibre-react-native/favicons/dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    },
  ],

  url: "https://maplibre.org/",
  baseUrl: "/maplibre-react-native/",

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
          path: "content",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/maplibre/maplibre-react-native/tree/main/docs/",
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
        srcDark: "logos/maplibre-logo-square-for-dark-bg.svg",
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
          href: "https://github.com/maplibre/maplibre-react-native",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Get Help",
          items: [
            {
              label: "GitHub Discussions",
              href: "https://github.com/maplibre/maplibre-react-native/discussions",
            },
            {
              label: "Slack",
              href: "https://osmus.slack.com/archives/C065DB4T2UB",
            },
          ],
        },
        {
          title: "MapLibre Community",
          items: [
            {
              label: "BlueSky",
              href: "https://bsky.app/profile/maplibre.org",
            },
            {
              label: "Mastodon",
              href: "https://mastodon.social/@maplibre",
            },
            {
              label: "X",
              href: "https://twitter.com/maplibre",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/maplibre",
            },
            {
              label: "GitHub",
              href: "https://github.com/MapLibre",
            },
          ],
        },
      ],
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["diff", "ruby"],
    },

    algolia: {
      appId: "XPG24MVV4L",
      apiKey: "88a400aaa583423db0984b785c1de05b",
      indexName: "maplibre-react-native",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
