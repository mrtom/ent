// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLFieldConfigMap,
  GraphQLBoolean,
} from "graphql";
import { RequestContext } from "@lolopinto/ent";
import {
  GraphQLTime,
  GraphQLNodeInterface,
  nodeIDEncoder,
  GraphQLEdgeConnection,
  convertToGQLEnum,
} from "@lolopinto/ent/graphql";
import {
  EventType,
  AddressType,
  EventActivityToAttendingConnectionType,
  EventActivityToDeclinedConnectionType,
  EventActivityToInvitesConnectionType,
  EventActivityRsvpStatusType,
} from "src/graphql/resolvers/internal";
import {
  EventActivity,
  EventActivityToAttendingQuery,
  EventActivityToDeclinedQuery,
  EventActivityToInvitesQuery,
  getEventActivityRsvpStatusValues,
} from "src/ent/";

export const EventActivityType = new GraphQLObjectType({
  name: "EventActivity",
  fields: (): GraphQLFieldConfigMap<EventActivity, RequestContext> => ({
    event: {
      type: EventType,
      resolve: (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        return eventActivity.loadEvent();
      },
    },
    id: {
      type: GraphQLNonNull(GraphQLID),
      resolve: nodeIDEncoder,
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    startTime: {
      type: GraphQLNonNull(GraphQLTime),
    },
    endTime: {
      type: GraphQLTime,
    },
    location: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    inviteAllGuests: {
      type: GraphQLNonNull(GraphQLBoolean),
    },
    attending: {
      type: GraphQLNonNull(EventActivityToAttendingConnectionType()),
      args: {
        first: {
          description: "",
          type: GraphQLInt,
        },
        after: {
          description: "",
          type: GraphQLString,
        },
        last: {
          description: "",
          type: GraphQLInt,
        },
        before: {
          description: "",
          type: GraphQLString,
        },
      },
      resolve: (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        return new GraphQLEdgeConnection(
          eventActivity.viewer,
          eventActivity,
          (v, eventActivity: EventActivity) =>
            EventActivityToAttendingQuery.query(v, eventActivity),
          args,
        );
      },
    },
    declined: {
      type: GraphQLNonNull(EventActivityToDeclinedConnectionType()),
      args: {
        first: {
          description: "",
          type: GraphQLInt,
        },
        after: {
          description: "",
          type: GraphQLString,
        },
        last: {
          description: "",
          type: GraphQLInt,
        },
        before: {
          description: "",
          type: GraphQLString,
        },
      },
      resolve: (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        return new GraphQLEdgeConnection(
          eventActivity.viewer,
          eventActivity,
          (v, eventActivity: EventActivity) =>
            EventActivityToDeclinedQuery.query(v, eventActivity),
          args,
        );
      },
    },
    invites: {
      type: GraphQLNonNull(EventActivityToInvitesConnectionType()),
      args: {
        first: {
          description: "",
          type: GraphQLInt,
        },
        after: {
          description: "",
          type: GraphQLString,
        },
        last: {
          description: "",
          type: GraphQLInt,
        },
        before: {
          description: "",
          type: GraphQLString,
        },
      },
      resolve: (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        return new GraphQLEdgeConnection(
          eventActivity.viewer,
          eventActivity,
          (v, eventActivity: EventActivity) =>
            EventActivityToInvitesQuery.query(v, eventActivity),
          args,
        );
      },
    },
    viewerRsvpStatus: {
      type: EventActivityRsvpStatusType,
      resolve: async (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        const ret = await eventActivity.viewerRsvpStatus();
        return convertToGQLEnum(
          ret,
          getEventActivityRsvpStatusValues(),
          EventActivityRsvpStatusType.getValues(),
        );
      },
    },
    address: {
      type: AddressType,
      resolve: async (
        eventActivity: EventActivity,
        args: {},
        context: RequestContext,
      ) => {
        return eventActivity.address();
      },
    },
  }),
  interfaces: [GraphQLNodeInterface],
  isTypeOf(obj) {
    return obj instanceof EventActivity;
  },
});
