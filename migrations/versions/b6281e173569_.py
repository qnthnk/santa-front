"""empty message

Revision ID: b6281e173569
Revises: 26e2a857c528
Create Date: 2025-02-28 23:59:10.522459

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b6281e173569'
down_revision = '26e2a857c528'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('first_last_name', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('second_last_name', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('curp', sa.String(length=18), nullable=False))
        batch_op.add_column(sa.Column('gender', sa.String(length=15), nullable=False))
        batch_op.add_column(sa.Column('birthdate', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('phone_number', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('facebook', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('instagram', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('x', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('blood_type', sa.String(length=5), nullable=True))
        batch_op.add_column(sa.Column('allergy', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('disease', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('city', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('address', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('state', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('zip_code', sa.String(length=80), nullable=False))
        batch_op.add_column(sa.Column('latitude', sa.String(length=80), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.String(length=80), nullable=True))
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(length=80),
               type_=sa.String(length=250),
               existing_nullable=False)
        batch_op.drop_column('is_active')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False))
        batch_op.alter_column('password',
               existing_type=sa.String(length=250),
               type_=sa.VARCHAR(length=80),
               existing_nullable=False)
        batch_op.drop_column('longitude')
        batch_op.drop_column('latitude')
        batch_op.drop_column('zip_code')
        batch_op.drop_column('state')
        batch_op.drop_column('address')
        batch_op.drop_column('city')
        batch_op.drop_column('disease')
        batch_op.drop_column('allergy')
        batch_op.drop_column('blood_type')
        batch_op.drop_column('x')
        batch_op.drop_column('instagram')
        batch_op.drop_column('facebook')
        batch_op.drop_column('phone_number')
        batch_op.drop_column('birthdate')
        batch_op.drop_column('gender')
        batch_op.drop_column('curp')
        batch_op.drop_column('second_last_name')
        batch_op.drop_column('first_last_name')
        batch_op.drop_column('first_name')

    # ### end Alembic commands ###
