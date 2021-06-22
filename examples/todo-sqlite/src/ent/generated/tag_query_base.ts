// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  AssocEdgeCountLoaderFactory,
  AssocEdgeLoaderFactory,
  AssocEdgeQueryBase,
  EdgeQuerySource,
  Viewer,
} from "@lolopinto/ent";
import {
  EdgeType,
  Tag,
  TagToTodosEdge,
  Todo,
  TodoToTagsQuery,
} from "src/ent/internal";

export const tagToTodosCountLoaderFactory = new AssocEdgeCountLoaderFactory(
  EdgeType.TagToTodos,
);
export const tagToTodosDataLoaderFactory = new AssocEdgeLoaderFactory(
  EdgeType.TagToTodos,
  () => TagToTodosEdge,
);

export class TagToTodosQueryBase extends AssocEdgeQueryBase<
  Tag,
  Todo,
  TagToTodosEdge
> {
  constructor(viewer: Viewer, src: EdgeQuerySource<Tag>) {
    super(
      viewer,
      src,
      tagToTodosCountLoaderFactory,
      tagToTodosDataLoaderFactory,
      Todo.loaderOptions(),
    );
  }

  static query<T extends TagToTodosQueryBase>(
    this: new (viewer: Viewer, src: EdgeQuerySource<Tag>) => T,
    viewer: Viewer,
    src: EdgeQuerySource<Tag>,
  ): T {
    return new this(viewer, src);
  }

  queryTags(): TodoToTagsQuery {
    return TodoToTagsQuery.query(this.viewer, this);
  }
}