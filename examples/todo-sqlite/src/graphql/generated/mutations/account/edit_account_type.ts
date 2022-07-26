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
import { Account, AccountState } from "src/ent/";
import EditAccountAction, {
  AccountEditInput,
} from "src/ent/account/actions/edit_account_action";
import { AccountStateType, AccountType } from "src/graphql/resolvers/";

interface customEditAccountInput
  extends Omit<AccountEditInput, "phoneNumber" | "accountState"> {
  id: string;
  phone_number?: string;
  account_state?: AccountState | null;
}

interface EditAccountPayload {
  account: Account;
}

export const EditAccountInputType = new GraphQLInputObjectType({
  name: "EditAccountInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    id: {
      description: "id of Account",
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    phone_number: {
      type: GraphQLString,
    },
    account_state: {
      type: AccountStateType,
    },
  }),
});

export const EditAccountPayloadType = new GraphQLObjectType({
  name: "EditAccountPayload",
  fields: (): GraphQLFieldConfigMap<EditAccountPayload, RequestContext> => ({
    account: {
      type: new GraphQLNonNull(AccountType),
    },
  }),
});

export const EditAccountType: GraphQLFieldConfig<
  undefined,
  RequestContext<Viewer>,
  { [input: string]: customEditAccountInput }
> = {
  type: new GraphQLNonNull(EditAccountPayloadType),
  args: {
    input: {
      description: "",
      type: new GraphQLNonNull(EditAccountInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext<Viewer>,
    _info: GraphQLResolveInfo,
  ): Promise<EditAccountPayload> => {
    const account = await EditAccountAction.saveXFromID(
      context.getViewer(),
      input.id,
      {
        name: input.name,
        phoneNumber: input.phone_number,
        accountState: input.account_state,
      },
    );
    return { account: account };
  },
};