# -*- coding: utf-8 -*-
import logging, sys
from agent import init

if __name__ == "__main__":
	init("local")
	from agent import app
	app.run()
	