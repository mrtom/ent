// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLObjectType } from "graphql";
import { Data, Viewer } from "@snowtop/ent";
import { GraphQLConnectionType } from "@snowtop/ent/graphql";
import { TodoType } from "src/graphql/resolvers/internal";

var connType: GraphQLConnectionType<GraphQLObjectType, Data, Viewer>;

export const AccountToTodosConnectionType = () => {
  if (connType === undefined) {
    connType = new GraphQLConnectionType("AccountToTodos", TodoType);
  }
  return connType;
};
