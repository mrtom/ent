// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

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
import { RequestContext } from "@lolopinto/ent";
import { mustDecodeIDFromGQLID } from "@lolopinto/ent/graphql";
import { Tag } from "src/ent/";
import CreateTagAction, {
  TagCreateInput,
} from "src/ent/tag/actions/create_tag_action";
import { TagType } from "src/graphql/resolvers/";

interface customTagCreateInput extends TagCreateInput {
  ownerID: string;
}

interface TagCreatePayload {
  tag: Tag;
}

export const TagCreateInputType = new GraphQLInputObjectType({
  name: "TagCreateInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    displayName: {
      type: GraphQLNonNull(GraphQLString),
    },
    ownerID: {
      type: GraphQLNonNull(GraphQLID),
    },
  }),
});

export const TagCreatePayloadType = new GraphQLObjectType({
  name: "TagCreatePayload",
  fields: (): GraphQLFieldConfigMap<TagCreatePayload, RequestContext> => ({
    tag: {
      type: GraphQLNonNull(TagType),
    },
  }),
});

export const TagCreateType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customTagCreateInput }
> = {
  type: GraphQLNonNull(TagCreatePayloadType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(TagCreateInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<TagCreatePayload> => {
    let tag = await CreateTagAction.create(context.getViewer(), {
      displayName: input.displayName,
      ownerID: mustDecodeIDFromGQLID(input.ownerID),
    }).saveX();
    return { tag: tag };
  },
};