import {
  EditEmailAddressActionBase,
  EditEmailAddressInput,
} from "../../generated/user/actions/edit_email_address_action_base";
import { UserBuilder } from "../../generated/user/actions/user_builder";
import CreateAuthCodeAction from "../../auth_code/actions/create_auth_code_action";
import { FakeComms, Mode } from "@snowtop/ent/testutils/fake_comms";
import { User } from "../..";
import { EditUserPrivacy } from "./edit_user_privacy";

export { EditEmailAddressInput };
import { ExampleViewer } from "../../../viewer/viewer";
import { Validator, Trigger, Observer } from "@snowtop/ent/action";

class NewAuthCode {
  private code: string = "";

  getCode() {
    if (this.code === "") {
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      }
      this.code = code;
    }
    return this.code;
  }

  changeset(builder: UserBuilder, input: EditEmailAddressInput) {
    return CreateAuthCodeAction.create(builder.viewer, {
      emailAddress: input.newEmail,
      userID: builder.viewer.viewerID!,
      code: this.getCode(),
    }).changeset();
  }

  observe(_builder: UserBuilder, input: EditEmailAddressInput) {
    let link = `https://website/confirm?email=${
      input.newEmail
    }&code=${this.getCode()}`;

    FakeComms.send({
      to: input.newEmail,
      mode: Mode.EMAIL,
      subject: "confirm email",
      from: "noreply@example-app.com",
      body: link,
    });
  }
}

// we're only writing this once except with --force and packageName provided
export default class EditEmailAddressAction extends EditEmailAddressActionBase {
  private generateNewCode = new NewAuthCode();

  getValidators(): Validator<
    User,
    UserBuilder<EditEmailAddressInput, User>,
    ExampleViewer,
    EditEmailAddressInput,
    User
  >[] {
    return [
      {
        // confirm email not being used
        async validate(builder: UserBuilder, input: EditEmailAddressInput) {
          const id = await User.loadIDFromEmailAddress(input.newEmail);
          if (id) {
            throw new Error(`cannot change email to ${input.newEmail}`);
          }
        },
      },
    ];
  }
  getTriggers(): Trigger<
    User,
    UserBuilder<EditEmailAddressInput, User>,
    ExampleViewer,
    EditEmailAddressInput,
    User
  >[] {
    return [this.generateNewCode];
  }

  getObservers(): Observer<
    User,
    UserBuilder<EditEmailAddressInput, User>,
    ExampleViewer,
    EditEmailAddressInput,
    User
  >[] {
    return [this.generateNewCode];
  }

  getPrivacyPolicy() {
    return EditUserPrivacy;
  }
}
