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
  WriteOperation,
} from "@snowtop/ent/action";
import { Address, Event } from "../../..";
import { EventBuilder } from "./event_builder";
import { ExampleViewer } from "../../../../viewer/viewer";

export interface EventEditInput {
  name?: string;
  creatorID?: ID;
  startTime?: Date;
  endTime?: Date | null;
  location?: string;
  addressID?: ID | null | Builder<Address, ExampleViewer>;
}

export class EditEventActionBase
  implements
    Action<
      Event,
      EventBuilder<EventEditInput, Event>,
      ExampleViewer,
      EventEditInput,
      Event
    >
{
  public readonly builder: EventBuilder<EventEditInput, Event>;
  public readonly viewer: ExampleViewer;
  protected input: EventEditInput;
  protected event: Event;

  constructor(viewer: ExampleViewer, event: Event, input: EventEditInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new EventBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      event,
    );
    this.event = event;
  }

  getPrivacyPolicy(): PrivacyPolicy<Event> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getInput(): EventEditInput {
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

  async save(): Promise<Event | null> {
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<Event> {
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends EditEventActionBase>(
    this: new (viewer: ExampleViewer, event: Event, input: EventEditInput) => T,
    viewer: ExampleViewer,
    event: Event,
    input: EventEditInput,
  ): T {
    return new this(viewer, event, input);
  }

  static async saveXFromID<T extends EditEventActionBase>(
    this: new (viewer: ExampleViewer, event: Event, input: EventEditInput) => T,
    viewer: ExampleViewer,
    id: ID,
    input: EventEditInput,
  ): Promise<Event> {
    const event = await Event.loadX(viewer, id);
    return new this(viewer, event, input).saveX();
  }
}
