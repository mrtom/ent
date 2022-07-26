// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { Data, Viewer, convertNullableDate } from "@snowtop/ent";

type Constructor<T = {}> = new (...args: any[]) => T;

export interface IDeletedAt {
  isDeletedAt(): boolean;
  deletedAt: Date | null;
}

function extractFromArgs<TViewer extends Viewer, TData extends Data>(
  args: any[],
): { viewer: TViewer; data: TData } {
  if (args.length !== 2) {
    throw new Error("args should be length 2");
  }
  return {
    viewer: args[0],
    data: args[1],
  };
}

export function DeletedAtMixin<T extends Constructor>(BaseClass: T) {
  return class DeletedAtMixin extends BaseClass {
    readonly deletedAt: Date | null;
    constructor(...args: any[]) {
      super(...args);
      const { data } = extractFromArgs(args);
      this.deletedAt = convertNullableDate(data.deleted_at);
    }

    isDeletedAt() {
      return true;
    }
  };
}