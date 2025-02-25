import { advanceBy } from "jest-date-mock";
import { DB, Viewer } from "@snowtop/ent";
import { clearAuthHandlers } from "@snowtop/ent/auth";
import { encodeGQLID, mustDecodeIDFromGQLID } from "@snowtop/ent/graphql";
import {
  queryRootConfig,
  expectQueryFromRoot,
  expectMutation,
} from "@snowtop/ent-graphql-tests";
import schema from "../generated/schema";
import CreateUserAction, {
  UserCreateInput,
} from "../../ent/user/actions/create_user_action";
import { Contact, User } from "../../ent/";
import { randomEmail, randomPhoneNumber } from "../../util/random";
import EditUserAction from "../../ent/user/actions/edit_user_action";
import CreateContactAction, {
  ContactCreateInput,
} from "../../ent/contact/actions/create_contact_action";
import { GraphQLObjectType } from "graphql";
import { v1 } from "uuid";
import {
  NotifType,
  NotifType2,
  UserDaysOff,
  UserPreferredShift,
  UserIntEnum,
  CatBreed,
  DogBreed,
  DogBreedGroup,
  NestedObjNestedNestedEnum,
  ObjNestedEnum,
  RabbitBreed,
  SuperNestedObjectEnum,
  ContactEmailLabel,
} from "../../ent/generated/types";
import { LoggedOutExampleViewer, ExampleViewer } from "../../viewer/viewer";
import CreateCommentAction from "../../ent/comment/actions/create_comment_action";
import { buildInsertQuery } from "@snowtop/ent/core/ent";
import { getSimpleInsertAction } from "@snowtop/ent/action/experimental_action";
import { UserBuilder } from "src/ent/generated/user/actions/user_builder";
import { DateTime } from "luxon";

afterEach(() => {
  clearAuthHandlers();
});

const loggedOutViewer = new LoggedOutExampleViewer();

async function create(opts: Partial<UserCreateInput>): Promise<User> {
  let input: UserCreateInput = {
    firstName: "first",
    lastName: "last",
    emailAddress: randomEmail(),
    phoneNumber: randomPhoneNumber(),
    password: "pa$$w0rd",
    ...opts,
  };
  return await CreateUserAction.create(loggedOutViewer, input).saveX();
}

function getNodeConfig(
  viewer: Viewer,
  user: User,
  partialConfig?: Partial<queryRootConfig>,
): queryRootConfig {
  return {
    viewer: viewer,
    schema: schema,
    root: "node",
    args: {
      id: encodeGQLID(user),
    },
    inlineFragmentRoot: "User",
    ...partialConfig,
  };
}

function getUserConfig(
  viewer: Viewer,
  user: User,
  partialConfig?: Partial<queryRootConfig>,
): queryRootConfig {
  return {
    viewer: viewer,
    schema: schema,
    root: "user_list_deprecated",
    args: {
      id: encodeGQLID(user),
    },
    ...partialConfig,
  };
}

test("query user", async () => {
  let user = await create({
    firstName: "ffirst",
  });

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["emailAddress", user.emailAddress],
    ["accountStatus", await user.accountStatus()],
    ["nicknames", null],
  );

  await expectQueryFromRoot(
    getUserConfig(new ExampleViewer(user.id), user),
    ["[0].id", encodeGQLID(user)],
    ["[0].firstName", user.firstName],
    ["[0].lastName", user.lastName],
    ["[0].emailAddress", user.emailAddress],
    ["[0].accountStatus", await user.accountStatus()],
    ["[0].nicknames", null],
  );
});

test("query other user", async () => {
  let user1 = await create({
    firstName: "ffirst",
  });

  let user2 = await create({
    firstName: "ffirst",
  });

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user1.id), user2, {
      rootQueryNull: true,
    }),
    ["id", null],
  );

  const action = EditUserAction.create(user1.viewer, user1, {});
  // for privacy
  action.builder.addFriend(user2);
  await action.saveX();

  // user now visible because friends
  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user1.id), user2),
    ["id", encodeGQLID(user2)],
    ["firstName", user2.firstName],
    ["lastName", user2.lastName],
    ["emailAddress", user2.emailAddress],
    // field not visible because of privacy
    ["accountStatus", null],
  );
});

