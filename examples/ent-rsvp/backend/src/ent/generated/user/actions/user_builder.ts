// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { Ent, ID, Viewer } from "@snowtop/ent";
import {
  Action,
  Builder,
  Changeset,
  Orchestrator,
  OrchestratorOptions,
  WriteOperation,
  saveBuilder,
  saveBuilderX,
} from "@snowtop/ent/action";
import { User } from "src/ent/";
import { userLoaderInfo } from "src/ent/generated/loaders";
import { NodeType } from "src/ent/generated/types";
import schema from "src/schema/user_schema";

export interface UserInput {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  password?: string;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

type MaybeNull<T extends Ent> = T | null;
type TMaybleNullableEnt<T extends Ent> = T | MaybeNull<T>;

export class UserBuilder<
  TInput extends UserInput = UserInput,
  TExistingEnt extends TMaybleNullableEnt<User> = User | null,
> implements Builder<User, Viewer, TExistingEnt>
{
  orchestrator: Orchestrator<User, TInput, Viewer, TExistingEnt>;
  readonly placeholderID: ID;
  readonly ent = User;
  readonly nodeType = NodeType.User;
  private input: TInput;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: Action<
      User,
      Builder<User, Viewer, TExistingEnt>,
      Viewer,
      TInput,
      TExistingEnt
    >,
    public readonly existingEnt: TExistingEnt,
    opts?: Partial<OrchestratorOptions<User, TInput, Viewer, TExistingEnt>>,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-User`;
    this.input = action.getInput();
    const updateInput = (d: UserInput) => this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "users",
      key: "id",
      loaderOptions: User.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
      fieldInfo: userLoaderInfo.fieldInfo,
      ...opts,
    });
  }

  getInput(): TInput {
    return this.input;
  }

  updateInput(input: UserInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  deleteInputKey(key: keyof UserInput) {
    delete this.input[key];
  }

  // store data in Builder that can be retrieved by another validator, trigger, observer later in the action
  storeData(k: string, v: any) {
    this.m.set(k, v);
  }

  // retrieve data stored in this Builder with key
  getStoredData(k: string) {
    return this.m.get(k);
  }

  // this returns the id of the existing ent or the id of the ent that's being created
  async getEntID() {
    if (this.existingEnt) {
      return this.existingEnt.id;
    }
    const edited = await this.orchestrator.getEditedData();
    if (!edited.id) {
      throw new Error(
        `couldn't get the id field. should have been set by 'defaultValueOnCreate'`,
      );
    }
    return edited.id;
  }
  async build(): Promise<Changeset> {
    return this.orchestrator.build();
  }

  async valid(): Promise<boolean> {
    return this.orchestrator.valid();
  }

  async validX(): Promise<void> {
    return this.orchestrator.validX();
  }

  async save(): Promise<void> {
    await saveBuilder(this);
  }

  async saveX(): Promise<void> {
    await saveBuilderX(this);
  }

  async editedEnt(): Promise<User | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<User> {
    return this.orchestrator.editedEntX();
  }

  private async getEditedFields(): Promise<Map<string, any>> {
    const input = this.input;

    const result = new Map<string, any>();

    const addField = function (key: string, value: any) {
      if (value !== undefined) {
        result.set(key, value);
      }
    };
    addField("FirstName", input.firstName);
    addField("LastName", input.lastName);
    addField("EmailAddress", input.emailAddress);
    addField("Password", input.password);
    return result;
  }

  isBuilder<T extends Ent>(
    node: ID | T | Builder<T, any>,
  ): node is Builder<T, any> {
    return (node as Builder<T, any>).placeholderID !== undefined;
  }

  // get value of FirstName. Retrieves it from the input if specified or takes it from existingEnt
  getNewFirstNameValue(): string {
    if (this.input.firstName !== undefined) {
      return this.input.firstName;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `firstName` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.firstName;
  }

  // get value of LastName. Retrieves it from the input if specified or takes it from existingEnt
  getNewLastNameValue(): string {
    if (this.input.lastName !== undefined) {
      return this.input.lastName;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `lastName` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.lastName;
  }

  // get value of EmailAddress. Retrieves it from the input if specified or takes it from existingEnt
  getNewEmailAddressValue(): string {
    if (this.input.emailAddress !== undefined) {
      return this.input.emailAddress;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `emailAddress` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.emailAddress;
  }

  // get value of Password. Retrieves it from the input if specified or takes it from existingEnt
  getNewPasswordValue(): string | undefined {
    return this.input.password;
  }
}
