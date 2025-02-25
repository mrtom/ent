/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import { AssocEdgeInputOptions, Ent, ID } from "@snowtop/ent";
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
import { Address, Event, User } from "../../..";
import { eventLoaderInfo } from "../../loaders";
import { EdgeType, NodeType } from "../../types";
import schema from "../../../../schema/event_schema";
import { ExampleViewer as ExampleViewerAlias } from "../../../../viewer/viewer";

export interface EventInput {
  name?: string;
  creatorID?: ID;
  startTime?: Date;
  endTime?: Date | null;
  location?: string;
  addressID?: ID | null | Builder<Address, ExampleViewerAlias>;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

type MaybeNull<T extends Ent> = T | null;
type TMaybleNullableEnt<T extends Ent> = T | MaybeNull<T>;

export class EventBuilder<
  TInput extends EventInput = EventInput,
  TExistingEnt extends TMaybleNullableEnt<Event> = Event | null,
> implements Builder<Event, ExampleViewerAlias, TExistingEnt>
{
  orchestrator: Orchestrator<Event, TInput, ExampleViewerAlias, TExistingEnt>;
  readonly placeholderID: ID;
  readonly ent = Event;
  readonly nodeType = NodeType.Event;
  private input: TInput;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: ExampleViewerAlias,
    public readonly operation: WriteOperation,
    action: Action<
      Event,
      Builder<Event, ExampleViewerAlias, TExistingEnt>,
      ExampleViewerAlias,
      TInput,
      TExistingEnt
    >,
    public readonly existingEnt: TExistingEnt,
    opts?: Partial<
      OrchestratorOptions<Event, TInput, ExampleViewerAlias, TExistingEnt>
    >,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-Event`;
    this.input = action.getInput();
    const updateInput = (d: EventInput) => this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "events",
      key: "id",
      loaderOptions: Event.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
      fieldInfo: eventLoaderInfo.fieldInfo,
      ...opts,
    });
  }

  getInput(): TInput {
    return this.input;
  }

  updateInput(input: Omit<EventInput, "creatorID">) {
    if (input.creatorID !== undefined) {
      throw new Error(
        `creatorID cannot be passed to updateInput. use overrideCreatorID instead`,
      );
    }

    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  // override immutable field `creatorID`
  overrideCreatorID(val: ID) {
    this.input.creatorID = val;
  }

  deleteInputKey(key: keyof EventInput) {
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

  addAttending(...nodes: (ID | User | Builder<User, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addAttendingID(node);
      } else if (typeof node === "object") {
        this.addAttendingID(node.id);
      } else {
        this.addAttendingID(node);
      }
    }
    return this;
  }

  addAttendingID(
    id: ID | Builder<User, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.EventToAttending,
      NodeType.User,
      options,
    );
    return this;
  }

  removeAttending(...nodes: (ID | User)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(
          node.id,
          EdgeType.EventToAttending,
        );
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.EventToAttending);
      }
    }
    return this;
  }

  addDeclined(...nodes: (ID | User | Builder<User, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addDeclinedID(node);
      } else if (typeof node === "object") {
        this.addDeclinedID(node.id);
      } else {
        this.addDeclinedID(node);
      }
    }
    return this;
  }

  addDeclinedID(
    id: ID | Builder<User, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.EventToDeclined,
      NodeType.User,
      options,
    );
    return this;
  }

  removeDeclined(...nodes: (ID | User)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(node.id, EdgeType.EventToDeclined);
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.EventToDeclined);
      }
    }
    return this;
  }

  addHost(...nodes: (ID | User | Builder<User, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addHostID(node);
      } else if (typeof node === "object") {
        this.addHostID(node.id);
      } else {
        this.addHostID(node);
      }
    }
    return this;
  }

  addHostID(
    id: ID | Builder<User, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.EventToHosts,
      NodeType.User,
      options,
    );
    return this;
  }

  removeHost(...nodes: (ID | User)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(node.id, EdgeType.EventToHosts);
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.EventToHosts);
      }
    }
    return this;
  }

  addInvited(...nodes: (ID | User | Builder<User, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addInvitedID(node);
      } else if (typeof node === "object") {
        this.addInvitedID(node.id);
      } else {
        this.addInvitedID(node);
      }
    }
    return this;
  }

  addInvitedID(
    id: ID | Builder<User, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.EventToInvited,
      NodeType.User,
      options,
    );
    return this;
  }

  removeInvited(...nodes: (ID | User)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(node.id, EdgeType.EventToInvited);
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.EventToInvited);
      }
    }
    return this;
  }

  addMaybe(...nodes: (ID | User | Builder<User, any>)[]): this {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.addMaybeID(node);
      } else if (typeof node === "object") {
        this.addMaybeID(node.id);
      } else {
        this.addMaybeID(node);
      }
    }
    return this;
  }

  addMaybeID(
    id: ID | Builder<User, any>,
    options?: AssocEdgeInputOptions,
  ): this {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.EventToMaybe,
      NodeType.User,
      options,
    );
    return this;
  }

  removeMaybe(...nodes: (ID | User)[]): this {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(node.id, EdgeType.EventToMaybe);
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.EventToMaybe);
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

  async editedEnt(): Promise<Event | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<Event> {
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
    addField("name", input.name);
    addField("creatorID", input.creatorID);
    if (input.creatorID !== undefined) {
      if (input.creatorID) {
        this.orchestrator.addInboundEdge(
          input.creatorID,
          EdgeType.UserToCreatedEvents,
          NodeType.User,
        );
      }
      if (
        this.existingEnt &&
        this.existingEnt.creatorID &&
        this.existingEnt.creatorID !== input.creatorID
      ) {
        this.orchestrator.removeInboundEdge(
          this.existingEnt.creatorID,
          EdgeType.UserToCreatedEvents,
        );
      }
    }
    addField("start_time", input.startTime);
    addField("end_time", input.endTime);
    addField("location", input.location);
    addField("addressID", input.addressID);
    if (input.addressID !== undefined) {
      if (input.addressID) {
        this.orchestrator.addInboundEdge(
          input.addressID,
          EdgeType.AddressToHostedEvents,
          NodeType.Address,
        );
      }
      // can't have this be dependent on privacy so need to fetch the raw data...
      if (this.existingEnt) {
        const rawData = await Event.loadRawData(
          this.existingEnt.id,
          this.viewer.context,
        );
        if (
          rawData &&
          rawData.address_id !== null &&
          rawData.address_id !== undefined
        ) {
          this.orchestrator.removeInboundEdge(
            rawData.address_id,
            EdgeType.AddressToHostedEvents,
          );
        }
      }
    }
    return result;
  }

  isBuilder<T extends Ent>(
    node: ID | T | Builder<T, any>,
  ): node is Builder<T, any> {
    return (node as Builder<T, any>).placeholderID !== undefined;
  }

  // get value of name. Retrieves it from the input if specified or takes it from existingEnt
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

  // get value of creatorID. Retrieves it from the input if specified or takes it from existingEnt
  getNewCreatorIDValue(): ID {
    if (this.input.creatorID !== undefined) {
      return this.input.creatorID;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `creatorID` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.creatorID;
  }

  // get value of start_time. Retrieves it from the input if specified or takes it from existingEnt
  getNewStartTimeValue(): Date {
    if (this.input.startTime !== undefined) {
      return this.input.startTime;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `startTime` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.startTime;
  }

  // get value of end_time. Retrieves it from the input if specified or takes it from existingEnt
  getNewEndTimeValue(): Date | null {
    if (this.input.endTime !== undefined) {
      return this.input.endTime;
    }

    return this.existingEnt?.endTime ?? null;
  }

  // get value of location. Retrieves it from the input if specified or takes it from existingEnt
  getNewLocationValue(): string {
    if (this.input.location !== undefined) {
      return this.input.location;
    }

    if (!this.existingEnt) {
      throw new Error(
        "no value to return for `location` since not in input and no existingEnt",
      );
    }
    return this.existingEnt.location;
  }

  // get value of addressID. Retrieves it from the input if specified or takes it from existingEnt
  getNewAddressIDValue():
    | ID
    | null
    | Builder<Address, ExampleViewerAlias>
    | undefined {
    return this.input.addressID;
  }
}
