/* 設定 */
var URL = 'http://www.frozenfair.com/frozenfair_apps/',
dataUrl = URL + 'store_data/store_name.php',
reisyokuUrl = URL + 'store_data/reisyoku_data.php',
iceUrl = URL + 'store_data/ice_data.php',
iRankUrl = URL + 'store_data/ice_rank.php',
rRankUrl = URL + 'store_data/reisyoku_rank.php',
enqUrl = URL + 'store_data/enq_data.php',
enq_cUrl = URL + 'store_data/enq_c.php';
voteUrl = URL + 'store_data/vote_query.php';
lotoUrl = URL + 'store_data/random.php';

/* 共通 */
$(function(){
    var touchsupport = ('ontouchstart' in window); //タッチイベントの切り替え判定
    if(touchsupport){
		touchstart = 'touchstart';
		touchmove = 'touchmove';
		touchend = 'touchend';
	}else{
		touchstart = 'mousedown';
		touchmove = 'mousemove';
		touchend = 'mouseup';
	}
});

/* 店舗選択 */
$(function(){　//店舗データ読み込み
	storeData(dataUrl) ;
	ame();
});
$(function(){　//店舗セレクト
	$('#store_select .bt.st').on(touchstart,function() {
		toggleScr('#store_select','#wait');
		$('.selected_store').text($(this).data('id'));
		reisyokuData(reisyokuUrl,iceUrl,enqUrl,enq_cUrl);
		setTimeout(function(){
				toggleScr('#wait','#start');
		},3000);
	});
});

/* スタート*/
$(function(){　//店舗選択に戻る
	$('#start .bt.rt').on(touchstart,function() {
		toggleScr('#start','#store_select');
		$('.reisyoku_data,.ice_data').text("");
		$('.enq6 .answer,.enq6 .data_area,.enqC2 .answer').html("");
	});
});
$(function(){　//結果速報へ
	$('#start .bt.rn').on(touchstart,function() {
		toggleScr('#start','#wait');
		rRankData(rRankUrl,iRankUrl);
		setTimeout(function(){
			toggleScr('#wait','#ranking');
		},1000);
	});
});
$(function(){　//冷食投票へ
	$('#start .bt.st').on(touchstart,function() {
		toggleScr('#start','#reisyoku_vote,#keyBoard,#reset');
		randomBack(9,'.lose','lose');
	});
});

/* 結果速報*/
$(function(){　//スタートに戻る
	$('#ranking .bt.rt').on(touchstart,function() {
		toggleScr('#ranking,.i_ranking,.ranking06,.i_ranking  .ranking01','#start,.r_ranking,.r_ranking  .ranking01');
	});
});
$(function(){　//冷食1～5位
	$('#ranking .r1').on(touchstart,function() {
		toggleScr('.r_ranking .ranking06,.i_ranking .ranking01,.i_ranking .ranking06','.r_ranking, .r_ranking .ranking01');
	});
});
$(function(){　//冷食6～10位
	$('#ranking .r6').on(touchstart,function() {
		toggleScr('.r_ranking .ranking01,.i_ranking .ranking01,.i_ranking .ranking06','.r_ranking, .r_ranking .ranking06');
	});
});
$(function(){　//アイス1～5位
	$('#ranking .i1').on(touchstart,function() {
		toggleScr('.i_ranking .ranking06,.r_ranking .ranking01,.r_ranking .ranking06','.i_ranking, .i_ranking .ranking01');
	});
});
$(function(){　//アイス6～10位
	$('#ranking .i6').on(touchstart,function() {
		toggleScr('.i_ranking .ranking01,.r_ranking .ranking01,.r_ranking .ranking06','.i_ranking, .i_ranking .ranking06');
	});
});

