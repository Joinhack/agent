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


$('.select[name="area"]').selectlist("change", function(n){
	if(!n || !n.value)
		return;
	areachange(n, $('.select[name="section"]'), appendAddSection);
});

var addCommunityOkClick = function() {
	if(!$.validate($("[v-regex][v-regex!='']", content)))
		return false;
	return true;
}

var bindAddCommunityEvent = function(content) {
	
	content.dialog({ok: addCommunityOkClick});
	$('.select[name="area"]', content).data('data', $('.select[name="area"]').data('data'));
	$('.select', content).selectlist();

	$('.select[name=area]', content).selectlist("change", function(n){
		if(!n || !n.value)
			return;
		areachange(n, $('.select[name="section"]', content));
	});
	$("[v-regex][v-regex!='']", content).validate();
	content.dialog("show", true);
}

var clickAddCommunity = function() {
	if($('.addCommunity').length > 0) {
		$('.addCommunity').dialog("show", true);
		return;
	}
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

$('.select[name="section"]').selectlist("change", function(n) {
	if(!n || !n.value)
		return;
	$('.select[name="community"]').selectlist('clear');
	$.getJSON('/region/community/' + n.value, function(d){
		if(d.code != 0) {
			alert(d.msg);
			return d;
		}
		for(var i = 0; i < d.data.length; i++) {
			var data = d.data[i];
			$('.select[name="section"]').selectlist("dataAppend", data);	
		}
		$('.select[name=community]').selectlist("dataAppend",  {content:"<div style='color:blue;'>添加楼盘</div>", click: clickAddCommunity});
	});
});

var addSectionOkClick = function() {
	if(!$.validate($("[v-regex][v-regex!='']", ".addSection")))
		return false;
	$('.addSection form').ajaxUpload({dataType:'json', success: function(d){
		if(d.code != 0)
			alert(d.msg);
		$('.select[name=section]').selectlist("dataPrepend", d.data);
	}});
	return true;
}

$('form','.addSection').submit(addSectionOkClick);

$('.addSection').dialog({close:function(){
	$('.select[name=area1]', ".addSection").selectlist("select", null);
	$('input[name=section]', ".addSection").val('');
}, ok:addSectionOkClick});

var appendAddSection = function(){
	$('.select[name="section"]').selectlist("dataAppend", {content:"<div style='color:blue;'>添加商圈</div>", click:function(){
		var selected = $('.select[name=area]').selectlist("selected");
		if(selected)
			$('.select[name=area1]').selectlist("select", selected);
		 $('.addSection').dialog("show", true);
	}});
}

$("[v-regex][v-regex!='']").validate();
});

})(jQuery);