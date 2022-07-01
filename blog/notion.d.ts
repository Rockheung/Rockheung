import {
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type NotionType<T, K> = Record<T, K> & {
  type: T;
};

type NotionTypeText = NotionType<
  "text",
  { content: string; link: string | null }
>;

type PageProperty<T, K> = NotionType<T, K> &
  Record<T, K> & {
    id: string;
  };

type PagePropertyName = PageProperty<"title", Array<RichTextItemResponse>> & {};

type PagePropertyTags = PageProperty<
  "multi_select",
  Array<SelectPropertyResponse>
> & {};

type PagePropertyDate = PageProperty<"date", DateResponse | null> & {};
type PagePropertyPublished = PageProperty<"checkbox", boolean> & {};
type PagePropertyTldr = PagePropertyPageProperty<
  "rich_text",
  Array<RichTextItemResponse>
> & {};

export type NotionPage = QueryDatabaseResponse["results"][number] & {
  properties: {
    name: PagePropertyName;
    tags: PagePropertyTags;
    date: PagePropertyDate;
    published: PagePropertyPublished;
    tldr: PagePropertyTldr;
  };
};
