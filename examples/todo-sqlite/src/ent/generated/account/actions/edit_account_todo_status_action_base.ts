// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  AllowIfViewerHasIdentityPrivacyPolicy,
  ID,
  PrivacyPolicy,
  Viewer,
} from "@snowtop/ent";
import {
  Action,
  Changeset,
  Observer,
  Trigger,
  Validator,
  WriteOperation,
  setEdgeTypeInGroup,
} from "@snowtop/ent/action";
import { Account } from "src/ent/";
import { AccountBuilder } from "src/ent/generated/account/actions/account_builder";
import { NodeType } from "src/ent/generated/types";

export enum AccountTodoStatusInput {
  OpenTodosDup = "openTodosDup",
  ClosedTodosDup = "closedTodosDup",
  Unknown = "%Unknown%",
}

export function convertAccountTodoStatusInput(
  val: string,
): AccountTodoStatusInput {
  switch (val) {
    case AccountTodoStatusInput.OpenTodosDup:
    case AccountTodoStatusInput.ClosedTodosDup:
    case AccountTodoStatusInput.Unknown:
      return val;
    default:
      return AccountTodoStatusInput.Unknown;
  }
}

export function convertNullableAccountTodoStatusInput(
  val: string | null,
): AccountTodoStatusInput | null {
  if (val === null || val === undefined) {
    return null;
  }
  return convertAccountTodoStatusInput(val);
}

export function convertAccountTodoStatusInputList(
  val: string[],
): AccountTodoStatusInput[] {
  return val.map((v) => convertAccountTodoStatusInput(v));
}

export function convertNullableAccountTodoStatusInputList(
  val: string[] | null,
): AccountTodoStatusInput[] | null {
  if (val === null || val === undefined) {
    return null;
  }
  return convertAccountTodoStatusInputList(val);
}

export interface EditAccountTodoStatusInput {
  todoStatus: AccountTodoStatusInput;
  todoID: ID;
}

export type EditAccountTodoStatusActionTriggers = (
  | Trigger<
      Account,
      AccountBuilder<EditAccountTodoStatusInput, Account>,
      Viewer,
      EditAccountTodoStatusInput,
      Account
    >
  | Trigger<
      Account,
      AccountBuilder<EditAccountTodoStatusInput, Account>,
      Viewer,
      EditAccountTodoStatusInput,
      Account
    >[]
)[];

export type EditAccountTodoStatusActionObservers = Observer<
  Account,
  AccountBuilder<EditAccountTodoStatusInput, Account>,
  Viewer,
  EditAccountTodoStatusInput,
  Account
>[];

export type EditAccountTodoStatusActionValidators = Validator<
  Account,
  AccountBuilder<EditAccountTodoStatusInput, Account>,
  Viewer,
  EditAccountTodoStatusInput,
  Account
>[];

export class EditAccountTodoStatusActionBase
  implements
    Action<
      Account,
      AccountBuilder<EditAccountTodoStatusInput, Account>,
      Viewer,
      EditAccountTodoStatusInput,
      Account
    >
{
  public readonly builder: AccountBuilder<EditAccountTodoStatusInput, Account>;
  public readonly viewer: Viewer;
  protected input: EditAccountTodoStatusInput;
  protected readonly account: Account;

  constructor(
    viewer: Viewer,
    account: Account,
    input: EditAccountTodoStatusInput,
  ) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new AccountBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      account,
    );
    this.account = account;
  }

  getPrivacyPolicy(): PrivacyPolicy<Account, Viewer> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getTriggers(): EditAccountTodoStatusActionTriggers {
    return [];
  }

  getObservers(): EditAccountTodoStatusActionObservers {
    return [];
  }

  getValidators(): EditAccountTodoStatusActionValidators {
    return [];
  }

  getInput(): EditAccountTodoStatusInput {
    return this.input;
  }

  async changeset(): Promise<Changeset> {
    await this.setEdgeType();
    return this.builder.build();
  }

  private async setEdgeType() {
    await setEdgeTypeInGroup(
      this.builder.orchestrator,
      this.input.todoStatus,
      this.account.id,
      this.input.todoID,
      NodeType.Account,
      this.account.getAccountTodoStatusMap(),
    );
  }

  async valid(): Promise<boolean> {
    await this.setEdgeType();
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.setEdgeType();
    await this.builder.validX();
  }

  async save(): Promise<Account | null> {
    await this.setEdgeType();
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<Account> {
    await this.setEdgeType();
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends EditAccountTodoStatusActionBase>(
    this: new (
      viewer: Viewer,
      account: Account,
      input: EditAccountTodoStatusInput,
    ) => T,
    viewer: Viewer,
    account: Account,
    input: EditAccountTodoStatusInput,
  ): T {
    return new this(viewer, account, input);
  }

  static async saveXFromID<T extends EditAccountTodoStatusActionBase>(
    this: new (
      viewer: Viewer,
      account: Account,
      input: EditAccountTodoStatusInput,
    ) => T,
    viewer: Viewer,
    id: ID,
    input: EditAccountTodoStatusInput,
  ): Promise<Account> {
    const account = await Account.loadX(viewer, id);
    return new this(viewer, account, input).saveX();
  }
}
