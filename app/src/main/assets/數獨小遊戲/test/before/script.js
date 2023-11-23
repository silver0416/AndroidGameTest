var stepNum = 0;	// 步数

var second = 0;
var minute = 0;
var hour = 0;
var timer = null;	// 计时器

/**
 * 页面加载初始化
 */
$(function(){
	initSudokuArea();
	setVisible();
	levelChange();
	bindClick();
});

/**
 * 初始化数独区
 */
function initSudokuArea(){
	$("#sudokuArea").children().remove();
	var table = "<table style='width: 100%;height: 100%;'><tbody>";
	for(var i=0; i<9; i++){
		table += "<tr>";
		for(var j=0; j<9; j++){
			table += "<td id='" + (i+1) + "_" + (j+1) + "' class='number' " +
					"onclick=leftCellClick(this.id) ></td>";
			
			if(j == 2 || j == 5){
				table += "<td style='width:3px; height:32px; background:#ffffff;'></td>";
			}
		}
		table += "</tr>";
		
		if(i == 2 || i == 5){
			table += "<tr style='width:40px; height:3px; background:#ffffff;'></tr>";
		}
	}
	table += "</tbody></table>";
	$("#sudokuArea").append(table);
	
	var created = createSudokuNumbers();
	while(!created){
		created = createSudokuNumbers();
	}
}

/**
 * 生成一份数独答案
 */
function createSudokuNumbers(){
	var created = true;
	for(var i=1; i<=9; i++){
		for(var j=1; j<=9; j++){
			var sudokuNumber = createEnableNumber(i, j);
			if(sudokuNumber == undefined){
				// createSudokuNumbers();
				created = false;
				return created;
			}else{
				$("#"+ i + "_" + j)[0].innerText = sudokuNumber;
			}
		}
	}
	return created;
}

/**
 * 生成可填入的数字
 */
function createEnableNumber(x, y){
	var num = "";
	var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	
	// 横向去重
	for(var i=1; i<=9; i++){
		var text = $("#"+ x + "_" + i)[0].innerText;
		if(i != y && text != ""){
			for(var j=0; j<numbers.length; j++){
				if(numbers[j] == text){
					numbers.splice(j,1);
					break;
				}
			}
		}
	}
	
	// 纵向去重
	for(var i=1; i<=9; i++){
		var text = $("#"+ i + "_" + y)[0].innerText;
		if(i != x && text != ""){
			for(var j=0; j<numbers.length; j++){
				if(numbers[j] == text){
					numbers.splice(j,1);
					break;
				}
			}
		}
	}
	
	// 小九宫内去重
	var m = 0;
	var n = 0;
	if(x == 1 || x == 2 || x == 3){
		m = 3;
	}
	if(x == 4 || x == 5 || x == 6){
		m = 6;
	}
	if(x == 7 || x == 8 || x == 9){
		m = 9;
	}
	
	if(y == 1 || y == 2 || y == 3){
		n = 3;
	}
	if(y == 4 || y == 5 || y == 6){
		n = 6;
	}
	if(y == 7 || y == 8 || y == 9){
		n = 9;
	}
	
	for(var i=m-2; i<=m; i++){
		for(var j=n-2; j<=n; j++){
			var text = $("#"+ i + "_" + j)[0].innerText;
			if(i != x && j != y && text != ""){
				for(var k=0; k<numbers.length; k++){
					if(numbers[k] == text){
						numbers.splice(k,1);
						break;
					}
				}
			}
		}
	}
	
	num = numbers[Math.ceil(Math.random() * numbers.length)-1];
	return num;
}

/**
 * 根据难度设置可见数字（随机）
 */
