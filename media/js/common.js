(function($){

function select(opts) {
	this.opts = opts;
	this.dom = opts.dom;
	this.init();
}

var CommonPrototype = {innerCall: function(params){
	if(params == null || params.length == 0)
		return;
	var method = params[0];

	if(typeof method != 'string' || 
		!method in this )
		return;
	var newParam = [];
	if(typeof this[method] == "function"){
		var idx = 1;
		for(; idx < params.length; idx ++)
			newParam.push(params[idx]);
		return this[method].apply(this, newParam);
	}
	return this[method];
}};

var jqCall = function(obj, args) {
	var priv = "._" + obj.name;
	var rs;
	$(this).each(function(){
		if($(this).data(priv) == null) {
			$(this).each(function(){
				$(this).data(priv, new obj($.extend({dom:$(this)}, args[0])));
			});
		} else {
			
			$($(this).data(priv)).each(function(){
				rs = this.innerCall(args);
			});
		}
	});
	return rs;
};

select.prototype = $.extend({
	'init': function() {
		this.prepare();
		this.dataPrepare();
		this.eventBind();
		this.opened = false;
	},
	'prepare': function() {
		this.container_a = $("<a class='wrapper' href='javascript:;'></a>");
		this.selectdom = $("<div class='menu-button'></div>");
		this.container_a.append(this.selectdom);
		$(this.dom).append(this.container_a);
		$(this.selectdom).append($("<div class='dropdown'>&nbsp;</div>"));
		this.droplist = $("<div class='droplist'></div>");
		this.content = $("<div class='content'>&nbsp;</div>");
		this.value = $("<input name='value' type='hidden'/>");
		if($(this.dom).attr("name"))
			this.value.attr("name", $(this.dom).attr("name"));
		$(this.dom).append(this.droplist);
		$(this.selectdom).prepend(this.content);
		$(this.selectdom).prepend(this.value);
		if($(this.dom).data("data"))
			this.opts.data = $(this.dom).data("data");
	},
	'select': function(d) {
		this.content.contents().remove();
		var oval = this.selected;
		var nval = d;
		this.selected = d;
		if(d) {
			this.content.attr('title', d.content);
			this.content.append(d.content);
			this.val(d.value);
		} else {
			this.content.append("&nbsp;");
			this.val('');
		}
		if(nval != oval)
			this._change(nval, oval);
	},
	'change': function(f){
		if(!this._onchange)
			this._onchange = [];
		this._onchange.push(f);
	},
	'_change': function(n, o) {
		if(!this._onchange)
			return;
		var that = this;
		$(this._onchange).each(function(){
			this.call(that.dom, n, o);
		});
	},
	'dataPrepare': function() {
		if(this.opts.selected) {
			this.select(this.opts.selected);
		}
		var data = this.opts.data;
		if(typeof(data) == 'function')
			data = data();
		this.dataAppend(data);
	},
	'dataAppend': function(data) {
		var that = this;
		this._addData(data, function(item){
			that.droplist.append(item);
		});
	},
	'_addData': function(data, _cb) {
		if(!data)
			return;
		var that = this;
		$(data).each(function(){
			var data = this;
			var item = $("<div class='item'></div>").append(this.content).data('data',data);
			if(data.selected)
				that.select(data);
			_cb(item);
			item.click(function(){
				that.droplist_open(false);
				if(data.click)
					data.click();
				else
					that.select(data);
				return false;
			}).mouseover(function(){
				$(this).addClass("hover");
			}).mouseout(function(){
				$(this).removeClass("hover");
			});
		});
	},
	'dataPrepend': function(data) {
		var that = this;
		this._addData(data, function(item){
			that.droplist.prepend(item);
		});
	},
	'val': function() {
		if(arguments.length == 0)
			return this.value.val();
		this.value.val(arguments[0]);
	},
	'dom_mouseover': function() {
		if(!this.opened)
			$(this).addClass("menu-button-hover");
	},
	'dom_mouseout': function() {
		$(this).removeClass("menu-button-hover");
	},
	'dom_click': function() {
		if(this.opts.click)
			this.opts.click.call(this.dom);
		this.droplist_open(true);
		return false;
	},
	'droplist_open': function(b) {
		if(b) {
			this.droplist.show();
			this.opened = true;
			$(this.selectdom).addClass("menu-button-open");
		} else {
			this.droplist.hide();
			this.opened = false;
			$(this.selectdom).removeClass("menu-button-open");
		}
	},
	clear: function() {
		this.droplist.contents().remove();
		this.select(null);
	},
	'reset': function() {
		this.droplist_open(false);
	},
	'eventBind': function() {
		var that = this;
		$(this.selectdom).click(function(){
			return that.dom_click();
		}).mouseover(function(){
			return that.dom_mouseover();
		}).mouseout(function(){
			return that.dom_mouseout();
		});
		$(document).click(function(){
			that.reset();
		});
	}
}, CommonPrototype);

$.fn.selectlist = function(){
	return jqCall.call(this, select, arguments);
}

function getGlobalDivmask() {
	var mask = $(".divmask");
	if(mask.length == 0) {
		mask = $("<div class='divmask'></div>");
		$('body').append(mask);
	}
	return mask;
}

var dialog = function(opts) {
	if(!opts)
		opts = {};
	this.opts = opts;
	this.init(opts);
}

dialog.prototype = $.extend({
	'init': function() {
		this.prepare(this.opts);
		this.bindEvent();
	},
	'prepare': function(opts) {
		this.dialog = $("<div class='dialog'></div>");
		this.inner = $("<div class='inner'></div>");
		this.title = $("<div class='title'></div>");
		this.bottom = $("<div class='bottom'></div>");
		this.closeDom = $("<a class='close'></a>");


		this.ok = $("<input type='button' class='ok' />");
		this.bottom.append(this.ok);

		this.content = $("<div class='content'></div>");
		this.dialog.append(this.inner);
		this.inner.append(this.title);

		this.dialog.append(this.closeDom);
		this.inner.append(this.content);

		this.inner.append(this.bottom);
		this.divmask = getGlobalDivmask();
		if(opts.dom) {
			this.content.append($(opts.dom).contents());
			$(opts.dom).append(this.dialog);
			if(opts.dom.attr('d-title'))
				this.title.append(opts.dom.attr('d-title'));
			this.dom = opts.dom;
		} else
			$(document).append(this.dialog);
		
		if(opts.width)
			this.dialog.width(opts.width);
		if(opts.height)
			this.dialog.height(opts.height);
		var offset = {'left':($('body').width() - this.dialog.width())/2};
		if(opts.offset)
			$.extend(offset, opts.offset);
		this.dialog.offset(offset);
	},
	'show': function(b) {
		if(b) {
			this.dialog.show();
			this.divmask.show();
		} else {
			this.dialog.hide();
			this.divmask.hide();
		}
	},
	'okclick': function() {
		if(this.clicking)
			return;
		this.clicking = true;
		try {
			if(this.opts.ok){
				this.opts.ok.call(this.dom||this);
			}
		} finally {
			this.clicking = false; 
		}
	},
	'close': function() {
		this.show(false);
		if(this.opts.close)
			this.opts.close.call(this.dom||this);
	},
	'bindEvent': function() {
		var that = this;
		this.closeDom.click(function(){
			that.close();
		});
		this.ok.click(function(){
			that.okclick();
		});
		$(document).keyup(function(e){
			if (e.keyCode == 27) {
				that.close();
			}
		});
	}
}, CommonPrototype);

$.fn.dialog = function() {
	return 	jqCall.call(this, dialog, arguments);
}

var tooltip = function(opts) {
	this.opts = opts;
	this.init();
}

tooltip.prototype = $.extend({
	'init': function(){
		this.initDom();
	},
	'initDom': function() {
		this.tpdom = $("<div class='tooltipbox'></div>");
		this.tpdom.append($("<div class='tp-l'></div>"));
		this.mid = $("<div class='tp-m'></div>");
		this.center = $("<div class='tp-c'></div>");
		this.center.append($("<div class='tp-icon'></div>"));
		this.msgdom = $("<div class='tp-msg'></div>");
		this.center.append(this.msgdom);
		this.mid.append(this.center);
		this.tpdom.append(this.mid);
		this.tpdom.append($("<div class='tp-r'></div>"));
		if(this.opts && this.opts.dom)
			$(this.opts.dom).append(this.tpdom);
		else
			$('body').append(this.tpdom);
	},
	'msg': function(msg) {
		this.msgdom.contents().remove();
		this.msgdom.append(msg);
	},
	'show': function(b) {
		if(b)
			this.tpdom.show();
		else
			this.tpdom.hide();
	},
	'width': function(w) {
		if(w)
			this.tpdom.width(w);
		else
			return this.tpdom.width();
	},
	'height': function(w) {
		if(w)
			this.tpdom.height(w);
		else
			return this.tpdom.height();
	},
	'outerHeight': function(w) {
		return this.tpdom.outerHeight(w);
	},
	'offset': function(o) {
		this.tpdom.offset(o);
	},
	'fadeOut': function(s, c) {
		var t = 1000;
		if(s)
			t = s;
		if(this.handler) {
			window.clearTimeout(this.handler);
			this.handler = null;
		}
		var that = this;
		this.handler = window.setTimeout(function() {
			that.tpdom.fadeOut(s, c);	
		}, t);
	}
}, CommonPrototype);

$.globaltooltip = function() {
	if($('body').length == 0)
		throw "can use globaltooltip, globaltooltip must in document ready";
	var priv = "._tooltip" ;
	var args = arguments;
	if($('body').data(priv) == null) {
		$('body').data(priv, new tooltip());
	}
	$('body').data(priv).innerCall(args);
	return $('body').data(priv);
}

$.fn.showError = function(msg) {
	var toff = $(this).offset();
	var th = $(this).outerHeight();
	var tw = $(this).width();
	var left = toff.left;
	$.globaltooltip("msg", msg);
	toff.left -= ($.globaltooltip().width() - tw)/2 ;
	toff.top -= th + 10;
	$.globaltooltip("show", true);
	$.globaltooltip('offset', toff);
	$.globaltooltip("fadeOut", 1000);
}

$(document).keyup(function(e){
	if (e.keyCode == 27) {
		$.globaltooltip("show", false);
	}
});


$.validateValGets = {};

$.getValidateValGet = function(k) {
	return $.validateValGets[k];
}

var validate = function(opts) {
	this.opts = opts;
	this.init();
};

validate.prototype = $.extend({
	init: function() {
		this.dom = this.opts.dom;
		this.msg = $(this.dom).attr("v-msg");
		this.regex = $(this.dom).attr("v-regex");
		this.type = $(this.dom).attr("v-type");
	},
	val: function() {
		if(this.type) {
			var valGet = $.getValidateValGet(this.type);
			if(valGet)
				return valGet(this.dom);
		}
		return $(this.dom).val();
	},
	check: function() {
		if(!this.regex) {
			return false;
		}
		var reg;
		try {
			reg = new RegExp(this.regex);
		} catch(e) {
			$(this.dom).showError("无效表达式，请联系管理员");
			return false;
		}
		var val = this.val();
		if(reg.test(val))
			return true;
		$(this.dom).showError(this.msg);
		return false;
	}
}, CommonPrototype);

$.fn.validate = function() {
	return jqCall.call(this, validate, arguments);
}

$.validateValGets['select'] = function(d){
	return $(d).selectlist("val");
};

$.validate = function(dom) {
	for(var i = 0; i < dom.length; i++) {
		if(!$(dom[i]).validate('check'))
			return false;
	}
	return true;
}


})(jQuery);