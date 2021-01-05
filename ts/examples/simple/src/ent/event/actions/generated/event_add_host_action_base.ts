// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  Action,
  Builder,
  WriteOperation,
  Changeset,
} from "@lolopinto/ent/action";
import {
  Viewer,
  ID,
  AssocEdgeInputOptions,
  AllowIfHasIdentity,
  PrivacyPolicy,
  AlwaysDenyRule,
} from "@lolopinto/ent";
import { Event, User } from "src/ent/";
import { EventBuilder, EventInput } from "src/ent/event/actions/event_builder";

export class EventAddHostActionBase implements Action<Event> {
  public readonly builder: EventBuilder;
  public readonly viewer: Viewer;

  constructor(viewer: Viewer, event: Event) {
    this.viewer = viewer;
    this.builder = new EventBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      event,
    );
  }

  getPrivacyPolicy(): PrivacyPolicy {
    return {
      rules: [AllowIfHasIdentity, AlwaysDenyRule],
    };
  }

  getInput(): EventInput {
    return {};
  }

  addHost(...ids: ID[]): this;
  addHost(...nodes: User[]): this;
  addHost(...nodes: Builder<User>[]): this;
  addHost(...nodes: ID[] | User[] | Builder<User>[]): this {
    nodes.forEach((node) => this.builder.addHost(node));
    return this;
  }

  addHostID(id: ID | Builder<User>, options?: AssocEdgeInputOptions): this {
    this.builder.addHostID(id, options);
    return this;
  }
  async changeset(): Promise<Changeset<Event>> {
    return this.builder.build();
  }

  async valid(): Promise<boolean> {
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.builder.validX();
  }

  async save(): Promise<Event | null> {
    await this.builder.save();
    return await this.builder.editedEnt();
  }

  async saveX(): Promise<Event> {
    await this.builder.saveX();
    return await this.builder.editedEntX();
  }

  static create<T extends EventAddHostActionBase>(
    this: new (viewer: Viewer, event: Event) => T,
    viewer: Viewer,
    event: Event,
  ): EventAddHostActionBase {
    return new this(viewer, event);
  }

  static async saveXFromID<T extends EventAddHostActionBase>(
    this: new (viewer: Viewer, event: Event) => T,
    viewer: Viewer,
    id: ID,
    hostID: ID,
  ): Promise<Event> {
    let event = await Event.loadX(viewer, id);
    return await new this(viewer, event).addHost(hostID).saveX();
  }
}
