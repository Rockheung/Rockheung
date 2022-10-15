import React from "react";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { isText } from "../lib/notion";
import styles from "./RichText.module.css";

type Props = {
  textItem: RichTextItemResponse;
};
const RichText = ({ textItem }: Props) => {
  if (!isText(textItem)) return <>{textItem.plain_text}</>;
  const { bold, italic, strikethrough, underline, color, code } =
    textItem.annotations;

  let classNames = [];
  if (bold) classNames.push(styles.bold);
  if (italic) classNames.push(styles.italic);
  if (strikethrough) classNames.push(styles.strikethrough);
  if (underline) classNames.push(styles.underline);
  if (code) classNames.push(styles.code);
  if (color !== "default") classNames.push(styles[color]);
  if (textItem.text.link) classNames.push(styles.link);

  if (classNames.length === 0) return <>{textItem.text.content}</>;

  if (code) {
    return (
      <code className={classNames.join(" ")}>{textItem.text.content}</code>
    );
  } else if (textItem.text.link) {
    return (
      <a
        className={classNames.join(" ")}
        href={textItem.text.link.url}
        target={"_blank"}
        rel={"noreferrer"}
      >
        {textItem.text.content}
      </a>
    );
  }
  return <span className={classNames.join(" ")}>{textItem.text.content}</span>;
};

export default RichText;
