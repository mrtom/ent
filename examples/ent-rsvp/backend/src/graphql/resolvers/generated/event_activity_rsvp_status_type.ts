// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLEnumType } from "graphql";

export const EventActivityRsvpStatusType = new GraphQLEnumType({
  name: "EventActivityRsvpStatus",
  values: {
    ATTENDING: {
      value: "attending",
    },
    DECLINED: {
      value: "declined",
    },
    CAN_RSVP: {
      value: "canRsvp",
    },
    CANNOT_RSVP: {
      value: "cannotRsvp",
    },
  },
});