/* 人気投票 */
$(function(){　//リセット
	$('#reset').on(touchstart,function() {
		reset();
	});
});
$(function(){
	$('.button.tenKey').on(touchstart,function() { //キータッチアニメーション
		$(this).addClass("keyTouch");
		setTimeout(function(){
			$('.button.tenKey').removeClass("keyTouch");
		},50);
		var flag = $(this).data("id"),display = $('.num_display').text(),len=$('.num_display').text().length,i_flag = $('#vote1').val();
		if(i_flag == ""){
			if(len <= 2){
				if(len == 0 && flag == 0){
					return false;
				} else {
					$('.num_display').append(flag);
				}
			}
		} else {
			if(len <= 2){
				if(len == 0 && flag != 1){
					return false;
				} else {
					$('.num_display').append(flag);
				}
			}
		}
		if(flag == "C"){
			$('.num_display').text("");
		}
	});
});
$(function(){
	$('#reisyoku_vote .button.agree').on(touchstart,function() { //冷食の選択
		var display = parseInt($('.num_display').text()),max_no = parseInt($('.reisyoku_len').text()),len=$('.num_display').text().length;
		if(display <= max_no){
			confirm('reisyoku');
		} else {
			unconfirm();
			$('#reisyoku_vote .fukidashi').removeClass("hide");
			setTimeout(function(){
				$('#reisyoku_vote .fukidashi').addClass("hide");
			},1500);
		}
	});
	$(document).on(touchstart,'#reisyoku_vote .bt.agree',function() { //OK
		$('#vote1').val($(this).data('id'));
		unconfirm();
		toggleScr('#reisyoku_vote','#ice_vote');
	});
});
$(function(){
	$('#ice_vote .button.agree').on(touchstart,function() { //アイスの選択
		var display = parseInt($('.num_display').text()),max_no = parseInt($('.ice_len').text()) + parseInt(100),len=$('.num_display').text().length;
		if(len == 3){
			if(display <= max_no && display > 100){
				confirm('ice');
			} else {
				unconfirm();
				$('#ice_vote .fukidashi').removeClass("hide");
				setTimeout(function(){
					$('#ice_vote .fukidashi').addClass("hide");
				},1500);
			}
		}
	});
	$(document).on(touchstart,'#ice_vote .bt.agree',function() { //OK
		$('#vote2').val($(this).data('id'));
		unconfirm();
		toggleScr('#ice_vote,#keyBoard','#enq');
	});
});
$(function(){
	$('.bt.cancel').on(touchstart,function() { //キャンセル
		unconfirm();
	});
});
/* アンケート */
$(function(){
	enq_query('enq1',null,'.enq2'); //アンケート1
	enq_query('enq2','.enq1,.enq2','.enq3','e_1','e_2',"[1]～9さい",'.enqC1','e_C1'); //アンケート2
	enq_query2('enq3','.enq3','.enq4','e_2','e_3'); //アンケート3
	enq_query('enq4','.enq4','.enq5','e_3','e_4'); //アンケート4
	enq_query('enq5','.enq5','.enq6','e_4','e_5'); //アンケート5
	enq_query2('enq6','.enq6,#enq','#wait','e_5','e_1'); //アンケート6
	$('.enq6 .agree').on(touchstart,function() { //アンケート6追加
		loto(lotoUrl);
	});
	enq_query('enqC1','.enqC1','.enqC2','e_C1','e_C2'); //子ども用アンケート1
	enq_query('enqC2','.enqC2,#enq','#wait','e_C2','e_1'); //子ども用アンケート2
	$(document).on(touchstart,'.enqC2 .item',function() { //子ども用アンケート2追加
		$('.enqC2 .item').removeClass("unselected").removeClass("selected");
		$('#loto').val("child");
		$(".lose").removeClass('hide');
		$("audio#show_m").attr("src","mp3/lose.mp3");
		send(voteUrl);
	});
});

/* 抽選スタート */
$(function() { 
	$('#thx .btn').on(touchstart,function() {
		$('#lock').removeClass("hide");
		var show_m = $("#show_m")[0];
//		show_m.load();
		setTimeout(function(){
			$('#lock').addClass("hide");
			toggleScr('#thx','#showTime');
			show_m.play();
		},500);
		setTimeout(function(){
			show_m.pause();
			show_m.currentTime = 8;
			show_m.play();
			toggleScr('#showTime','#announce');
			$('#reset').removeClass("hide");
		},5000);
		setTimeout(function(){
			show_m.pause();
			show_m.currentTime = 0;
		},25000);
		var flag = $('#loto').val();
		if(flag=="r_win"){
			return false;
		} else {
			if(flag=="i_win"){
				return false;
			} else {
				setTimeout(function(){
					reset();
				},10000);
			}
		}
	});
});