test("query multiple users", async () => {
  let user1 = await create({
    firstName: "ffirst",
  });

  let user2 = await create({
    firstName: "ffirst",
  });

  let user3 = await create({
    firstName: "ffirst",
  });

  const action = EditUserAction.create(user1.viewer, user1, {});
  // for privacy
  action.builder.addFriend(user2);
  action.builder.addFriend(user3);
  await action.saveX();

  await expectQueryFromRoot(
    {
      viewer: user1.viewer,
      schema: schema,
      root: "user_list_deprecated",
      args: {
        ids: [encodeGQLID(user1), encodeGQLID(user2), encodeGQLID(user3)],
      },
    },
    ["[0].id", encodeGQLID(user1)],
    ["[0].firstName", user1.firstName],
    ["[0].lastName", user1.lastName],
    ["[0].emailAddress", user1.emailAddress],

    ["[1].id", encodeGQLID(user2)],
    ["[1].firstName", user2.firstName],
    ["[1].lastName", user2.lastName],
    ["[1].emailAddress", user2.emailAddress],

    ["[2].id", encodeGQLID(user3)],
    ["[2].firstName", user3.firstName],
    ["[2].lastName", user3.lastName],
    ["[2].emailAddress", user3.emailAddress],
  );
});

test("query user list api no args", async () => {
  let user1 = await create({
    firstName: "ffirst",
  });

  await expectQueryFromRoot(
    {
      viewer: user1.viewer,
      schema: schema,
      root: "user_list_deprecated",
      args: {},
      expectedError: /invalid query. must provid id or ids/,
    },
    ["[0].id", null],
  );
});

test("query multiple users. connection", async () => {
  const dt = DateTime.now();
  let user1 = await create({
    firstName: "ffirst",
    // @ts-expect-error
    timeCreated: dt.plus({ hour: 1 }),
  });

  let user2 = await create({
    firstName: "ffirst",
    // @ts-expect-error
    timeCreated: dt.plus({ hour: 2 }),
  });

  let user3 = await create({
    firstName: "ffirst",
    // @ts-expect-error
    timeCreated: dt.plus({ hour: 3 }),
  });

  const action = EditUserAction.create(user1.viewer, user1, {});
  // for privacy
  action.builder.addFriend(user2);
  action.builder.addFriend(user3);
  await action.saveX();

  // sorted by created_at with most recent first
  await expectQueryFromRoot(
    {
      viewer: user1.viewer,
      schema: schema,
      root: "user_connection",
      args: {
        ids: [encodeGQLID(user1), encodeGQLID(user2), encodeGQLID(user3)],
      },
    },
    ["nodes[0].id", encodeGQLID(user3)],
    ["nodes[0].firstName", user3.firstName],
    ["nodes[0].lastName", user3.lastName],
    ["nodes[0].emailAddress", user3.emailAddress],

    ["nodes[1].id", encodeGQLID(user2)],
    ["nodes[1].firstName", user2.firstName],
    ["nodes[1].lastName", user2.lastName],
    ["nodes[1].emailAddress", user2.emailAddress],

    ["nodes[2].id", encodeGQLID(user1)],
    ["nodes[2].firstName", user1.firstName],
    ["nodes[2].lastName", user1.lastName],
    ["nodes[2].emailAddress", user1.emailAddress],
  );
});

test("query custom field", async () => {
  let user = await create({
    firstName: "first",
  });

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["fullName", user.fullName],
    ["nicknames", null],
  );
});

test("query list", async () => {
  const n = ["Lord Snow", "The Prince That was Promised"];
  let user = await create({
    firstName: "first",
    nicknames: n,
  });

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["fullName", user.fullName],
    ["nicknames", n],
  );
});

test("query custom function", async () => {
  let [user, user2] = await Promise.all([
    create({
      firstName: "first",
    }),
    create({
      firstName: "first2",
    }),
  ]);
  let vc = new ExampleViewer(user.id);
  let action = EditUserAction.create(vc, user, {});
  action.builder.addFriend(user2);
  await action.saveX();

  const count = await user.queryFriends().queryCount();
  expect(count).toBe(1);

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    // returns id when logged in user is same
    ["bar", user.id],
    ["nicknames", null],
  );
  clearAuthHandlers();

  // got some reason, it thinks this person is logged out
  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user2.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    // returns null when viewed as different user
    ["bar", null],
    ["nicknames", null],
  );
});

