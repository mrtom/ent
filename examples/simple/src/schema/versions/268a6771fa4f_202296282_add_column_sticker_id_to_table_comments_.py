# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add column sticker_id to table comments
add column sticker_type to table comments

Revision ID: 268a6771fa4f
Revises: 1d6ae314efd1
Create Date: 2022-09-06 02:08:02.224312+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '268a6771fa4f'
down_revision = '1d6ae314efd1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column(
        'sticker_id', postgresql.UUID(), nullable=True))
    op.add_column('comments', sa.Column(
        'sticker_type', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('comments', 'sticker_type')
    op.drop_column('comments', 'sticker_id')
    # ### end Alembic commands ###