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
import { ContactEmail } from "../../../../ent";
import CreateContactEmailAction, {
  ContactEmailCreateInput,
} from "../../../../ent/contact_email/actions/create_contact_email_action";
import { ContactEmailType } from "../../../resolvers";
import { ExampleViewer } from "../../../../viewer/viewer";

interface customContactEmailCreateInput extends ContactEmailCreateInput {
  contactID: string;
}

interface ContactEmailCreatePayload {
  contactEmail: ContactEmail;
}

export const ContactEmailCreateInputType = new GraphQLInputObjectType({
  name: "ContactEmailCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    emailAddress: {
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

export const ContactEmailCreatePayloadType = new GraphQLObjectType({
  name: "ContactEmailCreatePayload",
  fields: (): GraphQLFieldConfigMap<
    ContactEmailCreatePayload,
    RequestContext
  > => ({
    contactEmail: {
      type: new GraphQLNonNull(ContactEmailType),
    },
  }),
});

export const ContactEmailCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewer>,
  { [input: string]: customContactEmailCreateInput }
> = {
  type: new GraphQLNonNull(ContactEmailCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(ContactEmailCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewer>,
    _info: GraphQLResolveInfo,
  ): Promise<ContactEmailCreatePayload> => {
    const contactEmail = await CreateContactEmailAction.create(
      context.getViewer(),
      {
        emailAddress: input.emailAddress,
        label: input.label,
        contactID: mustDecodeIDFromGQLID(input.contactID),
      },
    ).saveX();
    return { contactEmail: contactEmail };
  },
};
