import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isFullPage,
  isNotionClientError,
} from "@notionhq/client";
import {
  BlockObjectResponse,
  CreateDatabaseResponse,
  EquationRichTextItemResponse,
  getDatabase,
  GetDatabaseParameters,
  GetDatabaseResponse,
  MentionRichTextItemResponse,
  PageObjectResponse,
  ParagraphBlockObjectResponse,
  queryDatabase,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  ClientOptions,
  RequestParameters,
} from "@notionhq/client/build/src/Client";
import { pick } from "@notionhq/client/build/src/utils";
import { type } from "os";

type DefaultDatabase<T> = Omit<T, "database_id">;

export type PagePropertyType = PageObjectResponse["properties"][string]["type"];

export type PageProperty<T extends PagePropertyType> = Extract<
  PageObjectResponse["properties"][string],
  { type: T }
>;

export type BlockObjectBase<T extends BlockObjectResponse["type"]> = Extract<
  BlockObjectResponse,
  { type: T }
>;

export type BlockObject<P extends BlockObjectResponse> = P extends { type: infer Type }
  ? Exclude<BlockObjectResponse, { type: Type }>
  : never;

type BlockObjectWithRichTextMaybe<T extends BlockObjectResponse["type"]> = Extract<
  BlockObjectBase<T>,
  { [key in T]: { rich_text: unknown } }
>;

type BlockObjectUnionMap<K extends BlockObjectResponse['type']> = {
  [key in K]: BlockObjectWithRichTextMaybe<key>;
}[K];

export type BlockObjectWithRichText = Exclude<
  BlockObjectUnionMap<BlockObjectResponse["type"]>,
  never
>;

export const isText = (
  response: RichTextItemResponse
): response is TextRichTextItemResponse => response.type === "text";
export const isMention = (
  response: RichTextItemResponse
): response is MentionRichTextItemResponse => response.type === "mention";
export const isEquation = (
  response: RichTextItemResponse
): response is EquationRichTextItemResponse => response.type === "equation";

class NotionClient extends Client {
  static client: NotionClient;
  private database: { database_id: string } = {
    database_id: process.env.NOTION_DATABASE_ID || "",
  };
  private lastFetchTime: number = Date.now();
  constructor(options?: ClientOptions) {
    if (NotionClient.client instanceof NotionClient) {
      return NotionClient.client;
    }
    if (
      typeof process.env.NOTION_TOKEN === "undefined" ||
      typeof process.env.NOTION_DATABASE_ID === "undefined"
    ) {
      console.warn("Notion api token missing");
    }
    super({
      ...options,
      auth: process.env.NOTION_TOKEN,
    });
    NotionClient.client = this;
  }

  public request = async <T>(
    args: Omit<RequestParameters, "auth">
  ): Promise<T> => {
    try {
      this.lastFetchTime = Date.now();
      return super.request<T>(args);
    } catch (error) {
      if (
        isNotionClientError(error) &&
        error.code === APIErrorCode.RateLimited
      ) {
        console.warn(APIErrorCode.RateLimited, "occurs");
        return new Promise((resolve) => {
          setTimeout(
            () => resolve(super.request<T>(args)),
            this.lastFetchTime + 500
          );
        });
      }
      console.warn(error);
    }
    return {} as T;
  };

  public postsHighlighted = async <T extends { properties: unknown }>() => {
    const { results } = await this.databases.query({
      filter: {
        and: [
          {
            property: "highlighted",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    return results.filter(isFullPage) as (PageObjectResponse & T)[];
  };

  public postsPublic = async <T extends { properties: unknown }>() => {
    const { results } = await this.databases.query({
      filter: {
        or: [
          {
            property: "published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "highlighted",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: 100,
    });

    return results.filter(isFullPage) as (PageObjectResponse & T)[];
  };

  readonly databases = {
    list: (): Promise<never> => {
      throw new Error("Please use `search`");
    },
    retrieve: (
      args: DefaultDatabase<GetDatabaseParameters>
    ): Promise<GetDatabaseResponse> => {
      return this.request<GetDatabaseResponse>({
        path: getDatabase.path(this.database),
        method: getDatabase.method,
        query: pick(args, getDatabase.queryParams),
        body: pick(args, getDatabase.bodyParams),
      });
    },
    query: (
      args: DefaultDatabase<QueryDatabaseParameters>
    ): Promise<QueryDatabaseResponse> => {
      return this.request<QueryDatabaseResponse>({
        path: queryDatabase.path(this.database),
        method: queryDatabase.method,
        query: pick(args, queryDatabase.queryParams),
        body: pick(args, queryDatabase.bodyParams),
      });
    },
    create: (): Promise<CreateDatabaseResponse> => {
      throw new Error("Create database now allowed");
    },
    update: (): Promise<never> => {
      throw new Error("Update database now allowed");
    },
  };
}

export default NotionClient;
