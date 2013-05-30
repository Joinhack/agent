# -*- coding: utf-8 -*-

from agent import app
from flask import jsonify,session
from flask import request, render_template, session, redirect, url_for, send_from_directory
from agent.models import *
from utils import *

@app.route("/community/add")
def community_add():
	return jsonify({'code':0, 'content':render_template("/house/community_add.html")})

@app.route("/community/list/<int:region_id>")
def community_list(region_id=-1):
	if region_id < 0:
		return jsonify({'code':-1, 'msg':'unkonw id'})
	cmgmt = CommunityManager()
	data = cmgmt.getCommunitiesByRegionId(region_id)
	return jsonify({'code':0, 'data':toselect(data)})


@app.route("/community/add/do", methods=["post"])
def community_add_do():
	section_id = request.form["section"]
	community_name = request.form["community"]
	location = request.form["location"]
	zip_code = request.form["zip_code"]
	number = request.form["number"]
	builder = request.form["builder"]
	complete_time = request.form["complete_time"]
	property_free = request.form["property_free"]
	plot_ratio = request.form["plot_ratio"]
	greening_ratio = request.form["greening_ratio"]
	community = Community(name=community_name, location=location)
	attr_set(community, zip_code=zip_code, number=number, \
		complete_time=complete_time, builder=builder,\
		property_free=property_free)
	cmgmt = CommunityManager()
	cmgmt.save(community)
	return jsonify({'code':0, 'data':{'value':community.id, 'content':community.name}})