function setVisible(){
	var level = parseInt($("#level")[0].value);
	var randoms = [];
	while(randoms.length < level){
		var isExists = false;
		var random = parseInt(81 * (Math.random()))+1;	// 获取一个1–81范围的数
		for(var i=0; i<randoms.length; i++){	// 判断当前随机数是否已经存在
			if (random == randoms[i]) {
				isExists = true;
				break;
			}
		}
		
		if(!isExists){	// 如果不存在，则添加进去
			randoms.push(random);
		}
	}
	
	for(var i=0; i<randoms.length; i++){	// 计算出id，并对该id相对于的数字赋与背景色不同的颜色让其显示出来
		var x = (randoms[i]%9 == 0 ? parseInt(randoms[i]/9) : (parseInt(randoms[i]/9) + 1));
		var y = (randoms[i]%9 == 0 ? 9 : randoms[i]%9);
		var id = (x + "_" + y);
		$("#" + id).css("color", "#66b8ff");
		$("#" + id).addClass("displayed");
	}
	
	for(var i=1; i<=9; i++){
		for(var j=1; j<=9; j++){
			var id = i + "_" + j;
			if($("#" + id)[0].className.indexOf("displayed") == -1){
				$("#" + id)[0].innerHTML = "";
			}
		}
	}
}

/**
 * 难度选择改变事件
 */
function levelChange(){
	$("#level").on("change", function(){
		// 重置步数
		stepNum = 0;
		
		// 重置定时器
		clearInterval(timer);
		second = 0;
		minute = 0;
		hour = 0;
		$("#second")[0].innerHTML = digitalProcessing(second);
		$("#minute")[0].innerHTML = digitalProcessing(minute);
		$("#hour")[0].innerHTML = digitalProcessing(hour);
		
		// 重新绘制数独区
		initSudokuArea();
		setVisible();
		bindClick();
	});
}

/**
 * 绑定点击事件
 */
function bindClick(){
	// 设置单击页面如何位置输入小键盘隐藏
	$("body").on("click", function(){
		$("#selectNumArea").css("display", "none");
	});
	
	// 设置右键单击页面如何位置不显示浏览器默认菜单
	$("body").bind("contextmenu", function(){
		window.event.returnValue = false;
		return false;
	});
	
	// 给所有 .number的td 标签绑定右键单击事件
	$(".number").bind("contextmenu", function(e){
		var id = e.target.id;
		rightCellClick(id)
	});
	
	// 输入小键盘的点击事件
	var selectNums = $(".selectNum");
	for(var i=0; i<selectNums.length; i++){
		selectNums[i].onclick = function(e){
			var selectedId = $(".selected")[0].id;
			var selectNum = e.target.innerHTML;
			var selectNumId = e.target.id;
			selectNumClick(selectedId, selectNum, selectNumId);
		};
	}
}

/**
 * 左单击事件
 */
function leftCellClick(id){
	$("#selectNumArea").css("display", "none");
	setCSS(id);
}

/**
 * 右单击事件
 */
function rightCellClick(id){
	if($("#" + id)[0].className.indexOf("displayed") == -1){
		$("#selectNumArea").css("display", "block");
	}else{
		$("#selectNumArea").css("display", "none");
	}
	setCSS(id);
}

/**
 * 输入小键盘单击事件
 */
function selectNumClick(id, selectNum, selectNumId){
	stepNum++;
	$("#" + id).css({"color":"black"});
	if(selectNum != "空"){
		$("#" + id)[0].innerHTML = selectNum;
		$("#" + id).addClass("inputNum");
	}else{
		$("#" + id).removeClass("inputNum");
		$("#" + id)[0].innerHTML = "";
	}
	setCSS(id);
	
	// 去除所有 same 样式
	var numbers = $(".number");
	for(var i=0; i<numbers.length; i++){
		$("#" + numbers[i].id).removeClass("same");
	}
	
	// 判断所有新录入的数字与相关行、列、小九宫中数字重复并闪烁提醒
	var inputNums = $(".inputNum");
	for(var i=0; i<inputNums.length; i++){
		searchSameNum(inputNums[i].id);
	}
	
	if(stepNum == 1){
		timer = setInterval(function(){setTimer();},1000);
	}
	
	// 判断是否填完且正确
	var displayedNum = $(".displayed");
	var sameNum = $(".same");
	if((displayedNum.length + inputNums.length) == 81 && sameNum.length == 0){
		clearInterval(timer);
		$("#selectNumArea").css("display", "none");
		alert("恭喜闯关闯关！（Congratulations on breaking through the customs!）");
	}
}

