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
  Ent,
  AllowIfHasIdentity,
  PrivacyPolicy,
  AlwaysDenyRule,
} from "@lolopinto/ent";
import { Address } from "src/ent/";
import {
  AddressBuilder,
  AddressInput,
} from "src/ent/address/actions/address_builder";

export interface AddressEditInput {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  apartment?: string | null;
  ownerID?: ID | Builder<Ent>;
  ownerType?: string;
}

export class EditAddressActionBase implements Action<Address> {
  public readonly builder: AddressBuilder;
  public readonly viewer: Viewer;
  protected input: AddressEditInput;

  constructor(viewer: Viewer, address: Address, input: AddressEditInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new AddressBuilder(
      this.viewer,
      WriteOperation.Edit,
      this,
      address,
    );
  }

  getPrivacyPolicy(): PrivacyPolicy {
    return {
      rules: [AllowIfHasIdentity, AlwaysDenyRule],
    };
  }

  getInput(): AddressInput {
    return this.input;
  }

  async changeset(): Promise<Changeset<Address>> {
    return this.builder.build();
  }

  async valid(): Promise<boolean> {
    return this.builder.valid();
  }

  async validX(): Promise<void> {
    await this.builder.validX();
  }

  async save(): Promise<Address | null> {
    await this.builder.save();
    return await this.builder.editedEnt();
  }

  async saveX(): Promise<Address> {
    await this.builder.saveX();
    return await this.builder.editedEntX();
  }

  static create<T extends EditAddressActionBase>(
    this: new (viewer: Viewer, address: Address, input: AddressEditInput) => T,
    viewer: Viewer,
    address: Address,
    input: AddressEditInput,
  ): EditAddressActionBase {
    return new this(viewer, address, input);
  }

  static async saveXFromID<T extends EditAddressActionBase>(
    this: new (viewer: Viewer, address: Address, input: AddressEditInput) => T,
    viewer: Viewer,
    id: ID,
    input: AddressEditInput,
  ): Promise<Address> {
    let address = await Address.loadX(viewer, id);
    return await new this(viewer, address, input).saveX();
  }
}
