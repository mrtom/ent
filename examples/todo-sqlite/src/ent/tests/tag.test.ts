import { createAccount, createTodoForSelf, createTag } from "../testutils/util";
import { AccountToTagsQuery } from "../account/query/account_to_tags_query";
import TodoAddTagAction from "../todo/actions/todo_add_tag_action";
import TodoRemoveTagAction from "../todo/actions/todo_remove_tag_action";

test("create", async () => {
  await createTag("SPORTS");
});

describe("duplicate", () => {
  test("same display name", async () => {
    const account = await createAccount();

    await createTag("SPORTS", account);

    try {
      await createTag("SPORTS", account);
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).message).toMatch(/UNIQUE constraint failed/);
    }
  });

  test("diff display name, same canonical", async () => {
    const account = await createAccount();

    await createTag("SPORTS", account);

    try {
      await createTag("sports", account);
      throw new Error("should have thrown");
    } catch (err) {
      expect((err as Error).message).toMatch(/UNIQUE constraint failed/);
    }
  });

  test("diff name", async () => {
    const account = await createAccount();

    await createTag("SPORTS", account);
    await createTag("kids", account);

    const count = await AccountToTagsQuery.query(
      account.viewer,
      account.id,
    ).queryCount();
    expect(count).toBe(2);

    const ents = await AccountToTagsQuery.query(
      account.viewer,
      account.id,
    ).queryEnts();
    expect(ents.map((ent) => ent.canonicalName).sort()).toEqual([
      "kids",
      "sports",
    ]);
  });
});

describe("tag + todo", () => {
  test("add tag to todo", async () => {
    const account = await createAccount();

    const todo1 = await createTodoForSelf({ creatorID: account.id });
    const todo2 = await createTodoForSelf({
      creatorID: account.id,
      text: "remember to have fun",
    });
    const tag1 = await createTag("kids", account);
    const tag2 = await createTag("work", account);

    await TodoAddTagAction.saveXFromID(account.viewer, todo1.id, tag1.id);
    await TodoAddTagAction.saveXFromID(account.viewer, todo1.id, tag2.id);
    await TodoAddTagAction.saveXFromID(account.viewer, todo2.id, tag2.id);

    const count = await todo1.queryTags().queryRawCount();
    expect(count).toBe(2);

    const ents = await todo1.queryTags().queryEnts();
    expect(ents.map((ent) => ent.displayName).sort()).toEqual(["kids", "work"]);

    const count2 = await tag1.queryTodos().queryRawCount();
    const count3 = await tag2.queryTodos().queryRawCount();
    expect(count2).toBe(1);
    expect(count3).toBe(2);
  });

  test("remove tag from todo", async () => {
    const account = await createAccount();

    const todo = await createTodoForSelf({ creatorID: account.id });
    const tag = await createTag("kids", account);

    await TodoAddTagAction.saveXFromID(account.viewer, todo.id, tag.id);

    const count = await todo.queryTags().queryRawCount();
    expect(count).toBe(1);

    await TodoRemoveTagAction.saveXFromID(account.viewer, todo.id, tag.id);

    const count2 = await todo.queryTags().queryRawCount();
    expect(count2).toBe(0);
  });
});