/**
 * 查重复数字
 */
function searchSameNum(id){
	var x = id.split("_")[0];	// 行
	var y = id.split("_")[1];	// 列
	var t = $("#" + id)[0].innerText;	// 值
	
	// 行查重
	for(var i=1; i<=9; i++){
		var text = $("#" + x + "_" + i)[0].innerText;
		var className = $("#" + x + "_" + i)[0].className;
		if(text == t && ((x + "_" + i) != id) && 
			(className.indexOf("displayed") != -1 || className.indexOf("inputNum") != -1)){
			$("#" + id).addClass("same");
			$("#" + x + "_" + i).addClass("same");
		}
	}
	
	// 列查重
	for(var i=1; i<=9; i++){
		var text = $("#" + i + "_" + y)[0].innerText;
		var className = $("#" + i + "_" + y)[0].className;
		if(text == t && ((i + "_" + y) != id) && 
			(className.indexOf("displayed") != -1 || className.indexOf("inputNum") != -1)){
			$("#" + id).addClass("same");
			$("#" + i + "_" + y).addClass("same");
		}
	}
	
	// 小九宫查重
	var m = 0;
	var n = 0;
	if(x == 1 || x == 2 || x == 3){
		m = 3;
	}
	if(x == 4 || x == 5 || x == 6){
		m = 6;
	}
	if(x == 7 || x == 8 || x == 9){
		m = 9;
	}
	
	if(y == 1 || y == 2 || y == 3){
		n = 3;
	}
	if(y == 4 || y == 5 || y == 6){
		n = 6;
	}
	if(y == 7 || y == 8 || y == 9){
		n = 9;
	}
	
	for(var i=m-2; i<=m; i++){
		for(var j=n-2; j<=n; j++){
			var text = $("#"+ i + "_" + j)[0].innerText;
			var className = $("#" + i + "_" + j)[0].className;
			if(text == t && ((i + "_" + j) != id) && 
				(className.indexOf("displayed") != -1 || className.indexOf("inputNum") != -1)){
				$("#" + id).addClass("same");
				$("#" + i + "_" + j).addClass("same");
			}
		}
	}
}

/**
 * 设置样式
 */
function setCSS(id){
	// 棋盘样式
	var numbers = $(".number");
	for(var i=0; i<numbers.length; i++){
		$("#" + numbers[i].id).css({"border":"3px solid blue"});
		$("#" + numbers[i].id).removeClass("selected");
	}
	$("#" + id).css({"border":"3px solid #0f0"});
	$("#" + id).addClass("selected");
	
	// 输入小键盘样式
	var x = "0px";
	var y = "0px";
	x = ($("#" + id).offset().left - 40) + "px";	// 根据点击的单元格的位置设置输入小键盘显示的位置
	y = ($("#" + id).offset().top - 100) + "px";
	$("#selectNumArea").css({"left":x, "top":y});
	
	var selectNums = $(".selectNum");
	for(var i=0; i<selectNums.length; i++){
		$("#" + selectNums[i].id).css({"border":"3px solid #08f"});
	}
}

/**
 * 计时器
 */
function setTimer(){
	if(second < 59){
		second++;
	}else{
		second = 0;
		if(minute < 59){
			minute++;
		}else{
			minute = 0;
			if(hour < 23){
				hour++;
			}else{
				clearInterval(timer);
			}
		}
	}
	
	$("#second")[0].innerHTML = digitalProcessing(second);
	$("#minute")[0].innerHTML = digitalProcessing(minute);
	$("#hour")[0].innerHTML = digitalProcessing(hour);
};

/**
 * 数字处理
 * 小于10的数字前面加0
 */
function digitalProcessing(number){
	var num = parseInt(number);
	if(num < 10){
		num = "0" + num;
	}
	return num;
};