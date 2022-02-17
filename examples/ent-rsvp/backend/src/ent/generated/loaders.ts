// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { ObjectLoaderFactory } from "@snowtop/ent";
import { NodeType } from "./const";

const addressTable = "addresses";
const addressFields = [
  "id",
  "created_at",
  "updated_at",
  "street",
  "city",
  "state",
  "zip_code",
  "apartment",
  "owner_id",
  "owner_type",
];

export const addressLoader = new ObjectLoaderFactory({
  tableName: addressTable,
  fields: addressFields,
  key: "id",
});
export const addressOwnerIDLoader = new ObjectLoaderFactory({
  tableName: addressTable,
  fields: addressFields,
  key: "owner_id",
});

export const addressLoaderInfo = {
  tableName: addressTable,
  fields: addressFields,
  nodeType: NodeType.Address,
  loaderFactory: addressLoader,
};

addressLoader.addToPrime(addressOwnerIDLoader);
addressOwnerIDLoader.addToPrime(addressLoader);

const authCodeTable = "auth_codes";
const authCodeFields = [
  "id",
  "created_at",
  "updated_at",
  "code",
  "guest_id",
  "email_address",
  "sent_code",
];

export const authCodeLoader = new ObjectLoaderFactory({
  tableName: authCodeTable,
  fields: authCodeFields,
  key: "id",
});
export const authCodeGuestIDLoader = new ObjectLoaderFactory({
  tableName: authCodeTable,
  fields: authCodeFields,
  key: "guest_id",
});

export const authCodeLoaderInfo = {
  tableName: authCodeTable,
  fields: authCodeFields,
  nodeType: NodeType.AuthCode,
  loaderFactory: authCodeLoader,
};

authCodeLoader.addToPrime(authCodeGuestIDLoader);
authCodeGuestIDLoader.addToPrime(authCodeLoader);

const eventActivityTable = "event_activities";
const eventActivityFields = [
  "id",
  "created_at",
  "updated_at",
  "name",
  "event_id",
  "start_time",
  "end_time",
  "location",
  "description",
  "invite_all_guests",
];

export const eventActivityLoader = new ObjectLoaderFactory({
  tableName: eventActivityTable,
  fields: eventActivityFields,
  key: "id",
});

export const eventActivityLoaderInfo = {
  tableName: eventActivityTable,
  fields: eventActivityFields,
  nodeType: NodeType.EventActivity,
  loaderFactory: eventActivityLoader,
};

const eventTable = "events";
const eventFields = [
  "id",
  "created_at",
  "updated_at",
  "name",
  "slug",
  "creator_id",
];

export const eventLoader = new ObjectLoaderFactory({
  tableName: eventTable,
  fields: eventFields,
  key: "id",
});
export const eventSlugLoader = new ObjectLoaderFactory({
  tableName: eventTable,
  fields: eventFields,
  key: "slug",
});

export const eventLoaderInfo = {
  tableName: eventTable,
  fields: eventFields,
  nodeType: NodeType.Event,
  loaderFactory: eventLoader,
};

eventLoader.addToPrime(eventSlugLoader);
eventSlugLoader.addToPrime(eventLoader);

const guestTable = "guests";
const guestFields = [
  "id",
  "created_at",
  "updated_at",
  "name",
  "event_id",
  "email_address",
  "guest_group_id",
  "title",
];

export const guestLoader = new ObjectLoaderFactory({
  tableName: guestTable,
  fields: guestFields,
  key: "id",
});

export const guestLoaderInfo = {
  tableName: guestTable,
  fields: guestFields,
  nodeType: NodeType.Guest,
  loaderFactory: guestLoader,
};

const guestDataTable = "guest_data";
const guestDataFields = [
  "id",
  "created_at",
  "updated_at",
  "guest_id",
  "event_id",
  "dietary_restrictions",
  "source",
];

export const guestDataLoader = new ObjectLoaderFactory({
  tableName: guestDataTable,
  fields: guestDataFields,
  key: "id",
});

export const guestDataLoaderInfo = {
  tableName: guestDataTable,
  fields: guestDataFields,
  nodeType: NodeType.GuestData,
  loaderFactory: guestDataLoader,
};

const guestGroupTable = "guest_groups";
const guestGroupFields = [
  "id",
  "created_at",
  "updated_at",
  "invitation_name",
  "event_id",
];

export const guestGroupLoader = new ObjectLoaderFactory({
  tableName: guestGroupTable,
  fields: guestGroupFields,
  key: "id",
});

export const guestGroupLoaderInfo = {
  tableName: guestGroupTable,
  fields: guestGroupFields,
  nodeType: NodeType.GuestGroup,
  loaderFactory: guestGroupLoader,
};

const userTable = "users";
const userFields = [
  "id",
  "created_at",
  "updated_at",
  "first_name",
  "last_name",
  "email_address",
  "password",
];

export const userLoader = new ObjectLoaderFactory({
  tableName: userTable,
  fields: userFields,
  key: "id",
});
export const userEmailAddressLoader = new ObjectLoaderFactory({
  tableName: userTable,
  fields: userFields,
  key: "email_address",
});

export const userLoaderInfo = {
  tableName: userTable,
  fields: userFields,
  nodeType: NodeType.User,
  loaderFactory: userLoader,
};

userLoader.addToPrime(userEmailAddressLoader);
userEmailAddressLoader.addToPrime(userLoader);

export function getLoaderInfoFromSchema(schema: string) {
  switch (schema) {
    case "Address":
      return addressLoaderInfo;
    case "AuthCode":
      return authCodeLoaderInfo;
    case "EventActivity":
      return eventActivityLoaderInfo;
    case "Event":
      return eventLoaderInfo;
    case "Guest":
      return guestLoaderInfo;
    case "GuestData":
      return guestDataLoaderInfo;
    case "GuestGroup":
      return guestGroupLoaderInfo;
    case "User":
      return userLoaderInfo;
    default:
      throw new Error(
        `invalid schema ${schema} passed to getLoaderInfoFromSchema`,
      );
  }
}

export function getLoaderInfoFromNodeType(nodeType: NodeType) {
  switch (nodeType) {
    case NodeType.Address:
      return addressLoaderInfo;
    case NodeType.AuthCode:
      return authCodeLoaderInfo;
    case NodeType.EventActivity:
      return eventActivityLoaderInfo;
    case NodeType.Event:
      return eventLoaderInfo;
    case NodeType.Guest:
      return guestLoaderInfo;
    case NodeType.GuestData:
      return guestDataLoaderInfo;
    case NodeType.GuestGroup:
      return guestGroupLoaderInfo;
    case NodeType.User:
      return userLoaderInfo;
    default:
      throw new Error(
        `invalid nodeType ${nodeType} passed to getLoaderInfoFromNodeType`,
      );
  }
}