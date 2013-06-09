# -*- coding: utf-8 -*-

from users import *

#小区
class Community(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(256))
	name_py = db.Column(db.String(256))
	builder = db.Column(db.String(128))
	complete_time = db.Column(db.Date, nullable=True)
	region_id = db.Column(db.Integer, db.ForeignKey("region.id"))
	company_id = db.Column(db.Integer, db.ForeignKey("department.id"))
	region = db.relationship("Region", uselist=False)
	company = db.relationship("Department", uselist=False)
	location = db.Column(db.String(256))
	#物管费
	property_free = db.Column(db.SmallInteger)
	#物管单位
	property_free_unit = db.Column(db.SmallInteger)
	#绿化率
	greening_ratio = db.Column(db.SmallInteger)
	#容积率
	plot_ratio = db.Column(db.SmallInteger)
	#邮编
	zip_code = db.Column(db.String(32))
	nunber = db.Column(db.SmallInteger)
	owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
	owner = db.relationship("User", uselist=False)

class Client(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), nullable=False)
	mobile = db.Column(db.String(256), nullable=False)
	phone = db.Column(db.String(256))
	owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
	owner = db.relationship("User", uselist=False)

class House(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	community_id = db.Column(db.Integer, db.ForeignKey("community.id"), nullable=False)
	community = db.relationship("Community", uselist=False, backref="buildings")
	#1,住宅	 2,经济适用房	 3,别墅	 4,写字楼	 5,商铺	 6,两限房
	type= db.Column(db.Integer, nullable=False)
	foor = db.Column(db.Integer, nullable=False)
	cell = db.Column(db.Integer, nullable=False)
	num = db.Column(db.Integer)
	price = db.Column(db.Integer)
	total_price = db.Column(db.Integer)
	decorate = db.Column(db.String(8), nullable=False)
	area = db.Column(db.Integer, nullable=False)
	face = db.Column(db.String(8))
	rent = db.Column(db.Integer)
	rent_unit = db.Column(db.String(8))
	desc = db.Column(db.String(512))
	owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
	owner = db.relationship("User", uselist=False)
	client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)
	client = db.relationship("Client", uselist=False)

class CommunityManager:
	def getCommunitiesByRegionId(self, rid):
		return Community.query.filter(Community.region_id==rid).all()
	def queryCommunitiesByUserId(self, user, q):
		um = UserManager()
		company = um.getUserCompany(user)
		filter = db.session.query(Community.name, Community.id).filter(db.or_(Community.region_id==user.department_id, Community.company_id == company.id)).filter(Community.name.like('%'+q+'%'))
		return  filter.limit(20).all()
	def save(self, c):
		db.session.add(c)
		db.session.commit()