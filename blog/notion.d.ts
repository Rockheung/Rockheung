import {
  QueryDatabaseResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

type NotionType<T, K> = {
  type: T;
  [T]: K;
};

type NotionTypeText = NotionType<
  "text",
  { content: string; link: string | null }
>;

type NotionProperty<T, K> = {
  type: T;
  [T]: K;
  id: string;
};

type NotionPropertyName = NotionProperty<
  "title",
  Array<RichTextItemResponse>
> & {};

type NotionPropertyTags = NotionProperty<
  "multi_select",
  Array<SelectPropertyResponse>
> & {};

type NotionPropertyDate = NotionProperty<"date", DateResponse | null> & {};
type NotionPropertyPublished = NotionProperty<"checkbox", boolean> & {};
type NotionPropertyTldr = NotionPropertyNotionProperty<
  "rich_text",
  Array<RichTextItemResponse>
> & {};

export type NotionPage = QueryDatabaseResponse["results"][number] & {
  properties: {
    name: NotionPropertyName;
    tags: NotionPropertyTags;
    date: NotionPropertyDate;
    published: NotionPropertyPublished;
    tldr: NotionPropertyTldr;
    1;
  };
};
