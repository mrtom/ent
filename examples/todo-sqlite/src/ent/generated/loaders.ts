// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { ID, ObjectLoaderFactory, query } from "@snowtop/ent";
import {
  AccountPrefs,
  AccountPrefs2,
  AccountPrefs3,
  AccountState,
} from "src/ent/generated/types";
import { NodeType } from "./types";

export interface AccountDBData {
  id: ID;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  name: string;
  phone_number: string;
  account_state: AccountState | null;
  account_prefs: AccountPrefs | null;
  account_prefs_3: AccountPrefs3;
  account_prefs_list: AccountPrefs2[] | null;
  credits: number;
}

const accountTable = "accounts";
const accountFields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "name",
  "phone_number",
  "account_state",
  "account_prefs",
  "account_prefs_3",
  "account_prefs_list",
  "credits",
];

export const accountLoader = new ObjectLoaderFactory<AccountDBData>({
  tableName: accountTable,
  fields: accountFields,
  key: "id",
  clause: query.Eq("deleted_at", null),
  instanceKey: "accounts:transformedReadClause",
});

export const accountPhoneNumberLoader = new ObjectLoaderFactory<AccountDBData>({
  tableName: accountTable,
  fields: accountFields,
  key: "phone_number",
  clause: query.Eq("deleted_at", null),
  instanceKey: "accounts:transformedReadClause",
});

export const accountNoTransformLoader = new ObjectLoaderFactory<AccountDBData>({
  tableName: accountTable,
  fields: accountFields,
  key: "id",
});

export const accountPhoneNumberNoTransformLoader =
  new ObjectLoaderFactory<AccountDBData>({
    tableName: accountTable,
    fields: accountFields,
    key: "phone_number",
  });

export const accountLoaderInfo = {
  tableName: accountTable,
  fields: accountFields,
  nodeType: NodeType.Account,
  loaderFactory: accountLoader,
  fieldInfo: {
    ID: {
      dbCol: "id",
      inputKey: "id",
    },
    createdAt: {
      dbCol: "created_at",
      inputKey: "createdAt",
    },
    updatedAt: {
      dbCol: "updated_at",
      inputKey: "updatedAt",
    },
    deleted_at: {
      dbCol: "deleted_at",
      inputKey: "deletedAt",
    },
    Name: {
      dbCol: "name",
      inputKey: "name",
    },
    PhoneNumber: {
      dbCol: "phone_number",
      inputKey: "phoneNumber",
    },
    accountState: {
      dbCol: "account_state",
      inputKey: "accountState",
    },
    accountPrefs: {
      dbCol: "account_prefs",
      inputKey: "accountPrefs",
    },
    accountPrefs3: {
      dbCol: "account_prefs_3",
      inputKey: "accountPrefs3",
    },
    accountPrefsList: {
      dbCol: "account_prefs_list",
      inputKey: "accountPrefsList",
    },
    credits: {
      dbCol: "credits",
      inputKey: "credits",
    },
  },
};

accountLoader.addToPrime(accountPhoneNumberLoader);
accountPhoneNumberLoader.addToPrime(accountLoader);

accountNoTransformLoader.addToPrime(accountPhoneNumberNoTransformLoader);
accountPhoneNumberNoTransformLoader.addToPrime(accountNoTransformLoader);

export interface TagDBData {
  id: ID;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  display_name: string;
  canonical_name: string;
  owner_id: ID;
  related_tag_ids: ID[] | null;
}

const tagTable = "tags";
const tagFields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "display_name",
  "canonical_name",
  "owner_id",
  "related_tag_ids",
];

export const tagLoader = new ObjectLoaderFactory<TagDBData>({
  tableName: tagTable,
  fields: tagFields,
  key: "id",
  clause: query.Eq("deleted_at", null),
  instanceKey: "tags:transformedReadClause",
});

export const tagNoTransformLoader = new ObjectLoaderFactory<TagDBData>({
  tableName: tagTable,
  fields: tagFields,
  key: "id",
});

export const tagLoaderInfo = {
  tableName: tagTable,
  fields: tagFields,
  nodeType: NodeType.Tag,
  loaderFactory: tagLoader,
  fieldInfo: {
    ID: {
      dbCol: "id",
      inputKey: "id",
    },
    createdAt: {
      dbCol: "created_at",
      inputKey: "createdAt",
    },
    updatedAt: {
      dbCol: "updated_at",
      inputKey: "updatedAt",
    },
    deleted_at: {
      dbCol: "deleted_at",
      inputKey: "deletedAt",
    },
    DisplayName: {
      dbCol: "display_name",
      inputKey: "displayName",
    },
    canonicalName: {
      dbCol: "canonical_name",
      inputKey: "canonicalName",
    },
    ownerID: {
      dbCol: "owner_id",
      inputKey: "ownerID",
    },
    relatedTagIds: {
      dbCol: "related_tag_ids",
      inputKey: "relatedTagIds",
    },
  },
};

export interface TodoDBData {
  id: ID;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  text: string;
  completed: boolean;
  creator_id: ID;
  completed_date: Date | null;
  assignee_id: ID;
  scope_id: ID;
  scope_type: string;
  bounty: number | null;
}

