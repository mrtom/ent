// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLConnectionType } from "@lolopinto/ent/graphql";
import { GuestType } from "src/graphql/resolvers/internal";

export const EventToGuestsConnectionType = () => {
  return new GraphQLConnectionType("EventToGuests", GuestType);
};