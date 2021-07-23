// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLObjectType } from "graphql";
import { Data } from "@snowtop/ent";
import { GraphQLConnectionType } from "@snowtop/ent/graphql";
import { TodoType } from "src/graphql/resolvers/internal";

var connType: GraphQLConnectionType<GraphQLObjectType, Data>;

export const RootToOpenTodosConnectionType = () => {
  if (connType === undefined) {
    connType = new GraphQLConnectionType("RootToOpenTodos", TodoType);
  }
  return connType;
};