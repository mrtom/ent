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
import { RequestContext, Viewer } from "@snowtop/ent";
import {
  mustDecodeIDFromGQLID,
  mustDecodeNullableIDFromGQLID,
} from "@snowtop/ent/graphql";
import { Guest } from "src/ent/";
import CreateGuestAction, {
  GuestCreateInput,
} from "src/ent/guest/actions/create_guest_action";
import { GuestType } from "src/graphql/resolvers/";

interface customGuestCreateInput extends GuestCreateInput {
  addressId?: string;
  eventID: string;
  guestGroupID: string;
}

interface GuestCreatePayload {
  guest: Guest;
}

export const GuestCreateInputType = new GraphQLInputObjectType({
  name: "GuestCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    addressId: {
      type: GraphQLID,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    emailAddress: {
      type: GraphQLString,
    },
    guestGroupID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
  }),
});

export const GuestCreatePayloadType = new GraphQLObjectType({
  name: "GuestCreatePayload",
  fields: (): GraphQLFieldConfigMap<
    GuestCreatePayload,
    RequestContext<Viewer>
  > => ({
    guest: {
      type: new GraphQLNonNull(GuestType),
    },
  }),
});

export const GuestCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext<Viewer>,
  { [input: string]: customGuestCreateInput }
> = {
  type: new GraphQLNonNull(GuestCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(GuestCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<Viewer>,
    _info: GraphQLResolveInfo,
  ): Promise<GuestCreatePayload> => {
    const guest = await CreateGuestAction.create(context.getViewer(), {
      addressId: mustDecodeNullableIDFromGQLID(input.addressId),
      name: input.name,
      eventID: mustDecodeIDFromGQLID(input.eventID),
      emailAddress: input.emailAddress,
      guestGroupID: mustDecodeIDFromGQLID(input.guestGroupID),
      title: input.title,
    }).saveX();
    return { guest: guest };
  },
};
