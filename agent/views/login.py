# -*- coding: utf-8 -*-
from flask import request, render_template, session, redirect, url_for, send_from_directory
from agent import app
from flask import jsonify,session
from agent.models import *
import logging, sys

@app.route('/')
def index():
	loginid = session.get("lid")
	user = None
	if loginid:
		um = UserManager()
		user = um.getByLoginId(loginid)
	return render_template('index.html', user=user)

@app.route('/about')
def about():
	return render_template('about.html')

@app.route("/login/do", methods=["post"])
def do_login():
	loginid = request.form["loginid"]
	password = request.form["password"]
	um = UserManager()
	user = um.getByLoginId(loginid)
	if user == None or \
		(user.loginid != loginid or user.password != password):
		return jsonify(code=-1, msg='用户或密码错误!')
	session["lid"] = loginid
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