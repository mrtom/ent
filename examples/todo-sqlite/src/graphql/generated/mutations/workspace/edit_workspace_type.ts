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
import { RequestContext, Viewer } from "@snowtop/ent";
import { Workspace } from "src/ent/";
import EditWorkspaceAction, {
  WorkspaceEditInput,
} from "src/ent/workspace/actions/edit_workspace_action";
import { WorkspaceType } from "src/graphql/resolvers/";

interface customEditWorkspaceInput extends WorkspaceEditInput {
  id: string;
}

interface EditWorkspacePayload {
  workspace: Workspace;
}

export const EditWorkspaceInputType = new GraphQLInputObjectType({
  name: "EditWorkspaceInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    id: {
      description: "id of Workspace",
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
  }),
});

export const EditWorkspacePayloadType = new GraphQLObjectType({
  name: "EditWorkspacePayload",
  fields: (): GraphQLFieldConfigMap<EditWorkspacePayload, RequestContext> => ({
    workspace: {
      type: new GraphQLNonNull(WorkspaceType),
    },
  }),
});

export const EditWorkspaceType: GraphQLFieldConfig<
  undefined,
  RequestContext<Viewer>,
  { [input: string]: customEditWorkspaceInput }
> = {
  type: new GraphQLNonNull(EditWorkspacePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(EditWorkspaceInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<Viewer>,
    _info: GraphQLResolveInfo,
  ): Promise<EditWorkspacePayload> => {
    const workspace = await EditWorkspaceAction.saveXFromID(
      context.getViewer(),
      input.id,
      {
        name: input.name,
        slug: input.slug,
      },
    );
    return { workspace: workspace };
  },
};