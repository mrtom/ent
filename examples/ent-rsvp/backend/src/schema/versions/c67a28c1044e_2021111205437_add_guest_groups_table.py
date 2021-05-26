# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add guest_groups table

Revision ID: c67a28c1044e
Revises: 992a82c9692f
Create Date: 2021-01-11 20:54:37.822154+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c67a28c1044e'
down_revision = '992a82c9692f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('guest_groups',
                    sa.Column('id', postgresql.UUID(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
                    sa.Column('invitation_name', sa.Text(), nullable=False),
                    sa.Column('event_id', postgresql.UUID(), nullable=False),
                    sa.ForeignKeyConstraint(['event_id'], [
                        'events.id'], name='guest_groups_event_id_fkey', ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id', name='guest_groups_id_pkey')
                    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('guest_groups')
    # ### end Alembic commands ###
