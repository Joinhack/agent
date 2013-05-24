(function($){
$(document).ready(function(){

$('.select').selectlist({click:function(){
	$('.select').selectlist("reset");
}});

$('.addSection').dialog({close:function(){
	$('.select[name=area1]', ".addSection").selectlist("select", null);
	$('input[name=section]', ".addSection").val('');
}, ok:function(){
	if(!$.validate($("[v-regex][v-regex!='']", ".addSection")))
		return;
	$('.addSection form').ajaxUpload();
	return true;
}});

$('.select[name="section"]').selectlist("dataAppend", {content:"<div style='color:blue;'>添加商圈</div>", click:function(){
	var selected = $('.select[name=area]').selectlist("selected");
	if(selected)
		$('.select[name=area1]').selectlist("select", selected);
	 $('.addSection').dialog("show", true);
}});

$("[v-regex][v-regex!='']").validate();
});

})(jQuery);