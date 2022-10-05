import React, { HTMLAttributes } from "react";
import {
  GetStaticProps,
  NextPage,
  GetStaticPropsResult,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import NotionClient, { isText, PageProperty } from "../../lib/notion";
import { PageProperties } from "..";
import Head from "next/head";
import {
  APIErrorCode,
  isFullBlock,
  isFullPage,
  isNotionClientError,
} from "@notionhq/client";
import {
  BlockObjectResponse,
  GetPageResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const getStaticPaths: GetStaticPaths = async () => {
  const notion = new NotionClient();

  const posts = await notion.postsPublished<{ properties: PageProperties }>();

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

  const notion = new NotionClient();

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
  const body = contents.map((block) => {
    switch (block.type) {
      case "paragraph": {
        return (
          <p>
            {block.paragraph.rich_text.map((text, idx) => {
              if (text.annotations.code) {
                return <code key={idx}>{text.plain_text}</code>;
              }
              const style: HTMLAttributes<HTMLParagraphElement>["style"] = {
                fontWeight: text.annotations.bold ? "bold" : undefined,
                fontStyle: text.annotations.italic ? "italic" : undefined,
                textDecoration:
                  [
                    text.annotations.strikethrough ? "line-through" : undefined,
                    text.annotations.underline ? "underline" : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined,
                color:
                  text.annotations.color === "default"
                    ? undefined
                    : text.annotations.color,
              };
              return Object.values(style).filter(Boolean).length === 0 ? (
                text.plain_text
              ) : (
                <span key={idx} style={style}>
                  {text.plain_text}
                </span>
              );
            })}
          </p>
        );
      }
      case "heading_1": {
        return block.heading_1.rich_text.map((text, idx) => {
          return <h1 key={idx}>{text.plain_text}</h1>;
        });
      }

      case "heading_2": {
        return block.heading_2.rich_text.map((text, idx) => {
          return <h2 key={idx}>{text.plain_text}</h2>;
        });
      }

      case "heading_3": {
        return block.heading_3.rich_text.map((text, idx) => {
          return <h3 key={idx}>{text.plain_text}</h3>;
        });
      }
      case "bulleted_list_item": {
        return (
          <li>
            {block.bulleted_list_item.rich_text.map((text, idx) => {
              return <span key={idx}>{text.plain_text}</span>;
            })}
          </li>
        );
      }
      case "code": {
        return block.code.rich_text.map((text, idx) => {
          return (
            <pre key={idx}>
              <code>{text.plain_text}</code>
            </pre>
          );
        });
      }
    }
  });
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header>
        <h1>{title}</h1>
      </header>

      <main>
        <div>{body}</div>
      </main>
    </>
  );
};

export default PagePost;
