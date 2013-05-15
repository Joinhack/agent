# -*- coding: utf-8 -*-
from users import *
from agent import db

def create_tables():
	db.create_all()

def drop_tables():
	db.drop_all()

def add_defaults():
	user = User()
	dep = Department()
	dep.type = 0
	dep.name = "company"
	db.session.add(dep)

	user.loginid = 'admin'
	user.password = 'admin'
	user.department = dep
	um = UserManager()
	um.save(user)
