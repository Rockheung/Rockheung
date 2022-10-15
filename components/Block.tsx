import {
  BlockObjectResponse,
  Heading1BlockObjectResponse,
  ParagraphBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React, { PropsWithChildren, PropsWithRef } from "react";
import { BlockObjectWithRichText } from "../lib/notion";
import RichText from "./RichText";

const ElementTypeWithRichText: Record<
  BlockObjectWithRichText["type"],
  keyof JSX.IntrinsicElements | (keyof JSX.IntrinsicElements)[]
> = {
  paragraph: ["div"],
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
  toggle: "div",
  template: "div",
  callout: "div",
};

type Props = {
  block: BlockObjectResponse;
};

const hasRichText = (
  block: BlockObjectResponse
): block is BlockObjectWithRichText => {
  return block.type in ElementTypeWithRichText;
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
    case "template": {
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

  if (Array.isArray(tagName)) {
    return (tagName as string[]).reduceRight(
      (Child, tag, idx) => {
        if (block.type === "to_do" && idx === 0) {
          return React.createElement(
            tag,
            {},
            React.createElement("input", {
              type: "checkbox",
              value: block.to_do.checked,
              disabled: true,
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
