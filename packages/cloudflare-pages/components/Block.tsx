import {
  BlockObjectResponse,
  CodeBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { BlockObjectWithRichText } from "../lib/notion";
import RichText from "./RichText";
import Prism from "../prism";

const ElementTypeWithRichText: Record<
  BlockObjectWithRichText["type"],
  keyof JSX.IntrinsicElements | (keyof JSX.IntrinsicElements)[]
> = {
  paragraph: ["p"],
  heading_1: "h1",
  heading_2: "h2",
  heading_3: "h3",
  bulleted_list_item: [
    // "ul",
    "li",
  ],
  numbered_list_item: [
    // "ol",
    "li",
  ],
  code: ["pre", "code"],
  quote: "blockquote",
  to_do: ["div", "label"],
  toggle: [],
  template: [],
  callout: "aside",
};

type Props = {
  block: BlockObjectResponse;
};

const hasRichText = (
  block: BlockObjectResponse
): block is BlockObjectWithRichText => {
  return block.type in ElementTypeWithRichText;
};

const hasChildren = (block: BlockObjectResponse) => block.has_children;

const getProperGrammar = (
  notionLanguageType: CodeBlockObjectResponse["code"]["language"]
) => {
  switch (notionLanguageType) {
    case "c++":
      return "cpp";
    case "typescript":
      return "ts";
    case "javascript":
      return "js";
    case "css":
      return "css";
    case "sass":
      return "sass";
    case "scss":
      return "scss";
    case "shell":
      return "shell";
    case "plain text":
      return "plaintext";
    case "html":
      return "html";
    default:
      return "clike";
  }
};

const getRichText = (block: BlockObjectResponse) => {
  switch (block.type) {
    case "paragraph": {
      return block[block.type].rich_text;
    }
    case "heading_1": {
      return block[block.type].rich_text;
    }
    case "heading_2": {
      return block[block.type].rich_text;
    }
    case "heading_3": {
      return block[block.type].rich_text;
    }
    case "bulleted_list_item": {
      return block[block.type].rich_text;
    }
    case "numbered_list_item": {
      return block[block.type].rich_text;
    }
    case "code": {
      return block[block.type].rich_text;
    }
    case "quote": {
      return block[block.type].rich_text;
    }
    case "to_do": {
      return block[block.type].rich_text;
    }
    case "toggle": {
      return block[block.type].rich_text;
    }
    case "callout": {
      return block[block.type].rich_text;
    }
    default: {
      console.warn(block.type, "has no renderer");
      return [];
    }
  }
};

const Block: React.FunctionComponent<Props> = ({ block }) => {
  if (!hasRichText(block)) {
    return (
      <div>
        <p>
          <em>Not supported yet.</em>
        </p>
      </div>
    );
  }

  const tagName = ElementTypeWithRichText[block.type];

  if (block.type === "code") {
    return React.createElement(
      "pre",
      { className: `language-${block.code.language}` },
      React.createElement("code", {
        className: `language-${block.code.language}`,
        dangerouslySetInnerHTML: {
          __html: Prism.highlight(
            getRichText(block)
              .map((text) => text.plain_text)
              .join(""),
            Prism.languages[getProperGrammar(block.code.language)],
            block.code.language
          ),
        },
      })
    );
  }

  if (Array.isArray(tagName)) {
    return (tagName as string[]).reduceRight(
      (Child, tag, idx) => {
        if (block.type === "to_do" && idx === 0) {
          return React.createElement(
            tag,
            {},
            React.createElement("input", {
              type: "checkbox",
              checked: block.to_do.checked,
              readOnly: true,
            }),
            Child
          );
        }
        return React.createElement(tag, {}, Child);
      },
      React.createElement(
        React.Fragment,
        {},
        ...getRichText(block).map((text, idx) => {
          return <RichText key={idx} textItem={text} />;
        })
      ) as JSX.Element
    );
  }

  return React.createElement(
    tagName || React.Fragment,
    {},
    ...getRichText(block).map((text, idx) => {
      return <RichText key={idx} textItem={text} />;
    })
  );
};

export default Block;
