// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo,
} from "graphql";
import { RequestContext } from "@lolopinto/ent";
import { UserType } from "src/graphql/resolvers/";
import ViewerResolver, { GQLViewer } from "../viewer";

export const GQLViewerType = new GraphQLObjectType({
  name: "Viewer",
  fields: (): GraphQLFieldConfigMap<GQLViewer, RequestContext> => ({
    viewerID: {
      type: GraphQLID,
    },
    user: {
      type: UserType,
      resolve: async (obj: GQLViewer) => {
        return obj.user();
      },
    },
  }),
});

export const ViewerType: GraphQLFieldConfig<undefined, RequestContext> = {
  type: GraphQLNonNull(GQLViewerType),
  args: {},
  resolve: async (
    _source,
    { arg },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ) => {
    const r = new ViewerResolver();
    return r.viewer(context);
  },
};
