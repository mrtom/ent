import {
  ID,
  Ent,
  Viewer,
  Data,
  LoadEntOptions,
  PrivacyPolicy,
} from "../../core/base";
import { loadEnt, loadEntX } from "../../core/ent";
import {
  AllowIfViewerRule,
  AlwaysDenyRule,
  AllowIfViewerInboundEdgeExistsRule,
  AllowIfConditionAppliesRule,
} from "../../core/privacy";
import { getBuilderSchemaFromFields, SimpleAction } from "../builder";
import { StringType } from "../../schema";
import { EdgeType } from "./internal";
import { NodeType } from "./const";
import { IDViewer, IDViewerOptions } from "../../core/viewer";
import { table, uuid, text, timestamptz } from "../db/temp_db";
import { ObjectLoaderFactory } from "../../core/loaders";
import { convertDate } from "../../core/convert";
import { WriteOperation } from "../../action";

interface TokenOptions extends IDViewerOptions {
  tokens?: {};
}

export class ViewerWithAccessToken extends IDViewer {
  constructor(viewerID: ID, private opts?: Partial<TokenOptions>) {
    super(viewerID, opts);
  }

  hasToken(key: string): boolean {
    const tokens = this.opts?.tokens || {};
    return tokens[key] !== undefined;
  }
}

export class FakeUser implements Ent {
  readonly id: ID;
  readonly data: Data;
  readonly nodeType = NodeType.FakeUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstName: string;
  readonly lastName: string;
  readonly emailAddress: string;
  readonly phoneNumber: string | null;
  protected readonly password: string | null;

  getPrivacyPolicy(): PrivacyPolicy<this> {
    return {
      rules: [
        AllowIfViewerRule,
        //can view user if friends
        new AllowIfViewerInboundEdgeExistsRule(EdgeType.UserToFriends),
        //can view user if following
        new AllowIfViewerInboundEdgeExistsRule(EdgeType.UserToFollowing),
        new AllowIfConditionAppliesRule((viewer: Viewer, ent: Ent) => {
          if (!(viewer instanceof ViewerWithAccessToken)) {
            return false;
          }

          return viewer.hasToken("allow_outbound_friend_request");
        }, new AllowIfViewerInboundEdgeExistsRule(EdgeType.UserToFriendRequests)),
        new AllowIfConditionAppliesRule((viewer: Viewer, ent: Ent) => {
          if (!(viewer instanceof ViewerWithAccessToken)) {
            return false;
          }

          return viewer.hasToken("allow_incoming_friend_request");
        }, new AllowIfViewerInboundEdgeExistsRule(EdgeType.UserToIncomingFriendRequests)),
        AlwaysDenyRule,
      ],
    };
  }

  constructor(public viewer: Viewer, data: Data) {
    this.data = data;
    this.id = data.id;
    this.createdAt = convertDate(data.created_at);
    this.updatedAt = convertDate(data.updated_at);
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.emailAddress = data.email_address;
    this.phoneNumber = data.phone_number;
    this.password = data.password;
  }

  __setRawDBData(data: Data) {}

  static getFields(): string[] {
    return [
      "id",
      "created_at",
      "updated_at",
      "first_name",
      "last_name",
      "email_address",
      "phone_number",
      "password",
    ];
  }

  static getTestTable() {
    return table(
      "fake_users",
      uuid("id", { primaryKey: true }),
      timestamptz("created_at"),
      timestamptz("updated_at"),
      text("first_name"),
      text("last_name"),
      text("email_address"),
      text("phone_number"),
      text("password"),
    );
  }

  static loaderOptions(): LoadEntOptions<FakeUser> {
    return {
      tableName: "fake_users",
      fields: FakeUser.getFields(),
      ent: this,
      loaderFactory: userLoader,
    };
  }
  static async load(v: Viewer, id: ID): Promise<FakeUser | null> {
    return loadEnt(v, id, FakeUser.loaderOptions());
  }

  static async loadX(v: Viewer, id: ID): Promise<FakeUser> {
    return loadEntX(v, id, FakeUser.loaderOptions());
  }
}

export const FakeUserSchema = getBuilderSchemaFromFields(
  {
    firstName: StringType(),
    lastName: StringType(),
    emailAddress: StringType(),
    phoneNumber: StringType(),
    password: StringType({
      nullable: true,
    }),
  },
  FakeUser,
);

export interface UserCreateInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  password: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserEditInput = Partial<UserCreateInput>;

export function getUserBuilder(viewer: Viewer, input: UserCreateInput) {
  const action = getUserAction(viewer, input);
  return action.builder;
}

export function getUserAction(viewer: Viewer, input: UserCreateInput) {
  const m = new Map();
  for (const key in input) {
    m.set(key, input[key]);
  }
  const action = new SimpleAction(
    viewer,
    FakeUserSchema,
    m,
    WriteOperation.Insert,
    null,
  );
  action.viewerForEntLoad = (data: Data) => {
    // load the created ent using a VC of the newly created user.
    return new IDViewer(data.id);
  };
  return action;
}

export async function createUser(viewer: Viewer, input: UserCreateInput) {
  const action = getUserAction(viewer, input);
  return action.saveX();
}

export const userLoader = new ObjectLoaderFactory({
  tableName: "fake_users",
  fields: FakeUser.getFields(),
  key: "id",
});

export const userEmailLoader = new ObjectLoaderFactory({
  tableName: "fake_users",
  fields: FakeUser.getFields(),
  key: "email_address",
});

export const userPhoneNumberLoader = new ObjectLoaderFactory({
  tableName: "fake_users",
  fields: FakeUser.getFields(),
  key: "phone_number",
});

userLoader.addToPrime(userEmailLoader);
userLoader.addToPrime(userPhoneNumberLoader);

userEmailLoader.addToPrime(userLoader);
userEmailLoader.addToPrime(userPhoneNumberLoader);

userPhoneNumberLoader.addToPrime(userLoader);
userPhoneNumberLoader.addToPrime(userEmailLoader);
