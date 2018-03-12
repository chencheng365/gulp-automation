var isPhone = (window.navigator.platform != "Win32");
var isAndroid = (window.navigator.userAgent.indexOf('Android')>=0)?true : false;

function $$(id)
{
    return document.getElementById(id);
}

function loading(){
    var newDiv = document.createElement("div");
    newDiv.id = "loadbg";
    newDiv.className = "ub ub-ac ub-ver ub-fv ub-pc up bc-wh"; 
    //setHtml(newDiv,'<div class="ub ub-ver ub-ac ub-pc ub-f1 ub-fh"><div id="loading_spinner" class="ub-img loadingImg" style=";width:98%;height:7.5em;"><div class="t-gra uinn" id="lodingTxt"></div></div></div>')
    var str = '<div class="spinner">'+
                  '<div class="rect1"></div>'+
                  '<div class="rect2"></div>'+
                  '<div class="rect3"></div>'+
                  '<div class="rect4"></div>'+
                  '<div class="rect5"></div>'+
                '</div>';
    setHtml(newDiv,str);
    document.body.appendChild(newDiv);
}
function removeLoad(){
	try {
		document.body.removeChild(document.getElementById("loadbg"));
	} catch (e) {
		
	}
}

function noResutl(id){
	if(id){
		document.getElementById(id).className = "ub ub-ac ub-ver ub-fv ub-pc"; 
		setHtml(id,'<div class="ub-f1 umh1"></div><div class="ub ub-ver ub-ac ub-pc"><div class="noMessage ub-img"></div><div class="content_font t-626262 uinn-top5">暂无数据</div></div><div class="ub-f1"></div>');
		//setHtml(id,'<div class="ub ub-ac ub-pc ub-f1"><img src="../css/img/noResult.png" class="uw10" style="width: 10em;margin-top: 10px;"/>');
	}else{
		var newDiv = document.createElement("div");
		newDiv.id = "noResult";
		newDiv.className = "ub ub-ac ub-ver ub-fv ub-pc";
		setHtml(newDiv,'<div class="ub-f1 umh1"></div><div class="ub ub-ver ub-ac ub-pc"><div class="noMessage ub-img"></div><div class="content_font t-626262 uinn-top5">暂无数据</div></div><div class="ub-f1"></div>');
		//setHtml(newDiv,'<div class="ub ub-ac ub-pc"><img src="../css/img/noResult.png" class="uw10" style="width: 10em;margin-top: 10px;"/>');
		document.body.appendChild(newDiv);
	}
		
}

function removeNoResutl(id,cn){
	try {
		if(id){
			document.getElementById(id).className = cn;
			document.getElementById(id).innerHTML = "";
		}else{
			document.body.removeChild($("#loadbg"));
		}
	} catch (e) {
		
	}
}



/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
	window.localStorage[key] = value;
}

/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
	if(window.localStorage[key])
		return window.localStorage[key];
	else
		return "";
}

/**
 * 清除缓存
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
	if(key)
		window.localStorage.removeItem(key);
	else
		window.localStorage.clear();
}

/**
 * alert 和 confirm 弹出框
 * @param String str 提示语
 * @param Function callback confirm的回调函数
 */
function $alert(str,callback){
	if(callback){
		uexWindow.cbConfirm = function(opId,dataType,data){
			if(data == 0)
				callback(); 
		}
		uexWindow.confirm('提示',str,['确定','取消']);
	}else
		uexWindow.alert('提示',str,'确定');
}
/**
 * alert 只有确定的alert
 * @param String str 提示语
 * @param Function callback confirm的回调函数
 */
function $alertONE(str,callback){
    if(callback){
        uexWindow.cbConfirm = function(opId,dataType,data){
            if(data == 0)
                callback(); 
        }
        uexWindow.confirm('提示',str,'确定');
    }else
        uexWindow.alert('提示',str,'确定');
}
/**
 * alert 和 confirm 有两种回调的弹框
 * @param String str 提示语
 * @param Function callback confirm的回调函数
 */
function emAlert(str,callback1,callback2){
    if(callback1&&callback2){
        uexWindow.cbConfirm = function(opId,dataType,data){
            if(data == 0){
                callback1(); 
            }else{
                callback2();
            }
                
        }
        uexWindow.confirm('提示',str,['同意','拒绝']);
    }else
        uexWindow.alert('提示',str,'确定');
}

/**
 * 根据时间戳获取年、月、日
 * @param String str 时间戳
 * @param Boolean f 是否在原来的基础上*1000，true要*，false或不填就不*
 */
