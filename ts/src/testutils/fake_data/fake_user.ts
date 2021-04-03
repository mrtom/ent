import {
  ID,
  Ent,
  Viewer,
  Data,
  loadEnt,
  loadEntX,
  LoadEntOptions,
} from "../../core/ent";
import {
  AllowIfViewerRule,
  AlwaysDenyRule,
  AllowIfViewerInboundEdgeExistsRule,
  PrivacyPolicy,
  AllowIfConditionAppliesRule,
  AlwaysAllowRule,
} from "../../core/privacy";
import { BuilderSchema, SimpleAction } from "../builder";
import { Field, StringType, BaseEntSchema } from "../../schema";
import { EdgeType } from "./internal";
import { NodeType } from "./const";
import { IDViewer, IDViewerOptions } from "../../core/viewer";

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
  readonly nodeType = NodeType.FakeUser;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly firstName: string;
  readonly lastName: string;
  readonly emailAddress: string;
  readonly phoneNumber: string | null;
  protected readonly password: string | null;

  privacyPolicy: PrivacyPolicy = {
    rules: [
      AllowIfViewerRule,
      //can view user if friends
      new AllowIfViewerInboundEdgeExistsRule(EdgeType.UserToFriends),
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

  constructor(public viewer: Viewer, id: ID, data: Data) {
    this.id = data["id"];
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.emailAddress = data.email_address;
    this.phoneNumber = data.phone_number;
    this.password = data.password;
  }

  private static getFields(): string[] {
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

  static loaderOptions(): LoadEntOptions<FakeUser> {
    return {
      tableName: "fake_users",
      fields: FakeUser.getFields(),
      ent: this,
    };
  }
  static async load(v: Viewer, id: ID): Promise<FakeUser | null> {
    return loadEnt(v, id, FakeUser.loaderOptions());
  }

  static async loadX(v: Viewer, id: ID): Promise<FakeUser> {
    return loadEntX(v, id, FakeUser.loaderOptions());
  }
}

export class FakeUserSchema extends BaseEntSchema
  implements BuilderSchema<FakeUser> {
  ent = FakeUser;
  fields: Field[] = [
    StringType({
      name: "firstName",
    }),
    StringType({
      name: "lastName",
    }),
    StringType({
      name: "emailAddress",
    }),
    StringType({
      name: "phoneNumber",
    }),
    StringType({
      name: "password",
      nullable: true,
    }),
  ];
}

export interface UserCreateInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string | null;
  password: string | null;
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
  const action = new SimpleAction(viewer, new FakeUserSchema(), m);
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