const CARD_SIZE = 100;
//1inch=2.54cm
const INCH_PAR_CM = 2.54;
var baseMatHeight = 480;
var tmpWindowWidth = 480;
var fPlay = false;
var cards = 0;
var chars = [];
const JUDGE_THIN = 0.7; // 判定深度
const STR_KANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんゃゅょっがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉー";
const ARRAY_KANA = STR_KANA.split('');

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
    
    // プレイマットのサイズ変更
    $(window).on("load orientationchange resize", function(){
        tmpWindowWidth = $(window).width();
        baseMatHeight = CARD_SIZE * 6;
        
        let windowWidth = $(window).width();
        let windowHeight = $(window).height();
        $('#play-mat').width(windowWidth - 80);
        if(Math.abs(window.orientation) === 90){
            // ランドスケープ
		}else{
			// ポートレート
            $(window).width(tmpWindowWidth);
		}
        if(windowWidth > windowHeight){
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
        fPlay = true;
        
        if ($('.opt-menu').css('display')!== 'none') {
            $('.opt-menu').slideUp('slow');
            $('#opt-open').text('　▼　おぷしょん　▼　');
        }

        var i;
        let numLowers, numVocs, numNormals;
        cards = 0;

        let checkL = $('#lower').is(':checked');
        let checkV = $('#voc').is(':checked');
        let checkD = $('#draw').is(':checked');

        $('#att').text('');
        $('#att').css('color', '#000000');

        // カード準備
        if(checkD){

            //どろわなぐらむ

            let chkS = $('#short').is(':checked');
            let chkL = $('#long').is(':checked');
            let chkV = $('#vast').is(':checked');
            let chkF = $('#full').is(':checked');

            let norm_chars = (chkF) ? range(1, 46) : shuffle(range(1, 46));
            let low_chars = (chkF) ? range(47, 50) : shuffle(range(47, 50));
            let voc_chars = (chkF) ? range(51, 75) : shuffle(range(51, 75));
            
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
            numVocs = (chkF) ? 25 : getSubCards(0,cards);

            if(checkL){
                if(checkV){
                    // 小文字・濁音
                    numLowers = (chkF) ? 4 : getSubCards(numVocs,cards);
                    numNormals = (chkF) ? 46 : (cards - numLowers - numVocs);
                    chars = norm_chars.slice(0, numNormals);
                    Array.prototype.push.apply(chars, low_chars.slice(0, numLowers));
                    Array.prototype.push.apply(chars, voc_chars.slice(0, numVocs));
                    chars = (chkF) ? chars : shuffle(chars);
                }
                else{
                    // 小文字のみ
                    numLowers = (chkF) ? 4 : getSubCards(0,cards);
                    numNormals = (chkF) ? 46 : (cards - numLowers);
                    chars = norm_chars.slice(0, numNormals);
                    Array.prototype.push.apply(chars, low_chars.slice(0, numLowers));
                    chars = (chkF) ? chars : shuffle(chars);
                }
            }
            else if(checkV){
                // 濁音のみ
                numNormals = (chkF) ? 46 : (cards - numVocs);
                chars = norm_chars.slice(0, numNormals);
                Array.prototype.push.apply(chars, voc_chars.slice(0, numVocs));
                chars = (chkF) ? chars : shuffle(chars);
            }
            else{
                // 清音のみ
                chars = norm_chars;
            }
        }
        else{

            // ふつう の あなぐらむ

            let strAnagram = $('#anatext').val();
            if (strAnagram.match(/^[\u3041-\u308F\u3092\u3093\u30FC]+$/)) {
                // すべて全角ひらがなである
                $('#att').text('「 ' + strAnagram + ' 」');
                var arrta  = strAnagram.split('');
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
        let matHeight = Math.ceil(cards/Math.floor(($('#play-mat').width())/CARD_SIZE))*3*CARD_SIZE;
        if(matHeight > (baseMatHeight)){
            $('#play-mat').height(matHeight); 
        }
        else{
            $('#play-mat').height(baseMatHeight); 
        }
        for(i = 0; i < cards; i++){
            let domCard = '<div id="drag' + i + '" class="drag"><img src="./img/chars/' + ("00"+chars[i]).slice(-3) + '.png" height="' + CARD_SIZE + 'px"  width="' + CARD_SIZE + 'px" alt="' + ("00"+chars[i]).slice(-3) + '.png"></div>\n';
            let $target = $('#play-mat');
            $target.append(domCard);
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
    function strSentence(isTweet = false){
        let strMsg = "どろー前には使えません！"; 
        if(fPlay){
            let strCards = ""
            let strAnswer = ""
            let i;
            let matPadding = Number($('#play-mat').css('padding-left').replace('px', '')) + Number($('#play-mat').css('border-width').replace('px', ''));
            let matX = $('#play-mat').offset().left;
            let matY = $('#play-mat').offset().top;
            let maxX = 0;
            let maxY = 0;
            let tmpX = 0;
            let tmpY = 0;
            // 探索範囲（最大値）の設定と配り札の文字列化
            for(i = 0; i < cards; i++){
                strCards += ARRAY_KANA[chars[i] - 1];
                tmpX = ($('#drag' + i).offset().left - matX);
                tmpY = ($('#drag' + i).offset().top - matY);
                maxX = (maxX <= tmpX) ? tmpX : maxX;
                maxY = (maxY <= tmpY) ? tmpY : maxY;
            } 
            let arrAnswer = []
            let baseX = matPadding;
            let baseY = matPadding + CARD_SIZE / 2 - 10;

            // 探索
            while(true) {
                let arr_tmp = [];
                let k = JUDGE_THIN;
                let fHead = true;
                baseX = matPadding - 1;
                while(true) {
                    for(i = 0; i < cards; i++){
                        tmpX = $('#drag' + i).offset().left - matX;
                        tmpY = $('#drag' + i).offset().top - matY;
                        if(tmpX > baseX && tmpX <= (baseX + CARD_SIZE * k) &&
                                 tmpY >= (baseY - CARD_SIZE / 2) && tmpY < (baseY + CARD_SIZE / 2)){
                            arr_tmp.push(ARRAY_KANA[chars[i] - 1]);
                            baseX = tmpX;
                            baseY = tmpY;
                            k = 1.5;
                            fHead = false;
                            break;
                        } 
                        if(i == (cards - 1)){
                            k = JUDGE_THIN;
                            fHead = true;
                        }
                    }
                    if(fHead) {
                        baseX = baseX + (CARD_SIZE * JUDGE_THIN);
                    }
                    if(baseX > maxX){
                        break;
                    }
                }
                arrAnswer.push(arr_tmp);
                baseY = baseY + CARD_SIZE;
                if(baseY > (maxY + CARD_SIZE)){
                    break;
                }
            }

            // メッセージへの回答文字列の格納
            arrAnswer.forEach(function(elm){
                elm.forEach(function(cld){
                    strAnswer += cld;
                })
                strAnswer += ","
            })

            // 漢字変換（全句第一候補で変換）
            let xhr = new XMLHttpRequest();
            let utf8str = encodeURIComponent(strAnswer);
            xhr.open('GET', 'https://www.google.com/transliterate?langpair=ja-Hira|ja&text=' + utf8str);
            xhr.send();
            xhr.onload = function() {
                if (xhr.status != 200) { // レスポンスの HTTP ステータスを解析
                    alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    console.log(xhr.responseText); // responseText is the server
                    const jsonObj = JSON.parse(xhr.responseText);
                    strAnswer = "";
                    jsonObj.forEach(elm => {
                        strAnswer += elm[1][0];
                    });
                    strMsg = "「" + strCards + "」\r\n　　↓↓↓\r\n「" + strAnswer + "」";
                    if (isTweet){
                        strMsg += "\r\n\r\n#どろわなぐらむ\r\n";
                        let href = location.href;
                        let param = location.search;
                        let url = href.replace(param, '');
                        param = encodeURIComponent(param);
                        strMsg = encodeURIComponent(strMsg);
                        let tw_link = "http://twitter.com/share?text=" + strMsg + "&url=" + url + param; 
                        window.open(tw_link, '_blank');
                    } else {
                        alert(strMsg);
                    }
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
            alert(strMsg);
        }
    }

    // 並べ替え確認
    $('#opt-chk').click(function(){
        strSentence(false);
        
    });
    // 並べ替え結果をツイート
    $('#opt-twt').click(function(){
        strSentence(true);
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
    for(i = 0; i < ARRAY_KANA.length; i++){
        if(ARRAY_KANA[i] == char){
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
        const date = new Date();
        const str_dt = date
            .toISOString()           //2022-02-05T21:00:00.000Z
            .replace(/[^0-9]/g, '')  //20220205210000000
            .slice(0, -3);           //20220205210000
	    link.download = "DrawAnagram_" + str_dt + ".png";
	    link.click();
  	}, "image/png");
    })
    .catch((error) => {
      alert(error);
    });
}
