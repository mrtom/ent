import { DeleteEventActionBase } from "../../generated/event/actions/delete_event_action_base";
import {
  AllowIfViewerIsEntPropertyRule,
  AlwaysDenyRule,
  PrivacyPolicy,
} from "@snowtop/ent";
import { Event } from "../../../ent";

// we're only writing this once except with --force and packageName provided
export default class DeleteEventAction extends DeleteEventActionBase {
  getPrivacyPolicy(): PrivacyPolicy {
    return {
      rules: [
        new AllowIfViewerIsEntPropertyRule<Event>("creatorID"),
        AlwaysDenyRule,
      ],
    };
  }
}
