// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@lolopinto/ent";
import {
  GraphQLEdgeConnection,
  GraphQLNodeInterface,
  nodeIDEncoder,
} from "@lolopinto/ent/graphql";
import { Todo, TodoToTagsQuery } from "src/ent/";
import {
  AccountType,
  TodoToTagsConnectionType,
} from "src/graphql/resolvers/internal";

export const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: (): GraphQLFieldConfigMap<Todo, RequestContext> => ({
    creator: {
      type: AccountType,
      resolve: (todo: Todo, args: {}, context: RequestContext) => {
        return todo.loadCreator();
      },
    },
    id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: nodeIDEncoder,
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
    completed: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
    tags: {
      type: GraphQLNonNull(TodoToTagsConnectionType()),
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
      resolve: (todo: Todo, args: {}, context: RequestContext) => {
        return new GraphQLEdgeConnection(
          todo.viewer,
          todo,
          (v, todo: Todo) => TodoToTagsQuery.query(v, todo),
          args,
        );
      },
    },
  }),
  interfaces: [GraphQLNodeInterface],
  isTypeOf(obj) {
    return obj instanceof Todo;
  },
});
