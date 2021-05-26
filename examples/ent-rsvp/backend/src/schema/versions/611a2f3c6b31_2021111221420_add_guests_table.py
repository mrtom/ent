# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add guests table

Revision ID: 611a2f3c6b31
Revises: c67a28c1044e
Create Date: 2021-01-11 22:14:20.770346+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '611a2f3c6b31'
down_revision = 'c67a28c1044e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('guests',
                    sa.Column('id', postgresql.UUID(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), nullable=False),
                    sa.Column('updated_at', sa.TIMESTAMP(), nullable=False),
                    sa.Column('first_name', sa.Text(), nullable=False),
                    sa.Column('last_name', sa.Text(), nullable=False),
                    sa.Column('email_address', sa.Text(), nullable=False),
                    sa.Column('event_id', postgresql.UUID(), nullable=False),
                    sa.Column('guest_group_id',
                              postgresql.UUID(), nullable=False),
                    sa.ForeignKeyConstraint(
                        ['event_id'], ['events.id'], name='guests_event_id_fkey', ondelete='CASCADE'),
                    sa.ForeignKeyConstraint(['guest_group_id'], [
                        'guest_groups.id'], name='guests_guest_group_id_fkey', ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id', name='guests_id_pkey')
                    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('guests')
    # ### end Alembic commands ###
