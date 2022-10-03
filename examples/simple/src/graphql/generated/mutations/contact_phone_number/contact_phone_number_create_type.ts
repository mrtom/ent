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
import { ContactPhoneNumber } from "../../../../ent";
import CreateContactPhoneNumberAction, {
  ContactPhoneNumberCreateInput,
} from "../../../../ent/contact_phone_number/actions/create_contact_phone_number_action";
import { ContactInfoInputType } from "../input/contact_info_input_type";
import { ContactPhoneNumberType } from "../../../resolvers";
import { ExampleViewer as ExampleViewerAlias } from "../../../../viewer/viewer";

interface customContactPhoneNumberCreateInput
  extends ContactPhoneNumberCreateInput {
  contactID: string;
}

interface ContactPhoneNumberCreatePayload {
  contactPhoneNumber: ContactPhoneNumber;
}

export const ContactPhoneNumberCreateInputType = new GraphQLInputObjectType({
  name: "ContactPhoneNumberCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    extra: {
      type: ContactInfoInputType,
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
    contactID: {
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});

export const ContactPhoneNumberCreatePayloadType = new GraphQLObjectType({
  name: "ContactPhoneNumberCreatePayload",
  fields: (): GraphQLFieldConfigMap<
    ContactPhoneNumberCreatePayload,
    RequestContext
  > => ({
    contactPhoneNumber: {
      type: new GraphQLNonNull(ContactPhoneNumberType),
    },
  }),
});

export const ContactPhoneNumberCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewerAlias>,
  { [input: string]: customContactPhoneNumberCreateInput }
> = {
  type: new GraphQLNonNull(ContactPhoneNumberCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(ContactPhoneNumberCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewerAlias>,
    _info: GraphQLResolveInfo,
  ): Promise<ContactPhoneNumberCreatePayload> => {
    const contactPhoneNumber = await CreateContactPhoneNumberAction.create(
      context.getViewer(),
      {
        extra: input.extra,
        phoneNumber: input.phoneNumber,
        label: input.label,
        contactID: mustDecodeIDFromGQLID(input.contactID),
      },
    ).saveX();
    return { contactPhoneNumber: contactPhoneNumber };
  },
};
