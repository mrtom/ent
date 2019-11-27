# Code generated by github.com/lolopinto/ent/ent, DO NOT edit. 

"""add column favorite to table contacts
add column number_of_calls to table contacts
add column pi to table contacts

Revision ID: 5b8837f1f71c
Revises: df1461c4a0dc
Create Date: 2019-10-30 06:01:46.231202+00:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5b8837f1f71c'
down_revision = 'df1461c4a0dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('contacts', sa.Column('favorite', sa.Boolean(), nullable=False))
    op.add_column('contacts', sa.Column('number_of_calls', sa.Integer(), nullable=False))
    op.add_column('contacts', sa.Column('pi', sa.Float(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('contacts', 'pi')
    op.drop_column('contacts', 'number_of_calls')
    op.drop_column('contacts', 'favorite')
    # ### end Alembic commands ###