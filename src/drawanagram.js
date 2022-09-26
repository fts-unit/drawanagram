var cardsize = 80;
var base_mat_h = 480;
//1inch=2.54cm
var INCH_PAR_CM = 2.54;
var pr_w = 480;
var f_play = false;
var cards = 0;
var chars = [];
var jdg_thin = 0.7; // 判定深度
var strKana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんゃゅょっがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉー';
var arrKana = strKana.split('');

$(function() {

    // オプションメニュー開閉
    $('#opt-open').click(function(){
        if ($('.opt-menu').css('display') == 'none') {
            $('.opt-menu').slideDown('slow');
            $('#opt-open').text('　▲　おぷしょん　▲　');
        } else {
            $('.opt-menu').slideUp('slow');
            $('#opt-open').text('　▼　おぷしょん　▼　');
        }
    });
    
    // プレースホルダ
    $(window).load(function(){
        $('input[type=text],input[type=password],textarea').each(function(){
            var thisTitle = $(this).attr('title');
            if(!(thisTitle === '')){
                $(this).wrapAll('<span style="text-align:left;display:inline-block;position:relative;"></span>');
                $(this).parent('span').append('<span class="placeholder">' + thisTitle + '</span>');
                $('.placeholder').css({
                    top:'4px',
                    left:'5px',
                    fontSize:'100%',
                    lineHeight:'120%',
                    textAlign:'left',
                    color:'#999',
                    overflow:'hidden',
                    position:'absolute',
                    zIndex:'99'
                }).click(function(){
                    $(this).prev().focus();
                });
 
                $(this).focus(function(){
                    $(this).next('span').css({display:'none'});
                });
 
                $(this).blur(function(){
                    var thisVal = $(this).val();
                    if(thisVal === ''){
                        $(this).next('span').css({display:'inline-block'});
                    } else {
                        $(this).next('span').css({display:'none'});
                    }
                });
 
                var thisVal = $(this).val();
                if(thisVal === ''){
                    $(this).next('span').css({display:'inline-block'});
                } else {
                    $(this).next('span').css({display:'none'});
                }
            }
        });
    });

    // プレイマットのサイズ変更
    $(window).on("load orientationchange resize", function(){
        pr_w = $(window).width();
        //cardsize = 2 * deviceDpi().logicalDpi / INCH_PAR_CM;
        base_mat_h = cardsize * 6;
        
        var win_w = $(window).width();
        var win_h = $(window).height();
        $('#play-mat').width(win_w - 80);
        var opt_lw = $('.opt-draw').width();
        var opt_rw = $('.opt-ana').width();
        if(Math.abs(window.orientation) === 90){
            // ランドスケープ
		}else{
			// ポートレート
            $(window).width(pr_w);
		}
        if(win_w < (opt_lw + opt_rw + 100)){
            $('.opt-draw').css('float','none');
            $('.opt-ana').css('float','none');
        } else {
            $('.opt-draw').css('float','left');
            $('.opt-ana').css('float','right');
        }
        if(win_w > win_h){
            $('#play-mat').height($('#play-mat').width() * 2 / 3);
        }else{
            $('#play-mat').height($('#play-mat').width() * 3 / 2);
        }
    });

    // ラジオボタンチェック
    // （テキストエリアにフォーカスしたとき）
    $('#anatext').focus(function() {
        $('#ana').prop('checked', true);
    });

    // どろわなぐらむ 本体
    $('#op-draw').on('click', function() {
        f_play = true;
        
        if ($('.opt-menu').css('display')!== 'none') {
            $('.opt-menu').slideUp('slow');
            $('#opt-open').text('　▼　おぷしょん　▼　');
        }

        var i, l_num, v_num, n_num;
        cards = 0;

        var checkL = $('#lower').is(':checked');
        var checkV = $('#voc').is(':checked');
        var checkD = $('#draw').is(':checked');

        $('#att').text('');
        $('#att').css('color', '#000000');

        // カード準備
        if(checkD){

            //どろわなぐらむ

            var chkS = $('#short').is(':checked');
            var chkL = $('#long').is(':checked');
            var chkV = $('#vast').is(':checked');
            var chkF = $('#full').is(':checked');

            var norm_chars = (chkF) ? range(1, 46) : shuffle(range(1, 46));
            var low_chars = (chkF) ? range(47, 50) : shuffle(range(47, 50));
            var voc_chars = (chkF) ? range(51, 75) : shuffle(range(51, 75));
            
            // カード枚数
            if(chkS){
                cards = rndprime(5, 13);
            } else if(chkL){
                cards = rndprime(20, 30);
            } else if(chkV){
                cards = rndprime(30, 45);
            } else if(chkF){
                if(checkL){
                    if(checkV){
                        cards = 75;
                    }else{
                        cards = 50;
                    }
                }else if(checkV){
                    cards = 71;
                }else{
                     cards = 46;
                }
            } else{
                cards = rndprime(5, 20);
            }
            v_num = (chkF) ? 25 : getSubCards(0,cards);

            if(checkL){
                if(checkV){
                    // 小文字・濁音
                    l_num = (chkF) ? 4 : getSubCards(v_num,cards);
                    n_num = (chkF) ? 46 : (cards - l_num - v_num);
                    chars = norm_chars.slice(0, n_num);
                    Array.prototype.push.apply(chars, low_chars.slice(0, l_num));
                    Array.prototype.push.apply(chars, voc_chars.slice(0, v_num));
                    chars = (chkF) ? chars : shuffle(chars);
                }
                else{
                    // 小文字のみ
                    l_num = (chkF) ? 4 : getSubCards(0,cards);
                    n_num = (chkF) ? 46 : (cards - l_num);
                    chars = norm_chars.slice(0, n_num);
                    Array.prototype.push.apply(chars, low_chars.slice(0, l_num));
                    chars = (chkF) ? chars : shuffle(chars);
                }
            }
            else if(checkV){
                // 濁音のみ
                n_num = (chkF) ? 46 : (cards - v_num);
                chars = norm_chars.slice(0, n_num);
                Array.prototype.push.apply(chars, voc_chars.slice(0, v_num));
                chars = (chkF) ? chars : shuffle(chars);
            }
            else{
                // 清音のみ
                chars = norm_chars;
            }
        }
        else{

            // ふつう の あなぐらむ

            var strta = $('#anatext').val();
            if (strta.match(/^[\u3041-\u308F\u3092\u3093\u30FC]+$/)) {
                // すべて全角ひらがなである
                $('#att').text('「 ' + strta + ' 」');
                var arrta  = strta.split('');
                chars = [];
                for(i = 0; i < arrta.length; i++){
                    chars[i] = KanaNum(arrta[i]);
                }
                cards = arrta.length;
            } else {
                // 全角ひらがなでない文字がある
                $('#att').text('＊ ごめんなさい！全角ひらがなしか使えません！！ ＊');
                $('#att').css('color', '#ff0000');
            }
        }

        // カード配布
        $('#play-mat').empty();
        var mat_h = Math.ceil(cards/Math.floor(($('#play-mat').width())/cardsize))*3*cardsize;
        if(mat_h > (base_mat_h)){
            $('#play-mat').height(mat_h); 
        }
        else{
            $('#play-mat').height(base_mat_h); 
        }
        for(i = 0; i < cards; i++){
            var dom = '<div id="drag' + i + '" class="drag"><img src="./img/chars/' + ("00"+chars[i]).slice(-3) + '.png" height="' + cardsize + 'px"  width="' + cardsize + 'px" alt="' + ("00"+chars[i]).slice(-3) + '.png"></div>\n';
            var $target = $('#play-mat');
            $target.append(dom);
        }

        // ドラッグ＆ドロップ機能を実装
        $('.drag').draggable({
            containment: 'parent',
            cursor: 'move',
            helper: 'original',
            opacity: 0.3,
            revert: false
        });
        $('.drop').droppable();

        // カード重ね順調整（保持カードを最前面にする）
        $('.drag').mousedown(function () {
            var boxes = [],
                self = this,
                myIndex;

            $('.drag').each(function (i) {
                boxes[i] = {
                    box: this,
                    zIndex: Number($(this).css('z-index'))
                };
                if (this === self) {
                    myIndex = i;
                }
            });
            boxes[myIndex].zIndex = boxes.length + 1;
            boxes.sort(function (a, b) {
                if (a.zIndex < b.zIndex) return -1;
                if (a.zIndex > b.zIndex) return 1;
                return 0;
            });

            boxes.forEach(function (item, i) {
                $(item.box).css('z-index', i + 1);
            });
        });
    });

    // 並べ替え判定
    $('#opt-chk').click(function(){
        var str_msg = "どろー前には使えません！"; 
        if(f_play){
            var str_res = ""
            var i;
            var mat_padd = Number($('#play-mat').css('padding-left').replace('px', '')) + Number($('#play-mat').css('border-width').replace('px', ''));
            var mat_x = $('#play-mat').offset().left;
            var mat_y = $('#play-mat').offset().top;
            var max_x = 0;
            var max_y = 0;
            var min_x = $('#play-mat').width();
            var min_y = $('#play-mat').height();
            var tmp_x = 0;
            var tmp_y = 0;
            for(i = 0; i < cards; i++){
                tmp_x = ($('#drag' + i).offset().left - mat_x);
                tmp_y = ($('#drag' + i).offset().top - mat_y);
                min_x = (min_x >= tmp_x) ? tmp_x : min_x;
                min_y = (min_y >= tmp_y) ? tmp_y : min_y;
                max_x = (max_x <= tmp_x) ? tmp_x : max_x;
                max_y = (max_y <= tmp_y) ? tmp_y : max_y;
            } 
            var arr_res = []
            var std_x = mat_padd;
            var std_y = mat_padd;

            // 探索
            while(true){
                var arr_tmp = [];
                var k = jdg_thin;
                var f_head = true;
                std_x = mat_padd - 1;
                min_y = $('#play-mat').height();
                while(true) {
                    for(i = 0; i < cards; i++){
                        tmp_x = $('#drag' + i).offset().left - mat_x;
                        tmp_y = $('#drag' + i).offset().top - mat_y;
                        if(tmp_x > std_x && tmp_x <= (std_x + cardsize * k) && tmp_y >= std_y && tmp_y < (std_y + cardsize)){
                            arr_tmp.push(i);
                            std_x = tmp_x;
                            k = 1.5;
                            f_head = false;
                            if(tmp_y < min_y){
                                min_y = tmp_y;
                            }
                            break;
                        } 
                        if(i == (cards - 1)){
                            f_head = true;
                        }
                    }
                    if(f_head) {
                        std_x = std_x + (cardsize * jdg_thin);
                    }
                    if(std_x > max_x){
                        break;
                    }
                }
                arr_res.push(arr_tmp);
                if(arr_res.length && !arr_tmp.length){
                    break;
                }
                std_y = min_y + (cardsize * jdg_thin);
                if(std_y > max_y){
                    break;
                }
            }

            // メッセージへの回答文字列の格納
            arr_res.forEach(function(elm, ide){
                elm.forEach(function(cld, idc){
                    str_res += arrKana[chars[arr_res[ide][idc]] - 1];
                })
                str_res += ","
            })
            str_msg = str_res;
            //str_msg = str_res + "\n" + str_msg;
            // 漢字変換（全句第一候補で変換）
            let xhr = new XMLHttpRequest();
            var utf8str = encodeURIComponent(str_res);
            xhr.open('GET', 'https://www.google.com/transliterate?langpair=ja-Hira|ja&text=' + utf8str);
            xhr.send();
            xhr.onload = function() {
                if (xhr.status != 200) { // レスポンスの HTTP ステータスを解析
                    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    console.log(xhr.responseText); // responseText is the server
                    const jsonObj = JSON.parse(xhr.responseText);
                    str_msg = "";
                    jsonObj.forEach(elm => {
                        str_msg += elm[1][0];
                    });
                    alert(str_msg);
                }
            }
            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    console.log(`Received ${event.loaded} of ${event.total} bytes`);
                } else {
                    console.log(`Received ${event.loaded} bytes`); // no Content-Length
                }
            }
            xhr.onerror = function() {
                alert("Request failed");
            }
        } else {
            alert(str_msg);
        }
    });
});


