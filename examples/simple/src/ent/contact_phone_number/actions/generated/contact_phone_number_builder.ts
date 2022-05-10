/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import { Ent, ID, Viewer } from "@snowtop/ent";
import {
  Action,
  Builder,
  Changeset,
  Orchestrator,
  WriteOperation,
  saveBuilder,
  saveBuilderX,
} from "@snowtop/ent/action";
import { Contact, ContactPhoneNumber } from "../../..";
import { NodeType } from "../../../generated/const";
import schema from "../../../../schema/contact_phone_number";

export interface ContactPhoneNumberInput {
  phoneNumber?: string;
  label?: string;
  contactID?: ID | Builder<Contact>;
}

export interface ContactPhoneNumberAction extends Action<ContactPhoneNumber> {
  getInput(): ContactPhoneNumberInput;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

export class ContactPhoneNumberBuilder implements Builder<ContactPhoneNumber> {
  orchestrator: Orchestrator<ContactPhoneNumber>;
  readonly placeholderID: ID;
  readonly ent = ContactPhoneNumber;
  readonly nodeType = NodeType.ContactPhoneNumber;
  private input: ContactPhoneNumberInput;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: ContactPhoneNumberAction,
    public readonly existingEnt?: ContactPhoneNumber | undefined,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-ContactPhoneNumber`;
    this.input = action.getInput();
    const updateInput = (d: ContactPhoneNumberInput) =>
      this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "contact_phone_numbers",
      key: "id",
      loaderOptions: ContactPhoneNumber.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
    });
  }

  getInput(): ContactPhoneNumberInput {
    return this.input;
  }

  updateInput(input: ContactPhoneNumberInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  overrideInput(input: ContactPhoneNumberInput) {
    this.input = input;
  }

  // store data in Builder that can be retrieved by another validator, trigger, observer later in the action
  storeData(k: string, v: any) {
    this.m.set(k, v);
  }

  // retrieve data stored in this Builder with key
  getStoredData(k: string) {
    return this.m.get(k);
  }

  async build(): Promise<Changeset<ContactPhoneNumber>> {
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

  async editedEnt(): Promise<ContactPhoneNumber | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<ContactPhoneNumber> {
    return this.orchestrator.editedEntX();
  }

  private async getEditedFields(): Promise<Map<string, any>> {
    const fields = this.input;

    const result = new Map<string, any>();

    const addField = function (key: string, value: any) {
      if (value !== undefined) {
        result.set(key, value);
      }
    };
    addField("phoneNumber", fields.phoneNumber);
    addField("label", fields.label);
    addField("contactID", fields.contactID);
    return result;
  }

  isBuilder(node: ID | Ent | Builder<Ent>): node is Builder<Ent> {
    return (node as Builder<Ent>).placeholderID !== undefined;
  }

  // get value of phoneNumber. Retrieves it from the input if specified or takes it from existingEnt
  getNewPhoneNumberValue(): string | undefined {
    if (this.input.phoneNumber !== undefined) {
      return this.input.phoneNumber;
    }
    return this.existingEnt?.phoneNumber;
  }

  // get value of label. Retrieves it from the input if specified or takes it from existingEnt
  getNewLabelValue(): string | undefined {
    if (this.input.label !== undefined) {
      return this.input.label;
    }
    return this.existingEnt?.label;
  }

  // get value of contactID. Retrieves it from the input if specified or takes it from existingEnt
  getNewContactIDValue(): ID | Builder<Contact> | undefined {
    if (this.input.contactID !== undefined) {
      return this.input.contactID;
    }
    return this.existingEnt?.contactID;
  }
}
