// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLObjectType } from "graphql";
import { Data } from "@lolopinto/ent";
import { GraphQLConnectionType } from "@lolopinto/ent/graphql";
import { TodoType } from "src/graphql/resolvers/internal";

var connType: GraphQLConnectionType<GraphQLObjectType, Data>;

export const AccountToTodosConnectionType = () => {
  if (connType === undefined) {
    connType = new GraphQLConnectionType("AccountToTodos", TodoType);
  }
  return connType;
};