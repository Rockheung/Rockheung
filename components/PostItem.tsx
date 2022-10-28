import React from "react";
import Link from "next/link";
import { isText, PageProperties } from "../lib/notion";
import styles from "./PostItem.module.css";

type Props = {
  id: string;
  properties: PageProperties;
};
const PostItem = ({ id, properties }: Props) => {
  const { tags, tldr, highlighted, date, published, category, name } =
    properties;
  return (
    <Link href={"/posts/" + id}>
      <a>
        <div className={styles.Post_wrapper}>
          <article id={id} className={styles.Post}>
            <h3>{name.title.filter(isText).map(({ text }) => text.content)}</h3>
            <p>{date.date!.start}</p>
            <p>
              {tldr.rich_text
                .filter(isText)
                .map(({ text }) => text.content)
                .join("\n")}
            </p>
          </article>
          <div className={styles.Bottom_shadow}></div>
          <div className={styles.Right_shadow}></div>
        </div>
      </a>
    </Link>
  );
};

export default PostItem;
