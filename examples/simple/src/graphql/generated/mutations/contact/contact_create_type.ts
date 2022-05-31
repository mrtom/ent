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
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { mustDecodeIDFromGQLID } from "@snowtop/ent/graphql";
import { Contact } from "../../../../ent";
import CreateContactAction, {
  ContactCreateInput,
} from "../../../../ent/contact/actions/create_contact_action";
import { ContactType } from "../../../resolvers";
import { ExampleViewer } from "../../../../viewer/viewer";

interface customContactCreateInput extends ContactCreateInput {
  userID: string;
}

interface ContactCreatePayload {
  contact: Contact;
}

export const EmailContactCreateInput = new GraphQLInputObjectType({
  name: "EmailContactCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    emailAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const PhoneNumberContactCreateInput = new GraphQLInputObjectType({
  name: "PhoneNumberContactCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    label: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const ContactCreateInputType = new GraphQLInputObjectType({
  name: "ContactCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    userID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    emails: {
      type: new GraphQLList(new GraphQLNonNull(EmailContactCreateInput)),
    },
    phoneNumbers: {
      type: new GraphQLList(new GraphQLNonNull(PhoneNumberContactCreateInput)),
    },
  }),
});

export const ContactCreatePayloadType = new GraphQLObjectType({
  name: "ContactCreatePayload",
  fields: (): GraphQLFieldConfigMap<ContactCreatePayload, RequestContext> => ({
    contact: {
      type: new GraphQLNonNull(ContactType),
    },
  }),
});

export const ContactCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewer>,
  { [input: string]: customContactCreateInput }
> = {
  type: new GraphQLNonNull(ContactCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(ContactCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewer>,
    _info: GraphQLResolveInfo,
  ): Promise<ContactCreatePayload> => {
    const contact = await CreateContactAction.create(context.getViewer(), {
      firstName: input.firstName,
      lastName: input.lastName,
      userID: mustDecodeIDFromGQLID(input.userID),
      emails: input.emails,
      phoneNumbers: input.phoneNumbers,
    }).saveX();
    return { contact: contact };
  },
};
