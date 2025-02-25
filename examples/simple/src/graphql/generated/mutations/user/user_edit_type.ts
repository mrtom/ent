/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

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
import { mustDecodeIDFromGQLID } from "@snowtop/ent/graphql";
import { User } from "../../../../ent";
import EditUserAction, {
  UserEditInput,
} from "../../../../ent/user/actions/edit_user_action";
import { UserType } from "../../../resolvers";
import { ExampleViewer as ExampleViewerAlias } from "../../../../viewer/viewer";

interface customUserEditInput extends UserEditInput {
  id: string;
}

interface UserEditPayload {
  user: User;
}

export const UserEditInputType = new GraphQLInputObjectType({
  name: "UserEditInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    id: {
      description: "id of User",
      type: new GraphQLNonNull(GraphQLID),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  }),
});

export const UserEditPayloadType = new GraphQLObjectType({
  name: "UserEditPayload",
  fields: (): GraphQLFieldConfigMap<
    UserEditPayload,
    RequestContext<ExampleViewerAlias>
  > => ({
    user: {
      type: new GraphQLNonNull(UserType),
    },
  }),
});

export const UserEditType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewerAlias>,
  { [input: string]: customUserEditInput }
> = {
  type: new GraphQLNonNull(UserEditPayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(UserEditInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewerAlias>,
    _info: GraphQLResolveInfo,
  ): Promise<UserEditPayload> => {
    const user = await EditUserAction.saveXFromID(
      context.getViewer(),
      mustDecodeIDFromGQLID(input.id),
      {
        firstName: input.firstName,
        lastName: input.lastName,
      },
    );
    return { user: user };
  },
};
