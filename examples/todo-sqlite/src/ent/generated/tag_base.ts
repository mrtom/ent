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
  convertDate,
  convertNullableDate,
  convertNullableList,
  loadCustomCount,
  loadCustomData,
  loadCustomEnts,
  loadEnt,
  loadEntX,
  loadEnts,
} from "@snowtop/ent";
import { Field, getFields } from "@snowtop/ent/schema";
import {
  TagDBData,
  tagLoader,
  tagLoaderInfo,
  tagNoTransformLoader,
} from "src/ent/generated/loaders";
import { NodeType } from "src/ent/generated/types";
import { Account, Tag, TagToTodosQuery } from "src/ent/internal";
import schema from "src/schema/tag_schema";

export class TagBase implements Ent<Viewer> {
  protected readonly data: TagDBData;
  readonly nodeType = NodeType.Tag;
  readonly id: ID;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  protected readonly deletedAt: Date | null;
  readonly displayName: string;
  readonly canonicalName: string;
  readonly ownerID: ID;
  readonly relatedTagIds: ID[] | null;

  constructor(public viewer: Viewer, data: Data) {
    this.id = data.id;
    this.createdAt = convertDate(data.created_at);
    this.updatedAt = convertDate(data.updated_at);
    this.deletedAt = convertNullableDate(data.deleted_at);
    this.displayName = data.display_name;
    this.canonicalName = data.canonical_name;
    this.ownerID = data.owner_id;
    this.relatedTagIds = convertNullableList(data.related_tag_ids);
    // @ts-expect-error
    this.data = data;
  }

  __setRawDBData<TagDBData>(data: TagDBData) {}

  /** used by some ent internals to get access to raw db data. should not be depended on. may not always be on the ent **/
  ___getRawDBData(): TagDBData {
    return this.data;
  }

  getPrivacyPolicy(): PrivacyPolicy<this, Viewer> {
    return AllowIfViewerPrivacyPolicy;
  }

  static async load<T extends TagBase>(
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
      TagBase.loaderOptions.apply(this),
    )) as T | null;
  }

  static async loadX<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T> {
    return (await loadEntX(viewer, id, TagBase.loaderOptions.apply(this))) as T;
  }

  // loadNoTransform and loadNoTransformX exist to load the data from the db
  // with no transformations which are currently done implicitly
  // we don't generate the full complement of read-APIs
  // but can easily query the raw data with tagNoTransformLoader
  static async loadNoTransform<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T | null> {
    const opts = {
      ...TagBase.loaderOptions.apply(this),
      loaderFactory: tagNoTransformLoader,
    };

    return (await loadEnt(viewer, id, opts)) as T | null;
  }

  static async loadNoTransformX<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<T> {
    const opts = {
      ...TagBase.loaderOptions.apply(this),
      loaderFactory: tagNoTransformLoader,
    };
    return (await loadEntX(viewer, id, opts)) as T;
  }

  static async loadMany<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    ...ids: ID[]
  ): Promise<Map<ID, T>> {
    return (await loadEnts(
      viewer,
      TagBase.loaderOptions.apply(this),
      ...ids,
    )) as Map<ID, T>;
  }

  static async loadCustom<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    query: CustomQuery<TagDBData>,
  ): Promise<T[]> {
    return (await loadCustomEnts(
      viewer,
      {
        ...TagBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
    )) as T[];
  }

  static async loadCustomData<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<TagDBData>,
    context?: Context,
  ): Promise<TagDBData[]> {
    return loadCustomData<TagDBData, TagDBData>(
      {
        ...TagBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
      context,
    );
  }

  static async loadCustomCount<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<TagDBData>,
    context?: Context,
  ): Promise<number> {
    return loadCustomCount(
      {
        ...TagBase.loaderOptions.apply(this),
      },
      query,
      context,
    );
  }

  static async loadRawData<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<TagDBData | null> {
    const row = await tagLoader.createLoader(context).load(id);
    if (!row) {
      return null;
    }
    return row;
  }

  static async loadRawDataX<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<TagDBData> {
    const row = await tagLoader.createLoader(context).load(id);
    if (!row) {
      throw new Error(`couldn't load row for ${id}`);
    }
    return row;
  }

  static loaderOptions<T extends TagBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
  ): LoadEntOptions<T, Viewer> {
    return {
      tableName: tagLoaderInfo.tableName,
      fields: tagLoaderInfo.fields,
      ent: this,
      loaderFactory: tagLoader,
    };
  }

  private static schemaFields: Map<string, Field>;

  private static getSchemaFields(): Map<string, Field> {
    if (TagBase.schemaFields != null) {
      return TagBase.schemaFields;
    }
    return (TagBase.schemaFields = getFields(schema));
  }

  static getField(key: string): Field | undefined {
    return TagBase.getSchemaFields().get(key);
  }

  queryTodos(): TagToTodosQuery {
    return TagToTodosQuery.query(this.viewer, this.id);
  }

  async loadOwner(): Promise<Account | null> {
    return loadEnt(this.viewer, this.ownerID, Account.loaderOptions());
  }

  loadOwnerX(): Promise<Account> {
    return loadEntX(this.viewer, this.ownerID, Account.loaderOptions());
  }

  async loadRelatedTags(): Promise<Tag[] | null> {
    if (!this.relatedTagIds) {
      return null;
    }
    const ents = await loadEnts(
      this.viewer,
      Tag.loaderOptions(),
      ...this.relatedTagIds,
    );
    return Array.from(ents.values());
  }
}
