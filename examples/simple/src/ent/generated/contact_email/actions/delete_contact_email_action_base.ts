/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  AllowIfViewerHasIdentityPrivacyPolicy,
  ID,
  PrivacyPolicy,
} from "@snowtop/ent";
import { Action, Changeset, WriteOperation } from "@snowtop/ent/action";
import { ContactEmail } from "../../..";
import {
  ContactEmailBuilder,
  ContactEmailInput,
} from "./contact_email_builder";
import { ExampleViewer } from "../../../../viewer/viewer";

export class DeleteContactEmailActionBase
  implements
    Action<
      ContactEmail,
      ContactEmailBuilder<ContactEmailInput, ContactEmail>,
      ExampleViewer,
      ContactEmailInput,
      ContactEmail
    >
{
  public readonly builder: ContactEmailBuilder<ContactEmailInput, ContactEmail>;
  public readonly viewer: ExampleViewer;
  protected contactEmail: ContactEmail;

  constructor(viewer: ExampleViewer, contactEmail: ContactEmail) {
    this.viewer = viewer;
    this.builder = new ContactEmailBuilder(
      this.viewer,
      WriteOperation.Delete,
      this,
      contactEmail,
    );
    this.contactEmail = contactEmail;
  }

  getPrivacyPolicy(): PrivacyPolicy<ContactEmail> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getInput(): ContactEmailInput {
    return {};
  }

  async changeset(): Promise<Changeset> {
    return this.builder.build();
  }

  async valid(): Promise<boolean> {
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.builder.validX();
  }

  async save(): Promise<void> {
    await this.builder.save();
  }

  async saveX(): Promise<void> {
    await this.builder.saveX();
  }

  static create<T extends DeleteContactEmailActionBase>(
    this: new (viewer: ExampleViewer, contactEmail: ContactEmail) => T,
    viewer: ExampleViewer,
    contactEmail: ContactEmail,
  ): T {
    return new this(viewer, contactEmail);
  }

  static async saveXFromID<T extends DeleteContactEmailActionBase>(
    this: new (viewer: ExampleViewer, contactEmail: ContactEmail) => T,
    viewer: ExampleViewer,
    id: ID,
  ): Promise<void> {
    const contactEmail = await ContactEmail.loadX(viewer, id);
    return new this(viewer, contactEmail).saveX();
  }
}
