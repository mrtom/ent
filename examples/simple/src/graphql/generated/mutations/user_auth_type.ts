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
import { ExampleViewer as ExampleViewerAlias } from "../../../viewer/viewer";
import {
  AuthResolver,
  UserAuthInput,
  UserAuthPayload,
} from "../../mutations/auth";

export const UserAuthInputType = new GraphQLInputObjectType({
  name: "UserAuthInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    emailAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const UserAuthPayloadType = new GraphQLObjectType({
  name: "UserAuthPayload",
  fields: (): GraphQLFieldConfigMap<
    UserAuthPayload,
    RequestContext<ExampleViewerAlias>
  > => ({
    viewerID: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});

export const UserAuthType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewerAlias>,
  { [input: string]: UserAuthInput }
> = {
  type: new GraphQLNonNull(UserAuthPayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(UserAuthInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewerAlias>,
    _info: GraphQLResolveInfo,
  ): Promise<UserAuthPayload> => {
    const r = new AuthResolver();
    return r.userAuth(context, {
      emailAddress: input.emailAddress,
      password: input.password,
    });
  },
};
