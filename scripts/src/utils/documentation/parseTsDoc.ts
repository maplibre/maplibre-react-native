import {
  DocBlock,
  DocCodeSpan,
  DocErrorText,
  DocEscapedText,
  DocFencedCode,
  DocHtmlEndTag,
  DocHtmlStartTag,
  DocLinkTag,
  DocNode,
  DocNodeKind,
  DocParagraph,
  DocPlainText,
  TSDocParser,
} from "@microsoft/tsdoc";

import type { ExampleEntry } from "../../types/DocEntry";

export interface ParsedTsDoc {
  description: string;
  params: Map<string, string>;
  returns: string;
  examples: ExampleEntry[];
  defaultValue?: string;
  see: string[];
}

const parser = new TSDocParser();

function extractNodeText(node: DocNode): string {
  switch (node.kind) {
    case DocNodeKind.PlainText:
      return (node as DocPlainText).text;
    case DocNodeKind.CodeSpan:
      return `\`${(node as DocCodeSpan).code}\``;
    case DocNodeKind.FencedCode: {
      const fenced = node as DocFencedCode;
      return `\`\`\`${fenced.language ?? ""}\n${fenced.code}\n\`\`\``;
    }
    case DocNodeKind.LinkTag: {
      const link = node as DocLinkTag;
      if (link.urlDestination) {
        const dest = link.urlDestination;
        const text = link.linkText?.trim() || dest;
        return `[${text}](${dest})`;
      }
      // Declaration reference: {@link SomeIdentifier} or {@link SomeIdentifier | display text}
      const identifier =
        link.codeDestination?.memberReferences[0]?.memberIdentifier
          ?.identifier ?? "";
      const displayText = link.linkText?.trim() || identifier;
      return displayText ? `\`${displayText}\`` : "";
    }
    case DocNodeKind.SoftBreak:
      return "\n";
    case DocNodeKind.EscapedText:
      return (node as DocEscapedText).decodedText;
    case DocNodeKind.ErrorText:
      return (node as DocErrorText).text;
    case DocNodeKind.HtmlStartTag:
      return (node as DocHtmlStartTag).emitAsHtml();
    case DocNodeKind.HtmlEndTag:
      return (node as DocHtmlEndTag).emitAsHtml();
    default: {
      let out = "";
      for (const child of node.getChildNodes()) {
        out += extractNodeText(child);
      }
      return out;
    }
  }
}

function extractBlockText(block: DocNode | undefined): string {
  if (!block) return "";

  const lines: string[] = [];
  for (const node of block.getChildNodes()) {
    if (node.kind === DocNodeKind.Paragraph) {
      const para = node as DocParagraph;
      let paraText = "";
      for (const child of para.getChildNodes()) {
        if (child.kind === DocNodeKind.SoftBreak) {
          paraText += "\n";
        } else {
          paraText += extractNodeText(child);
        }
      }
      lines.push(paraText.trimEnd());
    } else if (node.kind === DocNodeKind.FencedCode) {
      lines.push(extractNodeText(node));
    } else {
      const text = extractNodeText(node);
      if (text.trim()) lines.push(text.trimEnd());
    }
  }
  return lines.join("\n").trim();
}

export function parseTsDoc(rawComment: string): ParsedTsDoc {
  const ctx = parser.parseString(rawComment);
  const doc = ctx.docComment;

  const description = extractBlockText(doc.summarySection);

  const params = new Map<string, string>();
  for (const block of doc.params.blocks) {
    params.set(block.parameterName, extractBlockText(block.content));
  }

  const returns = doc.returnsBlock
    ? extractBlockText(doc.returnsBlock.content)
    : "";

  const examples: ExampleEntry[] = [];
  let defaultValue: string | undefined;
  const see: string[] = [];

  for (const block of doc.customBlocks as DocBlock[]) {
    const tagName = block.blockTag.tagName;
    if (tagName === "@example") {
      const children = [...block.content.getChildNodes()];

      let title = "";
      let bodyStartIdx = 0;
      const firstChild = children[0];
      if (firstChild?.kind === DocNodeKind.Paragraph) {
        title = extractNodeText(firstChild).trim();
        bodyStartIdx = 1;
      }

      const bodyLines: string[] = [];
      for (let i = bodyStartIdx; i < children.length; i++) {
        const node = children[i];
        if (!node) continue;
        if (node.kind === DocNodeKind.Paragraph) {
          const para = node as DocParagraph;
          let paraText = "";
          for (const child of para.getChildNodes()) {
            paraText +=
              child.kind === DocNodeKind.SoftBreak
                ? "\n"
                : extractNodeText(child);
          }
          bodyLines.push(paraText.trimEnd());
        } else if (node.kind === DocNodeKind.FencedCode) {
          bodyLines.push(extractNodeText(node));
        } else {
          const text = extractNodeText(node);
          if (text.trim()) bodyLines.push(text.trimEnd());
        }
      }

      examples.push({ title, content: bodyLines.join("\n").trim() });
    } else if (tagName === "@defaultValue") {
      defaultValue = extractBlockText(block.content);
    }
  }

  for (const block of doc.seeBlocks as DocBlock[]) {
    see.push(extractBlockText(block.content));
  }

  return { description, params, returns, examples, defaultValue, see };
}
