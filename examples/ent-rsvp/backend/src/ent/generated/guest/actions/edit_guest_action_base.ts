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
} from "@snowtop/ent/action";
import { Guest } from "src/ent/";
import { GuestBuilder } from "src/ent/generated/guest/actions/guest_builder";

export interface GuestEditInput {
  name?: string;
  emailAddress?: string | null;
}

export type EditGuestActionTriggers = (
  | Trigger<
      Guest,
      GuestBuilder<GuestEditInput, Guest>,
      Viewer,
      GuestEditInput,
      Guest
    >
  | Trigger<
      Guest,
      GuestBuilder<GuestEditInput, Guest>,
      Viewer,
      GuestEditInput,
      Guest
    >[]
)[];

export type EditGuestActionObservers = Observer<
  Guest,
  GuestBuilder<GuestEditInput, Guest>,
  Viewer,
  GuestEditInput,
  Guest
>[];

export type EditGuestActionValidators = Validator<
  Guest,
  GuestBuilder<GuestEditInput, Guest>,
  Viewer,
  GuestEditInput,
  Guest
>[];

export class EditGuestActionBase
  implements
    Action<
      Guest,
      GuestBuilder<GuestEditInput, Guest>,
      Viewer,
      GuestEditInput,
      Guest
    >
{
  public readonly builder: GuestBuilder<GuestEditInput, Guest>;
  public readonly viewer: Viewer;
  protected input: GuestEditInput;
  protected readonly guest: Guest;

  constructor(viewer: Viewer, guest: Guest, input: GuestEditInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new GuestBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      guest,
    );
    this.guest = guest;
  }

  getPrivacyPolicy(): PrivacyPolicy<Guest, Viewer> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getTriggers(): EditGuestActionTriggers {
    return [];
  }

  getObservers(): EditGuestActionObservers {
    return [];
  }

  getValidators(): EditGuestActionValidators {
    return [];
  }

  getInput(): GuestEditInput {
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

  async save(): Promise<Guest | null> {
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<Guest> {
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends EditGuestActionBase>(
    this: new (viewer: Viewer, guest: Guest, input: GuestEditInput) => T,
    viewer: Viewer,
    guest: Guest,
    input: GuestEditInput,
  ): T {
    return new this(viewer, guest, input);
  }

  static async saveXFromID<T extends EditGuestActionBase>(
    this: new (viewer: Viewer, guest: Guest, input: GuestEditInput) => T,
    viewer: Viewer,
    id: ID,
    input: GuestEditInput,
  ): Promise<Guest> {
    const guest = await Guest.loadX(viewer, id);
    return new this(viewer, guest, input).saveX();
  }
}
