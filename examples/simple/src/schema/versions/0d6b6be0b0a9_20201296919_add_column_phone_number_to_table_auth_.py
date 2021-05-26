# Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

"""add column phone_number to table auth_codes
modify nullable value of column email_address from False to True
add unique constraint uniquePhoneCode

Revision ID: 0d6b6be0b0a9
Revises: 7d18d14131dc
Create Date: 2020-12-09 06:09:19.859266+00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '0d6b6be0b0a9'
down_revision = '7d18d14131dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('auth_codes', sa.Column(
        'phone_number', sa.Text(), nullable=True))
    op.alter_column('auth_codes', 'email_address',
                    existing_type=sa.TEXT(),
                    nullable=True)
    op.create_unique_constraint('uniquePhoneCode', 'auth_codes', [
                                'phone_number', 'code'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uniquePhoneCode', 'auth_codes', type_='unique')
    op.alter_column('auth_codes', 'email_address',
                    existing_type=sa.TEXT(),
                    nullable=False)
    op.drop_column('auth_codes', 'phone_number')
    # ### end Alembic commands ###