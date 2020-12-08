// OKで実行する処理
function executeTask() {
    chrome.storage.sync.set({ 'isFool': Date.now() }, function() {
        alert('残念です。');
    })

}

// Cancelで実行する処理
function cancelTask() {
    window.location.href = 'http://google.com'


}

//----

function test1() {
    showConfirmDialog('Are you ready?', executeTask, cancelTask);
}

function test2() {
    // Cancelで何もしない場合
    showConfirmDialog('Are you ready?', executeTask);
}


$(function() {
    console.log("コンテントスクリプトだよ");

    const thisTime = Date.now();
    chrome.storage.sync.get(['isFool'], function(value) {
        console.log(thisTime);
        console.log(value.isFool);
        console.log(thisTime - value.isFool);
        if ((thisTime - value.isFool) / 1000 < 60) {
            return;
        }
        chrome.storage.sync.get(['urls'], function(value) {
            console.log('まずはstorageを出力');
            console.log(value);
            for (const url of value.urls) {
                const tmpUrl = document.domain;

                //Nullチェック
                if (url.url && tmpUrl.match(esc(url.url))) {
                    console.log('match!');

                    //popupの挿入
                    showConfirmDialog('禁止サイトへアクセスしています。無視して続けますか？', executeTask, cancelTask);
                } else {
                    console.log(url.url);
                }
            }
        });

    });
});



function esc(string) {
    const reRegExp = /[\\^$.+?()[\]{}|]/g;
    const reHasRegExp = new RegExp(reRegExp.source);

    return (string && reHasRegExp.test(string)) ?
        string.replace(reRegExp, '\\$&') :
        string;
}

/**
 * 確認ダイアログを表示します。
 * @param  {String} message ダイアログに表示するメッセージ
 * @param  {Function} [okFunction] OKボタンクリック時に実行される関数
 * @param  {Function} [cancelFunction] Cancelボタンクリック時に実行される関数
 */
function showConfirmDialog(message, okFunction, cancelFunction) {
    // Dialogを破棄する関数
    var _destroyDialog = function(dialogElement) {
        dialogElement.dialog('destroy'); // ※destroyなので、closeイベントは発生しない
        dialogElement.remove(); // ※動的に生成された要素を削除する必要がある
    };

    // Dialog要素(呼び出し毎に、動的に生成)
    var $dialog = $('<div></div>').text(message);

    // 各ボタンに対応する関数を宣言
    // ※Dialogを破棄後、コールバック関数を実行する
    var _funcOk = function() { _destroyDialog($dialog); if (okFunction) { okFunction(); } };
    var _funcCancel = function() { _destroyDialog($dialog); if (cancelFunction) { cancelFunction(); } };

    $dialog.dialog({
        modal: true,
        title: '確認',
        closeOnEscape: false,

        // 「閉じる」の設定
        // ※Cancel時の処理を「閉じる」に仕込むことで、Cancelと「閉じる」を同一の挙動とする
        closeText: 'Cancel',
        close: _funcCancel,

        // 各ボタンの設定
        buttons: [
            { text: '無視する', click: _funcOk },
            { text: 'google.comへ', click: function() { $(this).dialog('close'); } } // Dialogのcloseのみ
        ]
    });
}