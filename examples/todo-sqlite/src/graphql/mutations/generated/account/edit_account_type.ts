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
import { RequestContext } from "@snowtop/ent";
import { Account } from "src/ent/";
import EditAccountAction, {
  AccountEditInput,
} from "src/ent/account/actions/edit_account_action";
import { AccountType } from "src/graphql/resolvers/";

interface customEditAccountInput extends Omit<AccountEditInput, "phoneNumber"> {
  account_id: string;
  phone_number?: string;
}

interface EditAccountPayload {
  account: Account;
}

export const EditAccountInputType = new GraphQLInputObjectType({
  name: "EditAccountInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    account_id: {
      description: "id of Account",
      type: GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    phone_number: {
      type: GraphQLString,
    },
  }),
});

export const EditAccountPayloadType = new GraphQLObjectType({
  name: "EditAccountPayload",
  fields: (): GraphQLFieldConfigMap<EditAccountPayload, RequestContext> => ({
    account: {
      type: GraphQLNonNull(AccountType),
    },
  }),
});

export const EditAccountType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customEditAccountInput }
> = {
  type: GraphQLNonNull(EditAccountPayloadType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(EditAccountInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<EditAccountPayload> => {
    const account = await EditAccountAction.saveXFromID(
      context.getViewer(),
      input.account_id,
      {
        name: input.name,
        phoneNumber: input.phone_number,
      },
    );
    return { account: account };
  },
};
