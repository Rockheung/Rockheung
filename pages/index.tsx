import React from "react";
import type { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";

// Singleton
import NotionClient, { isText, PageProperty } from "../lib/notion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import commonsConfig from "../commons.config";

type PagePropertyKey =
  | "tags"
  | "tldr"
  | "highlighted"
  | "date"
  | "published"
  | "category"
  | "name";

export type PageProperties = {
  tags: PageProperty<"multi_select">;
  tldr: PageProperty<"rich_text">;
  highlighted: PageProperty<"checkbox">;
  date: PageProperty<"date">;
  published: PageProperty<"checkbox">;
  category: PageProperty<"select">;
  name: PageProperty<"title">;
};

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
  const notion = NotionClient.getInstance();

  const posts = await notion.postsHighlighted<{ properties: PageProperties }>();
  const publishedDate = new Date().toLocaleDateString();
  return {
    props: {
      posts,
      publishedDate,
    },
  };
};

const PageHome: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  posts,
  publishedDate,
}) => {
  return (
    <>
      <Head>
        <title>{commonsConfig.blogName}</title>
      </Head>

      <Header />

      <main>
        <section>
          <header>
            <h2>{"하이라이트"}</h2>
          </header>
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
                <article key={id}>
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
                </article>
              );
            })}
        </section>
        <section>
          <header>
            <h2>{"최근 글"}</h2>
          </header>
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
                <article key={id}>
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
                </article>
              );
            })}
        </section>
      </main>

      <Footer publishedDate={publishedDate} />
    </>
  );
};

export default PageHome;
