import React from "react";
import {
  GetStaticProps,
  InferGetServerSidePropsType,
  NextPage,
  GetStaticPropsResult,
  GetStaticPaths,
} from "next";
import {
  Client,
  APIErrorCode,
  isNotionClientError,
  ClientErrorCode,
} from "@notionhq/client";

export const getStaticProps = async (context: { params: { postId: any } }) => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  try {
    if (
      typeof context.params === "undefined" ||
      typeof context.params.postId === "undefined" ||
      Array.isArray(context.params.postId)
    ) {
      return {
        props: {},
        notFound: true,
      };
    }
    const { postId } = context.params;
    const page = await notion.pages.retrieve({ page_id: postId });
    return {
      props: {
        post: page,
      },
    };
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      // error is now strongly typed to NotionClientError
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          // ...
          break;
        case APIErrorCode.ObjectNotFound:
          // ...
          break;
        case APIErrorCode.Unauthorized:
          // ...
          break;
        // ...
        default:
          // you could even take advantage of exhaustiveness checking
          console.log(error.code);
      }
    }
  }

  return {
    props: {},
  };
};

export const getStaticPaths = async () => {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  try {
    const { results: pages } = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID || "",
      filter: {
        property: "published",
        checkbox: {
          equals: true,
        },
      },
    });

    return {
      paths: pages.map((page) => {
        return { params: { postId: page.id } };
      }),
      fallback: false,
    };
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      // error is now strongly typed to NotionClientError
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          // ...
          break;
        case APIErrorCode.ObjectNotFound:
          // ...
          break;
        case APIErrorCode.Unauthorized:
          // ...
          break;
        // ...
        default:
          // you could even take advantage of exhaustiveness checking
          console.log(error.code);
      }
    }
  }

  return {
    paths: [],
    fallback: false,
  };
};

const PagePost: NextPage<
  InferGetServerSidePropsType<typeof getStaticProps>
> = ({ post }) => {
  return <p>{JSON.stringify(post, null, 2)}</p>;
};

export default PagePost;
