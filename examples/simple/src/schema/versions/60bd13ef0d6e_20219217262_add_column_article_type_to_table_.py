# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add column article_type to table comments

Revision ID: 60bd13ef0d6e
Revises: 63c0cba9c4bb
Create Date: 2021-09-21 07:26:02.802252+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '60bd13ef0d6e'
down_revision = '63c0cba9c4bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comments', sa.Column(
        'article_type', sa.Text(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('comments', 'article_type')
    # ### end Alembic commands ###