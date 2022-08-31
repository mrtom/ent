# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add column address_id to table event_activities
add column address_id to table guests

Revision ID: 52bb2d3cd57e
Revises: 0ce29e7e2185
Create Date: 2022-08-21 23:46:55.435890+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '52bb2d3cd57e'
down_revision = '0ce29e7e2185'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event_activities', sa.Column(
        'address_id', postgresql.UUID(), nullable=True))
    op.add_column('guests', sa.Column(
        'address_id', postgresql.UUID(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('guests', 'address_id')
    op.drop_column('event_activities', 'address_id')
    # ### end Alembic commands ###