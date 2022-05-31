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
import {
  mustDecodeIDFromGQLID,
  mustDecodeNullableIDFromGQLID,
} from "@snowtop/ent/graphql";
import { Contact } from "../../../../ent";
import EditContactAction, {
  ContactEditInput,
} from "../../../../ent/contact/actions/edit_contact_action";
import { ContactType } from "../../../resolvers";
import { ExampleViewer } from "../../../../viewer/viewer";

interface customContactEditInput extends ContactEditInput {
  contactID: string;
  userID?: string;
}

interface ContactEditPayload {
  contact: Contact;
}

export const ContactEditInputType = new GraphQLInputObjectType({
  name: "ContactEditInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    contactID: {
      description: "id of Contact",
      type: new GraphQLNonNull(GraphQLID),
    },
    emailIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    phoneNumberIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    userID: {
      type: GraphQLID,
    },
  }),
});

export const ContactEditPayloadType = new GraphQLObjectType({
  name: "ContactEditPayload",
  fields: (): GraphQLFieldConfigMap<ContactEditPayload, RequestContext> => ({
    contact: {
      type: new GraphQLNonNull(ContactType),
    },
  }),
});

export const ContactEditType: GraphQLFieldConfig<
  undefined,
  RequestContext<ExampleViewer>,
  { [input: string]: customContactEditInput }
> = {
  type: new GraphQLNonNull(ContactEditPayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(ContactEditInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<ExampleViewer>,
    _info: GraphQLResolveInfo,
  ): Promise<ContactEditPayload> => {
    const contact = await EditContactAction.saveXFromID(
      context.getViewer(),
      mustDecodeIDFromGQLID(input.contactID),
      {
        emailIds: input.emailIds,
        phoneNumberIds: input.phoneNumberIds,
        firstName: input.firstName,
        lastName: input.lastName,
        userID: mustDecodeNullableIDFromGQLID(input.userID),
      },
    );
    return { contact: contact };
  },
};