const todoTable = "todos";
const todoFields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "text",
  "completed",
  "creator_id",
  "completed_date",
  "assignee_id",
  "scope_id",
  "scope_type",
  "bounty",
];

export const todoLoader = new ObjectLoaderFactory<TodoDBData>({
  tableName: todoTable,
  fields: todoFields,
  key: "id",
  clause: query.Eq("deleted_at", null),
  instanceKey: "todos:transformedReadClause",
});

export const todoNoTransformLoader = new ObjectLoaderFactory<TodoDBData>({
  tableName: todoTable,
  fields: todoFields,
  key: "id",
});

export const todoLoaderInfo = {
  tableName: todoTable,
  fields: todoFields,
  nodeType: NodeType.Todo,
  loaderFactory: todoLoader,
  fieldInfo: {
    ID: {
      dbCol: "id",
      inputKey: "id",
    },
    createdAt: {
      dbCol: "created_at",
      inputKey: "createdAt",
    },
    updatedAt: {
      dbCol: "updated_at",
      inputKey: "updatedAt",
    },
    deleted_at: {
      dbCol: "deleted_at",
      inputKey: "deletedAt",
    },
    Text: {
      dbCol: "text",
      inputKey: "text",
    },
    Completed: {
      dbCol: "completed",
      inputKey: "completed",
    },
    creatorID: {
      dbCol: "creator_id",
      inputKey: "creatorID",
    },
    completedDate: {
      dbCol: "completed_date",
      inputKey: "completedDate",
    },
    assigneeID: {
      dbCol: "assignee_id",
      inputKey: "assigneeID",
    },
    scopeID: {
      dbCol: "scope_id",
      inputKey: "scopeID",
    },
    scopeType: {
      dbCol: "scope_type",
      inputKey: "scopeType",
    },
    bounty: {
      dbCol: "bounty",
      inputKey: "bounty",
    },
  },
};

export interface WorkspaceDBData {
  id: ID;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  name: string;
  creator_id: ID;
  viewer_creator_id: ID;
  slug: string;
}

const workspaceTable = "workspaces";
const workspaceFields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "name",
  "creator_id",
  "viewer_creator_id",
  "slug",
];

export const workspaceLoader = new ObjectLoaderFactory<WorkspaceDBData>({
  tableName: workspaceTable,
  fields: workspaceFields,
  key: "id",
  clause: query.Eq("deleted_at", null),
  instanceKey: "workspaces:transformedReadClause",
});

export const workspaceSlugLoader = new ObjectLoaderFactory<WorkspaceDBData>({
  tableName: workspaceTable,
  fields: workspaceFields,
  key: "slug",
  clause: query.Eq("deleted_at", null),
  instanceKey: "workspaces:transformedReadClause",
});

export const workspaceNoTransformLoader =
  new ObjectLoaderFactory<WorkspaceDBData>({
    tableName: workspaceTable,
    fields: workspaceFields,
    key: "id",
  });

export const workspaceSlugNoTransformLoader =
  new ObjectLoaderFactory<WorkspaceDBData>({
    tableName: workspaceTable,
    fields: workspaceFields,
    key: "slug",
  });

export const workspaceLoaderInfo = {
  tableName: workspaceTable,
  fields: workspaceFields,
  nodeType: NodeType.Workspace,
  loaderFactory: workspaceLoader,
  fieldInfo: {
    ID: {
      dbCol: "id",
      inputKey: "id",
    },
    createdAt: {
      dbCol: "created_at",
      inputKey: "createdAt",
    },
    updatedAt: {
      dbCol: "updated_at",
      inputKey: "updatedAt",
    },
    deleted_at: {
      dbCol: "deleted_at",
      inputKey: "deletedAt",
    },
    name: {
      dbCol: "name",
      inputKey: "name",
    },
    creatorID: {
      dbCol: "creator_id",
      inputKey: "creatorID",
    },
    viewerCreatorID: {
      dbCol: "viewer_creator_id",
      inputKey: "viewerCreatorID",
    },
    slug: {
      dbCol: "slug",
      inputKey: "slug",
    },
  },
};

workspaceLoader.addToPrime(workspaceSlugLoader);
workspaceSlugLoader.addToPrime(workspaceLoader);

workspaceNoTransformLoader.addToPrime(workspaceSlugNoTransformLoader);
workspaceSlugNoTransformLoader.addToPrime(workspaceNoTransformLoader);

export function getLoaderInfoFromSchema(schema: string) {
  switch (schema) {
    case "Account":
      return accountLoaderInfo;
    case "Tag":
      return tagLoaderInfo;
    case "Todo":
      return todoLoaderInfo;
    case "Workspace":
      return workspaceLoaderInfo;
    default:
      throw new Error(
        `invalid schema ${schema} passed to getLoaderInfoFromSchema`,
      );
  }
}

export function getLoaderInfoFromNodeType(nodeType: NodeType) {
  switch (nodeType) {
    case NodeType.Account:
      return accountLoaderInfo;
    case NodeType.Tag:
      return tagLoaderInfo;
    case NodeType.Todo:
      return todoLoaderInfo;
    case NodeType.Workspace:
      return workspaceLoaderInfo;
    default:
      throw new Error(
        `invalid nodeType ${nodeType} passed to getLoaderInfoFromNodeType`,
      );
  }
}
