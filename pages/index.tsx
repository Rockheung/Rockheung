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
        <div className={styles.Main}>
          <section>
            <header className={styles.Section_header}>
              <h2>{"하이라이트"}</h2>
            </header>
            {typeof posts !== "undefined"
              ? posts.map((post) => {
                  return <PostItem key={post.id} {...post} />;
                })
              : null}
          </section>
          <section>
            <header className={styles.Section_header}>
              <h2>{"최근 글"}</h2>
            </header>
            {typeof posts !== "undefined"
              ? posts.map((post) => {
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