// 範囲指定順数配列
function range(from, to) {
    var ar = [];
    for (var i = from; i <= to; i++) {
        ar.push(i)
    }
    return ar;
}

// 配列の中身の並びをシャッフル
function shuffle(array) {
    var n = array.length, t, i;
    while (n) {
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
    }
    return array;
}

// ランダム素数
// （範囲内の素数の内１つをランダムに返す）
function rndprime (min, max) { 
        // 探索リスト
        var search = array_fill(0, max, true);
        var i, j;
        // 素数でない場合はfalseにする
        for(i = 2; i < Math.sqrt(max); i++){
            // 素数の倍数では何もしない
            if(!search[i]){
            continue;
            }
            // 素数の倍数をふるい落とす
            for(j = 2; (i * j) <= max; j++){
                search[i*j] = false;
            }
        }
        for(i = 0; i < search.length; i++){
            if(search[i]){
                search[i] = i;
            }
        }
        search = shuffle(search);
        for(i = 0; i < search.length; i++){
            if(search[i] > min && search[i] < max){
                return search[i]
                break;
            }
        }
}

// 全要素が指定の値に統一された配列
// （素数の計算に使用）
function array_fill (startIndex, num, mixedVal) { 
    var key
    var tmpArr = new Array();
    
    if (!isNaN(startIndex) && !isNaN(num)) {
        for (key = 0; key < num; key++) {
            tmpArr[(key + startIndex)] = mixedVal
        }
    }
    
    return tmpArr
}

