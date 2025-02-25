CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

CREATE TABLE account_created_workspaces_edges (
    id1 TEXT NOT NULL, 
    id1_type TEXT NOT NULL, 
    edge_type TEXT NOT NULL, 
    id2 TEXT NOT NULL, 
    id2_type TEXT NOT NULL, 
    time TIMESTAMP NOT NULL, 
    data TEXT, 
    deleted_at TIMESTAMP, 
    CONSTRAINT account_created_workspaces_edges_id1_edge_type_id2_pkey PRIMARY KEY (id1, edge_type, id2)
);

CREATE INDEX account_created_workspaces_edges_time_idx ON account_created_workspaces_edges (time);

CREATE TABLE accounts (
    id TEXT NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    deleted_at TIMESTAMP, 
    name TEXT NOT NULL, 
    phone_number TEXT NOT NULL, 
    account_state TEXT, 
    account_prefs TEXT, 
    account_prefs_3 TEXT DEFAULT '{"finished_nux":false,"enable_notifs":false,"preferred_language":"en_US"}' NOT NULL, 
    account_prefs_list TEXT, 
    credits INTEGER DEFAULT '1000' NOT NULL, 
    CONSTRAINT accounts_id_pkey PRIMARY KEY (id), 
    CONSTRAINT accounts_unique_phone_number UNIQUE (phone_number)
);

CREATE INDEX accounts_deleted_at_idx ON accounts (deleted_at);

CREATE TABLE assoc_edge_config (
    edge_type TEXT NOT NULL, 
    edge_name TEXT NOT NULL, 
    symmetric_edge BOOLEAN DEFAULT 'false' NOT NULL, 
    inverse_edge_type TEXT, 
    edge_table TEXT NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    CONSTRAINT assoc_edge_config_edge_type_pkey PRIMARY KEY (edge_type), 
    CONSTRAINT assoc_edge_config_inverse_edge_type_fkey FOREIGN KEY(inverse_edge_type) REFERENCES assoc_edge_config (edge_type) ON DELETE RESTRICT, 
    CONSTRAINT assoc_edge_config_unique_edge_name UNIQUE (edge_name)
);

CREATE TABLE object_scoped_todos_edges (
    id1 TEXT NOT NULL, 
    id1_type TEXT NOT NULL, 
    edge_type TEXT NOT NULL, 
    id2 TEXT NOT NULL, 
    id2_type TEXT NOT NULL, 
    time TIMESTAMP NOT NULL, 
    data TEXT, 
    deleted_at TIMESTAMP, 
    CONSTRAINT object_scoped_todos_edges_id1_edge_type_id2_pkey PRIMARY KEY (id1, edge_type, id2)
);

CREATE INDEX object_scoped_todos_edges_time_idx ON object_scoped_todos_edges (time);

CREATE TABLE todo_edges (
    id1 TEXT NOT NULL, 
    id1_type TEXT NOT NULL, 
    edge_type TEXT NOT NULL, 
    id2 TEXT NOT NULL, 
    id2_type TEXT NOT NULL, 
    time TIMESTAMP NOT NULL, 
    data TEXT, 
    deleted_at TIMESTAMP, 
    CONSTRAINT todo_edges_id1_edge_type_id2_pkey PRIMARY KEY (id1, edge_type, id2)
);

CREATE INDEX todo_edges_time_idx ON todo_edges (time);

CREATE TABLE todo_tags_edges (
    id1 TEXT NOT NULL, 
    id1_type TEXT NOT NULL, 
    edge_type TEXT NOT NULL, 
    id2 TEXT NOT NULL, 
    id2_type TEXT NOT NULL, 
    time TIMESTAMP NOT NULL, 
    data TEXT, 
    deleted_at TIMESTAMP, 
    CONSTRAINT todo_tags_edges_id1_edge_type_id2_pkey PRIMARY KEY (id1, edge_type, id2)
);

CREATE INDEX todo_tags_edges_time_idx ON todo_tags_edges (time);

CREATE TABLE workspace_members_edges (
    id1 TEXT NOT NULL, 
    id1_type TEXT NOT NULL, 
    edge_type TEXT NOT NULL, 
    id2 TEXT NOT NULL, 
    id2_type TEXT NOT NULL, 
    time TIMESTAMP NOT NULL, 
    data TEXT, 
    deleted_at TIMESTAMP, 
    CONSTRAINT workspace_members_edges_id1_edge_type_id2_pkey PRIMARY KEY (id1, edge_type, id2)
);

CREATE INDEX workspace_members_edges_time_idx ON workspace_members_edges (time);

