# -*- coding: utf-8 -*-
from users import *
from house import *
from agent import db

def create_tables():
	db.create_all()

def drop_tables():
	db.drop_all()

def add_defaults():
	p = Region()
	p.type = 1
	p.name = u"四川"
	c = Region()
	c.type = 2
	c.name = u"成都"
	c.parent = p

	a = Region()
	a.type = 3
	a.name = u"高新区"
	a.parent = c


	user = User()
	dep = Department()
	dep.type = 0
	dep.name = u"恒达"
	dep.region = c

	user.loginid = 'admin'
	user.password = 'admin'
	user.department = dep
	um = UserManager()
	um.save(user)
