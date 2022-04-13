// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { Todo } from "src/ent/";
import CreateTodoAction, {
  TodoCreateInput,
} from "src/ent/todo/actions/create_todo_action";
import { TodoType } from "src/graphql/resolvers/";

interface customCreateTodoInput extends TodoCreateInput {
  creator_id: string;
}

interface CreateTodoPayload {
  todo: Todo;
}

export const CreateTodoInputType = new GraphQLInputObjectType({
  name: "CreateTodoInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    text: {
      type: GraphQLNonNull(GraphQLString),
    },
    creator_id: {
      type: GraphQLNonNull(GraphQLID),
    },
  }),
});

export const CreateTodoPayloadType = new GraphQLObjectType({
  name: "CreateTodoPayload",
  fields: (): GraphQLFieldConfigMap<CreateTodoPayload, RequestContext> => ({
    todo: {
      type: GraphQLNonNull(TodoType),
    },
  }),
});

export const CreateTodoType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customCreateTodoInput }
> = {
  type: GraphQLNonNull(CreateTodoPayloadType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(CreateTodoInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<CreateTodoPayload> => {
    const todo = await CreateTodoAction.create(context.getViewer(), {
      text: input.text,
      creatorID: input.creator_id,
    }).saveX();
    return { todo: todo };
  },
};