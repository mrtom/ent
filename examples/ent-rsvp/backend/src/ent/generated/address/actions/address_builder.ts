// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { AssocEdgeInputOptions, Ent, ID, Viewer } from "@snowtop/ent";
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
import { Address } from "src/ent/";
import { addressLoaderInfo } from "src/ent/generated/loaders";
import { EdgeType, NodeType } from "src/ent/generated/types";
import schema from "src/schema/address_schema";

export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  apartment?: string | null;
  ownerID?: ID | Builder<Ent<Viewer>, Viewer>;
  ownerType?: string;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

type MaybeNull<T extends Ent> = T | null;
type TMaybleNullableEnt<T extends Ent> = T | MaybeNull<T>;

export class AddressBuilder<
  TInput extends AddressInput = AddressInput,
  TExistingEnt extends TMaybleNullableEnt<Address> = Address | null,
> implements Builder<Address, Viewer, TExistingEnt>
{
  orchestrator: Orchestrator<Address, TInput, Viewer, TExistingEnt>;
  readonly placeholderID: ID;
  readonly ent = Address;
  readonly nodeType = NodeType.Address;
  private input: TInput;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: Action<
      Address,
      Builder<Address, Viewer, TExistingEnt>,
      Viewer,
      TInput,
      TExistingEnt
    >,
    public readonly existingEnt: TExistingEnt,
    opts?: Partial<OrchestratorOptions<Address, TInput, Viewer, TExistingEnt>>,
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
      fieldInfo: addressLoaderInfo.fieldInfo,
      ...opts,
    });
  }

  getInput(): TInput {
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
  // this gets the inputs that have been written for a given edgeType and operation
  // WriteOperation.Insert for adding an edge and WriteOperation.Delete for deleting an edge
  getEdgeInputData(edgeType: EdgeType, op: WriteOperation) {
    return this.orchestrator.getInputEdges(edgeType, op);
  }

  clearInputEdges(edgeType: EdgeType, op: WriteOperation, id?: ID) {
    this.orchestrator.clearInputEdges(edgeType, op, id);
  }
  addLocatedAt(...nodes: (Ent | Builder<Ent, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.orchestrator.addOutboundEdge(
          node,
          EdgeType.AddressToLocatedAt,
          // nodeType will be gotten from Executor later
          "",
        );
      } else {
        this.orchestrator.addOutboundEdge(
          node.id,
          EdgeType.AddressToLocatedAt,
          node.nodeType,
        );
      }
    }
    return this;
  }

  addLocatedAtID(
    id: ID | Builder<Ent, any>,
    nodeType: NodeType,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.AddressToLocatedAt,
      nodeType,
      options,
    );
    return this;
  }

  removeLocatedAt(...nodes: (ID | Ent)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(
          node.id,
          EdgeType.AddressToLocatedAt,
        );
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.AddressToLocatedAt);
      }
    }
    return this;
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

  async editedEnt(): Promise<Address | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<Address> {
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
    addField("Street", input.street);
    addField("City", input.city);
    addField("State", input.state);
    addField("ZipCode", input.zipCode);
    addField("Apartment", input.apartment);
    addField("OwnerID", input.ownerID);
    addField("OwnerType", input.ownerType);
    return result;
  }

  isBuilder<T extends Ent>(
    node: ID | T | Builder<T, any>,
  ): node is Builder<T, any> {
    return (node as Builder<T, any>).placeholderID !== undefined;
  }

  // get value of Street. Retrieves it from the input if specified or takes it from existingEnt
  getNewStreetValue(): string {
    if (this.input.street !== undefined) {
      return this.input.street;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `street` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.street;
  }

  // get value of City. Retrieves it from the input if specified or takes it from existingEnt
  getNewCityValue(): string {
    if (this.input.city !== undefined) {
      return this.input.city;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `city` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.city;
  }

  // get value of State. Retrieves it from the input if specified or takes it from existingEnt
  getNewStateValue(): string {
    if (this.input.state !== undefined) {
      return this.input.state;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `state` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.state;
  }

  // get value of ZipCode. Retrieves it from the input if specified or takes it from existingEnt
  getNewZipCodeValue(): string {
    if (this.input.zipCode !== undefined) {
      return this.input.zipCode;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `zipCode` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.zipCode;
  }

  // get value of Apartment. Retrieves it from the input if specified or takes it from existingEnt
  getNewApartmentValue(): string | null {
    if (this.input.apartment !== undefined) {
      return this.input.apartment;
    }

    return this.existingEnt?.apartment ?? null;
  }

  // get value of OwnerID. Retrieves it from the input if specified or takes it from existingEnt
  getNewOwnerIDValue(): ID | Builder<Ent<Viewer>, Viewer> {
    if (this.input.ownerID !== undefined) {
      return this.input.ownerID;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `ownerID` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.ownerID;
  }

  // get value of OwnerType. Retrieves it from the input if specified or takes it from existingEnt
  getNewOwnerTypeValue(): string {
    if (this.input.ownerType !== undefined) {
      return this.input.ownerType;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `ownerType` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.ownerType;
  }
}
