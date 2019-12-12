# Code generated by github.com/lolopinto/ent/ent, DO NOT edit. 

"""add unique constraint event_creator_edges_unique_id1_edge_type

Revision ID: 42dd0bb4b460
Revises: 277d3388b6dd
Create Date: 2019-11-27 22:39:58.449478+00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42dd0bb4b460'
down_revision = '277d3388b6dd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('event_creator_edges_unique_id1_edge_type', 'event_creator_edges', ['id1', 'edge_type'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('event_creator_edges_unique_id1_edge_type', 'event_creator_edges', type_='unique')
    # ### end Alembic commands ###