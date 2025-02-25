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
  loadCustomCount,
  loadCustomData,
  loadCustomEnts,
  loadEnt,
  loadEntViaKey,
  loadEntX,
  loadEntXViaKey,
  loadEnts,
} from "@snowtop/ent";
import { Field, getFields } from "@snowtop/ent/schema";
import { loadEntByType, loadEntXByType } from "src/ent/generated/loadAny";
import {
  AddressDBData,
  addressLoader,
  addressLoaderInfo,
  addressOwnerIDLoader,
} from "src/ent/generated/loaders";
import { NodeType } from "src/ent/generated/types";
import { AddressToLocatedAtQuery } from "src/ent/internal";
import schema from "src/schema/address_schema";

export class AddressBase implements Ent<Viewer> {
  protected readonly data: AddressDBData;
  readonly nodeType = NodeType.Address;
  readonly id: ID;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly apartment: string | null;
  readonly ownerID: ID;
  readonly ownerType: string;

  constructor(public viewer: Viewer, data: Data) {
    this.id = data.id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.street = data.street;
    this.city = data.city;
    this.state = data.state;
    this.zipCode = data.zip_code;
    this.apartment = data.apartment;
    this.ownerID = data.owner_id;
    this.ownerType = data.owner_type;
    // @ts-expect-error
    this.data = data;
  }

  __setRawDBData<AddressDBData>(data: AddressDBData) {}

  /** used by some ent internals to get access to raw db data. should not be depended on. may not always be on the ent **/
  ___getRawDBData(): AddressDBData {
    return this.data;
  }

  getPrivacyPolicy(): PrivacyPolicy<this, Viewer> {
    return AllowIfViewerPrivacyPolicy;
  }

  static async load<T extends AddressBase>(
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
      AddressBase.loaderOptions.apply(this),
    )) as T | null;
  }

  static async loadX<T extends AddressBase>(
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
      AddressBase.loaderOptions.apply(this),
    )) as T;
  }

  static async loadMany<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    ...ids: ID[]
  ): Promise<Map<ID, T>> {
    return (await loadEnts(
      viewer,
      AddressBase.loaderOptions.apply(this),
      ...ids,
    )) as Map<ID, T>;
  }

  static async loadCustom<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    query: CustomQuery<AddressDBData>,
  ): Promise<T[]> {
    return (await loadCustomEnts(
      viewer,
      {
        ...AddressBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
    )) as T[];
  }

  static async loadCustomData<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<AddressDBData>,
    context?: Context,
  ): Promise<AddressDBData[]> {
    return loadCustomData<AddressDBData, AddressDBData>(
      {
        ...AddressBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
      context,
    );
  }

  static async loadCustomCount<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    query: CustomQuery<AddressDBData>,
    context?: Context,
  ): Promise<number> {
    return loadCustomCount(
      {
        ...AddressBase.loaderOptions.apply(this),
      },
      query,
      context,
    );
  }

  static async loadRawData<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<AddressDBData | null> {
    const row = await addressLoader.createLoader(context).load(id);
    if (!row) {
      return null;
    }
    return row;
  }

  static async loadRawDataX<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<AddressDBData> {
    const row = await addressLoader.createLoader(context).load(id);
    if (!row) {
      throw new Error(`couldn't load row for ${id}`);
    }
    return row;
  }

  static async loadFromOwnerID<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    ownerID: ID,
  ): Promise<T | null> {
    return (await loadEntViaKey(viewer, ownerID, {
      ...AddressBase.loaderOptions.apply(this),
      loaderFactory: addressOwnerIDLoader,
    })) as T | null;
  }

  static async loadFromOwnerIDX<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    viewer: Viewer,
    ownerID: ID,
  ): Promise<T> {
    return (await loadEntXViaKey(viewer, ownerID, {
      ...AddressBase.loaderOptions.apply(this),
      loaderFactory: addressOwnerIDLoader,
    })) as T;
  }

  static async loadIDFromOwnerID<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    ownerID: ID,
    context?: Context,
  ): Promise<ID | undefined> {
    const row = await addressOwnerIDLoader.createLoader(context).load(ownerID);
    return row?.id;
  }

  static async loadRawDataFromOwnerID<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
    ownerID: ID,
    context?: Context,
  ): Promise<AddressDBData | null> {
    const row = await addressOwnerIDLoader.createLoader(context).load(ownerID);
    if (!row) {
      return null;
    }
    return row;
  }

  static loaderOptions<T extends AddressBase>(
    this: new (
      viewer: Viewer,
      data: Data,
    ) => T,
  ): LoadEntOptions<T, Viewer> {
    return {
      tableName: addressLoaderInfo.tableName,
      fields: addressLoaderInfo.fields,
      ent: this,
      loaderFactory: addressLoader,
    };
  }

  private static schemaFields: Map<string, Field>;

  private static getSchemaFields(): Map<string, Field> {
    if (AddressBase.schemaFields != null) {
      return AddressBase.schemaFields;
    }
    return (AddressBase.schemaFields = getFields(schema));
  }

  static getField(key: string): Field | undefined {
    return AddressBase.getSchemaFields().get(key);
  }

  queryLocatedAt(): AddressToLocatedAtQuery {
    return AddressToLocatedAtQuery.query(this.viewer, this.id);
  }

  async loadOwner(): Promise<Ent | null> {
    return loadEntByType(
      this.viewer,
      this.ownerType as unknown as NodeType,
      this.ownerID,
    );
  }

  loadOwnerX(): Promise<Ent> {
    return loadEntXByType(
      this.viewer,
      this.ownerType as unknown as NodeType,
      this.ownerID,
    );
  }
}
