/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import {
  GraphQLEdgeConnection,
  GraphQLNodeInterface,
  nodeIDEncoder,
} from "@snowtop/ent/graphql";
import { Comment, CommentToPostQuery } from "../../../ent";
import {
  CommentToPostConnectionType,
  UserType,
} from "../../resolvers/internal";
import { ExampleViewer as ExampleViewerAlias } from "../../../viewer/viewer";

export const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: (): GraphQLFieldConfigMap<
    Comment,
    RequestContext<ExampleViewerAlias>
  > => ({
    article: {
      type: GraphQLNodeInterface,
      resolve: (
        comment: Comment,
        args: {},
        context: RequestContext<ExampleViewerAlias>,
      ) => {
        return comment.loadArticle();
      },
    },
    author: {
      type: UserType,
      resolve: (
        comment: Comment,
        args: {},
        context: RequestContext<ExampleViewerAlias>,
      ) => {
        return comment.loadAuthor();
      },
    },
    sticker: {
      type: GraphQLNodeInterface,
      resolve: (
        comment: Comment,
        args: {},
        context: RequestContext<ExampleViewerAlias>,
      ) => {
        return comment.loadSticker();
      },
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: nodeIDEncoder,
    },
    body: {
      type: new GraphQLNonNull(GraphQLString),
    },
    post: {
      type: new GraphQLNonNull(CommentToPostConnectionType()),
      args: {
        first: {
          description: "",
          type: GraphQLInt,
        },
        after: {
          description: "",
          type: GraphQLString,
        },
        last: {
          description: "",
          type: GraphQLInt,
        },
        before: {
          description: "",
          type: GraphQLString,
        },
      },
      resolve: (
        comment: Comment,
        args: any,
        context: RequestContext<ExampleViewerAlias>,
      ) => {
        return new GraphQLEdgeConnection(
          comment.viewer,
          comment,
          (v, comment: Comment) => CommentToPostQuery.query(v, comment),
          args,
        );
      },
    },
  }),
  interfaces: [GraphQLNodeInterface],
  isTypeOf(obj) {
    return obj instanceof Comment;
  },
});
