/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import { EnumUsedInListType, IntEnumUsedInListType } from "../../../resolvers";

const UserNestedNestedObjectListInputType = new GraphQLInputObjectType({
  name: "UserNestedNestedObjectListInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    int: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});

export const UserNestedObjectListInputType = new GraphQLInputObjectType({
  name: "UserNestedObjectListInput",
  fields: (): GraphQLInputFieldConfigMap => ({
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    enum: {
      type: new GraphQLNonNull(EnumUsedInListType),
    },
    objects: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(UserNestedNestedObjectListInputType),
        ),
      ),
    },
    enumList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(IntEnumUsedInListType)),
      ),
    },
  }),
});
