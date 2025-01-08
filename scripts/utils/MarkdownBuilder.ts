import ejs from "ejs";
import { promises as fs } from "node:fs";
import path from "node:path";
import prettier from "prettier";

import * as TemplateHelpers from "./TemplateHelpers";

const TEMPLATE_PATH = path.join(__dirname, "..", "templates");

export class MarkdownBuilder {
  async generateComponentFile(docJSON: any, componentName: string) {
    const template = ejs.compile(
      await fs.readFile(path.join(TEMPLATE_PATH, "component.md.ejs"), "utf8"),
      {
        async: true,
        strict: true,
      },
    );
    const fileContents = await template({
      component: docJSON[componentName],
      helpers: TemplateHelpers,
    });

    const pathParts = [
      __dirname,
      "..",
      "..",
      "docs",
      "content",
      `${docJSON[componentName].type}s`,
    ];

    if (docJSON[componentName].type === "component") {
      if (componentName.includes("Layer") || componentName === "Light") {
        pathParts.push("layers");
      } else if (componentName.includes("Source")) {
        pathParts.push("sources");
      } else {
        pathParts.push("general");
      }
    }

    await fs.writeFile(
      path.join(
        ...pathParts,
        `${componentName
          .match(/[A-Z][a-z]*/g)
          ?.join("-")
          .toLowerCase()}.md`,
      ),

      await prettier.format(fileContents, {
        ...(await prettier.resolveConfig(process.cwd())),
        parser: "markdown",
      }),
    );
  }

  async generate() {
    const docJSONFile = await fs.readFile(
      path.join(__dirname, "..", "..", "docs", "content", "docs.json"),
      "utf8",
    );
    const docJSON = JSON.parse(docJSONFile);
    const componentPaths = Object.keys(docJSON);

    await Promise.all(
      componentPaths.map((componentPath) =>
        this.generateComponentFile(docJSON, componentPath),
      ),
    );

    console.log("Markdown is finished generating");
  }
}
