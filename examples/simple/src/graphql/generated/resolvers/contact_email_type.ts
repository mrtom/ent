/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { GraphQLNodeInterface, nodeIDEncoder } from "@snowtop/ent/graphql";
import { ContactEmail } from "../../../ent";
import {
  ContactEmailLabelType,
  ContactInfoType,
  ContactType,
} from "../../resolvers/internal";
import { ExampleViewer as ExampleViewerAlias } from "../../../viewer/viewer";

export const ContactEmailType = new GraphQLObjectType({
  name: "ContactEmail",
  fields: (): GraphQLFieldConfigMap<
    ContactEmail,
    RequestContext<ExampleViewerAlias>
  > => ({
    contact: {
      type: ContactType,
      resolve: (
        contactEmail: ContactEmail,
        args: {},
        context: RequestContext<ExampleViewerAlias>,
      ) => {
        return contactEmail.loadContact();
      },
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: nodeIDEncoder,
    },
    extra: {
      type: ContactInfoType,
    },
    emailAddress: {
      type: new GraphQLNonNull(GraphQLString),
    },
    label: {
      type: new GraphQLNonNull(ContactEmailLabelType),
    },
  }),
  interfaces: [GraphQLNodeInterface],
  isTypeOf(obj) {
    return obj instanceof ContactEmail;
  },
});
