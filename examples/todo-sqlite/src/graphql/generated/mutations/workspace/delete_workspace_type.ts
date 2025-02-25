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
} from "graphql";
import { RequestContext, Viewer } from "@snowtop/ent";
import DeleteWorkspaceAction from "src/ent/workspace/actions/delete_workspace_action";

interface customDeleteWorkspaceInput {
  id: string;
}

interface DeleteWorkspacePayload {
  deleted_workspace_id: string;
}

export const DeleteWorkspaceInputType = new GraphQLInputObjectType({
  name: "DeleteWorkspaceInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    id: {
      description: "id of Workspace",
      type: new GraphQLNonNull(GraphQLID),
    },
  }),
});

export const DeleteWorkspacePayloadType = new GraphQLObjectType({
  name: "DeleteWorkspacePayload",
  fields: (): GraphQLFieldConfigMap<
    DeleteWorkspacePayload,
    RequestContext<Viewer>
  > => ({
    deleted_workspace_id: {
      type: GraphQLID,
    },
  }),
});

export const DeleteWorkspaceType: GraphQLFieldConfig<
  undefined,
  RequestContext<Viewer>,
  { [input: string]: customDeleteWorkspaceInput }
> = {
  type: new GraphQLNonNull(DeleteWorkspacePayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(DeleteWorkspaceInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<Viewer>,
    _info: GraphQLResolveInfo,
  ): Promise<DeleteWorkspacePayload> => {
    await DeleteWorkspaceAction.saveXFromID(context.getViewer(), input.id);
    return { deleted_workspace_id: input.id };
  },
};