function getMakeTimes(str,f){
	var t = (f) ? parseInt(str) : parseInt(str)*1000;
	var d = new Date(t);
	var y = d.getFullYear();
	var m = setNum(d.getMonth()+1);
	var dd = setNum(d.getDate());
	var h = setNum(d.getHours());
	var mm = setNum(d.getMinutes());
	return y+"."+m+"."+dd+ " "+h+":"+mm;
}

function setNum(s){
	return (parseInt(s)>9) ? s : '0'+s;
}

//获取现在的时间
function getNowDate(){

	var d = new Date();
	var y = d.getFullYear();
	var m = setNum(d.getMonth()+1);
	var dd = setNum(d.getDate());

	return y+"-"+m+"-"+dd;
}
function getNowTime(){
	var d = new Date();
	
	var h = setNum(d.getHours());
	var mm = setNum(d.getMinutes());
	return h+":"+mm;
}





/**
 * 判断是否是空
 * @param value
 */
function isDefine(value){
    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined'){
        return false;
    }
    else{
		value = value+"";
        value = value.replace(/\s/g,"");
        if(value == ""){
            return false;
        }
        return true;
    }
}


/**
 * 给DOM对象赋值innerHTML
 * @param String id 对象id或者对象
 * @param String html html字符串
 * @param String showstr 当html不存在时的提示语
 */
function setHtml(id, html,showstr) {
	var showval = isDefine(showstr)? showstr : "";
	if ("string" == typeof(id)) {
		var ele = document.getElementById(id);
		if (ele != null) {
			ele.innerHTML = isDefine(html) ? html : showval;
		}else{
			alert("没有id为"+id+"的对象");
		}
	} else if (id != null) {
		id.innerHTML = isDefine(html) ? html : showval;
	}
}





/**
 * 显示加载框
 * @param String mes 显示的提示语
 * @param String t  毫秒数 窗口存在时间 有的话显示框不显示那个“圈”，并且在t时间后消失
 */
function $toast(mes,t){
	uexWindow.toast(t?'0':'1','5',mes,t?t:0);
}



/**
 * getJSON请求数据的错误回调函数
 * @param {Object} err 返回的错误对象
 */
function getJSONError(err){
    $closeToast();
	resetBV(0);
	resetBV(1);
    if (err.message == 'network error!') {
        alert('网络未连接');
    }else if (err.message == 'json parse failed!') {
        alert('json解析失败');
    }else if (err.message == 'file does not exist!') {
		alert('文件不存在');
    }else if (err.message == 'read file failed!') {
		alert('文件读取错误');
    }else {
		alert('发现未知错误');
    }
}







//电话号码验证
function phone_check(t){
   var rePhone =  /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/ ;
    if (!rePhone.test(t)) 
        return false;
    return true;
}
    
//手机验证
function telphone_check(num){                
	if(!(/^\d{11}$/.test(num))){
	  return "手机号格式错误";
	}else{
		return true;
	}    
}

//表示以1开头，第二位可能是3/4/5/7/8等的任意一个，在加上后面的\d表示数字[0-9]的9位，总共加起来11位结束。
function checkPhone(phone){ 
    if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){ 
        return false;  
    }else{
        return true;
    } 
}
  












function timec(str){
	// alert("str======"+str);
    var n_date = new Date();
    var y = n_date.getFullYear();
    var m = setNum(n_date.getMonth()+1);
    var dd = setNum(n_date.getDate());
    var dangtian1 = y+"-"+m+"-"+dd;
    var h = setNum(n_date.getHours());
    var mm = setNum(n_date.getMinutes());
    var t1 = y+"-"+m+"-"+dd+ " "+h+":"+mm;
    str = parseInt(str);
    var date_ = new Date(str);
    y = date_.getFullYear();
    m = setNum(date_.getMonth()+1);
    dd = setNum(date_.getDate());
    var dangtian2 = y+"-"+m+"-"+dd;
    h = setNum(date_.getHours());
    mm = setNum(date_.getMinutes());
    var t2 = y+"-"+m+"-"+dd+ " "+h+":"+mm;
    if(dangtian1==dangtian2){
        return h+":"+mm;
    }else{
        return t2;
    }
}









//tingting.yan 
// //删除数组中指定的某个元素
// Array.prototype.indexOf = function(val) { //查找指定的元素在数组中的位置
            // for (var i = 0; i < this.length; i++) {
            // if (this[i] == val) return i;
            // }
            // return -1;
        // };
// Array.prototype.remove = function(val) {
    // var index = this.indexOf(val);
    // if (index > -1) {
    // this.splice(index, 1);
    // }
// };