test("query custom async function", async () => {
  let user = await create({
    firstName: "first",
  });
  let vc = new ExampleViewer(user.id);
  await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail("foo.com"),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user, {
      nullQueryPaths: ["contactSameDomain"],
    }),
    ["id", encodeGQLID(user)],
    ["contactSameDomain.id", null], // no contact on same domain
  );

  let contact = await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail(),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["contactSameDomain.id", encodeGQLID(contact)], // query again, new contact shows up
  );
});

test("query custom async function list", async () => {
  let user = await create({
    firstName: "first",
    lastName: "last",
    emailAddress: randomEmail(),
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);
  let selfContact = await user.loadSelfContact();
  let contact = await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail(),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["contactsSameDomain[0].id", encodeGQLID(contact!)],
    ["contactsSameDomain[1].id", encodeGQLID(selfContact!)],
  );
});

test("query custom async function list with domain passed in", async () => {
  let user = await create({
    firstName: "first",
    lastName: "last",
    emailAddress: randomEmail(),
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);
  let selfContact = await user.loadSelfContact();
  let contact = await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail(),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  const domain = "email.com";
  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user, {
      extraVariables: {
        domain: {
          graphqlType: "String!",
          value: domain,
        },
      },
    }),
    ["id", encodeGQLID(user)],
    [`contactsGivenDomain(domain: $domain)[0].id`, encodeGQLID(contact!)],
    [`contactsGivenDomain(domain: $domain)[1].id`, encodeGQLID(selfContact!)],
  );
});
test("query custom async function nullable list", async () => {
  let user = await create({
    firstName: "first",
  });

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user, {
      nullQueryPaths: ["contactsSameDomainNullable"],
    }),
    ["id", encodeGQLID(user)],
    ["contactsSameDomainNullable[0].id", null],
  );
});

test("query custom async function nullable contents", async () => {
  let user = await create({
    firstName: "first",
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);
  let selfContact = await user.loadSelfContact();
  await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail("foo.com"),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    [
      "contactsSameDomainNullableContents",
      [
        null,
        {
          id: encodeGQLID(selfContact!),
        },
      ],
    ],
  );
});

