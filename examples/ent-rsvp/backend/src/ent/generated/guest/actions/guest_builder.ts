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
import { Address, Event, EventActivity, Guest, GuestGroup } from "src/ent/";
import { guestLoaderInfo } from "src/ent/generated/loaders";
import { EdgeType, NodeType } from "src/ent/generated/types";
import schema from "src/schema/guest_schema";

export interface GuestInput {
  addressId?: ID | null | Builder<Address, Viewer>;
  name?: string;
  eventID?: ID | Builder<Event, Viewer>;
  emailAddress?: string | null;
  guestGroupID?: ID | Builder<GuestGroup, Viewer>;
  title?: string | null;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

type MaybeNull<T extends Ent> = T | null;
type TMaybleNullableEnt<T extends Ent> = T | MaybeNull<T>;

export class GuestBuilder<
  TInput extends GuestInput = GuestInput,
  TExistingEnt extends TMaybleNullableEnt<Guest> = Guest | null,
> implements Builder<Guest, Viewer, TExistingEnt>
{
  orchestrator: Orchestrator<Guest, TInput, Viewer, TExistingEnt>;
  readonly placeholderID: ID;
  readonly ent = Guest;
  readonly nodeType = NodeType.Guest;
  private input: TInput;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: Action<
      Guest,
      Builder<Guest, Viewer, TExistingEnt>,
      Viewer,
      TInput,
      TExistingEnt
    >,
    public readonly existingEnt: TExistingEnt,
    opts?: Partial<OrchestratorOptions<Guest, TInput, Viewer, TExistingEnt>>,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-Guest`;
    this.input = action.getInput();
    const updateInput = (d: GuestInput) => this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "guests",
      key: "id",
      loaderOptions: Guest.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
      fieldInfo: guestLoaderInfo.fieldInfo,
      ...opts,
    });
  }

  getInput(): TInput {
    return this.input;
  }

  updateInput(input: GuestInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  deleteInputKey(key: keyof GuestInput) {
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

  addGuestToAttendingEvent(
    ...nodes: (ID | EventActivity | Builder<EventActivity, any>)[]
  ): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addGuestToAttendingEventID(node);
      } else if (typeof node === "object") {
        this.addGuestToAttendingEventID(node.id);
      } else {
        this.addGuestToAttendingEventID(node);
      }
    }
    return this;
  }

  addGuestToAttendingEventID(
    id: ID | Builder<EventActivity, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.GuestToAttendingEvents,
      NodeType.EventActivity,
      options,
    );
    return this;
  }

  removeGuestToAttendingEvent(...nodes: (ID | EventActivity)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(
          node.id,
          EdgeType.GuestToAttendingEvents,
        );
      } else {
        this.orchestrator.removeOutboundEdge(
          node,
          EdgeType.GuestToAttendingEvents,
        );
      }
    }
    return this;
  }

  addGuestToDeclinedEvent(
    ...nodes: (ID | EventActivity | Builder<EventActivity, any>)[]
  ): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addGuestToDeclinedEventID(node);
      } else if (typeof node === "object") {
        this.addGuestToDeclinedEventID(node.id);
      } else {
        this.addGuestToDeclinedEventID(node);
      }
    }
    return this;
  }

  addGuestToDeclinedEventID(
    id: ID | Builder<EventActivity, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.GuestToDeclinedEvents,
      NodeType.EventActivity,
      options,
    );
    return this;
  }

  removeGuestToDeclinedEvent(...nodes: (ID | EventActivity)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(
          node.id,
          EdgeType.GuestToDeclinedEvents,
        );
      } else {
        this.orchestrator.removeOutboundEdge(
          node,
          EdgeType.GuestToDeclinedEvents,
        );
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

  async editedEnt(): Promise<Guest | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<Guest> {
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
    addField("address_id", input.addressId);
    if (input.addressId !== undefined) {
      if (input.addressId) {
        this.orchestrator.addInboundEdge(
          input.addressId,
          EdgeType.AddressToLocatedAt,
          NodeType.Address,
        );
      }
      if (
        this.existingEnt &&
        this.existingEnt.addressId &&
        this.existingEnt.addressId !== input.addressId
      ) {
        this.orchestrator.removeInboundEdge(
          this.existingEnt.addressId,
          EdgeType.AddressToLocatedAt,
        );
      }
    }
    addField("Name", input.name);
    addField("eventID", input.eventID);
    addField("EmailAddress", input.emailAddress);
    addField("guestGroupID", input.guestGroupID);
    addField("title", input.title);
    return result;
  }

  isBuilder<T extends Ent>(
    node: ID | T | Builder<T, any>,
  ): node is Builder<T, any> {
    return (node as Builder<T, any>).placeholderID !== undefined;
  }

  // get value of address_id. Retrieves it from the input if specified or takes it from existingEnt
  getNewAddressIdValue(): ID | null | Builder<Address, Viewer> {
    if (this.input.addressId !== undefined) {
      return this.input.addressId;
    }

    return this.existingEnt?.addressId ?? null;
  }

  // get value of Name. Retrieves it from the input if specified or takes it from existingEnt
  getNewNameValue(): string {
    if (this.input.name !== undefined) {
      return this.input.name;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `name` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.name;
  }

  // get value of eventID. Retrieves it from the input if specified or takes it from existingEnt
  getNewEventIDValue(): ID | Builder<Event, Viewer> {
    if (this.input.eventID !== undefined) {
      return this.input.eventID;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `eventID` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.eventID;
  }

  // get value of EmailAddress. Retrieves it from the input if specified or takes it from existingEnt
  getNewEmailAddressValue(): string | null {
    if (this.input.emailAddress !== undefined) {
      return this.input.emailAddress;
    }

    return this.existingEnt?.emailAddress ?? null;
  }

  // get value of guestGroupID. Retrieves it from the input if specified or takes it from existingEnt
  getNewGuestGroupIDValue(): ID | Builder<GuestGroup, Viewer> {
    if (this.input.guestGroupID !== undefined) {
      return this.input.guestGroupID;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `guestGroupID` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.guestGroupID;
  }

  // get value of title. Retrieves it from the input if specified or takes it from existingEnt
  getNewTitleValue(): string | null {
    if (this.input.title !== undefined) {
      return this.input.title;
    }

    return this.existingEnt?.title ?? null;
  }
}
