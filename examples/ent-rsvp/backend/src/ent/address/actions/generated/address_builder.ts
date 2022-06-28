// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

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
import { Address } from "src/ent/";
import { NodeType } from "src/ent/generated/const";
import schema from "src/schema/address";

export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  apartment?: string | null;
  ownerID?: ID | Builder<Ent>;
  ownerType?: string;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

export class AddressBuilder<TData extends AddressInput = AddressInput>
  implements Builder<Address>
{
  orchestrator: Orchestrator<Address, TData>;
  readonly placeholderID: ID;
  readonly ent = Address;
  readonly nodeType = NodeType.Address;
  private input: TData;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: Action<Address, Builder<Address>, TData>,
    public readonly existingEnt?: Address | undefined,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-Address`;
    this.input = action.getInput();
    const updateInput = (d: AddressInput) => this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "addresses",
      key: "id",
      loaderOptions: Address.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
    });
  }

  getInput(): TData {
    return this.input;
  }

  updateInput(input: AddressInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  deleteInputKey(key: keyof AddressInput) {
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

  async build(): Promise<Changeset<Address>> {
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

  async editedEnt(): Promise<Address | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<Address> {
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
    addField("Street", fields.street);
    addField("City", fields.city);
    addField("State", fields.state);
    addField("ZipCode", fields.zipCode);
    addField("Apartment", fields.apartment);
    addField("OwnerID", fields.ownerID);
    addField("OwnerType", fields.ownerType);
    return result;
  }

  isBuilder(node: ID | Ent | Builder<Ent>): node is Builder<Ent> {
    return (node as Builder<Ent>).placeholderID !== undefined;
  }

  // get value of Street. Retrieves it from the input if specified or takes it from existingEnt
  getNewStreetValue(): string | undefined {
    if (this.input.street !== undefined) {
      return this.input.street;
    }
    return this.existingEnt?.street;
  }

  // get value of City. Retrieves it from the input if specified or takes it from existingEnt
  getNewCityValue(): string | undefined {
    if (this.input.city !== undefined) {
      return this.input.city;
    }
    return this.existingEnt?.city;
  }

  // get value of State. Retrieves it from the input if specified or takes it from existingEnt
  getNewStateValue(): string | undefined {
    if (this.input.state !== undefined) {
      return this.input.state;
    }
    return this.existingEnt?.state;
  }

  // get value of ZipCode. Retrieves it from the input if specified or takes it from existingEnt
  getNewZipCodeValue(): string | undefined {
    if (this.input.zipCode !== undefined) {
      return this.input.zipCode;
    }
    return this.existingEnt?.zipCode;
  }

  // get value of Apartment. Retrieves it from the input if specified or takes it from existingEnt
  getNewApartmentValue(): string | null | undefined {
    if (this.input.apartment !== undefined) {
      return this.input.apartment;
    }
    return this.existingEnt?.apartment;
  }

  // get value of OwnerID. Retrieves it from the input if specified or takes it from existingEnt
  getNewOwnerIDValue(): ID | Builder<Ent> | undefined {
    if (this.input.ownerID !== undefined) {
      return this.input.ownerID;
    }
    return this.existingEnt?.ownerID;
  }

  // get value of OwnerType. Retrieves it from the input if specified or takes it from existingEnt
  getNewOwnerTypeValue(): string | undefined {
    if (this.input.ownerType !== undefined) {
      return this.input.ownerType;
    }
    return this.existingEnt?.ownerType;
  }
}