test("query custom async function nullable list contents", async () => {
  let user = await create({
    firstName: "first",
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);
  let selfContact = await user.loadSelfContact();
  await CreateContactAction.create(vc, {
    emails: [
      {
        emailAddress: randomEmail("foo.com"),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user.id,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user, {
      nullQueryPaths: ["contactsSameDomainNullableContents[0]"],
    }),
    ["id", encodeGQLID(user)],
    ["contactsSameDomainNullableContents[0].id", null],
    ["contactsSameDomainNullableContents[1].id", encodeGQLID(selfContact!)],
  );
});

test("query custom async function nullable list and contents", async () => {
  let user = await create({
    firstName: "first",
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);

  // not testing the null list case because it's hard

  // for user 2, because there's a valid email, we get a non-null list even though
  // the list is nullable
  let user2 = await create({
    firstName: "first",
  });
  let vc2 = new ExampleViewer(user2.id);
  user2 = await User.loadX(vc2, user2.id);
  let selfContact2 = await user2.loadSelfContact();
  await CreateContactAction.create(vc2, {
    emails: [
      {
        emailAddress: randomEmail("foo.com"),
        label: ContactEmailLabel.Unknown,
      },
    ],
    firstName: "Jon",
    lastName: "Snow",
    userID: user2.id,
  }).saveX();
  await expectQueryFromRoot(
    getNodeConfig(vc2, user2),
    ["id", encodeGQLID(user2)],
    // can query this way because of id above
    ["contactsSameDomainNullableContentsAndList[0]", null],
    [
      "contactsSameDomainNullableContentsAndList[1].id",
      encodeGQLID(selfContact2!),
    ],
  );
});

test("query user who's not visible", async () => {
  let [user, user2] = await Promise.all([
    create({
      firstName: "user1",
    }),
    create({
      firstName: "user2",
    }),
  ]);

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user2, { rootQueryNull: true }),
    ["id", null],
    ["firstName", null],
    ["lastName", null],
    ["emailAddress", null],
    ["accountStatus", null],
  );
});

test("query user and nested object", async () => {
  let user = await create({
    firstName: "ffirst",
  });
  let vc = new ExampleViewer(user.id);
  user = await User.loadX(vc, user.id);
  let selfContact = await user.loadSelfContact();
  if (!selfContact) {
    throw new Error("expected self contact to be loaded");
  }

  const selfContactEmails = await selfContact.loadEmails();
  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["emailAddress", user.emailAddress],
    ["accountStatus", await user.accountStatus()],
    ["selfContact.id", encodeGQLID(selfContact)],
    ["selfContact.firstName", selfContact.firstName],
    ["selfContact.lastName", selfContact.lastName],
    ["selfContact.emails[0].emailAddress", selfContactEmails[0].emailAddress],
    ["selfContact.user.id", encodeGQLID(user)],
  );
});

test("load assoc connection", async () => {
  let [user, user2, user3, user4, user5] = await Promise.all([
    create({
      firstName: "user1",
    }),
    create({
      firstName: "user2",
    }),
    create({
      firstName: "user3",
    }),
    create({
      firstName: "user4",
    }),
    create({
      firstName: "user5",
    }),
  ]);

  let vc = new ExampleViewer(user.id);
  let action = EditUserAction.create(vc, user, {});
  const friends = [user2, user3, user4, user5];
  for (const friend of friends) {
    // add time btw adding a new friend so that it's deterministic
    advanceBy(86400);
    action.builder.addFriendID(friend.id, {
      time: new Date(),
    });
  }
  await action.saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["emailAddress", user.emailAddress],
    ["accountStatus", await user.accountStatus()],
    // most recent first
    ["friends.rawCount", 4],
    [
      "friends.nodes",
      [
        {
          id: encodeGQLID(user5),
          firstName: user5.firstName,
          lastName: user5.lastName,
        },
        {
          id: encodeGQLID(user4),
          firstName: user4.firstName,
          lastName: user4.lastName,
        },
        {
          id: encodeGQLID(user3),
          firstName: user3.firstName,
          lastName: user3.lastName,
        },
        {
          id: encodeGQLID(user2),
          firstName: user2.firstName,
          lastName: user2.lastName,
        },
      ],
    ],
    [
      "friends.edges",
      [
        {
          node: {
            id: encodeGQLID(user5),
          },
        },
        {
          node: {
            id: encodeGQLID(user4),
          },
        },
        {
          node: {
            id: encodeGQLID(user3),
          },
        },
        {
          node: {
            id: encodeGQLID(user2),
          },
        },
      ],
    ],
  );

  let cursor: string;
  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["friends(first:1).edges[0].node.id", encodeGQLID(user5)],
    [
      "friends(first:1).edges[0].cursor",
      function (c: string) {
        cursor = c;
      },
    ],
    [`friends(first:1).pageInfo.hasNextPage`, true],
  );

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    [
      `friends(after: "${cursor!}", first:1).edges[0].node.id`,
      encodeGQLID(user4),
    ],
    [
      `friends(after: "${cursor!}", first:1).edges[0].cursor`,
      function (c: string) {
        cursor = c;
      },
    ],
    [`friends(after: "${cursor!}", first:1).pageInfo.hasNextPage`, true],
  );

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    [
      `friends(after: "${cursor!}", first:1).edges[0].node.id`,
      encodeGQLID(user3),
    ],
    [
      `friends(after: "${cursor!}", first:1).edges[0].cursor`,
      function (c: string) {
        cursor = c;
      },
    ],
    [`friends(after: "${cursor!}", first:1).pageInfo.hasNextPage`, true],
  );

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    [
      `friends(after: "${cursor!}", first:1).edges[0].node.id`,
      encodeGQLID(user2),
    ],
    [
      `friends(after: "${cursor!}", first:1).edges[0].cursor`,
      function (c: string) {
        cursor = c;
      },
    ],
    [`friends(after: "${cursor!}", first:1).pageInfo.hasNextPage`, false],
  );

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user, {
      undefinedQueryPaths: [`friends(after: "${cursor!}", first:1).edges[0]`],
    }),
    ["id", encodeGQLID(user)],
    [`friends(after: "${cursor!}", first:1).edges[0].node.id`, undefined],
    [`friends(after: "${cursor!}", first:1).pageInfo.hasNextPage`, false],
  );
});

