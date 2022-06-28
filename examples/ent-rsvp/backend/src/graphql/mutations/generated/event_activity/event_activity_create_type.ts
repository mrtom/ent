// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLBoolean,
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
import { GraphQLTime, mustDecodeIDFromGQLID } from "@snowtop/ent/graphql";
import { EventActivity } from "src/ent/";
import CreateEventActivityAction, {
  EventActivityCreateInput,
} from "src/ent/event_activity/actions/create_event_activity_action";
import { EventActivityType } from "src/graphql/resolvers/";

interface customEventActivityCreateInput extends EventActivityCreateInput {
  eventID: string;
}

interface EventActivityCreatePayload {
  eventActivity: EventActivity;
}

export const AddressEventActivityCreateInput = new GraphQLInputObjectType({
  name: "AddressEventActivityCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    street: {
      type: new GraphQLNonNull(GraphQLString),
    },
    city: {
      type: new GraphQLNonNull(GraphQLString),
    },
    state: {
      type: new GraphQLNonNull(GraphQLString),
    },
    zipCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    apartment: {
      type: GraphQLString,
    },
  }),
});

export const EventActivityCreateInputType = new GraphQLInputObjectType({
  name: "EventActivityCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    eventID: {
      type: new GraphQLNonNull(GraphQLID),
    },
    startTime: {
      type: new GraphQLNonNull(GraphQLTime),
    },
    endTime: {
      type: GraphQLTime,
    },
    location: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    inviteAllGuests: {
      type: GraphQLBoolean,
    },
    address: {
      type: AddressEventActivityCreateInput,
    },
  }),
});

export const EventActivityCreatePayloadType = new GraphQLObjectType({
  name: "EventActivityCreatePayload",
  fields: (): GraphQLFieldConfigMap<
    EventActivityCreatePayload,
    RequestContext
  > => ({
    eventActivity: {
      type: new GraphQLNonNull(EventActivityType),
    },
  }),
});

export const EventActivityCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customEventActivityCreateInput }
> = {
  type: new GraphQLNonNull(EventActivityCreatePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(EventActivityCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<EventActivityCreatePayload> => {
    const eventActivity = await CreateEventActivityAction.create(
      context.getViewer(),
      {
        name: input.name,
        eventID: mustDecodeIDFromGQLID(input.eventID),
        startTime: input.startTime,
        endTime: input.endTime,
        location: input.location,
        description: input.description,
        inviteAllGuests: input.inviteAllGuests,
        address: input.address,
      },
    ).saveX();
    return { eventActivity: eventActivity };
  },
};
