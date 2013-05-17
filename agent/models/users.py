# -*- coding: utf-8 -*-
from agent import db

class Region(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	#1 province, 2 city, 3 area, 4 section
	type = db.Column(db.Integer, nullable=False)
	name = db.Column(db.String(128), unique=True)
	name_py = db.Column(db.String(256), unique=True)
	parent_id = db.Column(db.Integer, db.ForeignKey("region.id"))
	parent = db.relationship("Region", remote_side=[id], backref="children")

class Location(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	#0 street, 1 location
	type = db.Column(db.Integer, nullable=False)
	name = db.Column(db.String(128), unique=True)
	region_id = db.Column(db.Integer, db.ForeignKey("region.id"))
	region = db.relationship("Region", uselist=False)
	zip_code = db.Column(db.String(32), nullable=False)
	nunber = db.Column(db.Integer, nullable=False)

class Department(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	#0 Comoany, 1 Department
	type = db.Column(db.Integer, nullable=False)
	name = db.Column(db.String(128), unique=True)
	parent_id = db.Column(db.Integer, db.ForeignKey("department.id"))
	region_id = db.Column(db.Integer, db.ForeignKey("region.id"))
	parent = db.relationship("Department", remote_side=[id], backref="children")
	region = db.relationship("Region", uselist=False)

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	loginid = db.Column(db.String(128), unique=True)
	email = db.Column(db.String(128), unique=True)
	firstname = db.Column(db.String(128))
	lastname = db.Column(db.String(128))
	password = db.Column(db.String(128), nullable=False)
	department_id = db.Column(db.Integer, db.ForeignKey("department.id"), nullable=False)
	department = db.relationship("Department", uselist=False)
	def __repr__(self):
		return "loginid:%s, password:%s"(self.loginid, self.password)

class UserManager:
	def save(slef, user):
		db.session.add(user)
		db.session.commit()
	def getByLoginId(self, loginId):
		return User.query.filter_by(loginid=loginId).first()
	def getUserComany(self, user):
		dep = user.department;
		while dep:
			if dep.type == 0:
				return dep
			dep = None
			if dep.id != dep.parent_id and dep.parent_id != None:
				dep = dep.parent
		return None;
