import { Client } from "@notionhq/client";
import {
  createDatabase,
  CreateDatabaseParameters,
  CreateDatabaseResponse,
  getDatabase, GetDatabaseParameters, GetDatabaseResponse, listDatabases, ListDatabasesParameters, ListDatabasesResponse, queryDatabase, QueryDatabaseParameters, QueryDatabaseResponse, updateDatabase, UpdateDatabaseParameters, UpdateDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  ClientOptions, RequestParameters,
} from "@notionhq/client/build/src/Client";
import { pick } from '@notionhq/client/build/src/utils'

type DefaultDatabase<T> = Omit<T,'database_id'>

class NotionClient extends Client {
  static client: NotionClient;
  private database: {database_id: string } = { database_id: process.env.NOTION_DATABASE_ID || "" };
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

  public readonly request: <ResponseBody>({
    method,
    query,
    body,
  }: Omit<RequestParameters, "auth">) => Promise<ResponseBody> = (
    args
  ) => {
    return super.request(args);
  };

  readonly databases = {
    list: (): Promise<never> => {
      throw new Error('Please use `search`')
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
    query: (args: DefaultDatabase<QueryDatabaseParameters>): Promise<QueryDatabaseResponse> => {
      return this.request<QueryDatabaseResponse>({
        path: queryDatabase.path(this.database),
        method: queryDatabase.method,
        query: pick(args, queryDatabase.queryParams),
        body: pick(args, queryDatabase.bodyParams),
      });
    },
    create: (): Promise<CreateDatabaseResponse> => {
      throw new Error('Create database now allowed')
    },
    update: (): Promise<never> => {
      throw new Error('Update database now allowed')
    },
  };
}

export default NotionClient;