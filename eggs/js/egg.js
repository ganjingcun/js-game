var names = ['汤丽芳','王必杰','张鸿辉','陈燕淑','林凯','李播','苏晓超','黄国鸿','李志艺','刘妍',
    '白涛','陈雅清','孟丹丹','张宝婷','陈峰','张煜轩','刘禹君','陈婷婷','李协成','黄艳丽','王振璜'
];


var runingmic=document.getElementById("runingmic");
var pausemic=document.getElementById("pausemic");laugh
var laugh=document.getElementById("laugh");

function eggClick(obj) {
    var _this = obj;

    pausemic.play();

    var rand = Math.floor(Math.random() * names.length);

    var it = rand;
    if (_this.hasClass("curr")) {
        var r= '<h2>蛋都碎了，别砸了！刷新再来.</h2>';
        var dd = dialog({
            quickClose: true,
            content: r,
            okValue: '确定'
        });
        dd.show();
        return false;
    }

    _this.addClass("curr"); //蛋碎效果
    _this.find("sup").show(); //金花四溅
    var r= '<h2>'+names[it]+', 恭喜您成为本周幸运之星！</h2>';
    var dd = dialog({
        quickClose: true,
        content: r,
        okValue: '确定'
    });
    dd.show();
    $("#pig").show();
    laugh.play()
}


$("li").click(function () {
    $(this).children("span").hide();
    eggClick($(this));
});


document.onmousemove = function (e) {
    var e = e || window.event;
    var divx = e.clientX;
    var divy = e.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    var hammer = document.getElementById('hammer');
    hammer.style.left = divx - 10 + 'px';
    hammer.style.top = divy - 10 + 'px';
}