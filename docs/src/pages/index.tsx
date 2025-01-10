import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { IndexFeatures } from "@site/src/components/IndexFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./index.module.css";

function IndexHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="docs/setup/getting-started"
          >
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Index(): ReactNode {
  return (
    <Layout>
      <IndexHeader />
      <main>
        <IndexFeatures />
      </main>
    </Layout>
  );
}
