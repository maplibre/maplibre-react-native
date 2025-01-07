import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

type FeatureItemProps = {
  title: string;
  imgSrc?: string;
  description?: ReactNode;
};

const FeatureList: FeatureItemProps[] = [
  {
    title: "Android",
    imgSrc: require("@site/static/screenshots/index/device-android.png")
      .default,
  },
  {
    title: "iOS",
    imgSrc: require("@site/static/screenshots/index/device-ios.png").default,
  },
];

function Feature({ title, imgSrc, description }: FeatureItemProps) {
  return (
    <div className={clsx("col col--6")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
      <div className="text--center">
        <img className={styles.featureSvg} src={imgSrc} />
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