function delHtmlTag(str){
return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



function loadingimg(id,url){
    var nimg =  new Image();
    nimg.src = url;
    nimg.onload = function(){
        document.getElementById(id).style.backgroundImage = 'url('+nimg.src+')';
    }
}



/**
 * 计算一个div的位置
 * @param {Object} obj 当前dome对象
 * 返回值："x,y" 坐标值，中间以逗号分隔
 */
function getPosition(obj){
    var topValue = 0, leftValue = 0;
    while (obj) {
        leftValue += obj.offsetLeft;
        topValue += obj.offsetTop;
        obj = obj.offsetParent;
    }
    finalvalue = leftValue + "," + topValue;
    return finalvalue;
}


/**
 * 时间戳转换日期
 * @param <int> unixTime   待时间戳(秒)
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int>  timeZone  时区
 */
function UnixToDate(unixTime, isFull, timeZone) {
    if ( typeof (timeZone) == 'number') {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getFullYear() + "-";
    ymdhis += ((time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)) + "-";
    ymdhis += time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    if (isFull === true) {
        ymdhis += " " + (time.getHours() < 10 ? '0' + time.getHours() : time.getHours()) + ":";
        ymdhis += (time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()) + ":";
        ymdhis += time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    }
    return ymdhis;
}






    function strlen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x1 && c <= 0x007e)(0xff60 <= c && c <= 0xff9f)) {
                len++;
            } else {
                len += 2;
            }
        }
        return len;
    }

    //Fri Oct 31 18:00:00 UTC+0800 2008     Wed Jul 15 2015 00:00:00 GMT+0800
    function Todate(num) {
        num = num + "";
        var date = "";
        var month = new Array();
        month["Jan"] = 1;
        month["Feb"] = 2;
        month["Mar"] = 3;
        month["Apr"] = 4;
        month["May"] = 5;
        month["Jan"] = 6;
        month["Jul"] = 7;
        month["Aug"] = 8;
        month["Sep"] = 9;
        month["Oct"] = 10;
        month["Nov"] = 11;
        month["Dec"] = 12;
        var week = new Array();
        week["Mon"] = "一";
        week["Tue"] = "二";
        week["Wed"] = "三";
        week["Thu"] = "四";
        week["Fri"] = "五";
        week["Sat"] = "六";
        week["Sun"] = "日";
    
        str = num.split(" ");
        date = str[3] + "-";
        var count = strlen(month[str[1]]);
        var m = month[str[1]];
        if ( count = 1) {
            m = "0" + month[str[1]];
        }
        date = date + m + "-" + str[2];
        return date;
    }


            //根据给定的值去删除数组中的元素
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

//计算字符串长度(英文占1个字符，中文汉字占2个字符)
function getStrLen(val) {    
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                len += 2; //如果是全角，占用两个字节
            else
                len += 1; //半角占用一个字节
        }
        return len;
} 

//根据元素的值移除数组元素中的值
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

function isDengLu() {
    var userId = getLocVal("userId");
    if(isDefine(userId)){
        return true;
    }else{
        appcan.window.open('login','login.html',11);
    }
}



function weekDay(d){
    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var dateStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/"))); 
    return myDate.getDay();
}
//根据身份证号判断性别
function discriCard(card){
    if (parseInt(card.substr(16, 1)) % 2 == 1) {
            return "男";
       } else {
            return "女";
       }
}


function validateIdCard(idCard) {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (idCard.length == 15) {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0,
            i;
        idCard = idCard.substr(0, 6) + '19' + idCard.substr(6, idCard.length - 6);
        for ( i = 0; i < 17; i++) {
            nTemp += idCard.substr(i, 1) * arrInt[i];
        }
        idCard += arrCh[nTemp % 11];
        var idCard = idCard;
    }
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            //将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);
            //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0;
            //用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }

            var idCardMod = idCardWiSum % 11;
            //计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17);
            //得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                    //alert("恭喜通过验证啦！");
                } else {
                    return false;
                    //alert("身份证号码错误！");
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    return true;
                    // alert("恭喜通过验证啦！");
                } else {
                    return false;
                    // alert("身份证号码错误！");
                }
            }
        }
    } else {
        return false;
        // alert("身份证格式不正确!");
    }
}

//计算字符串长度(英文占1个字符，中文汉字占2个字符)

function getStrLen(val) {    //传入一个字符串
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
                len += 2; //如果是全角，占用两个字节
            else
                len += 1; //半角占用一个字节
        }
        return len;
}
//正则表达式   匹配 数字英文和汉字的 其他的一律不能输入
function checkStr(str){
    var regx = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
    if(regx.test(str)){
        return false;     
    } else {
        return true;
    } 
}

//数组对象排序
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
} 