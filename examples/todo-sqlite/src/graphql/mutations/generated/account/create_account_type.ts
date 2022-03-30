// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { Account } from "src/ent/";
import CreateAccountAction, {
  AccountCreateInput,
} from "src/ent/account/actions/create_account_action";
import { AccountType } from "src/graphql/resolvers/";

interface customCreateAccountInput
  extends Omit<AccountCreateInput, "phoneNumber"> {
  phone_number: string;
}

interface CreateAccountPayload {
  account: Account;
}

export const CreateAccountInputType = new GraphQLInputObjectType({
  name: "CreateAccountInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    phone_number: {
      type: GraphQLNonNull(GraphQLString),
    },
  }),
});

export const CreateAccountPayloadType = new GraphQLObjectType({
  name: "CreateAccountPayload",
  fields: (): GraphQLFieldConfigMap<CreateAccountPayload, RequestContext> => ({
    account: {
      type: GraphQLNonNull(AccountType),
    },
  }),
});

export const CreateAccountType: GraphQLFieldConfig<
  undefined,
  RequestContext,
  { [input: string]: customCreateAccountInput }
> = {
  type: GraphQLNonNull(CreateAccountPayloadType),
  args: {
    input: {
      description: "",
      type: GraphQLNonNull(CreateAccountInputType),
    },
  },
  resolve: async (
    _source,
    { input },
    context: RequestContext,
    _info: GraphQLResolveInfo,
  ): Promise<CreateAccountPayload> => {
    const account = await CreateAccountAction.create(context.getViewer(), {
      name: input.name,
      phoneNumber: input.phone_number,
    }).saveX();
    return { account: account };
  },
};
