# -*- coding: utf-8 -*-
from agent import db

#小区
class Community(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(256), unique=True)
	name_py = db.Column(db.String(256))
	builder = db.Column(db.String(128))
	complete_time = db.Column(db.Date)
	location_id = db.Column(db.Integer, db.ForeignKey("location.id"), nullable=False)
	location = db.relationship("Location", uselist=False)

class Building(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	community_id = db.Column(db.Integer, db.ForeignKey("community.id"), nullable=False)
	community = db.relationship("Community", uselist=False, backref="buildings")
	floor_num = db.Column(db.Integer)
	cell_num = db.Column(db.Integer)

class Client(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64), nullable=False)
	mobile = db.Column(db.String(256), nullable=False)
	phone = db.Column(db.String(256))
	owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
	owner = db.relationship("User", uselist=False)

class House(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	building_id = db.Column(db.Integer, db.ForeignKey("building.id"), nullable=False)
	building = db.relationship("Building", uselist=False, backref="houses")
	#1,住宅	 2,经济适用房	 3,别墅	 4,写字楼	 5,商铺	 6,两限房
	type= db.Column(db.Integer, nullable=False)
	foor = db.Column(db.Integer, nullable=False)
	cell = db.Column(db.Integer, nullable=False)
	num = db.Column(db.Integer)
	price = db.Column(db.Integer)
	total_price = db.Column(db.Integer)
	decorate = db.Column(db.String(32), nullable=False)
	area = db.Column(db.Integer, nullable=False)
	face = db.Column(db.String(32))
	rent = db.Column(db.Integer)
	desc = db.Column(db.String(512))
	owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
	owner = db.relationship("User", uselist=False)
	client_id = db.Column(db.Integer, db.ForeignKey("client.id"), nullable=False)
	client = db.relationship("Client", uselist=False)

class CommunityManager:
	def getCommunitiesByRegionId(self, rid):
		return Community.query.filter(Community.location.region_id==rid).all()
