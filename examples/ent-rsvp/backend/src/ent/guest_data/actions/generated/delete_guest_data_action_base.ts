// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { Action, WriteOperation, Changeset } from "@lolopinto/ent/action";
import {
  Viewer,
  ID,
  AllowIfHasIdentity,
  PrivacyPolicy,
  AlwaysDenyRule,
} from "@lolopinto/ent";
import { GuestData } from "src/ent/";
import {
  GuestDataBuilder,
  GuestDataInput,
} from "src/ent/guest_data/actions/guest_data_builder";

export class DeleteGuestDataActionBase implements Action<GuestData> {
  public readonly builder: GuestDataBuilder;
  public readonly viewer: Viewer;

  constructor(viewer: Viewer, guestData: GuestData) {
    this.viewer = viewer;
    this.builder = new GuestDataBuilder(
      this.viewer,
      WriteOperation.Delete,
      this,
      guestData,
    );
  }

  getPrivacyPolicy(): PrivacyPolicy {
    return {
      rules: [AllowIfHasIdentity, AlwaysDenyRule],
    };
  }

  getInput(): GuestDataInput {
    return {};
  }

  async changeset(): Promise<Changeset<GuestData>> {
    return this.builder.build();
  }

  async valid(): Promise<boolean> {
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.builder.validX();
  }

  async save(): Promise<void> {
    await this.builder.save();
  }

  async saveX(): Promise<void> {
    await this.builder.saveX();
  }

  static create<T extends DeleteGuestDataActionBase>(
    this: new (viewer: Viewer, guestData: GuestData) => T,
    viewer: Viewer,
    guestData: GuestData,
  ): DeleteGuestDataActionBase {
    return new this(viewer, guestData);
  }

  static async saveXFromID<T extends DeleteGuestDataActionBase>(
    this: new (viewer: Viewer, guestData: GuestData) => T,
    viewer: Viewer,
    id: ID,
  ): Promise<void> {
    let guestData = await GuestData.loadX(viewer, id);
    return await new this(viewer, guestData).saveX();
  }
}
