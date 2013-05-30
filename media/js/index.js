(function($){
$(document).ready(function(){

$('.select').selectlist({click:function(){
	$('.select').selectlist("reset");
}});


var areachange = function(n, target, lastCall) {
	target.selectlist('clear');
	$.getJSON('/region/children/' + n.value, function(d){
		if(d.code != 0) {
			alert(d.msg);
			return d;
		}
		for(var i = 0; i < d.data.length; i++) {
			var data = d.data[i];
			target.selectlist("dataAppend", data);	
		}
		if(lastCall)
			lastCall();
	});
};

var sectionchange = function(n, target, lastCall) {
	target.selectlist('clear');
	$.getJSON('/community/list/' + n.value, function(d){
		if(d.code != 0) {
			alert(d.msg);
			return d;
		}
		for(var i = 0; i < d.data.length; i++) {
			var data = d.data[i];
			target.selectlist("dataAppend", data);	
		}
		if(lastCall)
			lastCall();
	});
};


$('.select[name="area"]', '.addHouse').selectlist("change", function(n){
	if(!n || !n.value)
		return;
	areachange(n, $('.select[name="section"]', '.addHouse'), appendAddSection);
});

var addCommunityOkClick = function() {
	if(!$.validate($("[v-regex][v-regex!='']", ".addCommunity")))
		return;
	var that = this;
	$('.addCommunity form').ajaxUpload({success: function(d){
		if(d.code != 0 || !d.data) {
			alert(d.msg);
			return d;
		}
		$('.select[name=community]', '.addHouse').selectlist('dataPrepend', d.data);
		$('.select[name=community]', '.addHouse').selectlist('select', d.data);
		$('.select', '.addCommunity').selectlist('select', null);
		$('input[type=text],input[type=hidden]', '.addCommunity').val('');
		that.dialog('show', false);
	}});
	return;
}

var bindAddCommunityEvent = function(content) {
	
	content.dialog({ok: addCommunityOkClick, offset:{top:120}});
	$('.select[name="area"]', content).data('data', $('.select[name="area"]').data('data'));
	$('.select', content).selectlist();

	$('.select[name=area]', content).selectlist("change", function(n){
		if(!n || !n.value)
			return;
		areachange(n, $('.select[name="section"]', content));
	});
	$('form', content).submit(function(){
		content.dialog("okclick");
		return false;
	});
	$("[v-regex][v-regex!='']", content).validate();
	content.dialog("show", true);
}

var clickAddCommunity = function() {
	if($('.addCommunity').length > 0) {
		$('.addCommunity').dialog("show", true);
		return;
	}
	var that = this;
	$.getJSON('/community/add', function(d){
		if(d.code != 0) {
			alert(d.msg);
			return d;
		}
		var content = $(d.content);
		$('.dls').append(content);
		bindAddCommunityEvent(content);
	});
}

$('.select[name="section"]', '.addHouse').selectlist('change', function(n){
	if(!n || !n.value)
		return;
	var target = $('.select[name="community"]', '.addHouse');

	sectionchange(n,target, function(){
		target.selectlist("dataAppend",  {content:"<div style='color:blue;'>添加楼盘</div>", click: clickAddCommunity});
	});
});

var addSectionOkClick = function() {
	var that  = this;
	if(!$.validate($("[v-regex][v-regex!='']", ".addSection")))
		return;
	$('.addSection form').ajaxUpload({success: function(d){
		if(d.code != 0) {
			alert(d.msg);
			return;
		}
		$('.select[name=section]', '.addHouse').selectlist("dataPrepend", d.data);
		$('input[type=text],input[type=hidden]', '.addSection').val('');
		$('.select','.addSection').selectlist("select", null);
		$(that).dialog("show", false);
	}});
	return;
}

$('form','.addSection').submit(function(){
	$('.addSection').dialog("okclick");
	return false;
});

$('.addSection').dialog({close:function(){
	$('.select[name=area]', ".addSection").selectlist("select", null);
	$('input[name=section]', ".addSection").val('');
}, ok:addSectionOkClick});

var appendAddSection = function(){
	$('.select[name="section"]', '.addHouse').selectlist("dataAppend", {content:"<div style='color:blue;'>添加商圈</div>", click:function(){
		var selected = $('.select[name=area]', '.addHouse').selectlist("selected");
		if(selected)
			$('.select[name=area]', '.addSection').selectlist("select", selected);
		 $('.addSection').dialog("show", true);
	}});
}

$("[v-regex][v-regex!='']").validate();
});

})(jQuery);