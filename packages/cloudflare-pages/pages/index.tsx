import React from "react";
import type { NextPage, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";

// Singleton
import NotionClient, { PageProperties } from "../lib/notion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import commonsConfig from "../commons.config";
import styles from "../styles/Index.module.css";
import PostItem from "../components/PostItem";

export const getStaticProps = async () => {
  const notion = NotionClient.getInstance();

  const postsPinned = await notion.postsPinned<{
    properties: PageProperties;
  }>();
  const postsLatest = await notion.postsLatest<{
    properties: PageProperties;
  }>();
  const publishedDate = new Date().toLocaleDateString();
  return {
    props: {
      postsPinned,
      postsLatest,
      publishedDate,
    },
  };
};

const PageHome: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  postsPinned,
  postsLatest,
  publishedDate,
}) => {
  return (
    <>
      <Head>
        <title>{commonsConfig.blogName}</title>
      </Head>

      <Header />

      <main>
        <div className={styles.Main}>
          <section>
            <header className={styles.Section_header}>
              <h2>{"Pinned"}</h2>
            </header>
            {typeof postsPinned !== "undefined"
              ? postsPinned.map((post) => {
                  return <PostItem key={post.id} {...post} />;
                })
              : null}
          </section>
          <section>
            <header className={styles.Section_header}>
              <h2>{"Latest Posts"}</h2>
            </header>
            {typeof postsLatest !== "undefined"
              ? postsLatest.map((post) => {
                  return <PostItem key={post.id} {...post} />;
                })
              : null}
          </section>
        </div>
      </main>

      <Footer publishedDate={publishedDate} />
    </>
  );
};

export default PageHome;