async function createMany(
  user: User,
  names: Pick<ContactCreateInput, "firstName" | "lastName">[],
): Promise<Contact[]> {
  let results: Contact[] = [];
  for (const name of names) {
    // for deterministic sorting
    advanceBy(86400);
    // TODO eventually a multi-create API
    let contact = await CreateContactAction.create(new ExampleViewer(user.id), {
      emails: [
        {
          emailAddress: randomEmail(),
          label: ContactEmailLabel.Unknown,
        },
      ],
      firstName: name.firstName,
      lastName: name.lastName,
      userID: user.id,
    }).saveX();
    results.push(contact);
  }

  return results;
}

test("load fkey connection", async () => {
  const user = await create({});
  let inputs = [
    { firstName: "Robb", lastName: "Stark" },
    { firstName: "Sansa", lastName: "Stark" },
    { firstName: "Arya", lastName: "Stark" },
    { firstName: "Bran", lastName: "Stark" },
    { firstName: "Rickon", lastName: "Stark" },
  ];
  const contacts = await createMany(user, inputs);
  const selfContact = await user.loadSelfContact();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user.id), user),
    ["id", encodeGQLID(user)],
    ["firstName", user.firstName],
    ["lastName", user.lastName],
    ["emailAddress", user.emailAddress],
    ["accountStatus", await user.accountStatus()],
    ["contacts.rawCount", 6],
    [
      // most recent first
      "contacts.nodes",
      [
        {
          id: encodeGQLID(contacts[4]),
        },
        {
          id: encodeGQLID(contacts[3]),
        },
        {
          id: encodeGQLID(contacts[2]),
        },
        {
          id: encodeGQLID(contacts[1]),
        },
        {
          id: encodeGQLID(contacts[0]),
        },
        {
          id: encodeGQLID(selfContact!),
        },
      ],
    ],
  );
});

test("likes", async () => {
  const [user1, user2, user3, user4] = await Promise.all([
    create({}),
    create({}),
    create({}),
    create({}),
  ]);
  const action = EditUserAction.create(user1.viewer, user1, {});
  for (const liker of [user2.id, user3.id, user4.id]) {
    advanceBy(1000);
    action.builder.addLikerID(liker, {
      time: new Date(),
    });
  }
  // for privacy
  action.builder.addFriend(user2, user3, user4);
  await action.saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user1.id), user1),
    ["likers.rawCount", 3],
    [
      "likers.nodes",
      [
        // most recent first
        {
          id: encodeGQLID(user4),
        },
        {
          id: encodeGQLID(user3),
        },
        {
          id: encodeGQLID(user2),
        },
      ],
    ],
  );

  // query likes also
  for (const liker of [user2, user3, user4]) {
    await expectQueryFromRoot(
      getNodeConfig(new ExampleViewer(liker.id), liker),
      ["likes.rawCount", 1],
      [
        "likes.nodes",
        [
          {
            id: encodeGQLID(user1),
          },
        ],
      ],
    );
  }
});

test("create with prefs+prefsList", async () => {
  await expectMutation(
    {
      schema: schema,
      mutation: "userCreate",
      args: {
        firstName: "Jon",
        lastName: "Snow",
        emailAddress: randomEmail(),
        phoneNumber: randomPhoneNumber(),
        password: "pa$$w0rd",
        prefs: {
          finishedNux: true,
          notifTypes: [NotifType.EMAIL],
        },
        prefsList: [
          {
            finishedNux: true,
            notifTypes: [NotifType2.EMAIL],
          },
          {
            finishedNux: false,
            notifTypes: [NotifType2.MOBILE],
          },
        ],
      },
    },
    [
      "user.id",
      async function (id: string) {
        const entID = mustDecodeIDFromGQLID(id);
        const user = await User.loadX(new ExampleViewer(entID), entID);
        expect(await user.prefs()).toStrictEqual({
          enableNotifs: undefined,
          finishedNux: true,
          notifTypes: [NotifType.EMAIL],
        });
        expect(await user.prefsList()).toStrictEqual([
          {
            enableNotifs: undefined,
            finishedNux: true,
            notifTypes: [NotifType.EMAIL],
          },
          {
            enableNotifs: undefined,
            finishedNux: false,
            notifTypes: [NotifType.MOBILE],
          },
        ]);
      },
    ],
  );
});

