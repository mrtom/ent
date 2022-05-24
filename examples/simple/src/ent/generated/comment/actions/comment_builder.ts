/**
 * Copyright whaa whaa
 * Generated by github.com/lolopinto/ent/ent, DO NOT EDIT.
 */

import { AssocEdgeInputOptions, Ent, ID, Viewer } from "@snowtop/ent";
import {
  Action,
  Builder,
  Changeset,
  Orchestrator,
  WriteOperation,
  saveBuilder,
  saveBuilderX,
} from "@snowtop/ent/action";
import { Comment, User } from "../../..";
import { EdgeType, NodeType } from "../../const";
import schema from "../../../../schema/comment_schema";

export interface CommentInput {
  authorID?: ID | Builder<User>;
  body?: string;
  articleID?: ID | Builder<Ent>;
  articleType?: string;
  // allow other properties. useful for action-only fields
  [x: string]: any;
}

function randomNum(): string {
  return Math.random().toString(10).substring(2);
}

export class CommentBuilder<TData extends CommentInput = CommentInput>
  implements Builder<Comment>
{
  orchestrator: Orchestrator<Comment, TData>;
  readonly placeholderID: ID;
  readonly ent = Comment;
  readonly nodeType = NodeType.Comment;
  private input: TData;
  private m: Map<string, any> = new Map();

  public constructor(
    public readonly viewer: Viewer,
    public readonly operation: WriteOperation,
    action: Action<Comment, Builder<Comment>, TData>,
    public readonly existingEnt?: Comment | undefined,
  ) {
    this.placeholderID = `$ent.idPlaceholderID$ ${randomNum()}-Comment`;
    this.input = action.getInput();
    const updateInput = (d: CommentInput) => this.updateInput.apply(this, [d]);

    this.orchestrator = new Orchestrator({
      viewer,
      operation: this.operation,
      tableName: "comments",
      key: "id",
      loaderOptions: Comment.loaderOptions(),
      builder: this,
      action,
      schema,
      editedFields: () => this.getEditedFields.apply(this),
      updateInput,
    });
  }

  getInput(): TData {
    return this.input;
  }

  updateInput(input: CommentInput) {
    // override input
    this.input = {
      ...this.input,
      ...input,
    };
  }

  deleteInputKey(key: keyof CommentInput) {
    delete this.input[key];
  }

  // store data in Builder that can be retrieved by another validator, trigger, observer later in the action
  storeData(k: string, v: any) {
    this.m.set(k, v);
  }

  // retrieve data stored in this Builder with key
  getStoredData(k: string) {
    return this.m.get(k);
  }

  // this gets the inputs that have been written for a given edgeType and operation
  // WriteOperation.Insert for adding an edge and WriteOperation.Delete for deleting an edge
  getEdgeInputData(edgeType: EdgeType, op: WriteOperation) {
    return this.orchestrator.getInputEdges(edgeType, op);
  }

  clearInputEdges(edgeType: EdgeType, op: WriteOperation, id?: ID) {
    this.orchestrator.clearInputEdges(edgeType, op, id);
  }
  addPost(...nodes: (Ent | Builder<Ent>)[]): CommentBuilder<TData> {
    for (const node of nodes) {
      if (this.isBuilder(node)) {
        this.orchestrator.addOutboundEdge(
          node,
          EdgeType.CommentToPost,
          // nodeType will be gotten from Executor later
          "",
        );
      } else {
        this.orchestrator.addOutboundEdge(
          node.id,
          EdgeType.CommentToPost,
          node.nodeType,
        );
      }
    }
    return this;
  }

  addPostID(
    id: ID | Builder<Ent>,
    nodeType: NodeType,
    options?: AssocEdgeInputOptions,
  ): CommentBuilder<TData> {
    this.orchestrator.addOutboundEdge(
      id,
      EdgeType.CommentToPost,
      nodeType,
      options,
    );
    return this;
  }

  removePost(...nodes: (ID | Ent)[]): CommentBuilder<TData> {
    for (const node of nodes) {
      if (typeof node === "object") {
        this.orchestrator.removeOutboundEdge(node.id, EdgeType.CommentToPost);
      } else {
        this.orchestrator.removeOutboundEdge(node, EdgeType.CommentToPost);
      }
    }
    return this;
  }

  async build(): Promise<Changeset<Comment>> {
    return this.orchestrator.build();
  }

  async valid(): Promise<boolean> {
    return this.orchestrator.valid();
  }

  async validX(): Promise<void> {
    return this.orchestrator.validX();
  }

  async save(): Promise<void> {
    await saveBuilder(this);
  }

  async saveX(): Promise<void> {
    await saveBuilderX(this);
  }

  async editedEnt(): Promise<Comment | null> {
    return this.orchestrator.editedEnt();
  }

  async editedEntX(): Promise<Comment> {
    return this.orchestrator.editedEntX();
  }

  private async getEditedFields(): Promise<Map<string, any>> {
    const fields = this.input;

    const result = new Map<string, any>();

    const addField = function (key: string, value: any) {
      if (value !== undefined) {
        result.set(key, value);
      }
    };
    addField("AuthorID", fields.authorID);
    addField("Body", fields.body);
    addField("ArticleID", fields.articleID);
    addField("ArticleType", fields.articleType);
    return result;
  }

  isBuilder(node: ID | Ent | Builder<Ent>): node is Builder<Ent> {
    return (node as Builder<Ent>).placeholderID !== undefined;
  }

  // get value of AuthorID. Retrieves it from the input if specified or takes it from existingEnt
  getNewAuthorIDValue(): ID | Builder<User> | undefined {
    if (this.input.authorID !== undefined) {
      return this.input.authorID;
    }
    return this.existingEnt?.authorID;
  }

  // get value of Body. Retrieves it from the input if specified or takes it from existingEnt
  getNewBodyValue(): string | undefined {
    if (this.input.body !== undefined) {
      return this.input.body;
    }
    return this.existingEnt?.body;
  }

  // get value of ArticleID. Retrieves it from the input if specified or takes it from existingEnt
  getNewArticleIDValue(): ID | Builder<Ent> | undefined {
    if (this.input.articleID !== undefined) {
      return this.input.articleID;
    }
    return this.existingEnt?.articleID;
  }

  // get value of ArticleType. Retrieves it from the input if specified or takes it from existingEnt
  getNewArticleTypeValue(): string | undefined {
    if (this.input.articleType !== undefined) {
      return this.input.articleType;
    }
    return this.existingEnt?.articleType;
  }
}