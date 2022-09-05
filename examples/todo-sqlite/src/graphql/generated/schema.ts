// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLSchema } from "graphql";
import {
  CreateAccountInputType,
  CreateAccountPayloadType,
} from "src/graphql/generated/mutations/account/create_account_type";
import {
  DeleteAccountInputType,
  DeleteAccountPayloadType,
} from "src/graphql/generated/mutations/account/delete_account_type";
import {
  EditAccountInputType,
  EditAccountPayloadType,
} from "src/graphql/generated/mutations/account/edit_account_type";
import {
  AccountTodoStatusInputType,
  TodoStatusAccountEditInputType,
  TodoStatusAccountEditPayloadType,
} from "src/graphql/generated/mutations/account/todo_status_account_edit_type";
import { MutationType } from "src/graphql/generated/mutations/mutation_type";
import {
  CreateTagInputType,
  CreateTagPayloadType,
} from "src/graphql/generated/mutations/tag/create_tag_type";
import {
  AddTodoTagInputType,
  AddTodoTagPayloadType,
} from "src/graphql/generated/mutations/todo/add_todo_tag_type";
import {
  ChangeTodoStatusInputType,
  ChangeTodoStatusPayloadType,
} from "src/graphql/generated/mutations/todo/change_todo_status_type";
import {
  CreateTodoInputType,
  CreateTodoPayloadType,
} from "src/graphql/generated/mutations/todo/create_todo_type";
import {
  DeleteTodoInputType,
  DeleteTodoPayloadType,
} from "src/graphql/generated/mutations/todo/delete_todo_type";
import {
  RemoveTodoTagInputType,
  RemoveTodoTagPayloadType,
} from "src/graphql/generated/mutations/todo/remove_todo_tag_type";
import {
  RenameTodoInputType,
  RenameTodoPayloadType,
} from "src/graphql/generated/mutations/todo/rename_todo_type";
import { QueryType } from "src/graphql/generated/resolvers/query_type";
import {
  AccountStateType,
  AccountToClosedTodosDupConnectionType,
  AccountToOpenTodosConnectionType,
  AccountToOpenTodosDupConnectionType,
  AccountToTagsConnectionType,
  AccountToTodosConnectionType,
  AccountTodoStatusType,
  AccountType,
  RootToOpenTodosConnectionType,
  TagToTodosConnectionType,
  TagType,
  TodoToTagsConnectionType,
  TodoType,
} from "src/graphql/resolvers";

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [
    AccountStateType,
    AccountTodoStatusType,
    AccountType,
    TagType,
    TodoType,
    AccountToClosedTodosDupConnectionType(),
    AccountToOpenTodosConnectionType(),
    AccountToOpenTodosDupConnectionType(),
    AccountToTagsConnectionType(),
    AccountToTodosConnectionType(),
    RootToOpenTodosConnectionType(),
    TagToTodosConnectionType(),
    TodoToTagsConnectionType(),
    AccountTodoStatusInputType,
    AddTodoTagInputType,
    AddTodoTagPayloadType,
    ChangeTodoStatusInputType,
    ChangeTodoStatusPayloadType,
    CreateAccountInputType,
    CreateAccountPayloadType,
    CreateTagInputType,
    CreateTagPayloadType,
    CreateTodoInputType,
    CreateTodoPayloadType,
    DeleteAccountInputType,
    DeleteAccountPayloadType,
    DeleteTodoInputType,
    DeleteTodoPayloadType,
    EditAccountInputType,
    EditAccountPayloadType,
    RemoveTodoTagInputType,
    RemoveTodoTagPayloadType,
    RenameTodoInputType,
    RenameTodoPayloadType,
    TodoStatusAccountEditInputType,
    TodoStatusAccountEditPayloadType,
  ],
});