test("create with prefs diff", async () => {
  await expectMutation(
    {
      schema: schema,
      mutation: "userCreate",
      args: {
        firstName: "Jon",
        lastName: "Snow",
        emailAddress: randomEmail(),
        phoneNumber: randomPhoneNumber(),
        password: "pa$$w0rd",
        prefsDiff: {
          type: "blah",
        },
      },
    },
    [
      "user.id",
      async function (id: string) {
        const entID = mustDecodeIDFromGQLID(id);
        const user = await User.loadX(new ExampleViewer(entID), entID);
        expect(await user.prefsDiff()).toStrictEqual({
          type: "blah",
        });
      },
    ],
  );
});

test("create with prefs diff. fail", async () => {
  await expectMutation(
    {
      schema: schema,
      mutation: "userCreate",
      args: {
        firstName: "Jon",
        lastName: "Snow",
        emailAddress: randomEmail(),
        phoneNumber: randomPhoneNumber(),
        password: "pa$$w0rd",
        prefsDiff: {
          foo: "foo",
        },
      },
      expectedError:
        /Field \"type\" of required type \"String!\" was not provided./,
    },
    [
      "user.id",
      async function (id: string) {
        throw new Error("not called");
      },
    ],
  );
});

test("enum list", async () => {
  await expectMutation(
    {
      schema: schema,
      mutation: "userCreate",
      args: {
        firstName: "Jon",
        lastName: "Snow",
        emailAddress: randomEmail(),
        phoneNumber: randomPhoneNumber(),
        password: "pa$$w0rd",
        daysOff: ["SATURDAY", "SUNDAY"],
        preferredShift: ["GRAVEYARD"],
      },
    },
    // TODO need to be able to query this correctly
    //["user.daysOff", ["SATURDAY", "SUNDAY"]],
    [
      "user.id",
      async function (id: string) {
        const decoded = mustDecodeIDFromGQLID(id);
        const user = await User.loadX(new ExampleViewer(decoded), decoded);
        expect(user.daysOff).toEqual([
          UserDaysOff.Saturday,
          UserDaysOff.Sunday,
        ]);
        expect(user.preferredShift).toEqual([UserPreferredShift.Graveyard]);
      },
    ],
  );
});

test("int enum", async () => {
  await expectMutation(
    {
      schema: schema,
      mutation: "userCreate",
      args: {
        firstName: "Jon",
        lastName: "Snow",
        emailAddress: randomEmail(),
        phoneNumber: randomPhoneNumber(),
        password: "pa$$w0rd",
        intEnum: "VERIFIED",
      },
    },
    ["user.intEnum", "VERIFIED"],
    [
      "user.id",
      async function (id: string) {
        const decoded = mustDecodeIDFromGQLID(id);
        const user = await User.loadX(new ExampleViewer(decoded), decoded);
        expect(user.intEnum).toEqual(UserIntEnum.VERIFIED);
      },
    ],
  );
});

test("expected graphql schema", async () => {
  const typ = schema.getType("UserCreateInput") as GraphQLObjectType;
  if (!typ) {
    throw new Error(`can't find type for UserCreateInput`);
  }
  const fields = typ.getFields();
  // firstName should show up
  expect(fields["firstName"]).toBeDefined();
  // accountStatus shouldn't even tho it's in CreateAction because it's not graphql editable
  expect(fields["accountStatus"]).toBeUndefined();
});

