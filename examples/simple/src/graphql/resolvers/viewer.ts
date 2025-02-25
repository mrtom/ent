import {
  gqlField,
  gqlObjectType,
  gqlContextType,
  gqlQuery,
  encodeGQLID,
} from "@snowtop/ent/graphql";
import { GraphQLID } from "graphql";
import { RequestContext } from "@snowtop/ent";

import { User } from "../../ent";
import { ExampleViewer } from "../../viewer/viewer";
import { DateTime } from "luxon";

@gqlObjectType({ name: "Viewer" })
// TODO when this wasn't exported, it didn't work...
// TODO when this is named ViewerType, it breaks
export class GQLViewer {
  constructor(private viewer: ExampleViewer) {}

  @gqlField({ type: GraphQLID, nullable: true })
  async viewerID() {
    const user = await this.user();
    if (!user) {
      return null;
    }
    return encodeGQLID(user);
  }

  @gqlField({ type: User, nullable: true })
  async user(): Promise<User | null> {
    const v = this.viewer.viewerID;
    if (!v) {
      return null;
    }
    return User.loadX(this.viewer, v);
  }
}

export class ViewerResolver {
  @gqlQuery({ name: "viewer", type: GQLViewer })
  viewer(@gqlContextType() context: RequestContext<ExampleViewer>): GQLViewer {
    return new GQLViewer(context.getViewer());
  }

  timeDiff(time: Date, _log: any) {
    const diff = DateTime.now().diff(DateTime.fromJSDate(time));
    return diff.toString();
  }
}
