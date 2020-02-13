# Code generated by github.com/lolopinto/ent/ent, DO NOT edit. (TODO figure out correct pythonic way of doing this)

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

metadata = sa.MetaData()

 
sa.Table("addresses", metadata,
    sa.Column("id", UUID(), nullable=False),
    sa.Column("city", sa.Text(), nullable=False),
    sa.Column("country", sa.Text(), nullable=False),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("resident_names", sa.Text(), nullable=False),
    sa.Column("state", sa.Text(), nullable=False),
    sa.Column("street_address", sa.Text(), nullable=False),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("zip", sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint("id", name="addresses_id_pkey"),
)
   
sa.Table("assoc_edge_config", metadata,
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("edge_name", sa.Text(), nullable=False),
    sa.Column("symmetric_edge", sa.Boolean(), nullable=False, server_default='false'),
    sa.Column("inverse_edge_type", UUID(), nullable=True),
    sa.Column("edge_table", sa.Text(), nullable=False),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.PrimaryKeyConstraint("edge_type", name="assoc_edge_config_edge_type_pkey"),
    sa.UniqueConstraint("edge_name", name="assoc_edge_config_unique_edge_name"),
    sa.ForeignKeyConstraint(["inverse_edge_type"], ["assoc_edge_config.edge_type"], name="assoc_edge_config_inverse_edge_type_fkey", ondelete="RESTRICT"),
)
   
sa.Table("contact_allow_list_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="contact_allow_list_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("contact_emails", metadata,
    sa.Column("id", UUID(), nullable=False),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("email_address", sa.Text(), nullable=False),
    sa.Column("label", sa.Text(), nullable=False),
    sa.Column("contact_id", UUID(), nullable=False),
    sa.PrimaryKeyConstraint("id", name="contact_emails_id_pkey"),
    sa.ForeignKeyConstraint(["contact_id"], ["contacts.id"], name="contact_emails_contact_id_fkey", ondelete="CASCADE"),
)
   
sa.Table("contacts", metadata,
    sa.Column("id", UUID(), nullable=False),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("email_address", sa.Text(), nullable=False),
    sa.Column("first_name", sa.Text(), nullable=False),
    sa.Column("last_name", sa.Text(), nullable=False),
    sa.Column("user_id", UUID(), nullable=False),
    sa.Column("favorite", sa.Boolean(), nullable=True),
    sa.Column("number_of_calls", sa.Integer(), nullable=True, server_default='0'),
    sa.Column("pi", sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint("id", name="contacts_id_pkey"),
    sa.UniqueConstraint("email_address", name="contacts_unique_email_address"),
    sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="contacts_user_id_fkey", ondelete="CASCADE"),
)
   
sa.Table("event_creator_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="event_creator_edges_id1_edge_type_id2_pkey"),
    sa.UniqueConstraint("id1", "edge_type", name="event_creator_edges_unique_id1_edge_type"),
)
   
sa.Table("event_hosts_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="event_hosts_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("event_invited_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="event_invited_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("events", metadata,
    sa.Column("id", UUID(), nullable=False),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("name", sa.Text(), nullable=False),
    sa.Column("user_id", sa.Text(), nullable=False),
    sa.Column("start_time", sa.TIMESTAMP(), nullable=False),
    sa.Column("end_time", sa.TIMESTAMP(), nullable=True),
    sa.Column("location", sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint("id", name="events_id_pkey"),
)
   
sa.Table("user_events_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="user_events_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("user_family_members_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="user_family_members_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("user_friends_edges", metadata,
    sa.Column("id1", UUID(), nullable=False),
    sa.Column("id1_type", sa.Text(), nullable=False),
    sa.Column("edge_type", UUID(), nullable=False),
    sa.Column("id2", UUID(), nullable=False),
    sa.Column("id2_type", sa.Text(), nullable=False),
    sa.Column("time", sa.TIMESTAMP(), nullable=False),
    sa.Column("data", sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint("id1", "edge_type", "id2", name="user_friends_edges_id1_edge_type_id2_pkey"),
)
   
sa.Table("users", metadata,
    sa.Column("id", UUID(), nullable=False),
    sa.Column("bio", sa.Text(), nullable=True),
    sa.Column("created_at", sa.TIMESTAMP(), nullable=False),
    sa.Column("email_address", sa.Text(), nullable=False),
    sa.Column("first_name", sa.Text(), nullable=False),
    sa.Column("last_name", sa.Text(), nullable=False),
    sa.Column("password", sa.Text(), nullable=False),
    sa.Column("phone_number", sa.Text(), nullable=True),
    sa.Column("updated_at", sa.TIMESTAMP(), nullable=False),
    sa.PrimaryKeyConstraint("id", name="users_id_pkey"),
    sa.UniqueConstraint("email_address", name="users_unique_email_address"),
    sa.UniqueConstraint("phone_number", name="users_unique_phone_number"),
)
  

edges = {
  'public': {
    'ContactToAllowListEdge': {"edge_name":"ContactToAllowListEdge", "edge_type":"f6ecacb9-1d4f-47bb-8f18-f7d544450ea2", "edge_table":"contact_allow_list_edges", "symmetric_edge":False, "inverse_edge_type":None},
    'EventToAttendingEdge': {"edge_name":"EventToAttendingEdge", "edge_type":"9f384bf7-af59-4a41-8b67-8ecc659524c6", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"4afef8fc-f75a-406e-aafc-8b571980e6ef"},
    'EventToCreatorEdge': {"edge_name":"EventToCreatorEdge", "edge_type":"eb45df04-a2ce-4d20-9325-ef6ddb7c5c31", "edge_table":"event_creator_edges", "symmetric_edge":False, "inverse_edge_type":None},
    'EventToDeclinedEdge': {"edge_name":"EventToDeclinedEdge", "edge_type":"d7b9e19a-4214-4376-927c-58b98913dbb7", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"14f2d5b4-d0fd-4088-ba25-e417ab40307c"},
    'EventToHostsEdge': {"edge_name":"EventToHostsEdge", "edge_type":"06a23665-6e2c-413a-bbb0-f53222c313dd", "edge_table":"event_hosts_edges", "symmetric_edge":False, "inverse_edge_type":None},
    'EventToInvitedEdge': {"edge_name":"EventToInvitedEdge", "edge_type":"12a5ac62-1f9a-4fd7-b38f-a6d229ace12c", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"e89302ca-c76b-41ad-a823-9e3964b821dd"},
    'UserToDeclinedEventsEdge': {"edge_name":"UserToDeclinedEventsEdge", "edge_type":"14f2d5b4-d0fd-4088-ba25-e417ab40307c", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"d7b9e19a-4214-4376-927c-58b98913dbb7"},
    'UserToEventsAttendingEdge': {"edge_name":"UserToEventsAttendingEdge", "edge_type":"4afef8fc-f75a-406e-aafc-8b571980e6ef", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"9f384bf7-af59-4a41-8b67-8ecc659524c6"},
    'UserToEventsEdge': {"edge_name":"UserToEventsEdge", "edge_type":"41bddf81-0c26-432c-9133-2f093af2c07c", "edge_table":"user_events_edges", "symmetric_edge":False, "inverse_edge_type":None},
    'UserToFamilyMembersEdge': {"edge_name":"UserToFamilyMembersEdge", "edge_type":"38176101-6adc-4e0d-bd36-08cdc45f5ed2", "edge_table":"user_family_members_edges", "symmetric_edge":False, "inverse_edge_type":None},
    'UserToFriendsEdge': {"edge_name":"UserToFriendsEdge", "edge_type":"d78d13dc-85d6-4f55-a72d-5dbcdc36131d", "edge_table":"user_friends_edges", "symmetric_edge":True, "inverse_edge_type":None},
    'UserToInvitedEventsEdge': {"edge_name":"UserToInvitedEventsEdge", "edge_type":"e89302ca-c76b-41ad-a823-9e3964b821dd", "edge_table":"event_invited_edges", "symmetric_edge":False, "inverse_edge_type":"12a5ac62-1f9a-4fd7-b38f-a6d229ace12c"},
  }
}

metadata.info.setdefault("edges", edges)

def get_metadata():
  return metadata
