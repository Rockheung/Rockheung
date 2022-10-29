import React from "react";
import {
  GetStaticProps,
  NextPage,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import NotionClient, { PageProperties } from "../../lib/notion";
import Head from "next/head";
import { isFullBlock, isFullPage } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import RichText from "../../components/RichText";
import commonsConfig from "../../commons.config";
import Header from "../../components/Header";

import stylesIndex from "../../styles/Index.module.css";
import styles from "../../styles/Post.module.css";
import Footer from "../../components/Footer";
import Block from "../../components/Block";

// const Block = dynamic(() => import("../../components/Block"), { ssr: false });

export const getStaticPaths: GetStaticPaths = async () => {
  const notion = NotionClient.getInstance();

  const posts = await notion.postsPublic<{ properties: PageProperties }>();

  return {
    paths: posts.map((post) => {
      return { params: { postId: post.id } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  {
    post: PageObjectResponse & {
      properties: PageProperties;
    };
    contents: BlockObjectResponse[];
  },
  { postId: string }
> = async ({ params }) => {
  if (typeof params?.postId === "undefined") return { notFound: true };

  const notion = NotionClient.getInstance();

  const post = await notion.pages.retrieve({ page_id: params.postId });

  if (!isFullPage(post)) return { notFound: true };

  const { results } = await notion.blocks.children.list({
    block_id: params.postId,
  });
  const contents = results.filter(isFullBlock);

  return {
    props: {
      post: post as PageObjectResponse & {
        properties: PageProperties;
      },
      contents: contents,
    },
  };
};

const PagePost: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  post,
  contents,
}) => {
  const title = post.properties.name.title
    .map((text) => text.plain_text)
    .join("\n");

  const PostBody: React.ReactNode[] = [];

  for (let idx = 0; idx < contents.length; idx += 1) {
    if (
      contents[idx].type !== "numbered_list_item" &&
      typeof contents[idx - 1] !== "undefined" &&
      contents[idx - 1].type === "numbered_list_item"
    ) {
      const list = [];
      let listCount = 1;
      while (contents[idx - listCount].type === "numbered_list_item") {
        list.push(PostBody.pop());
        listCount += 1;
      }
      PostBody.push(React.createElement("ol", { key: idx }, ...list.reverse()));
    } else if (
      contents[idx].type !== "bulleted_list_item" &&
      typeof contents[idx - 1] !== "undefined" &&
      contents[idx - 1].type === "bulleted_list_item"
    ) {
      const list = [];
      let listCount = 1;
      while (contents[idx - listCount].type === "bulleted_list_item") {
        list.push(PostBody.pop());
        listCount += 1;
      }
      PostBody.push(React.createElement("ul", { key: idx }, ...list.reverse()));
    }
    PostBody.push(
      React.createElement(Block, {
        key: contents[idx].id,
        block: contents[idx],
      })
    );
  }

  return (
    <>
      <Head>
        <title>{commonsConfig.blogName + " | " + title}</title>
      </Head>

      <Header />

      <main>
        <div className={stylesIndex.Main}>
          <section className={styles.Content}>
            <header className={stylesIndex.Section_header}>
              <h1 className={styles.Title}>
                {post.properties.name.title.map((text, idx) => (
                  <RichText key={idx} textItem={text} />
                ))}
              </h1>
            </header>
            {PostBody}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PagePost;
