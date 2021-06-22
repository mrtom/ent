// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  CustomEdgeQueryBase,
  ID,
  IndexLoaderFactory,
  RawCountLoaderFactory,
  Viewer,
} from "@lolopinto/ent";
import { Account, Tag, Todo, tagLoader, todoLoader } from "src/ent/internal";

export const accountToTagsCountLoaderFactory = new RawCountLoaderFactory(
  Tag.loaderOptions(),
  "owner_id",
);
export const accountToTagsDataLoaderFactory = new IndexLoaderFactory(
  Tag.loaderOptions(),
  "owner_id",
  {
    toPrime: [tagLoader],
  },
);
export const accountToTodosCountLoaderFactory = new RawCountLoaderFactory(
  Todo.loaderOptions(),
  "creator_id",
);
export const accountToTodosDataLoaderFactory = new IndexLoaderFactory(
  Todo.loaderOptions(),
  "creator_id",
  {
    toPrime: [todoLoader],
  },
);

export class AccountToTagsQueryBase extends CustomEdgeQueryBase<Tag> {
  constructor(viewer: Viewer, src: Account | ID) {
    super(viewer, {
      src: src,
      countLoaderFactory: accountToTagsCountLoaderFactory,
      dataLoaderFactory: accountToTagsDataLoaderFactory,
      options: Tag.loaderOptions(),
    });
  }

  static query<T extends AccountToTagsQueryBase>(
    this: new (viewer: Viewer, src: Account | ID) => T,
    viewer: Viewer,
    src: Account | ID,
  ): T {
    return new this(viewer, src);
  }
}

export class AccountToTodosQueryBase extends CustomEdgeQueryBase<Todo> {
  constructor(viewer: Viewer, src: Account | ID) {
    super(viewer, {
      src: src,
      countLoaderFactory: accountToTodosCountLoaderFactory,
      dataLoaderFactory: accountToTodosDataLoaderFactory,
      options: Todo.loaderOptions(),
    });
  }

  static query<T extends AccountToTodosQueryBase>(
    this: new (viewer: Viewer, src: Account | ID) => T,
    viewer: Viewer,
    src: Account | ID,
  ): T {
    return new this(viewer, src);
  }
}