/* 関数 */
function toggleScr(offScr,onScr) { //画面の切り替え
	$(offScr).addClass("hide");
	$(onScr).removeClass("hide");
	lockScr(500);
}
function lockScr(time) { //画面タッチ制御
	$('#lock').removeClass("hide");
	setTimeout(function(){
		$('#lock').addClass("hide");
	},time);
}
function storeData(dataUrl) { //店舗データの読み込み
	$.ajax({
	    url: dataUrl,
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var store_a = data.store_a, store_b = data.store_b, store_c = data.store_c, store_d = data.store_d;
		$('.store_a').text(store_a);
		$('.store_b').text(store_b);
		$('.store_c').text(store_c);
		$('.store_d').text(store_d);
	})
	.fail(function() {
		alert('店舗データが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function reisyokuData(reisyokuUrl,iceUrl,enqUrl,enq_cUrl) { //冷食データの読み込み
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: reisyokuUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
		$('.reisyoku_len').text(len);
		$('.reisyoku_max').text(len);
	    for(var i=0; i < len; i++){
			$(".reisyoku_data").append(
				'<div class="item en_' + data[i].entry_no + ' def hide"><div class="entry_no">'+ data[i].entry_no +'</div><!-- entry_no --><div class="name">'+ data[i].name +'</div><!-- name --><div class="maker">( ' + data[i].maker + ' )</div><!-- name --><div class="bt agree" data-id="' + data[i].entry_no + '.'+ data[i].name +'( '+ data[i].maker + ' )">OK</div><!-- bt agree --></div><!-- item -->'
			);
    	}
		iceData(iceUrl,enqUrl,enq_cUrl);//アイス読み込み
	})
	.fail(function() {
		alert('冷凍食品データが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function iceData(iceUrl,enqUrl,enq_cUrl) { //アイスデータの読み込み
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: iceUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
		$('.ice_len').text(len);
		$('.ice_max').text(parseInt(len) + parseInt(100));
	    for(var i=0; i < len; i++){
			$(".ice_data").append(
				'<div class="item en_' + data[i].entry_no + ' def hide"><div class="entry_no">'+ data[i].entry_no +'</div><!-- entry_no --><div class="name">'+ data[i].name +'</div><!-- name --><div class="maker">( ' + data[i].maker + ' )</div><!-- name --><div class="bt agree" data-id="' + data[i].entry_no + '.'+ data[i].name +'( '+ data[i].maker + ' )">OK</div><!-- bt agree --></div><!-- item -->'
			);
    	}
		enqData(enqUrl,enq_cUrl);//アンケート読み込み
	})
	.fail(function() {
		alert('アイスデータが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function enqData(enqUrl,enq_cUrl) { //アンケートデータの読み込み
	nameChange();//冷食・アイスの名前の調整
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: enqUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
		$('.enq_len').text(len);
	    for(var i=0; i < len; i++){
			var a1 = data[i].answer1,no = parseInt(i + 1),a_no = "enq6_" + no, a_no_c = "." + a_no;
			if(data[i].answer2 == null){
				var a2 = a2n ="";
			} else {
				var a2 = data[i].answer2, a2n = "<br>" + a2;
			}
			var data_id = "[" + no + "]" + a1 + a2, data_name = a1 + a2n;
			$(".enq6 .answer").append(
				'<div class="item unselected ' + a_no + '" data-id="' + data_id + '" data-name="' + a_no + '">' + data_name + '</div><!-- item -->'
			);
			if(a2 != "")$(a_no_c).addClass("long_a");
			$(".enq6 .data_area").append(
				'<div class="' + a_no + 'd data hide"></div>'
			);
    	}
		charaData(enq_cUrl);//キャラ読み込み
	})
	.fail(function() {
		alert('アンケートデータが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function charaData(enq_cUrl) { //キャラクターデータの読み込み
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: enq_cUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
		$('.chara_len').text(len);
	    for(var i=0; i < len; i++){
			var no = parseInt(i + 1),d_no = data[i].no, name = "[" + no +"]" + data[i].name;
			$(".enqC2 .answer").append(
				'<div class="item C' + d_no + ' large" data-id="' + name + '"></div>'
			);
    	}
		if(parseInt(len) > 4){
			$('.enqC2 .item').removeClass("large").addClass("mini");
		}
	})
	.fail(function() {
		alert('キャラクターデータが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function confirm(k) { //人気投票確認画面
	var data = "." + k + "_data",choice = data + " .en_" + $('.num_display').text(),board = "#" + k + "_vote .whiteboard";
	$('.bt.cancel').removeClass("hide");
	$(data).removeClass("hide");
	$(choice).removeClass("hide");
	$(board).removeClass("hide");
}
function unconfirm() { //人気投票確認画面キャンセル
	$('.num_display,.data').text("");
	$('.whiteboard,.bt.cancel,#reisyoku_vote .def,#ice_vote .def').addClass("hide");
}
function reset() { //リセット
	var show_m = $("#show_m")[0];
	show_m.pause();
	show_m.currentTime = 0;
	unconfirm();
	$('input').val("");
	toggleScr('.def','#start,.enq1');
	$('#enq').removeClass('e_2 e_3 e_4 e_5').addClass('e_1');
	$('#thx').removeClass('thx2 thx3 thx4 thx5 thx6').addClass('thx1');
	$('.lose').removeClass('lose2 lose3 lose4 lose5 lose6 lose7 lose8 lose9').addClass('lose1');
	$('.selected').addClass('unselected').removeClass('selected');
	setTimeout(function(){
		lockScr(3000);
	},500);
}
function randomBack(max,place,bcNo){ //背景のランダム選択
	var rand = Math.floor( Math.random() * max ) + 1,imgPass = bcNo + rand;
	$(place).removeClass(bcNo + 1).addClass(imgPass);
}
function nameChange(){ //アイテム名の調整
	$(".item .name").each(function(){
		if ($(this).text().length > 30) {
			$(this).text($(this).text().substr(0, 27));
			$(this).append('...');
		}
	});
}
function enq_query(e_no,offScr,onScr,offBk,onBk,flag,another,anotherBk) { //単一選択肢アンケート
	var btn = "." + e_no + " .item", e_val = "#" + e_no;
	$(document).on(touchstart,btn,function() {
		$(btn).removeClass('selected').addClass('unselected');
		$(this).addClass('selected');
		$(e_val).val($(this).data('id'));
		if(flag == null){ //条件分岐なし
			$('#enq').removeClass(offBk).addClass(onBk);
			toggleScr(offScr,onScr);
		} else {　//条件分岐あり
			var c_flag = $(e_val).val();
			if(c_flag == flag){
				$('#enq').removeClass(offBk).addClass(anotherBk);
				toggleScr(offScr,another);
			} else {
				$('#enq').removeClass(offBk).addClass(onBk);
				toggleScr(offScr,onScr);
			}
		}
	});
}
function enq_query2(e_no,offScr,onScr,offBk,onBk) {//複数選択肢アンケート
	var btn = "." + e_no + " .item",e_val = "#" + e_no, agr_btn = "." + e_no + " .agree", count = $(btn).length;
	$(document).on(touchstart,btn,function() { //選択
		var target = $(this).data('name'),flag = "." + target,flag_d = flag + "d",s_flag = $(flag_d).text();
		var count = $(btn).length;
		if(s_flag==""){
			$(flag).addClass('selected').removeClass('unselected');
			$(flag_d).text($(this).data('id'));
		} else {
			$(flag).addClass('unselected').removeClass('selected');
			$(flag_d).text("");
		}
		var eNO_dAll = "";
	   	for(var i=0; i < count; i++){
			var n=i+1, e_no_d = e_no+ "_" + n +"d",e_no_c = "." + e_no_d,e_no_dv = $(e_no_c).text(),eNO_dAll = eNO_dAll + e_no_dv;
    	}
		if(eNO_dAll==""){
			$(agr_btn).addClass('hide');
		}else{
			$(agr_btn).removeClass('hide');
		}
	});
	$(document).on(touchstart,agr_btn,function() { //決定
		var count = $(btn).length,eNO_dAll = "";
	   	for(var i=0; i < count; i++){
			var n=i+1, e_no_d = e_no+ "_" + n +"d",e_no_c = "." + e_no_d,e_no_dv = $(e_no_c).text(),eNO_dAll = eNO_dAll + e_no_dv;
    	}
		$(e_val).val(eNO_dAll);
		$('#enq').removeClass(offBk).addClass(onBk);
		toggleScr(offScr,onScr);
		unconfirm();
	});
}
function send(voteUrl) { //投票・アンケートデータの送信
	var store = $('.selected_store').text();
	var vote1 = $('#vote1').val();
	var vote2 = $('#vote2').val();
	var enq1 = $('#enq1').val();
	var enq2 = $('#enq2').val();
	var enq3 = $('#enq3').val();
	var enq4 = $('#enq4').val();
	var enq5 = $('#enq5').val();
	var enq6 = $('#enq6').val();
	var enqC1 = $('#enqC1').val();
	var enqC2 = $('#enqC2').val();
	var pwd = 'ne8r4jf9jf0';
	$.ajax({
	    type: 'GET',
	    url: voteUrl,
		data: {
			"store": store,
			"vote1": vote1,
			"vote2": vote2,
			"enq1": enq1,
			"enq2": enq2,
			"enq3": enq3,
			"enq4": enq4,
			"enq5": enq5,
			"enq6": enq6,
			"enqC1": enqC1,
			"enqC2": enqC2,
			"pwd": pwd
		},
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	    jsonpCallback: 'callback',
	}).done(function(data) {
		var OK = data.submit;
		if(OK != 'success'){
			alert(OK);
		}
		randomBack(6,'#thx','thx');
        setTimeout(function(){
			toggleScr('#wait,#reset','#thx');
		},2000);
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
		alert('データの送信に失敗しました。通信環境をチェックししてください。');
	})
}
function loto(lotoUrl) { //抽選実行
	$('#loto').val("");
	var store = $('.selected_store').text();
	var pwd = 'ne8r4jf9jf0';
	$.ajax({
	    type: 'GET',
	    url: lotoUrl,
		data: {
			"store": store,
			"pwd": pwd
		},
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	    jsonpCallback: 'callback',
	})
	.done(function(data) {
		var loto = data.loto;
		$('#loto').val(loto);
		if (loto == "r_win"){
			$(".r_win").removeClass('hide');
			$("audio#show_m").attr("src","mp3/win.mp3");
			var show_m = $("#show_m")[0];
			show_m.pause();
			show_m.currentTime = 0;
		} else {
			if (loto == "i_win"){
				$(".i_win").removeClass('hide');
				$("audio#show_m").attr("src","mp3/win.mp3");
				var show_m = $("#show_m")[0];
				show_m.pause();
				show_m.currentTime = 0;
			} else {
				$(".lose").removeClass('hide');
				$("audio#show_m").attr("src","mp3/lose.mp3");
				var show_m = $("#show_m")[0];
				show_m.pause();
				show_m.currentTime = 0;
			}
		}
		send(voteUrl); //アンケート送信
	})
	.fail(function(XMLHttpRequest, textStatus, errorThrown) {
		//alert('抽選データの取得に失敗しました。通信環境をチェックししてください。');
	})
}
function rRankData(rRankUrl,iRankUrl) { //冷食速報データの読み込み
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: rRankUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
	    for(var i=0; i < len; i++){
			var rank = '.r_ranking .rank'+ parseInt(i + 1),rank_name = rank + ' .rank_name',rank_maker = rank + ' .rank_maker',rank_point = rank + ' .rank_point';
			$(rank_name).text(data[i].name);
			$(rank_maker).text(data[i].maker);
			$(rank_point).text(data[i].point);
    	}
		iRankData(iRankUrl); //アイスデータの読み込み
	})
	.fail(function() {
		alert('冷凍食品データが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function iRankData(iRankUrl) { //アイスデータの読み込み
	var store = $('.selected_store').text();
	$.ajax({
	    type: 'GET',
	    url: iRankUrl,
		data: {
			"store": store,
		},
		jsonpCallback: "callback",
		scriptCharset: 'utf-8',
		dataType: 'jsonp',
	})
	.done(function(data) {
	    var len = data.length;
	    for(var i=0; i < len; i++){
			var rank = '.i_ranking .rank'+ parseInt(i + 1),rank_name = rank + ' .rank_name',rank_maker = rank + ' .rank_maker',rank_point = rank + ' .rank_point';
			$(rank_name).text(data[i].name);
			$(rank_maker).text(data[i].maker);
			$(rank_point).text(data[i].point);
    	}
	})
	.fail(function() {
		alert('アイスデータが読み込めませんでした。通信環境をチェックししてください。');
	})
}
function ame() { //残念賞のアニメーション
	var time =800;
    $(".ame").animate({
		left:"+=50px",
		top:"+=50px"
	}, time).animate({
		left:"-=50px",
		top:"+=50px"
	}, time).animate({
		left:"+=50px",
		top:"+=50px"
	}, time).animate({
		left:"-=50px",
		top:"+=50px"
	}, time).animate({
		left:"+=50px",
		top:"-=50px"
	}, time).animate({
		left:"-=50px",
		top:"-=50px"
	}, time).animate({
		left:"+=50px",
		top:"-=50px"
	}, time).animate({
		left:"-=50px",
		top:"-=50px"
	}, time);
    setTimeout("ame()",time*8);  
}
