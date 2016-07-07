var bodyWidth = $("body").css("width");
$("div.items").css("width",(bodyWidth.substring(0,bodyWidth.length-2)-380)+"px");


var names = ['陈峰','黄艳丽','孟丹丹','李志艺','许明杰','陈淸基','林凯','方颖騏','李协成','陈燕淑'
	,'黄帅','李播','刘妍','陈婷婷','黄国鸿','卢梦琪','祝煜','常登凯','张宝婷','张煜轩'
	,'霍冲','张朴科','王振煌','江龙','朱虹宏','苏晓超','李智荣','王必杰','刘禹君','游月传'
	,'张鸿辉'];

//参与抽奖人数初始值
var itemCount= names.length;
//跑马灯循环
var tx;
var runtx;
//是否正在运行跑马灯
var isRun=true;
//是否跑马灯暂停状态
var pause =false;

//默认跑马灯频率
var pl=50;
//程序是否开始运行用于判断程序是否开始运行
var isStart=false;
	
var zzs = "#98ff98";
//跑马灯音效
var runingmic=document.getElementById("runingmic");
runingmic.volume=0.5;
//中奖音效
var pausemic=document.getElementById("pausemic");
pausemic.volume=1.0;

var keyStatus=false;

$("document").ready(function(){
    
    //初始化皮肤
    if(localStorage.getItem("pf")){
		var	pf = localStorage.getItem("pf");
		dynamicLoading.css("./css/style"+pf+".css");
		$("#bodybg img").attr("src","./images/bodybg"+pf+".jpg");
		$("input[name=pf][value="+pf+"]").attr("checked",true);
		if(pf!=1){
		    zzs="#ba3030";
		}
	}
    //初始化标题
    if(localStorage.getItem("title")){
		$("#title").val(localStorage.getItem("title"));
	}
    $(".top").text($("#title").val());
    
    //频率模式本地存储  	 
	if(localStorage.getItem("ms")){
		pl = localStorage.getItem("ms");
		$("input[name=ms][value="+pl+"]").attr("checked",true);
	}
	//排名信息本地存储
	if(localStorage.getItem("sequence")){
        var ssHtml = localStorage.getItem("sequence");
		$(".ss").html(ssHtml);
	}
	

	//创建item小方格
	for(var i=0;i<itemCount;i++){
		$("div.items").append("<div class='item i"+i+"'>"+names[i]+"</div>");
    }

	
	//初始化排序信息
	$(".ss li").each(function(idx,item){
		$(".i"+$(item).attr("data-number")).addClass("ignore");
	});
	
	
    $("body").keyup(function(e){
    	keyStatus=false;
	});
	//全局键盘事件监听
	$("body").keydown(function(e){

		if(isStart){
			if(!keyStatus){
			keyStatus=true;
			}else{
				return false;
			}
		}
		if(e.keyCode==116||e.keyCode==8){
			return true;
		}
		//按F1弹出帮助窗口
		if(e.keyCode==112){
			e.preventDefault();
			showReadme();
			return false;
		}
		//ESC案件呼出隐藏菜单
		if(e.keyCode==27){
			if($(".help:hidden").size()>0)
				$(".help").show();
			else
				$(".help").hide();
			
			return false;
		}
        
		if(e.keyCode==37){
			$(".prev").click();
			return false;
		}
		if(e.keyCode==39){
			$(".next").click();
			return false;
		}
		//当程序出于暂停状态
		if(pause){
			//以下按键有效 数字键 0-9 和 小键盘 0-9
			return true;
		}
		//存在未中奖用户切程序出于未开始运行状态执行开始方法
		if((e.keyCode==32||e.keyCode==65)&&$("div.item:not(.ignore)").size()!=0&&!isStart){
			isStart=!isStart;
			startApp();
			
			// setTimeout("autoStop()",5000)
			return false;
		}
		

		//a 和 空格
		if(e.keyCode==32||e.keyCode==65){
			stop();
		}
		
		e.preventDefault();
	});
	
	//打开高级设置窗口	 
	$("a.config").click(function(){
		pause=true;
		runingmic.pause();
		var d = dialog({
			title: '抽奖参数设定',
		    content: $(".model"),
		    okValue: '确定',
		    ok: function () {
		    	if($("#reset:checked").val()&&confirm("点击确定将清空抽奖结果。")){
		    		localStorage.removeItem("sequence");
		    	}
		    	if($("#personCount").val()){
		    		localStorage.setItem("itemCount",$("#personCount").val());
		    	}
		   		if($("#itemk").val()){
		   			localStorage.setItem("itemk",$("#itemk").val());
		    	}
		   		if($("#itemg").val()){
		    		localStorage.setItem("itemg",$("#itemg").val());
		    	}
		    	localStorage.setItem("title",$("#title").val());
		    	localStorage.setItem("ms",$("input[name=ms]:checked").val());
		    	localStorage.setItem("pf",$("input[name=pf]:checked").val());
		    	
		    	window.location.reload();
		    },onclose: function () {
		        pause=false;
		    }
			});
			d.show();
		 });
	

});

function autoStop(){
	isStart=!isStart;
	stop();
}

function stop(){
	//当所有抽奖号全部抽取完毕则销毁跑马和音效循环
	if($("div.item:not(.ignore)").size()==0){
		alert("抽奖已经全部结束。");
		clearInterval(tx);
		clearInterval(runtx);
		runingmic.puase();	
		return false;
	}
	
	//更新运行状态
	isRun=!isRun;
	//如果项目出于运行状态
	if(!isRun){
		//取得当前选中号码
		var it = $(".item.active").text();
		//停止跑马灯
		runingmic.pause();
		//播放中奖音效
		pausemic.currentTime = 0;
		pausemic.play();
		$('.ss ol').append('*****'+it+'*****');
        var r= '<h2>'+it+', 恭喜您成为本周幸运之星！</h2>';
        var dd = dialog({
                title: '抽奖结果',
                content: r,
                okValue: '确定'
            });
        dd.show();

		$(".item.active").addClass("ignore");
		$(".item.active").pulsate({
			color: zzs,        //#98ff98
			repeat: 5
		});
	}else{
		$(".active").removeClass("active");
		runingmic.play();
	}
}

//程序开始入口
function startApp(){
	//开始播放跑马灯音效
	runingmic.play();
 	//产生随机数临时变量
	var rand =0
	//存储上一次随机数的临时变量
	var prenum;
	tx=setInterval(function(){
	    if(isRun){
	    	while(true){
				rand=Math.floor(Math.random() * ( $("div.item:not(.ignore)").size()));
				console.log(rand);
			 	if(rand ==0 || rand!=prenum){break;}
			}
			prenum=rand;
			$(".item.active").removeClass("active");
			$("div.item:not(.ignore):not(.active)").eq(rand).addClass("active");
		}
	},pl);
	runtx = setInterval(function(){runingmic.currentTime = 0;},7000);
}
function showReadme(){
	var d = dialog({
		    title: '帮助信息',
		    content: $(".readme") ,
		    width:'400px',
		    okValue: '关闭',
			ok:function(){
		    },
		    onclose: function () {
		        pause=false;
		    }
	}).show();
}

var dynamicLoading = {
    css: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
}