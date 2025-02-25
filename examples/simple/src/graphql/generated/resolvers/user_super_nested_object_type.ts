/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from "graphql";
import { RequestContext } from "@snowtop/ent";
import { GraphQLTime } from "@snowtop/ent/graphql";
import {
  CatType,
  DogType,
  RabbitType,
  UserNestedNestedObject,
  UserNestedObject,
  UserSuperNestedObject,
} from "../../../ent/generated/types";
import {
  CatBreedType,
  DogBreedGroupType,
  DogBreedType,
  NestedObjNestedNestedEnumType,
  ObjNestedEnumType,
  RabbitBreedType,
  SuperNestedObjectEnumType,
} from "../../resolvers/internal";
import { ExampleViewer as ExampleViewerAlias } from "../../../viewer/viewer";

const UserNestedObjectType = new GraphQLObjectType({
  name: "UserNestedObject",
  fields: (): GraphQLFieldConfigMap<
    UserNestedObject,
    RequestContext<ExampleViewerAlias>
  > => ({
    nestedUuid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    nestedInt: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    nestedString: {
      type: new GraphQLNonNull(GraphQLString),
    },
    nestedBool: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    nestedFloat: {
      type: GraphQLFloat,
    },
    nestedEnum: {
      type: new GraphQLNonNull(ObjNestedEnumType),
    },
    nestedStringList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    nestedIntList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
    },
    nestedObj: {
      type: UserNestedNestedObjectType,
    },
  }),
});

const UserNestedNestedObjectType = new GraphQLObjectType({
  name: "UserNestedNestedObject",
  fields: (): GraphQLFieldConfigMap<
    UserNestedNestedObject,
    RequestContext<ExampleViewerAlias>
  > => ({
    nestedNestedUuid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    nestedNestedInt: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    nestedNestedString: {
      type: new GraphQLNonNull(GraphQLString),
    },
    nestedNestedBool: {
      type: GraphQLBoolean,
    },
    nestedNestedFloat: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    nestedNestedEnum: {
      type: new GraphQLNonNull(NestedObjNestedNestedEnumType),
    },
    nestedNestedStringList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },
    nestedNestedIntList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
    },
  }),
});

const CatTypeType = new GraphQLObjectType({
  name: "CatType",
  fields: (): GraphQLFieldConfigMap<
    CatType,
    RequestContext<ExampleViewerAlias>
  > => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLTime),
    },
    breed: {
      type: new GraphQLNonNull(CatBreedType),
    },
    kitten: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  }),
});

const DogTypeType = new GraphQLObjectType({
  name: "DogType",
  fields: (): GraphQLFieldConfigMap<
    DogType,
    RequestContext<ExampleViewerAlias>
  > => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLTime),
    },
    breed: {
      type: new GraphQLNonNull(DogBreedType),
    },
    breedGroup: {
      type: new GraphQLNonNull(DogBreedGroupType),
    },
    puppy: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  }),
});

const RabbitTypeType = new GraphQLObjectType({
  name: "RabbitType",
  fields: (): GraphQLFieldConfigMap<
    RabbitType,
    RequestContext<ExampleViewerAlias>
  > => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    birthday: {
      type: new GraphQLNonNull(GraphQLTime),
    },
    breed: {
      type: new GraphQLNonNull(RabbitBreedType),
    },
  }),
});

const PetUnionTypeType = new GraphQLUnionType({
  name: "PetUnionType",
  types: [
    CatTypeType,

    DogTypeType,

    RabbitTypeType,
  ],
});

export const UserSuperNestedObjectType = new GraphQLObjectType({
  name: "UserSuperNestedObject",
  fields: (): GraphQLFieldConfigMap<
    UserSuperNestedObject,
    RequestContext<ExampleViewerAlias>
  > => ({
    uuid: {
      type: new GraphQLNonNull(GraphQLID),
    },
    int: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    string: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bool: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    float: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    enum: {
      type: new GraphQLNonNull(SuperNestedObjectEnumType),
    },
    stringList: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
    },
    intList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt))),
    },
    obj: {
      type: UserNestedObjectType,
    },
    union: {
      type: PetUnionTypeType,
    },
  }),
});
