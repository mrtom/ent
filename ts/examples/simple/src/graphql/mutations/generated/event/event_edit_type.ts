// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo,
  GraphQLInputFieldConfigMap,
} from "graphql";
import { ID, RequestContext } from "@lolopinto/ent";
import { GraphQLTime } from "@lolopinto/ent/graphql";
import { Event } from "src/ent/";
import { EventType } from "src/graphql/resolvers/";
import EditEventAction, {
  EventEditInput,
} from "src/ent/event/actions/edit_event_action";

interface customEventEditInput extends EventEditInput {
  eventID: ID;
}

interface EventEditResponse {
  event: Event;
}

export const EventEditInputType = new GraphQLInputObjectType({
  name: "EventEditInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    eventID: {
      type: GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    creatorID: {
      type: GraphQLString,
    },
    startTime: {
      type: GraphQLTime,
    },
    endTime: {
      type: GraphQLTime,
    },
    eventLocation: {
      type: GraphQLString,
    },
  }),
});

export const EventEditResponseType = new GraphQLObjectType({
  name: "EventEditResponse",
  fields: (): GraphQLFieldConfigMap<EventEditResponse, RequestContext> => ({
    event: {
      type: GraphQLNonNull(EventType),
    },
  }),
});

export const EventEditType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customEventEditInput }
> = {
  type: GraphQLNonNull(EventEditResponseType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(EventEditInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<EventEditResponse> => {
    let event = await EditEventAction.saveXFromID(
      context.getViewer(),
      input.eventID,
      {
        name: input.name,
        startTime: input.startTime,
        endTime: input.endTime,
        location: input.location,
      },
    );
    return { event: event };
  },
};
