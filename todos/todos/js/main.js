$(document).ready(function(e){
	


	getData();
	
	
	
	var $width = $(window).width();
    var $height = $(window).height()-60;
    if($width <= 1024){
      $width = 1024;
    }
    $("body").css({width:$width,height:$height});
    $("body > div.box").css({width:$width,height:$height});
    $("body div.box-left").css({height:$height-10});
    $("body div.box-right").css({height:$height-10});

    //获取当前时间
    function p(s) {
      return s < 10 ? '0' + s: s;
    }
    var myDate = new Date();
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate(); 
    $('.date').append(year+'/'+p(month)+"/"+p(date));

    // 输入事件
    $('.add').blur(function(){
    	list.add();
    	getData();
    });

    $('.add').bind('keydown',function(e){
    	var key = e.which;
    	if(key == 13){
    		e.preventDefault();
    		list.add();
    		getData();
    	}

    });

    // 全选事件
    $('#allChoose').click(function(){
    	
    	for(var i = 0;i<data.length;i++){
    		if($(this).prop('checked')){
    			data[i].state = true;
	    		$('.check input').prop('checked',true);
	    	}else{
	    		$('.check input').prop('checked',false);
	    		data[i].state = false;
	    	}
    		
    	}
    	console.log(data);
    	localStorage.setItem('list',JSON.stringify(data));
    	getData();
    })

    // 删除勾选项
    $('#remove').click(function(){
    	for(var i = 0;i<data.length;i++){
    		if(data[i].state){
    			delete data[i];
				data.splice(i,1);
				i--;
    		}
    	}
    	console.log(data);
    	localStorage.setItem('list',JSON.stringify(data));
    	getData();
    });

    // 切换菜单事件
    $('.box-left ul li').click(function(){
    	$('.box-left ul li').removeClass('act');
    	$(this).addClass('act');
    	localStorage.setItem('tab',$(this).children('a').attr('class'));
    	getData();
    })

});

//读取数据
function getData(){
	$('.check').remove();
	if(localStorage.getItem('list')){
		var allChecked =0;
		data = JSON.parse(localStorage.getItem('list'));
		console.log(data);
		for(var i=0; i<data.length; i++){
			// 确定菜单
			if(localStorage.getItem('tab')=="all"||!localStorage.getItem('tab')){
				$('.box-left ul li.all').addClass('act');
				$('.list ul').append("<li class='check'><input id="+data[i].id+" type='checkbox' name=''><label for="+data[i].id+">"+data[i].val+"</label><span class='delet'>X</span></li>");
				if(data[i].state){
					allChecked++;
					$('.check #'+data[i].id+'').prop('checked',true);
					$('#remove').css({'display':'block','background':'red'});
				}
			}else if(localStorage.getItem('tab')=="active"){
				$('.box-left ul li.active').addClass('act');
				if(!data[i].state){
					$('.list ul').append("<li class='check'><input id="+data[i].id+" type='checkbox' name=''><label for="+data[i].id+">"+data[i].val+"</label><span class='delet'>X</span></li>");
					$('.check #'+data[i].id+'').prop('checked',false);
				}else{
					allChecked++;
				}
				$('#remove').css('display','none');
			}else if(localStorage.getItem('tab')=="compeleted"){
				$('.box-left ul li.compeleted').addClass('act');
				if(data[i].state){
					$('.list ul').append("<li class='check'><input id="+data[i].id+" type='checkbox' name=''><label for="+data[i].id+">"+data[i].val+"</label><span class='delet'>X</span></li>");
					$('.check #'+data[i].id+'').prop('checked',true);
					allChecked++;
					$('#remove').css({'display':'block','background':'red'});
				}
			}
			
		}
		// 确定条数
		n = $('.list ul li').length;
		$('.item i').html(n);
		// 确定是否重选
		if(allChecked == data.length){
			$('#allChoose').prop('checked',true);
		}

		list.delete();
		list.choose();
		
	}
	// 确定是否显示全选
	if($('.list ul li').length==0){
		$('.haveVal').css('display','none');
	}else{
		$('.haveVal').css('display','block');
		n = $('.list ul li').length;
		$('.item i').html(n);
	}
}

var n;
var data = [];
var list = {
	add:function(){
		var val = $('.add').val();
		if(!val) return;
		var math = parseInt(Math.random()*1000);
		$('.list ul').append("<li class='check'><input id="+math+" type='checkbox' name=''><label for="+math+">"+val+"</label><span class='delet'>X</span></li>");
		$('.haveVal').css('display','block');
		n = $('.list ul li').length;
		$('.item i').html(n);

		var obj = {
			id:math,
			state:$(this).children('input').is(':checked'),
			val:$('.add').val()
		}
		data.push(obj);
		localStorage.setItem('list',JSON.stringify(data));
	
		$('.add').val('');
		this.delete();
		this.choose();
		$('.all input').prop('checked',false);
		
	},
	choose:function(){
		$('.check input').unbind('click');
		$('.check input').click(function(){
			var num=0;
			for(var i=0;i<data.length;i++){
				if(data[i].id == $(this).attr('id')){
					data[i].state = $(this).is(':checked')
				}
				if(data[i].state == true){
					num++;
				}
				
			}

			if (num ==data.length){
				$('.all input').prop('checked',true);
			}else{
				$('.all input').prop('checked',false);
			}
			
			console.log(data);
			localStorage.setItem('list',JSON.stringify(data));
			getData();
		})
	},
	delete:function(){
		$('.delet').unbind('click');
	    $('.delet').click(function(){
	    	var num1=0;
		    $(this).parent().remove();
		    n = $('.list ul li').length;
		    $('.item i').html(n);
		    for(var i=0;i<data.length;i++){
				if(data[i].id == $(this).siblings('input').attr('id')){
					delete data[i];
					data.splice(i,1);
				}else if(data[i].state){
					num1++;
				}
				if(num1==data.length){
					$('.all input').prop('checked',true);
				}
				if(num1 == 0){
					$('.all input').prop('checked',false);
				}	
				
			}
			
			console.log(data);
			localStorage.setItem('list',JSON.stringify(data));
		});
	}
}
// function add(){
// 	n++;
// 	var val = $('.add').val();
// 	if(!val) return;
// 	$('.item i').html(n);
// 	$('.list ul').append("<li class='check'><input id='1' type='checkbox' name=''><label for='1'></label>"+val+"<span class='delet'>X</span></li>");
// 	$('.haveVal').css('display','block');
// 	$('.add').val('');
// 	delete();
// }


// function delete() {
// 	// 删除单项事件
// 	$('.delet').unbind('click');
//     $('.delet').click(function(){
// 	    $(this).parent().remove();
// 	});
// };