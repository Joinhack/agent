# -*- coding: utf-8 -*-
from flask import Flask
import logging, sys
try:
	from flask.ext.sqlalchemy import SQLAlchemy
except:
	from flask_sqlalchemy import SQLAlchemy

app = None
db = None


MysqlConf = {}

def get_mysql_uri():
	return "mysql://%s:%s@%s:%s/%s?charset=utf8"%(MysqlConf["MYSQL_USER"], MysqlConf["MYSQL_PASS"], MysqlConf["MYSQL_HOST"], MysqlConf["MYSQL_PORT"], MysqlConf["MYSQL_DB"])

def _init_sae_db():
	import sae.const
	MysqlConf["MYSQL_USER"] = sae.const.MYSQL_USER
	MysqlConf["MYSQL_PASS"] = sae.const.MYSQL_PASS
	MysqlConf["MYSQL_HOST"] = sae.const.MYSQL_HOST
	MysqlConf["MYSQL_PORT"] = sae.const.MYSQL_PORT
	MysqlConf["MYSQL_DB"] = sae.const.MYSQL_DB
	app.config.setdefault("SQLALCHEMY_DATABASE_URI", get_mysql_uri())

def _init_local_db():
	app.config.setdefault("SQLALCHEMY_DATABASE_URI", "sqlite://///Users/joinhack/temp/h.db")

inited = False

def init(type):
	global app
	global db
	global inited
	if not inited:
		app = Flask(__name__)
		app.debug = True
		app.secret_key = 'xkjhjw153k1x1jhl0h5xzyzi22kjh0xll1k52l5i'
		if type == 'sae':
			_init_sae_db()
		else:
			_init_local_db()
		db = SQLAlchemy(app)
		db.engine.echo = True
		import views
		import models
		#app.session_interface = models.DBSessionInterface()
	else:
		inited = True