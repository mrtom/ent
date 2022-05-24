/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  AllowIfViewerHasIdentityPrivacyPolicy,
  ID,
  PrivacyPolicy,
  Viewer,
} from "@snowtop/ent";
import { Action, Changeset, WriteOperation } from "@snowtop/ent/action";
import { User } from "../../..";
import { UserBuilder } from "./user_builder";

export interface ConfirmEditEmailAddressInput {
  emailAddress: string;
  code: string;
}

export class ConfirmEditEmailAddressActionBase
  implements
    Action<
      User,
      UserBuilder<ConfirmEditEmailAddressInput>,
      ConfirmEditEmailAddressInput
    >
{
  public readonly builder: UserBuilder<ConfirmEditEmailAddressInput>;
  public readonly viewer: Viewer;
  protected input: ConfirmEditEmailAddressInput;
  protected user: User;

  constructor(viewer: Viewer, user: User, input: ConfirmEditEmailAddressInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new UserBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      user,
    );
    this.user = user;
  }

  getPrivacyPolicy(): PrivacyPolicy<User> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getInput(): ConfirmEditEmailAddressInput {
    return this.input;
  }

  async changeset(): Promise<Changeset<User>> {
    return this.builder.build();
  }

  async valid(): Promise<boolean> {
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.builder.validX();
  }

  async save(): Promise<User | null> {
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<User> {
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends ConfirmEditEmailAddressActionBase>(
    this: new (
      viewer: Viewer,
      user: User,
      input: ConfirmEditEmailAddressInput,
    ) => T,
    viewer: Viewer,
    user: User,
    input: ConfirmEditEmailAddressInput,
  ): T {
    return new this(viewer, user, input);
  }

  static async saveXFromID<T extends ConfirmEditEmailAddressActionBase>(
    this: new (
      viewer: Viewer,
      user: User,
      input: ConfirmEditEmailAddressInput,
    ) => T,
    viewer: Viewer,
    id: ID,
    input: ConfirmEditEmailAddressInput,
  ): Promise<User> {
    const user = await User.loadX(viewer, id);
    return new this(viewer, user, input).saveX();
  }
}