$(document).ready(function () {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideOptionMenu');
	});
//	推荐商品
//	$('.menu .ccbg dd').each(function(){
//		if( $(this).attr("menu") == '1' ){
//			$(this).show();
//		}else{
//			$(this).hide();
//		}
//	});
	
	$('#cart').on('click' , function (){
		$('#menu-container').hide();
		$('#cart-container').show();
		$('#user-container').hide();
		
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	});
	$('#home').on('click' , function (){
		$('#menu-container').show();
		$('#cart-container').hide();
		$('#user-container').hide();
		
		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
	});
	$('#user').on('click' , function (){
		$('#menu-container').hide();
		$('#cart-container').hide();
		$('#user-container').show();

		$(".footermenu ul li a").each(function(){
			$(this).attr("class","");
		});
		$(this).children("a").attr("class","active");
		
		$.ajax({
			type : 'POST',
			url : appurl+'/App/Interface/getorders',
			data : {
				uid : $_GET['uid']
			},
			success : function (response , status , xhr){
				if(response){
					var json = eval(response); 
					var html = '';
					var orders_status = '';
					
					$.each(json, function (index, value) {
						if (value.orders_status == '未处理'){
							orders_status = 'no';
						}else if ( value.orders_status == '已完成'){
							orders_status = 'ok';
						}
						html += '<tr><td>'+value.orderid+'</td><td class="cc">'+value.totalprice+'元</td><td class="cc"><em class="'+orders_status+'">'+value.orders_status+'</em></td></tr>';
					});
					$('#orderlistinsert').empty();
					$('#orderlistinsert').append( html );					
				}

			},
			beforeSend : function(){
    			$('#page_tag_load').show();
	    	},
	    	complete : function(){
	    		$('#page_tag_load').hide();
	    	}
		});
	});

});
function home() {
	$('#home').click();
}
function clearCache(){
	$('#ullist').find('li').remove();

	$('#home').click();

	$('.reduce').each(function () {
		$(this).children().css('background','');
	});
	$('#totalNum').html(0);
	$('#cartN2').html(0);
	$('#totalPrice').html(0);
}
function addProductN (wemallId){
	var jqueryid = wemallId.split('_')[0]+'_'+wemallId.split('_')[1];
	var price = parseFloat( wemallId.split('_')[2] );
	var productN = parseFloat( $('#'+jqueryid).find('.count').html() );
	$('#'+jqueryid).find('.count').html( productN + 1);

	var cartMenuN = parseFloat($('#cartN2').html())+1;
	$('#totalNum').html( cartMenuN );
	$('#cartN2').html( cartMenuN );
	
	var totalPrice = parseFloat($('#totalPrice').html())+ parseFloat(price);
	$('#totalPrice').html( totalPrice.toFixed(2) );
}
function reduceProductN ( wemallId ){
	var price = parseFloat( wemallId.split('_')[2] );
	var jqueryid = wemallId.split('_')[0]+'_'+wemallId.split('_')[1];
	var reduceProductN = parseFloat( $('#'+jqueryid).find('.count').html() );
	if ( reduceProductN == 1) {
		$('#'+jqueryid).remove();
		var id = wemallId.split('_')[1];
		$('#'+id).children().css('background','');

		if ( $('#ullist').find('li').length == 0 ){
			$('#menu-container').show();
			$('#cart-container').hide();
			$('#user-container').hide();
		}
	}
	$('#'+jqueryid).find('.count').html( reduceProductN - 1);
	
	var cartMenuN = parseFloat($('#cartN2').html())-1;
	$('#totalNum').html( cartMenuN );
	$('#cartN2').html( cartMenuN );

	var totalPrice = parseFloat($('#totalPrice').html())- parseFloat(price);
	$('#totalPrice').html( totalPrice.toFixed(2) );
}
function doProduct (id , name , price) {
	var bgcolor = $('#'+id).children().css('background-color').colorHex().toUpperCase();
	if (bgcolor == '#FFFFFF') {
		$('#'+id).children().css('background-color','#D00A0A');

		var cartMenuN = parseFloat($('#cartN2').html())+1;
		$('#totalNum').html( cartMenuN );
		$('#cartN2').html( cartMenuN );

		var totalPrice = parseFloat($('#totalPrice').html())+ parseFloat(price);
		$('#totalPrice').html( totalPrice.toFixed(2) );

		var wemallId = 'wemall_'+id;
		var html = '<li class="ccbg2" id="'+wemallId+'"><div class="orderdish"><span name="title">'+name+'</span><span class="price" id="v_0">'+price+'</span><span class="price">元</span></div><div class="orderchange"><a href=javascript:addProductN("'+wemallId+'_'+price+'") class="increase"><b class="ico_increase">加一份</b></a><span class="count" id="num_1_499">1</span><a href=javascript:reduceProductN("'+wemallId+'_'+price+'") class="reduce"><b class="ico_reduce">减一份</b></a></div></li>';
		$('#ullist').append(html);
	}else{
		$('#'+id).children().css('background-color','');

		var cartMenuN = parseFloat($('#cartN2').html())-1;
		$('#totalNum').html( cartMenuN );
		$('#cartN2').html( cartMenuN );

		var totalPrice = parseFloat($('#totalPrice').html())- parseFloat(price);
		$('#totalPrice').html( totalPrice.toFixed(2) );

		var wemallId = 'wemall_'+id;
		$('#'+wemallId).remove();
	}
}
function submitOrder () {

	//获取订单信息
	var json = '';
	$('#ullist li').each(function () {
		var title = $(this).find('span[name=title]').html();
		var num = $(this).find('span[class=count]').html();
		var price = $(this).find('span[class=price]').html();
		json += '{"title":"'+title+'","num":"'+num+'","price":"'+price+'"},';
	
	});
	json = json.substring(0 , json.length-1);
	json = '['+json+']';
	
	$.ajax({
		type : 'POST',
		url : appurl+'/App/Interface/addorder',
		data : {
			uid : $_GET['uid'],
			cartData : json,
			userData : $('form').serializeArray(),
			totalPrice : $('#totalPrice').html()
		},
		success : function (response , status , xhr) {
			
			$('#user').click();
			$('#ullist').find('li').remove();
			$('.reduce').each(function () {
				$(this).children().css('background','');
			});
			$('#totalNum').html(0);
			$('#cartN2').html( 0 );
			$('#totalPrice').html(0);
			
			$.ajax({
				type : 'POST',
				url : appurl+'/App/Interface/getorders',
				data : {
					uid : $_GET['uid']
				},
				success : function (response , status , xhr){
					if(response){
						var json = eval(response); 
						var html = '';
						var orders_status = '';
						
						$.each(json, function (index, value) {
							if (value.orders_status == '未处理'){
								orders_status = 'no';
							}else if ( value.orders_status == '已完成'){
								orders_status = 'ok';
							}
							html += '<tr><td>'+value.orderid+'</td><td class="cc">'+value.totalprice+'元</td><td class="cc"><em class="'+orders_status+'">'+value.orders_status+'</em></td></tr>';
						});
						$('#orderlistinsert').empty();
						$('#orderlistinsert').append( html );
					}
				},
				beforeSend : function(){
	    			$('#page_tag_load').show();
		    	},
		    	complete : function(){
		    		$('#page_tag_load').hide();
		    	}
			});
		},
		beforeSend : function(){
			$('#menu-shadow').show();
		},
		complete : function(){
			$('#menu-shadow').hide();
		}
	});
	

}
var $_GET = (function(){
	var url = window.document.location.href.toString();
	var u = url.split("?");
	if(typeof(u[1]) == "string"){
		u = u[1].split("&");
		var get = {};
		for(var i in u){
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	}
})();
String.prototype.colorHex = function(){
	var that = this;
	if(/^(rgb|RGB)/.test(that)){
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
		var strHex = "#";
		for(var i=0; i<aColor.length; i++){
			var hex = Number(aColor[i]).toString(16);
			if(hex === "0"){
				hex += hex;	
			}
			strHex += hex;
		}
		if(strHex.length !== 7){
			strHex = that;	
		}
		return strHex;
	}else if(reg.test(that)){
		var aNum = that.replace(/#/,"").split("");
		if(aNum.length === 6){
			return that;	
		}else if(aNum.length === 3){
			var numHex = "#";
			for(var i=0; i<aNum.length; i+=1){
				numHex += (aNum[i]+aNum[i]);
			}
			return numHex;
		}
	}else{
		return that;	
	}
};
function showDetail(id){
	$.ajax({
		type : 'post',
		url : appurl+'/App/Interface/fetchgoodsdetail',
		data : {
			id : id,
		},
		success : function(response , status , xhr){
			$('#mcover').show();
			var json = eval(response);
			$('#detailpic').attr('src',rooturl+'/Public/Uploads/'+json.image);
			$('#detailtitle').html(json.title);
			$('#detailinfo').html(json.detail);
		}
	});
}
function showMenu(){
	$("#menu").find("ul").toggle();
}
function toggleBar(){
	$(".footermenu ul li a").each(function(){
		$(this).attr("class","");
	});
	$(this).children("a").attr("class","active");
}
function showProducts(id) {
	$('.menu .ccbg dd').each(function(){
		if( $(this).attr("menu") == id ){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
	$('#menu ul').hide();
}
function showAll() {
	$('.menu .ccbg dd').each(function(){
		$(this).show();
	});
	$('#menu ul').hide();
}