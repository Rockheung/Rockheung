import React from "react";
import type { NextPage, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

// Singleton
import NotionClient, { isText, PageProperty } from "../notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type PagePropertyKey =
  | "tags"
  | "tldr"
  | "highlighted"
  | "date"
  | "published"
  | "category"
  | "name";

type PageProperties = PageProperty<"tags", "multi_select"> &
  PageProperty<"tldr", "rich_text"> &
  PageProperty<"highlighted", "checkbox"> &
  PageProperty<"date", "date"> &
  PageProperty<"published", "checkbox"> &
  PageProperty<"category", "select"> &
  PageProperty<"name", "title">;

const propertyKeys = [
  "tags",
  "tldr",
  "highlighted",
  "date",
  "published",
  "category",
  "name",
];

export const getStaticProps = async () => {
  const notion = new NotionClient();

  const posts = await notion.postsHighlighted<{ properties: PageProperties }>();
  return {
    props: {
      posts,
    },
  };
};

const PageHome: NextPage<
  InferGetServerSidePropsType<typeof getStaticProps>
> = ({ posts }) => {
  const today = React.useMemo(() => {
    const _date = new Date();
    return "Published at " + _date.toLocaleDateString();
  }, []);

  return (
    <div>
      <Head>
        <title>/var/log/</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>{"/var/log"}</h1>
      </header>

      <main>
        <div>
          <ul>
            {typeof posts !== "undefined" &&
              posts.map(({ properties, id }) => {
                const {
                  tags,
                  tldr,
                  highlighted,
                  date,
                  published,
                  category,
                  name,
                } = properties;
                return (
                  <li key={id}>
                    <Link href={"/posts/" + id}>
                      <a>
                        <article id={id}>
                          <h3>
                            {name.title
                              .filter(isText)
                              .map(({ text }) => text.content)}
                          </h3>
                          <p>{date.date!.start}</p>
                          <p>
                            {tldr.rich_text
                              .filter(isText)
                              .map(({ text }) => text.content)
                              .join("\n")}
                          </p>
                        </article>
                      </a>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </main>

      <footer>
        <p>{today}</p>
      </footer>
    </div>
  );
};

export default PageHome;
