// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  AllowIfViewerPrivacyPolicy,
  AssocEdge,
  Context,
  Data,
  ID,
  LoadEntOptions,
  ObjectLoaderFactory,
  PrivacyPolicy,
  Viewer,
  convertBool,
  convertDate,
  loadEnt,
  loadEntX,
  loadEnts,
} from "@lolopinto/ent";
import { Field, getFields } from "@lolopinto/ent/schema";
import { Account, EdgeType, NodeType, TodoToTagsQuery } from "src/ent/internal";
import schema from "src/schema/todo";

const tableName = "todos";
const fields = [
  "id",
  "created_at",
  "updated_at",
  "text",
  "completed",
  "creator_id",
];

export class TodoBase {
  readonly nodeType = NodeType.Todo;
  readonly id: ID;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly text: string;
  readonly completed: boolean;
  readonly creatorID: ID;

  constructor(public viewer: Viewer, data: Data) {
    this.id = data.id;
    this.createdAt = convertDate(data.created_at);
    this.updatedAt = convertDate(data.updated_at);
    this.text = data.text;
    this.completed = convertBool(data.completed);
    this.creatorID = data.creator_id;
  }

  // default privacyPolicy is Viewer can see themselves
  privacyPolicy: PrivacyPolicy = AllowIfViewerPrivacyPolicy;

  static async load<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T | null> {
    return loadEnt(viewer, id, TodoBase.loaderOptions.apply(this));
  }

  static async loadX<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T> {
    return loadEntX(viewer, id, TodoBase.loaderOptions.apply(this));
  }

  static async loadMany<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
    viewer: Viewer,
    ...ids: ID[]
  ): Promise<T[]> {
    return loadEnts(viewer, TodoBase.loaderOptions.apply(this), ...ids);
  }

  static async loadRawData<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
    id: ID,
    context?: Context,
  ): Promise<Data | null> {
    return await todoLoader.createLoader(context).load(id);
  }

  static async loadRawDataX<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
    id: ID,
    context?: Context,
  ): Promise<Data> {
    const row = await todoLoader.createLoader(context).load(id);
    if (!row) {
      throw new Error(`couldn't load row for ${id}`);
    }
    return row;
  }

  // TODO index Completed not id... we want an indexQueryLoader...

  static loaderOptions<T extends TodoBase>(
    this: new (viewer: Viewer, data: Data) => T,
  ): LoadEntOptions<T> {
    return {
      tableName: tableName,
      fields: fields,
      ent: this,
      loaderFactory: todoLoader,
    };
  }

  private static schemaFields: Map<string, Field>;

  private static getSchemaFields(): Map<string, Field> {
    if (TodoBase.schemaFields != null) {
      return TodoBase.schemaFields;
    }
    return (TodoBase.schemaFields = getFields(schema));
  }

  static getField(key: string): Field | undefined {
    return TodoBase.getSchemaFields().get(key);
  }

  queryTags(): TodoToTagsQuery {
    return TodoToTagsQuery.query(this.viewer, this.id);
  }

  async loadCreator(): Promise<Account | null> {
    return loadEnt(this.viewer, this.creatorID, Account.loaderOptions());
  }

  loadCreatorX(): Promise<Account> {
    return loadEntX(this.viewer, this.creatorID, Account.loaderOptions());
  }
}

export const todoLoader = new ObjectLoaderFactory({
  tableName,
  fields,
  key: "id",
});