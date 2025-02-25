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
  Changeset,
  Observer,
  Trigger,
  Validator,
  WriteOperation,
} from "@snowtop/ent/action";
import { Holiday } from "../../..";
import { HolidayBuilder } from "./holiday_builder";
import { DayOfWeek, DayOfWeekAlt } from "../../types";
import { ExampleViewer as ExampleViewerAlias } from "../../../../viewer/viewer";

export interface CustomCreateHolidayInput {
  dayOfWeek: DayOfWeek;
  dayOfWeekAlt: DayOfWeekAlt;
  label: string;
  date?: Date;
  fakeId?: ID | null;
}

export type CustomCreateHolidayActionTriggers = (
  | Trigger<
      Holiday,
      HolidayBuilder<CustomCreateHolidayInput, Holiday | null>,
      ExampleViewerAlias,
      CustomCreateHolidayInput,
      Holiday | null
    >
  | Trigger<
      Holiday,
      HolidayBuilder<CustomCreateHolidayInput, Holiday | null>,
      ExampleViewerAlias,
      CustomCreateHolidayInput,
      Holiday | null
    >[]
)[];

export type CustomCreateHolidayActionObservers = Observer<
  Holiday,
  HolidayBuilder<CustomCreateHolidayInput, Holiday | null>,
  ExampleViewerAlias,
  CustomCreateHolidayInput,
  Holiday | null
>[];

export type CustomCreateHolidayActionValidators = Validator<
  Holiday,
  HolidayBuilder<CustomCreateHolidayInput, Holiday | null>,
  ExampleViewerAlias,
  CustomCreateHolidayInput,
  Holiday | null
>[];

export class CustomCreateHolidayActionBase
  implements
    Action<
      Holiday,
      HolidayBuilder<CustomCreateHolidayInput, Holiday | null>,
      ExampleViewerAlias,
      CustomCreateHolidayInput,
      Holiday | null
    >
{
  public readonly builder: HolidayBuilder<
    CustomCreateHolidayInput,
    Holiday | null
  >;
  public readonly viewer: ExampleViewerAlias;
  protected input: CustomCreateHolidayInput;

  constructor(viewer: ExampleViewerAlias, input: CustomCreateHolidayInput) {
    this.viewer = viewer;
    this.input = input;
    this.builder = new HolidayBuilder(
      this.viewer,
      WriteOperation.Insert,
      this,
      null,
    );
  }

  getPrivacyPolicy(): PrivacyPolicy<Holiday, ExampleViewerAlias> {
    return AllowIfViewerHasIdentityPrivacyPolicy;
  }

  getTriggers(): CustomCreateHolidayActionTriggers {
    return [];
  }

  getObservers(): CustomCreateHolidayActionObservers {
    return [];
  }

  getValidators(): CustomCreateHolidayActionValidators {
    return [];
  }

  getInput(): CustomCreateHolidayInput {
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

  async save(): Promise<Holiday | null> {
    await this.builder.save();
    return this.builder.editedEnt();
  }

  async saveX(): Promise<Holiday> {
    await this.builder.saveX();
    return this.builder.editedEntX();
  }

  static create<T extends CustomCreateHolidayActionBase>(
    this: new (
      viewer: ExampleViewerAlias,
      input: CustomCreateHolidayInput,
    ) => T,
    viewer: ExampleViewerAlias,
    input: CustomCreateHolidayInput,
  ): T {
    return new this(viewer, input);
  }
}
