# -*- coding: utf-8 -*-

from agent import app
from flask import jsonify,session
from agent.models import *
from flask import request, render_template, session, redirect, url_for, send_from_directory
from functools import wraps
import logging, sys, types

LOGINID="@#$!!0@"

def login_required(json=False):
	def outer(fn):
		@wraps(fn)
		def login_check(*args, **kwargs):
			loginId = session.get(LOGINID)
			if not loginId:
				if json:
					return jsonify({'code':-1, 'msg':'please login'})
				return redirect(url_for("login"))
			return fn(*args, **kwargs)
		return login_check
	return outer

@app.route('/')
@login_required()
def index():
	loginid = session.get(LOGINID)
	um = UserManager()
	dm = DepartmentManager();
	user = um.getByLoginId(loginid)
	company = um.getUserComany(user)
	region = user.department.region
	cities = dm.getCitiesOfCompany(company)

	return render_template('index.html', \
		user=user, company=company, region=region, cities=cities)

@app.route('/about')
def about():
	return render_template('about.html')


@app.route("/region/children/<parent_id>")
def region_children(parent_id):
	rmgmt = RegionManager()
	data = rmgmt.getChildren(parent_id)
	return jsonify({'code':0, 'data':_toselect(data)})

@app.route("/region/community/<rid>")
def region_building(rid):
	rmgmt = RegionManager()
	data = rmgmt.getChildren(rid)
	return jsonify({'code':0, 'data':_toselect(data)})


def _toselect(datas):
	rs = []
	def _cover(data):
		rs = {}
		rs["content"] = data.name
		rs["value"] = data.id
		return rs
	for data in datas:
		rs.append(_cover(data))
	return rs

@app.route("/section/add", methods=["post"])
def section_add():
	area = request.form["area1"]
	name = request.form["section"]
	reg = Region(type=3, name=name, parent_id=area)
	rmgmt = RegionManager()
	rmgmt.save(reg)
	data = {'value':reg.id, 'content':reg.name, 'selected':True}
	return jsonify({'code':0, 'data':data})

@app.route("/login/do", methods=["post"])
def do_login():
	loginid = request.form["loginid"]
	password = request.form["password"]
	um = UserManager()
	user = um.getByLoginId(loginid)
	if user == None or \
		(user.loginid != loginid or user.password != password):
		return jsonify(code=-1, msg='用户或密码错误!')
	session[LOGINID] = loginid
	return jsonify({'code':0, 'redirect':url_for('index')})

@app.route("/logout")
def logout():
	session.clear()
	return redirect(url_for("index"))

@app.route('/login')
def login():
	return render_template('login.html')

@app.route('/init_all')
def init_all():
	drop_tables()
	create_tables()
	add_defaults()
	return jsonify({'code':0});