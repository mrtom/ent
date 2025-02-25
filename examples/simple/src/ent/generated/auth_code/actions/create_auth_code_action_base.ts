/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  AllowIfViewerHasIdentityPrivacyPolicy,
  ID,
  PrivacyPolicy,
} from "@snowtop/ent";
import {
  Action,
  Builder,
  Changeset,
  Observer,
  Trigger,
  Validator,
  WriteOperation,
} from "@snowtop/ent/action";
import { AuthCode, User } from "../../..";
import { AuthCodeBuilder } from "./auth_code_builder";
import { ExampleViewer as ExampleViewerAlias } from "../../../../viewer/viewer";

export interface AuthCodeCreateInput {
  code: string;
  userID: ID | Builder<User, ExampleViewerAlias>;
  emailAddress?: string | null;
  phoneNumber?: string | null;
}

export type CreateAuthCodeActionTriggers = (
  | Trigger<
      AuthCode,
      AuthCodeBuilder<AuthCodeCreateInput, AuthCode | null>,
      ExampleViewerAlias,
      AuthCodeCreateInput,
      AuthCode | null
    >
  | Trigger<
      AuthCode,
      AuthCodeBuilder<AuthCodeCreateInput, AuthCode | null>,
      ExampleViewerAlias,
      AuthCodeCreateInput,
      AuthCode | null
    >[]
)[];

export type CreateAuthCodeActionObservers = Observer<
  AuthCode,
  AuthCodeBuilder<AuthCodeCreateInput, AuthCode | null>,
  ExampleViewerAlias,
  AuthCodeCreateInput,
  AuthCode | null
>[];

export type CreateAuthCodeActionValidators = Validator<
  AuthCode,
  AuthCodeBuilder<AuthCodeCreateInput, AuthCode | null>,
  ExampleViewerAlias,
  AuthCodeCreateInput,
  AuthCode | null
>[];

export class CreateAuthCodeActionBase
  implements
    Action<
      AuthCode,
      AuthCodeBuilder<AuthCodeCreateInput, AuthCode | null>,
      ExampleViewerAlias,
      AuthCodeCreateInput,
      AuthCode | null
    >
{
  public readonly builder: AuthCodeBuilder<
    AuthCodeCreateInput,
    AuthCode | null
  >;
  public readonly viewer: ExampleViewerAlias;
  protected input: AuthCodeCreateInput;

  constructor(viewer: ExampleViewerAlias, input: AuthCodeCreateInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new AuthCodeBuilder(
      this.viewer,
      WriteOperation.Insert,
      this,
      null,
    );
  }

  getPrivacyPolicy(): PrivacyPolicy<AuthCode, ExampleViewerAlias> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getTriggers(): CreateAuthCodeActionTriggers {
    return [];
  }

  getObservers(): CreateAuthCodeActionObservers {
    return [];
  }

  getValidators(): CreateAuthCodeActionValidators {
    return [];
  }

  getInput(): AuthCodeCreateInput {
    return this.input;
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

  async save(): Promise<AuthCode | null> {
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<AuthCode> {
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends CreateAuthCodeActionBase>(
    this: new (
      viewer: ExampleViewerAlias,
      input: AuthCodeCreateInput,
    ) => T,
    viewer: ExampleViewerAlias,
    input: AuthCodeCreateInput,
  ): T {
    return new this(viewer, input);
  }
}
