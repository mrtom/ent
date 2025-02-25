/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import { GraphQLObjectType } from "graphql";
import { AddressCreateType } from "./address/address_create_type";
import { BulkUploadContactType } from "./bulk_upload_contact_type";
import { CommentCreateType } from "./comment/comment_create_type";
import { CommentEditType } from "./comment/comment_edit_type";
import { ContactCreateType } from "./contact/contact_create_type";
import { ContactDeleteType } from "./contact/contact_delete_type";
import { ContactEditType } from "./contact/contact_edit_type";
import { ContactEmailCreateType } from "./contact_email/contact_email_create_type";
import { ContactEmailDeleteType } from "./contact_email/contact_email_delete_type";
import { ContactEmailEditType } from "./contact_email/contact_email_edit_type";
import { ContactPhoneNumberCreateType } from "./contact_phone_number/contact_phone_number_create_type";
import { ContactPhoneNumberDeleteType } from "./contact_phone_number/contact_phone_number_delete_type";
import { ContactPhoneNumberEditType } from "./contact_phone_number/contact_phone_number_edit_type";
import { EventAddHostType } from "./event/event_add_host_type";
import { EventCreateType } from "./event/event_create_type";
import { EventDeleteType } from "./event/event_delete_type";
import { EventEditType } from "./event/event_edit_type";
import { EventRemoveHostType } from "./event/event_remove_host_type";
import { EventRsvpStatusClearType } from "./event/event_rsvp_status_clear_type";
import { EventRsvpStatusEditType } from "./event/event_rsvp_status_edit_type";
import { HolidayCreateType } from "./holiday/holiday_create_type";
import { HoursOfOperationCreateType } from "./hours_of_operation/hours_of_operation_create_type";
import { ConfirmEmailAddressEditType } from "./user/confirm_email_address_edit_type";
import { ConfirmPhoneNumberEditType } from "./user/confirm_phone_number_edit_type";
import { EmailAddressEditType } from "./user/email_address_edit_type";
import { PhoneNumberEditType } from "./user/phone_number_edit_type";
import { UserCreateType } from "./user/user_create_type";
import { UserDelete2Type } from "./user/user_delete_2_type";
import { UserDeleteType } from "./user/user_delete_type";
import { UserEditType } from "./user/user_edit_type";
import { UserAuthJWTType } from "./user_auth_jwt_type";
import { UserAuthType } from "./user_auth_type";

export const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addressCreate: AddressCreateType,
    bulkUploadContact: BulkUploadContactType,
    commentCreate: CommentCreateType,
    commentEdit: CommentEditType,
    confirmEmailAddressEdit: ConfirmEmailAddressEditType,
    confirmPhoneNumberEdit: ConfirmPhoneNumberEditType,
    contactCreate: ContactCreateType,
    contactDelete: ContactDeleteType,
    contactEdit: ContactEditType,
    contactEmailCreate: ContactEmailCreateType,
    contactEmailDelete: ContactEmailDeleteType,
    contactEmailEdit: ContactEmailEditType,
    contactPhoneNumberCreate: ContactPhoneNumberCreateType,
    contactPhoneNumberDelete: ContactPhoneNumberDeleteType,
    contactPhoneNumberEdit: ContactPhoneNumberEditType,
    emailAddressEdit: EmailAddressEditType,
    eventAddHost: EventAddHostType,
    eventCreate: EventCreateType,
    eventDelete: EventDeleteType,
    eventEdit: EventEditType,
    eventRemoveHost: EventRemoveHostType,
    eventRsvpStatusClear: EventRsvpStatusClearType,
    eventRsvpStatusEdit: EventRsvpStatusEditType,
    holidayCreate: HolidayCreateType,
    hoursOfOperationCreate: HoursOfOperationCreateType,
    phoneNumberEdit: PhoneNumberEditType,
    userAuth: UserAuthType,
    userAuthJWT: UserAuthJWTType,
    userCreate: UserCreateType,
    userDelete: UserDeleteType,
    userDelete2: UserDelete2Type,
    userEdit: UserEditType,
  }),
});
