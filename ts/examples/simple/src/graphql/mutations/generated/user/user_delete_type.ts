// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo,
  GraphQLInputFieldConfigMap,
} from "graphql";
import { ID, RequestContext } from "@lolopinto/ent";
import { User } from "src/ent/";
import DeleteUserAction from "src/ent/user/actions/delete_user_action";

interface customUserDeleteInput {
  userID: ID;
}

interface UserDeleteResponse {
  deletedUserID: ID;
}

export const UserDeleteInputType = new GraphQLInputObjectType({
  name: "UserDeleteInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    userID: {
      type: GraphQLNonNull(GraphQLID),
    },
  }),
});

export const UserDeleteResponseType = new GraphQLObjectType({
  name: "UserDeleteResponse",
  fields: (): GraphQLFieldConfigMap<UserDeleteResponse, RequestContext> => ({
    deletedUserID: {
      type: GraphQLID,
    },
  }),
});

export const UserDeleteType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customUserDeleteInput }
> = {
  type: GraphQLNonNull(UserDeleteResponseType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(UserDeleteInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<UserDeleteResponse> => {
    await DeleteUserAction.saveXFromID(context.getViewer(), input.userID);
    return { deletedUserID: input.userID };
  },
};
