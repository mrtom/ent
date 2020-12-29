// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfigMap,
} from "graphql";
import { RequestContext } from "@lolopinto/ent";
import { GraphQLNodeInterface, nodeIDEncoder } from "@lolopinto/ent/graphql";
import { UserType } from "src/graphql/resolvers/";
import { Contact } from "src/ent/";

export const ContactType = new GraphQLObjectType({
  name: "Contact",
  fields: (): GraphQLFieldConfigMap<Contact, RequestContext> => ({
    user: {
      type: UserType,
      resolve: (contact: Contact, args: {}) => {
        return contact.loadUser();
      },
    },
    id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: nodeIDEncoder,
    },
    emailAddress: {
      type: GraphQLNonNull(GraphQLString),
    },
    firstName: {
      type: GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: GraphQLNonNull(GraphQLString),
    },
    fullName: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
  interfaces: [GraphQLNodeInterface],
  isTypeOf(obj) {
    return obj instanceof Contact;
  },
});
