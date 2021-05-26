// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import { GraphQLObjectType } from "graphql";
import { AddressCreateType } from "src/graphql/mutations/generated/address/address_create_type";
import { AddressDeleteType } from "src/graphql/mutations/generated/address/address_delete_type";
import { AddressEditType } from "src/graphql/mutations/generated/address/address_edit_type";
import { AuthGuestType } from "src/graphql/mutations/generated/auth_guest_type";
import { AuthUserType } from "src/graphql/mutations/generated/auth_user_type";
import { EmailAvailableType } from "src/graphql/mutations/generated/email_available_type";
import { EventActivityAddInviteType } from "src/graphql/mutations/generated/event_activity/event_activity_add_invite_type";
import { EventActivityCreateType } from "src/graphql/mutations/generated/event_activity/event_activity_create_type";
import { EventActivityDeleteType } from "src/graphql/mutations/generated/event_activity/event_activity_delete_type";
import { EventActivityEditType } from "src/graphql/mutations/generated/event_activity/event_activity_edit_type";
import { EventActivityRemoveInviteType } from "src/graphql/mutations/generated/event_activity/event_activity_remove_invite_type";
import { EventActivityRsvpStatusEditType } from "src/graphql/mutations/generated/event_activity/event_activity_rsvp_status_edit_type";
import { EventCreateType } from "src/graphql/mutations/generated/event/event_create_type";
import { GuestCreateType } from "src/graphql/mutations/generated/guest/guest_create_type";
import { GuestDeleteType } from "src/graphql/mutations/generated/guest/guest_delete_type";
import { GuestEditType } from "src/graphql/mutations/generated/guest/guest_edit_type";
import { GuestGroupCreateType } from "src/graphql/mutations/generated/guest_group/guest_group_create_type";
import { GuestGroupDeleteType } from "src/graphql/mutations/generated/guest_group/guest_group_delete_type";
import { GuestGroupEditType } from "src/graphql/mutations/generated/guest_group/guest_group_edit_type";
import { ImportGuestsType } from "src/graphql/mutations/generated/import_guests_type";
import { UserCreateType } from "src/graphql/mutations/generated/user/user_create_type";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addressCreate: AddressCreateType,
    addressDelete: AddressDeleteType,
    addressEdit: AddressEditType,
    authGuest: AuthGuestType,
    authUser: AuthUserType,
    emailAvailable: EmailAvailableType,
    eventActivityAddInvite: EventActivityAddInviteType,
    eventActivityCreate: EventActivityCreateType,
    eventActivityDelete: EventActivityDeleteType,
    eventActivityEdit: EventActivityEditType,
    eventActivityRemoveInvite: EventActivityRemoveInviteType,
    eventActivityRsvpStatusEdit: EventActivityRsvpStatusEditType,
    eventCreate: EventCreateType,
    guestCreate: GuestCreateType,
    guestDelete: GuestDeleteType,
    guestEdit: GuestEditType,
    guestGroupCreate: GuestGroupCreateType,
    guestGroupDelete: GuestGroupDeleteType,
    guestGroupEdit: GuestGroupEditType,
    importGuests: ImportGuestsType,
    userCreate: UserCreateType,
  }),
});