describe("super nested complex", () => {
  test("super nested", async () => {
    const obj = {
      uuid: v1(),
      int: 34,
      string: "whaa",
      float: 2.3,
      bool: false,
      enum: "MAYBE",
      intList: [7, 8, 9],
      obj: {
        nestedBool: false,
        nestedIntList: [1, 2, 3],
        nestedUuid: v1(),
        nestedEnum: "NO",
        nestedString: "stri",
        nestedInt: 24,
        nestedStringList: ["hello", "goodbye"],
        nestedObj: {
          nestedNestedUuid: v1(),
          nestedNestedFloat: 4.2,
          nestedNestedEnum: "YES",
          nestedNestedInt: 32,
          nestedNestedString: "whaa",
          nestedNestedIntList: [4, 5, 6],
          nestedNestedStringList: ["sss"],
        },
      },
    };
    // graphql vs typescript
    const transformedObj = {
      ...obj,
      enum: SuperNestedObjectEnum.Maybe,
      obj: {
        ...obj.obj,
        nestedEnum: ObjNestedEnum.No,
        nestedObj: {
          ...obj.obj.nestedObj,
          nestedNestedEnum: NestedObjNestedNestedEnum.Yes,
        },
      },
    };

    await expectMutation(
      {
        schema: schema,
        mutation: "userCreate",
        args: {
          firstName: "Jon",
          lastName: "Snow",
          emailAddress: randomEmail(),
          phoneNumber: randomPhoneNumber(),
          password: "pa$$w0rd",
          superNestedObject: obj,
        },
      },
      [
        "user.id",
        async function (id: string) {
          const entID = mustDecodeIDFromGQLID(id);
          const user = await User.loadX(new ExampleViewer(entID), entID);
          // we return fields which were not set as undefined so can't use strictEqual
          expect(await user.superNestedObject()).toMatchObject(transformedObj);
        },
      ],
    );
  });

  test("union cat", async () => {
    const obj = {
      uuid: v1(),
      int: 34,
      string: "whaa",
      float: 2.3,
      bool: false,
      enum: "MAYBE",
      intList: [7, 8, 9],
      union: {
        // input has cat specified
        cat: {
          name: "tabby",
          birthday: new Date(),
          breed: "BENGAL",
          kitten: true,
        },
      },
    };
    // graphql vs typescript
    // union type is separate
    const transformedObj = {
      ...obj,
      enum: SuperNestedObjectEnum.Maybe,
      union: {
        ...obj.union.cat,
        breed: CatBreed.Bengal,
        birthday: obj.union.cat.birthday.toISOString(),
      },
    };

    await expectMutation(
      {
        schema: schema,
        mutation: "userCreate",
        args: {
          firstName: "Jon",
          lastName: "Snow",
          emailAddress: randomEmail(),
          phoneNumber: randomPhoneNumber(),
          password: "pa$$w0rd",
          superNestedObject: obj,
        },
      },
      [
        "user.id",
        async function (id: string) {
          const entID = mustDecodeIDFromGQLID(id);
          const user = await User.loadX(new ExampleViewer(entID), entID);
          // we return fields which were not set as undefined so can't use strictEqual
          expect(await user.superNestedObject()).toMatchObject(transformedObj);
        },
      ],
    );
  });

  test("union dog", async () => {
    const obj = {
      uuid: v1(),
      int: 34,
      string: "whaa",
      float: 2.3,
      bool: false,
      enum: "MAYBE",
      intList: [7, 8, 9],
      union: {
        // input has dog specified
        dog: {
          name: "scout",
          birthday: new Date(),
          breed: "GERMAN_SHEPHERD",
          breedGroup: "HERDING",
          puppy: false,
        },
      },
    };
    // graphql vs typescript
    // union type is separate
    const transformedObj = {
      ...obj,
      enum: SuperNestedObjectEnum.Maybe,
      union: {
        ...obj.union.dog,
        breed: DogBreed.GermanShepherd,
        breedGroup: DogBreedGroup.Herding,
        birthday: obj.union.dog.birthday.toISOString(),
      },
    };

    await expectMutation(
      {
        schema: schema,
        mutation: "userCreate",
        args: {
          firstName: "Jon",
          lastName: "Snow",
          emailAddress: randomEmail(),
          phoneNumber: randomPhoneNumber(),
          password: "pa$$w0rd",
          superNestedObject: obj,
        },
      },
      [
        "user.id",
        async function (id: string) {
          const entID = mustDecodeIDFromGQLID(id);
          const user = await User.loadX(new ExampleViewer(entID), entID);
          // we return fields which were not set as undefined so can't use strictEqual
          expect(await user.superNestedObject()).toMatchObject(transformedObj);
        },
      ],
    );
  });

  test("union rabbit", async () => {
    const obj = {
      uuid: v1(),
      int: 34,
      string: "whaa",
      float: 2.3,
      bool: false,
      enum: "MAYBE",
      intList: [7, 8, 9],
      union: {
        // input has rabbit specified
        rabbit: {
          name: "hallo",
          birthday: new Date(),
          breed: "AMERICAN_CHINCILLA",
        },
      },
    };
    // graphql vs typescript
    // union type is separate
    const transformedObj = {
      ...obj,
      enum: SuperNestedObjectEnum.Maybe,
      union: {
        ...obj.union.rabbit,
        breed: RabbitBreed.AmericanChincilla,
        birthday: obj.union.rabbit.birthday.toISOString(),
      },
    };

    await expectMutation(
      {
        schema: schema,
        mutation: "userCreate",
        args: {
          firstName: "Jon",
          lastName: "Snow",
          emailAddress: randomEmail(),
          phoneNumber: randomPhoneNumber(),
          password: "pa$$w0rd",
          superNestedObject: obj,
        },
      },
      [
        "user.id",
        async function (id: string) {
          const entID = mustDecodeIDFromGQLID(id);
          const user = await User.loadX(new ExampleViewer(entID), entID);
          // we return fields which were not set as undefined so can't use strictEqual
          expect(await user.superNestedObject()).toMatchObject(transformedObj);
        },
      ],
    );
  });
});

