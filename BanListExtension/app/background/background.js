
// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    localStorage.isActivated = true;   // The display activation.
    localStorage.frequency = 1;        // The display frequency, in minutes.
    localStorage.isInitialized = true; // The option initialization.
}

var warningId = 'notification.warning';

function hideWarning(done) {
    chrome.notifications.clear(warningId, function () {
        if (done) done();
    });
}

var f_wordList = [
    ['通知タイトル', '通知メッセージ'],
    ['あれ', 'これ'],
    ['それ', 'どれ'],
]



function showWarning() {

    //isFoolの日付が指定時間以内かつ不正ページ閲覧時に実行する。



    chrome.storage.sync.get(['isFool'], function (isFool) {

        if ((Date.now() - isFool.isFool) / 1000 <60) {

                    //0~2
                    var rn = Math.floor((Math.random() * f_wordList.length));

                    hideWarning(function () {
                        chrome.notifications.create(warningId, {
                            iconUrl: chrome.runtime.getURL('images/icon.png'),
                            title: f_wordList[rn][0],
                            type: 'basic',
                            message: f_wordList[rn][1],
                            buttons: [{ title: 'オプションページへ' }],
                            priority: 2,
                        }, function () { });
                    });



        };

    })


}

function openWarningPage() {
    chrome.tabs.create({
        url: 'chrome://extensions?options=' + chrome.runtime.id
    });
}

chrome.notifications.onClicked.addListener(openWarningPage);
chrome.notifications.onButtonClicked.addListener(openWarningPage);
chrome.runtime.onInstalled.addListener(showWarning);

// Test for notification support.
if (window.Notification) {
    // While activated, show notifications at the display frequency.
    if (JSON.parse(localStorage.isActivated)) { showWarning(); }

    var interval = 0; // The display interval, in minutes.

    setInterval(function () {
        interval++;

        if (
            JSON.parse(localStorage.isActivated) &&
            localStorage.frequency <= interval
        ) {
            showWarning();
            interval = 0;
        }
    }, 3000);
}
