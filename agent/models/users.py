# -*- coding: utf-8 -*-
from agent import db

class Department(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	type = db.Column(db.Integer, nullable=False)
	name = db.Column(db.String(128), unique=True)
	parent_id = db.Column(db.Integer, db.ForeignKey("department.id"))
	parent = db.relationship("Department", remote_side=[id])

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	loginid = db.Column(db.String(128), unique=True)
	email = db.Column(db.String(128), unique=True)
	firstname = db.Column(db.String(128))
	lastname = db.Column(db.String(128))
	password = db.Column(db.String(128), nullable=False)
	departmentid = db.Column(db.Integer, db.ForeignKey("department.id"), nullable=False)
	department = db.relationship("Department", uselist=False)
	def __repr__(self):
		return "loginid:%s, password:%s"(self.loginid, self.password)

class UserManager:
	def save(slef, user):
		db.session.add(user)
		db.session.commit()
	def getByLoginId(self, loginId):
		return User.query.filter_by(loginid=loginId).first()
