import React from "react";
import Link from "next/link";
import { PageProperty, isText } from "../lib/notion";
import styles from "./PostItem.module.css";

export type PageProperties = {
  tags: PageProperty<"multi_select">;
  tldr: PageProperty<"rich_text">;
  highlighted: PageProperty<"checkbox">;
  date: PageProperty<"date">;
  published: PageProperty<"checkbox">;
  category: PageProperty<"select">;
  name: PageProperty<"title">;
};

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
        <article className={styles.Post}>
          <article id={id}>
            <h3>{name.title.filter(isText).map(({ text }) => text.content)}</h3>
            <p>{date.date!.start}</p>
            <p>
              {tldr.rich_text
                .filter(isText)
                .map(({ text }) => text.content)
                .join("\n")}
            </p>
          </article>
        </article>
      </a>
    </Link>
  );
};

export default PostItem;
