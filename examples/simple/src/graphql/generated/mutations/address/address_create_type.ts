/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { Address } from "../../../../ent";
import CreateAddressAction, {
  AddressCreateInput,
} from "../../../../ent/address/actions/create_address_action";
import { AddressType } from "../../../resolvers";
import { ExampleViewer } from "../../../../viewer/viewer";

interface AddressCreatePayload {
  address: Address;
}

export const AddressCreateInputType = new GraphQLInputObjectType({
  name: "AddressCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    streetName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
    },
    zip: {
      type: new GraphQLNonNull(GraphQLString),
    },
    apartment: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
  }),
});

export const AddressCreatePayloadType = new GraphQLObjectType({
  name: "AddressCreatePayload",
  fields: (): GraphQLFieldConfigMap<AddressCreatePayload, RequestContext> => ({
    address: {
      type: new GraphQLNonNull(AddressType),
    },
  }),
});

export const AddressCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewer>,
  { [input: string]: AddressCreateInput }
> = {
  type: new GraphQLNonNull(AddressCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(AddressCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewer>,
    _info: GraphQLResolveInfo,
  ): Promise<AddressCreatePayload> => {
    const address = await CreateAddressAction.create(context.getViewer(), {
      streetName: input.streetName,
      city: input.city,
      state: input.state,
      zip: input.zip,
      apartment: input.apartment,
      country: input.country,
    }).saveX();
    return { address: address };
  },
};
