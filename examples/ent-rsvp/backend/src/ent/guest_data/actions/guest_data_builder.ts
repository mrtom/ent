// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { Viewer, ID, Ent } from "@lolopinto/ent";
import {
  Action,
  Builder,
  WriteOperation,
  Changeset,
  saveBuilder,
  saveBuilderX,
  Orchestrator,
} from "@lolopinto/ent/action";
import schema from "src/schema/guest_data";
import { GuestData, Event, Guest } from "src/ent/";

export interface GuestDataInput {
  guestID?: ID | Builder<Guest>;
  eventID?: ID | Builder<Event>;
  dietaryRestrictions?: string;
}

export interface GuestDataAction extends Action<GuestData> {
  getInput(): GuestDataInput;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

export class GuestDataBuilder implements Builder<GuestData> {
  orchestrator: Orchestrator<GuestData>;
  readonly placeholderID: ID;
  readonly ent = GuestData;
  private input: GuestDataInput;

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: GuestDataAction,
    public readonly existingEnt?: GuestData | undefined,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-GuestData`;
    this.input = action.getInput();

    this.orchestrator = new Orchestrator({
      viewer: viewer,
      operation: this.operation,
      tableName: "guest_data",
      key: "id",
      loaderOptions: GuestData.loaderOptions(),
      builder: this,
      action: action,
      schema: schema,
      editedFields: () => {
        return this.getEditedFields.apply(this);
      },
    });
  }

  getInput(): GuestDataInput {
    return this.input;
  }

  updateInput(input: GuestDataInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  async build(): Promise<Changeset<GuestData>> {
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

  async editedEnt(): Promise<GuestData | null> {
    return await this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<GuestData> {
    return await this.orchestrator.editedEntX();
  }

  private getEditedFields(): Map<string, any> {
    const fields = this.input;

    let result = new Map<string, any>();

    const addField = function (key: string, value: any) {
      if (value !== undefined) {
        result.set(key, value);
      }
    };
    addField("guestID", fields.guestID);
    addField("eventID", fields.eventID);
    addField("dietaryRestrictions", fields.dietaryRestrictions);
    return result;
  }

  isBuilder(node: ID | Ent | Builder<Ent>): node is Builder<Ent> {
    return (node as Builder<Ent>).placeholderID !== undefined;
  }
}