test("custom connection. comments", async () => {
  const [user1, user2] = await Promise.all([create({}), create({})]);

  const comment = await CreateCommentAction.create(user2.viewer, {
    authorID: user2.id,
    body: "sup",
    articleID: user1.id,
    articleType: user1.nodeType,
  }).saveX();

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(user2.id), user2),
    ["id", encodeGQLID(user2)],
    ["firstName", user2.firstName],
    ["commentsAuthored.rawCount", 1],
    ["commentsAuthored.nodes[0].body", comment.body],
  );
});

test("create user with deprecated account_status", async () => {
  // @ts-ignore
  const action = getSimpleInsertAction(loggedOutViewer, UserBuilder, {
    firstName: "Jon",
    lastName: "Snow",
    accountStatus: "hello",
    emailAddress: randomEmail(),
    password: "pa$$w0rd",
    phoneNumber: randomPhoneNumber(),
  });
  const data = await action.builder.orchestrator.getEditedData();
  const [query, values] = buildInsertQuery({
    tableName: "users",
    fields: data,
  });

  const client = await DB.getInstance().getNewClient();
  await client.exec(query, values);
  client.release();

  const id = data.id;
  const user = await User.loadX(new ExampleViewer(id), id);

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(id), user),
    ["id", encodeGQLID(user)],
    // graphql returns UNKNOWN instead of throwing
    // unhandled error [{"message":"Enum \"UserAccountStatus\" cannot represent value: \"hello\"","locations":[{"line":2,"column":34}],"path":["node","accountStatus"]}]
    ["accountStatus", "UNKNOWN"],
  );
});

test("create user with invalid days off value", async () => {
  // @ts-ignore
  const action = getSimpleInsertAction(loggedOutViewer, UserBuilder, {
    firstName: "Jon",
    lastName: "Snow",
    emailAddress: randomEmail(),
    password: "pa$$w0rd",
    phoneNumber: randomPhoneNumber(),
    daysOff: [UserDaysOff.Monday, "hello"],
  });
  const data = await action.builder.orchestrator.getEditedData();
  const [query, values] = buildInsertQuery({
    tableName: "users",
    fields: data,
  });

  const client = await DB.getInstance().getNewClient();
  await client.exec(query, values);
  client.release();

  const id = data.id;

  const user = await User.loadX(new ExampleViewer(id), id);

  await expectQueryFromRoot(
    getNodeConfig(new ExampleViewer(id), user, {
      expectedError: 'Enum "UserDaysOff" cannot represent value: "hello"',
    }),
    [
      "",
      {
        id: encodeGQLID(user),
        daysOff: ["MONDAY", "hello"],
      },
    ],
  );
});

test("create user with invalid days off value", async () => {
  // @ts-ignore
  const action = getSimpleInsertAction(loggedOutViewer, UserBuilder, {
    firstName: "Jon",
    lastName: "Snow",
    emailAddress: randomEmail(),
    password: "pa$$w0rd",
    phoneNumber: randomPhoneNumber(),
    preferredShift: [UserPreferredShift.Morning, "hello"],
  });
  const data = await action.builder.orchestrator.getEditedData();
  const [query, values] = buildInsertQuery({
    tableName: "users",
    fields: data,
  });

  const client = await DB.getInstance().getNewClient();
  await client.exec(query, values);
  client.release();

  const id = data.id;

  const user = await User.loadX(new ExampleViewer(id), id);

  await expectQueryFromRoot(getNodeConfig(new ExampleViewer(id), user), [
    "",
    {
      id: encodeGQLID(user),
      preferredShift: ["MORNING", "UNKNOWN"],
    },
  ]);
});
