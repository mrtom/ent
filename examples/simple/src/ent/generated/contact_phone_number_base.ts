/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  AllowIfViewerPrivacyPolicy,
  Context,
  CustomQuery,
  Data,
  Ent,
  ID,
  LoadEntOptions,
  PrivacyPolicy,
  loadCustomCount,
  loadCustomData,
  loadCustomEnts,
  loadEnt,
  loadEntX,
  loadEnts,
} from "@snowtop/ent";
import { Field, getFields } from "@snowtop/ent/schema";
import {
  ContactPhoneNumberDBData,
  contactPhoneNumberLoader,
  contactPhoneNumberLoaderInfo,
} from "./loaders";
import {
  ContactPhoneNumberLabel,
  NodeType,
  convertContactPhoneNumberLabel,
} from "./types";
import { Contact, ContactInfoMixin, IContactInfo } from "../internal";
import schema from "../../schema/contact_phone_number_schema";
import { ExampleViewer as ExampleViewerAlias } from "../../viewer/viewer";

export class ContactPhoneNumberBase
  extends ContactInfoMixin(class {})
  implements Ent<ExampleViewerAlias>, IContactInfo
{
  protected readonly data: ContactPhoneNumberDBData;
  readonly nodeType = NodeType.ContactPhoneNumber;
  readonly id: ID;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly phoneNumber: string;
  readonly label: ContactPhoneNumberLabel;
  readonly contactID: ID;

  constructor(public viewer: ExampleViewerAlias, data: Data) {
    // @ts-ignore pass to mixin
    super(viewer, data);
    this.id = data.id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.phoneNumber = data.phone_number;
    this.label = convertContactPhoneNumberLabel(data.label);
    this.contactID = data.contact_id;
    // @ts-expect-error
    this.data = data;
  }

  __setRawDBData<ContactPhoneNumberDBData>(data: ContactPhoneNumberDBData) {}

  /** used by some ent internals to get access to raw db data. should not be depended on. may not always be on the ent **/
  ___getRawDBData(): ContactPhoneNumberDBData {
    return this.data;
  }

  getPrivacyPolicy(): PrivacyPolicy<this, ExampleViewerAlias> {
    return AllowIfViewerPrivacyPolicy;
  }

  static async load<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    viewer: ExampleViewerAlias,
    id: ID,
  ): Promise<T | null> {
    return (await loadEnt(
      viewer,
      id,
      ContactPhoneNumberBase.loaderOptions.apply(this),
    )) as T | null;
  }

  static async loadX<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    viewer: ExampleViewerAlias,
    id: ID,
  ): Promise<T> {
    return (await loadEntX(
      viewer,
      id,
      ContactPhoneNumberBase.loaderOptions.apply(this),
    )) as T;
  }

  static async loadMany<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    viewer: ExampleViewerAlias,
    ...ids: ID[]
  ): Promise<Map<ID, T>> {
    return (await loadEnts(
      viewer,
      ContactPhoneNumberBase.loaderOptions.apply(this),
      ...ids,
    )) as Map<ID, T>;
  }

  static async loadCustom<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    viewer: ExampleViewerAlias,
    query: CustomQuery<ContactPhoneNumberDBData>,
  ): Promise<T[]> {
    return (await loadCustomEnts(
      viewer,
      {
        ...ContactPhoneNumberBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
    )) as T[];
  }

  static async loadCustomData<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    query: CustomQuery<ContactPhoneNumberDBData>,
    context?: Context,
  ): Promise<ContactPhoneNumberDBData[]> {
    return loadCustomData<ContactPhoneNumberDBData, ContactPhoneNumberDBData>(
      {
        ...ContactPhoneNumberBase.loaderOptions.apply(this),
        prime: true,
      },
      query,
      context,
    );
  }

  static async loadCustomCount<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    query: CustomQuery<ContactPhoneNumberDBData>,
    context?: Context,
  ): Promise<number> {
    return loadCustomCount(
      {
        ...ContactPhoneNumberBase.loaderOptions.apply(this),
      },
      query,
      context,
    );
  }

  static async loadRawData<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<ContactPhoneNumberDBData | null> {
    const row = await contactPhoneNumberLoader.createLoader(context).load(id);
    if (!row) {
      return null;
    }
    return row;
  }

  static async loadRawDataX<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
    id: ID,
    context?: Context,
  ): Promise<ContactPhoneNumberDBData> {
    const row = await contactPhoneNumberLoader.createLoader(context).load(id);
    if (!row) {
      throw new Error(`couldn't load row for ${id}`);
    }
    return row;
  }

  static loaderOptions<T extends ContactPhoneNumberBase>(
    this: new (
      viewer: ExampleViewerAlias,
      data: Data,
    ) => T,
  ): LoadEntOptions<T, ExampleViewerAlias> {
    return {
      tableName: contactPhoneNumberLoaderInfo.tableName,
      fields: contactPhoneNumberLoaderInfo.fields,
      ent: this,
      loaderFactory: contactPhoneNumberLoader,
    };
  }

  private static schemaFields: Map<string, Field>;

  private static getSchemaFields(): Map<string, Field> {
    if (ContactPhoneNumberBase.schemaFields != null) {
      return ContactPhoneNumberBase.schemaFields;
    }
    return (ContactPhoneNumberBase.schemaFields = getFields(schema));
  }

  static getField(key: string): Field | undefined {
    return ContactPhoneNumberBase.getSchemaFields().get(key);
  }

  async loadContact(): Promise<Contact | null> {
    return loadEnt(this.viewer, this.contactID, Contact.loaderOptions());
  }

  loadContactX(): Promise<Contact> {
    return loadEntX(this.viewer, this.contactID, Contact.loaderOptions());
  }
}
