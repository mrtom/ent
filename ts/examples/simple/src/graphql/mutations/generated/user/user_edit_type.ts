// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo,
  GraphQLInputFieldConfigMap,
} from "graphql";
import { ID, RequestContext } from "@lolopinto/ent";
import { User } from "src/ent/";
import { UserType } from "src/graphql/resolvers/generated/user_type";
import EditUserAction, {
  UserEditInput,
} from "src/ent/user/actions/edit_user_action";

interface customUserEditInput extends UserEditInput {
  userID: ID;
}

interface UserEditResponse {
  user: User;
}

export const UserEditInputType = new GraphQLInputObjectType({
  name: "UserEditInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    userID: {
      type: GraphQLNonNull(GraphQLID),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  }),
});

export const UserEditResponseType = new GraphQLObjectType({
  name: "UserEditResponse",
  fields: (): GraphQLFieldConfigMap<UserEditResponse, RequestContext> => ({
    user: {
      type: GraphQLNonNull(UserType),
    },
  }),
});

export const UserEditType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customUserEditInput }
> = {
  type: GraphQLNonNull(UserEditResponseType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(UserEditInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<UserEditResponse> => {
    let user = await EditUserAction.saveXFromID(
      context.getViewer(),
      input.userID,
      {
        firstName: input.firstName,
        lastName: input.lastName,
      },
    );
    return { user: user };
  },
};