// 範囲内の整数乱数
function getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
}

// 小文字・濁音の配布文字数計算
function getSubCards(rdy, crd) {
    
    var rnd, num;
    rnd = Math.random() * 100;

    if(rnd < 10 && rdy > 0){
        num = 0;
    } else if(rnd < 10 && rdy < 2 && crd > 15){
        num = 3;
    } else if(rnd < 30  && rdy < 3 && crd > 10){
        num = 2;
    } else{
        num = 1;
    }
    return num;
}

// かな⇒画像ファイルナンバー変換
function KanaNum(char){
    for(i = 0; i < arrKana.length; i++){
        if(arrKana[i] == char){
            return i + 1;
            break;
        }
    }
}

// DPI取得関連
function windowWidthHeight(){
    var ratio;
    window.devicePixelRatio ? ratio = window.devicePixelRatio : ratio = 1 ;
    return{ 
        windowWidth : window.innerWidth , 
        windowHeight : window.innerHeight,
        devicePixelRatio : ratio
    };
}
function deviceDpi(){
    var POINTDPI = 96 ,
        ratio = windowWidthHeight().devicePixelRatio ,
        width = windowWidthHeight().windowWidth ,
        coefficient ,
        logicalDpi ,
        estimatedActualDpi;
    ratio < 2  ? coefficient = -ratio : coefficient = ratio ,
    logicalDpi = ( devicePixelRatio === 1 ) ? 
        ( POINTDPI + Math.sqrt( Math.sqrt( windowWidthHeight().windowWidth ) ) * coefficient ) :
        ( POINTDPI + ( POINTDPI / ratio ) + Math.sqrt( Math.sqrt( width ) ) * coefficient ) ;
    estimatedActualDpi = logicalDpi * ratio;
    return { 
        logicalDpi : logicalDpi,
        estimatedActualDpi : estimatedActualDpi   
    };
}
function deviceInchSize(){
    var dpi = deviceDpi().logicalDpi ,
        width = windowWidthHeight().windowWidth ,
        height = windowWidthHeight().windowHeight ;
        widthInch = width / dpi ,
        heightInch = height / dpi ,
        diagonalInch = Math.sqrt( Math.pow( widthInch , 2 ) + Math.pow( heightInch , 2 ) );
    return {
        widthInch : widthInch ,
        heightInch : heightInch ,
        diagonalInch : diagonalInch
    }
}

function handleDownload() {
    html2canvas(document.querySelector("#main"))
    .then(canvas => {
        canvas.toBlob(function(blob) {
	    let link = document.createElement("a");
	    link.href = window.URL.createObjectURL(blob);
	    link.download = "DrawAnagram.png";
	    link.click();
  	}, "image/png");
    })
    .catch((error) => {
      alert(error);
    });
}
