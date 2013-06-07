# -*- coding: utf-8 -*-
from agent import init
init("bae")
from agent import app

from bae.core.wsgi import WSGIApplication


application = WSGIApplication(app)
