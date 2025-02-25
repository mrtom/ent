// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  AllowIfViewerPrivacyPolicy,
  Context,
  CustomQuery,
  Data,
  Ent,
  ID,
  LoadEntOptions,
  PrivacyPolicy,
  Viewer,
  convertBool,
  convertDate,
  convertNullableDate,
  loadCustomCount,
  loadCustomData,
  loadCustomEnts,
  loadEnt,
  loadEntX,
  loadEnts,
} from "@snowtop/ent";
import { Field, getFields } from "@snowtop/ent/schema";
import { loadEntByType, loadEntXByType } from "src/ent/generated/loadAny";
import {
  TodoDBData,
  todoLoader,
  todoLoaderInfo,
  todoNoTransformLoader,
} from "src/ent/generated/loaders";
import { NodeType } from "src/ent/generated/types";
import {
  Account,
  TodoToTagsQuery,
  TodoToTodoScopeQuery,
} from "src/ent/internal";
import schema from "src/schema/todo_schema";

export class TodoBase implements Ent<Viewer> {
  protected readonly data: TodoDBData;
  readonly nodeType = NodeType.Todo;
  readonly id: ID;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  protected readonly deletedAt: Date | null;
  readonly text: string;
  readonly completed: boolean;
  readonly creatorID: ID;
  readonly completedDate: Date | null;
  readonly assigneeID: ID;
  readonly scopeID: ID;
  readonly scopeType: string;
  readonly bounty: number | null;

  constructor(public viewer: Viewer, data: Data) {
    this.id = data.id;
    this.createdAt = convertDate(data.created_at);
    this.updatedAt = convertDate(data.updated_at);
    this.deletedAt = convertNullableDate(data.deleted_at);
    this.text = data.text;
    this.completed = convertBool(data.completed);
    this.creatorID = data.creator_id;
    this.completedDate = convertNullableDate(data.completed_date);
    this.assigneeID = data.assignee_id;
    this.scopeID = data.scope_id;
    this.scopeType = data.scope_type;
    this.bounty = data.bounty;
    // @ts-expect-error
    this.data = data;
  }

  __setRawDBData<TodoDBData>(data: TodoDBData) {}

  /** used by some ent internals to get access to raw db data. should not be depended on. may not always be on the ent **/
  ___getRawDBData(): TodoDBData {
    return this.data;
  }

  getPrivacyPolicy(): PrivacyPolicy<this, Viewer> {
    return AllowIfViewerPrivacyPolicy;
  }

  static async load<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T | null> {
    return (await loadEnt(
      viewer,
      id,
      TodoBase.loaderOptions.apply(this),
    )) as T | null;
  }

  static async loadX<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T> {
    return (await loadEntX(
      viewer,
      id,
      TodoBase.loaderOptions.apply(this),
    )) as T;
  }

  // loadNoTransform and loadNoTransformX exist to load the data from the db
  // with no transformations which are currently done implicitly
  // we don't generate the full complement of read-APIs
  // but can easily query the raw data with todoNoTransformLoader
  static async loadNoTransform<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T | null> {
    const opts = {
      ...TodoBase.loaderOptions.apply(this),
      loaderFactory: todoNoTransformLoader,
    };

    return (await loadEnt(viewer, id, opts)) as T | null;
  }

  static async loadNoTransformX<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T> {
    const opts = {
      ...TodoBase.loaderOptions.apply(this),
      loaderFactory: todoNoTransformLoader,
    };
    return (await loadEntX(viewer, id, opts)) as T;
  }

  static async loadMany<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    ...ids: ID[]
  ): Promise<Map<ID, T>> {
    return (await loadEnts(
      viewer,
      TodoBase.loaderOptions.apply(this),
      ...ids,
    )) as Map<ID, T>;
  }

  static async loadCustom<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    query: CustomQuery<TodoDBData>,
  ): Promise<T[]> {
    return (await loadCustomEnts(
      viewer,
      {
        ...TodoBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
    )) as T[];
  }

  static async loadCustomData<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<TodoDBData>,
    context?: Context,
  ): Promise<TodoDBData[]> {
    return loadCustomData<TodoDBData, TodoDBData>(
      {
        ...TodoBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
      context,
    );
  }

  static async loadCustomCount<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<TodoDBData>,
    context?: Context,
  ): Promise<number> {
    return loadCustomCount(
      {
        ...TodoBase.loaderOptions.apply(this),
      },
      query,
      context,
    );
  }

  static async loadRawData<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<TodoDBData | null> {
    const row = await todoLoader.createLoader(context).load(id);
    if (!row) {
      return null;
    }
    return row;
  }

  static async loadRawDataX<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<TodoDBData> {
    const row = await todoLoader.createLoader(context).load(id);
    if (!row) {
      throw new Error(`couldn't load row for ${id}`);
    }
    return row;
  }

  static loaderOptions<T extends TodoBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
  ): LoadEntOptions<T, Viewer> {
    return {
      tableName: todoLoaderInfo.tableName,
      fields: todoLoaderInfo.fields,
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

  queryTodoScope(): TodoToTodoScopeQuery {
    return TodoToTodoScopeQuery.query(this.viewer, this.id);
  }

  async loadAssignee(): Promise<Account | null> {
    return loadEnt(this.viewer, this.assigneeID, Account.loaderOptions());
  }

  loadAssigneeX(): Promise<Account> {
    return loadEntX(this.viewer, this.assigneeID, Account.loaderOptions());
  }

  async loadCreator(): Promise<Account | null> {
    return loadEnt(this.viewer, this.creatorID, Account.loaderOptions());
  }

  loadCreatorX(): Promise<Account> {
    return loadEntX(this.viewer, this.creatorID, Account.loaderOptions());
  }

  async loadScope(): Promise<Ent | null> {
    return loadEntByType(
      this.viewer,
      this.scopeType as unknown as NodeType,
      this.scopeID,
    );
  }

  loadScopeX(): Promise<Ent> {
    return loadEntXByType(
      this.viewer,
      this.scopeType as unknown as NodeType,
      this.scopeID,
    );
  }
}