CREATE TABLE tags (
    id TEXT NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    deleted_at TIMESTAMP, 
    display_name TEXT NOT NULL, 
    canonical_name TEXT NOT NULL, 
    owner_id TEXT NOT NULL, 
    related_tag_ids TEXT, 
    CONSTRAINT tags_id_pkey PRIMARY KEY (id), 
    CONSTRAINT tags_owner_id_fkey FOREIGN KEY(owner_id) REFERENCES accounts (id) ON DELETE CASCADE, 
    CONSTRAINT "uniqueForOwner" UNIQUE (canonical_name, owner_id)
);

CREATE INDEX tags_deleted_at_idx ON tags (deleted_at);

CREATE INDEX tags_owner_id_idx ON tags (owner_id);

CREATE TABLE todos (
    id TEXT NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    deleted_at TIMESTAMP, 
    text TEXT NOT NULL, 
    completed BOOLEAN NOT NULL, 
    creator_id TEXT NOT NULL, 
    completed_date TIMESTAMP, 
    assignee_id TEXT NOT NULL, 
    scope_id TEXT NOT NULL, 
    scope_type TEXT NOT NULL, 
    bounty INTEGER, 
    CONSTRAINT todos_id_pkey PRIMARY KEY (id), 
    CONSTRAINT todos_creator_id_fkey FOREIGN KEY(creator_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE INDEX todos_assignee_id_idx ON todos (assignee_id);

CREATE INDEX todos_completed_date_idx ON todos (completed_date);

CREATE INDEX todos_completed_idx ON todos (completed);

CREATE INDEX todos_created_at_idx ON todos (created_at);

CREATE INDEX todos_creator_id_idx ON todos (creator_id);

CREATE INDEX todos_deleted_at_idx ON todos (deleted_at);

CREATE TABLE workspaces (
    id TEXT NOT NULL, 
    created_at TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP NOT NULL, 
    deleted_at TIMESTAMP, 
    name TEXT NOT NULL, 
    creator_id TEXT NOT NULL, 
    viewer_creator_id TEXT NOT NULL, 
    slug TEXT NOT NULL, 
    CONSTRAINT workspaces_id_pkey PRIMARY KEY (id), 
    CONSTRAINT workspaces_creator_id_fkey FOREIGN KEY(creator_id) REFERENCES accounts (id) ON DELETE CASCADE, 
    CONSTRAINT workspaces_unique_slug UNIQUE (slug)
);

CREATE INDEX workspaces_deleted_at_idx ON workspaces (deleted_at);

INSERT INTO assoc_edge_config(edge_name, edge_type, edge_table, symmetric_edge, inverse_edge_type, created_at, updated_at) VALUES('AccountToClosedTodosDupEdge', '7dcd1712-6a08-4253-96d9-068996bb6e4a', 'todo_edges', false, NULL, datetime(), datetime()),
('AccountToCreatedWorkspacesEdge', '533096dc-3e79-4e66-8af8-b65e4e9c86d3', 'account_created_workspaces_edges', false, NULL, datetime(), datetime()),
('AccountToOpenTodosDupEdge', 'a75dafbf-0051-4804-bb99-a0c212599af3', 'todo_edges', false, NULL, datetime(), datetime()),
('AccountToWorkspacesEdge', 'b27492cd-a064-4e74-a3af-59256352ed91', 'workspace_members_edges', false, '1c8f1e5c-4bab-4ab5-8a31-1ac71688bbb0', datetime(), datetime()),
('ObjectToScopedTodosEdge', '2a4965c1-c959-4a2d-9f93-afd131baf16b', 'object_scoped_todos_edges', false, '04ad27c4-1da0-4a90-aa2d-df4e95e381da', datetime(), datetime()),
('TagToTodosEdge', '33dd169d-a290-4d3f-8b09-b74628bec247', 'todo_tags_edges', false, '546160e1-224a-42ef-92c7-46089ab5e06e', datetime(), datetime()),
('TodoToTagsEdge', '546160e1-224a-42ef-92c7-46089ab5e06e', 'todo_tags_edges', false, '33dd169d-a290-4d3f-8b09-b74628bec247', datetime(), datetime()),
('TodoToTodoScopeEdge', '04ad27c4-1da0-4a90-aa2d-df4e95e381da', 'object_scoped_todos_edges', false, '2a4965c1-c959-4a2d-9f93-afd131baf16b', datetime(), datetime()),
('WorkspaceToMembersEdge', '1c8f1e5c-4bab-4ab5-8a31-1ac71688bbb0', 'workspace_members_edges', false, 'b27492cd-a064-4e74-a3af-59256352ed91', datetime(), datetime());

