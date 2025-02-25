import { Trigger, Validator } from "@snowtop/ent/action";
import {
  ConfirmEditPhoneNumberActionBase,
  ConfirmEditPhoneNumberInput,
} from "../../generated/user/actions/confirm_edit_phone_number_action_base";
import { User } from "../..";
import { UserBuilder } from "../../generated/user/actions/user_builder";
import DeleteAuthCodeAction from "../../auth_code/actions/delete_auth_code_action";
import { ExampleViewer } from "../../../viewer/viewer";

export { ConfirmEditPhoneNumberInput };

async function findAuthCode(
  builder: UserBuilder,
  code: string,
  phoneNumber: string,
) {
  const user = await User.loadX(builder.viewer, builder.viewer.viewerID!);
  const authCodes = await user.queryAuthCodes().queryEnts();
  return authCodes.find(
    (authCode) => authCode.code == code && authCode.phoneNumber == phoneNumber,
  );
}
// we're only writing this once except with --force and packageName provided
export default class ConfirmEditPhoneNumberAction extends ConfirmEditPhoneNumberActionBase {
  getValidators(): Validator<
    User,
    UserBuilder<ConfirmEditPhoneNumberInput, User>,
    ExampleViewer,
    ConfirmEditPhoneNumberInput,
    User
  >[] {
    return [
      {
        async validate(builder, input) {
          const authCode = await findAuthCode(
            builder,
            input.code,
            input.phoneNumber,
          );
          if (!authCode) {
            throw new Error(
              `code ${input.code} not found associated with user`,
            );
          }
        },
      },
    ];
  }

  getTriggers(): Trigger<
    User,
    UserBuilder<ConfirmEditPhoneNumberInput, User>,
    ExampleViewer,
    ConfirmEditPhoneNumberInput,
    User
  >[] {
    return [
      {
        async changeset(builder, input) {
          const authCode = await findAuthCode(
            builder,
            input.code,
            input.phoneNumber,
          );
          if (!authCode) {
            throw new Error(
              `code ${input.code} not found associated with user`,
            );
          }
          // delete the authCode
          return await DeleteAuthCodeAction.create(
            builder.viewer,
            authCode,
          ).changeset();
        },
      },
    ];
  }
}
