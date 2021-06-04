// Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

import {
  AssocEdgeCountLoaderFactory,
  AssocEdgeLoaderFactory,
  AssocEdgeQueryBase,
  CustomEdgeQueryBase,
  EdgeQuerySource,
  ID,
  IndexLoaderFactory,
  RawCountLoaderFactory,
  Viewer,
} from "@lolopinto/ent";
import {
  AuthCode,
  EdgeType,
  EventActivity,
  EventActivityToAttendingQuery,
  EventActivityToDeclinedQuery,
  EventActivityToInvitesQuery,
  Guest,
  GuestData,
  GuestToAttendingEventsEdge,
  GuestToDeclinedEventsEdge,
  authCodeLoader,
  guestDataLoader,
} from "src/ent/internal";

export const guestToAttendingEventsCountLoaderFactory =
  new AssocEdgeCountLoaderFactory(EdgeType.GuestToAttendingEvents);
export const guestToAttendingEventsDataLoaderFactory =
  new AssocEdgeLoaderFactory(
    EdgeType.GuestToAttendingEvents,
    () => GuestToAttendingEventsEdge,
  );

export const guestToDeclinedEventsCountLoaderFactory =
  new AssocEdgeCountLoaderFactory(EdgeType.GuestToDeclinedEvents);
export const guestToDeclinedEventsDataLoaderFactory =
  new AssocEdgeLoaderFactory(
    EdgeType.GuestToDeclinedEvents,
    () => GuestToDeclinedEventsEdge,
  );

export const guestToAuthCodesCountLoaderFactory = new RawCountLoaderFactory(
  AuthCode.loaderOptions(),
  "guest_id",
);
export const guestToAuthCodesDataLoaderFactory = new IndexLoaderFactory(
  AuthCode.loaderOptions(),
  "guest_id",
  {
    toPrime: [authCodeLoader],
  },
);
export const guestToGuestDataCountLoaderFactory = new RawCountLoaderFactory(
  GuestData.loaderOptions(),
  "guest_id",
);
export const guestToGuestDataDataLoaderFactory = new IndexLoaderFactory(
  GuestData.loaderOptions(),
  "guest_id",
  {
    toPrime: [guestDataLoader],
  },
);

export class GuestToAttendingEventsQueryBase extends AssocEdgeQueryBase<
  Guest,
  EventActivity,
  GuestToAttendingEventsEdge
> {
  constructor(viewer: Viewer, src: EdgeQuerySource<Guest>) {
    super(
      viewer,
      src,
      guestToAttendingEventsCountLoaderFactory,
      guestToAttendingEventsDataLoaderFactory,
      EventActivity.loaderOptions(),
    );
  }

  static query<T extends GuestToAttendingEventsQueryBase>(
    this: new (viewer: Viewer, src: EdgeQuerySource<Guest>) => T,
    viewer: Viewer,
    src: EdgeQuerySource<Guest>,
  ): T {
    return new this(viewer, src);
  }

  queryAttending(): EventActivityToAttendingQuery {
    return EventActivityToAttendingQuery.query(this.viewer, this);
  }

  queryDeclined(): EventActivityToDeclinedQuery {
    return EventActivityToDeclinedQuery.query(this.viewer, this);
  }

  queryInvites(): EventActivityToInvitesQuery {
    return EventActivityToInvitesQuery.query(this.viewer, this);
  }
}

export class GuestToDeclinedEventsQueryBase extends AssocEdgeQueryBase<
  Guest,
  EventActivity,
  GuestToDeclinedEventsEdge
> {
  constructor(viewer: Viewer, src: EdgeQuerySource<Guest>) {
    super(
      viewer,
      src,
      guestToDeclinedEventsCountLoaderFactory,
      guestToDeclinedEventsDataLoaderFactory,
      EventActivity.loaderOptions(),
    );
  }

  static query<T extends GuestToDeclinedEventsQueryBase>(
    this: new (viewer: Viewer, src: EdgeQuerySource<Guest>) => T,
    viewer: Viewer,
    src: EdgeQuerySource<Guest>,
  ): T {
    return new this(viewer, src);
  }

  queryAttending(): EventActivityToAttendingQuery {
    return EventActivityToAttendingQuery.query(this.viewer, this);
  }

  queryDeclined(): EventActivityToDeclinedQuery {
    return EventActivityToDeclinedQuery.query(this.viewer, this);
  }

  queryInvites(): EventActivityToInvitesQuery {
    return EventActivityToInvitesQuery.query(this.viewer, this);
  }
}

export class GuestToAuthCodesQueryBase extends CustomEdgeQueryBase<AuthCode> {
  constructor(viewer: Viewer, src: Guest | ID) {
    super(viewer, {
      src: src,
      countLoaderFactory: guestToAuthCodesCountLoaderFactory,
      dataLoaderFactory: guestToAuthCodesDataLoaderFactory,
      options: AuthCode.loaderOptions(),
    });
  }

  static query<T extends GuestToAuthCodesQueryBase>(
    this: new (viewer: Viewer, src: Guest | ID) => T,
    viewer: Viewer,
    src: Guest | ID,
  ): T {
    return new this(viewer, src);
  }
}

export class GuestToGuestDataQueryBase extends CustomEdgeQueryBase<GuestData> {
  constructor(viewer: Viewer, src: Guest | ID) {
    super(viewer, {
      src: src,
      countLoaderFactory: guestToGuestDataCountLoaderFactory,
      dataLoaderFactory: guestToGuestDataDataLoaderFactory,
      options: GuestData.loaderOptions(),
    });
  }

  static query<T extends GuestToGuestDataQueryBase>(
    this: new (viewer: Viewer, src: Guest | ID) => T,
    viewer: Viewer,
    src: Guest | ID,
  ): T {
    return new this(viewer, src);
  }
}
