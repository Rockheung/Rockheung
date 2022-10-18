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
  const { link, content } = textItem.text;

  /**
   * color: <span>
   * bold: <strong>
   * italic: <i>
   * strikethrough: <s>
   * underline: <u>
   * code: <code>
   * link: <a>
   */

  let WrappedChild: React.ReactNode = <>{content}</>;

  if (color !== "default")
    WrappedChild = <span className={styles[color]}>{WrappedChild}</span>;

  if (bold) WrappedChild = <strong>{WrappedChild}</strong>;
  if (italic) WrappedChild = <i>{WrappedChild}</i>;
  if (strikethrough) <s>{WrappedChild}</s>;
  if (underline) <u>{WrappedChild}</u>;
  if (code) WrappedChild = <code>{WrappedChild}</code>;
  if (link)
    WrappedChild = (
      <a href={link.url} target={"_blank"} rel={"noreferrer"}>
        {WrappedChild}
      </a>
    );
  return WrappedChild;
};

export default RichText;
