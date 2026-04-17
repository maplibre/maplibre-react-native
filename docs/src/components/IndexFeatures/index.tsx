import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import clsx from "clsx";
import React from "react";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

type FeatureItemProps = {
  col: number;
  title: string;
  imgSrc?: string;
  description?: ReactNode;
};

const FeatureList: FeatureItemProps[] = [
  {
    col: 3,
    title: "Android",
    imgSrc: require("@site/static/screenshots/index/device-android.png")
      .default,
  },
  {
    col: 6,
    title: "Code",
    description: (
      <>
        <CodeBlock language="tsx">
          {`import { Map } from "@maplibre/maplibre-react-native";

export function ExampleMap() {
  return <Map mapStyle="https://demotiles.maplibre.org/style.json" />;
}
`}
        </CodeBlock>
      </>
    ),
  },
  {
    col: 3,
    title: "iOS",
    imgSrc: require("@site/static/screenshots/index/device-ios.png").default,
  },
];

function Feature({ col, title, imgSrc, description }: FeatureItemProps) {
  return (
    <div className={clsx(`col col--${col}`, styles.feature)}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
      </div>
      {description}
      {imgSrc && (
        <div className="text--center">
          <img alt={title} className={styles.featureSvg} src={imgSrc} />
        </div>
      )}
    </div>
  );
}

export function IndexFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
