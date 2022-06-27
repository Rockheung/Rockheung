import { NextPage } from "next";
import React from "react";

type PagePostProps = {
  post: any;
};

export async function getStaticProps() {
  return {
    props: {
      post: {},
    },
  };
}

export function getStaticPaths() {
  return { paths: [], fallback: false };
}

const PagePost: NextPage<PagePostProps> = ({ post }) => {
  return null;
};

export default PagePost;
