import ejs from "ejs";
import { promises as fs } from "node:fs";
import path from "node:path";

const TMPL_PATH = path.join(__dirname, "..", "templates");

export class MarkdownBuilder {
  async generateComponentFile(docJSON: any, componentName: string) {
    const tmpl = ejs.compile(
      await fs.readFile(path.join(TMPL_PATH, "component.md.ejs"), "utf8"),
      {
        async: true,
        strict: true,
      },
    );
    const fileContents = await tmpl({ component: docJSON[componentName] });
    await fs.writeFile(
      path.join(__dirname, "..", "..", "docs", `${componentName}.md`),
      fileContents,
    );
  }

  async generate() {
    const docJSONFile = await fs.readFile(
      path.join(__dirname, "..", "..", "docs", "docs.json"),
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
