// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const setBtn = document.getElementById('setStrage');
const getBtn = document.getElementById('getStrage');

const titleTxt = document.getElementById('title');
const urlTxt = document.getElementById('url');

const authBtn = document.getElementById('authTwitter');
const pinTxt = document.getElementById('pinCode');
const pinBtn = document.getElementById('sendCode');
const chkBtn = document.getElementById('checkAuth');
const IDTxt = document.getElementById('isTwitterID');


//データ保存時
document.addEventListener("DOMContentLoaded", function () {
  setBtn.addEventListener('click', () => {
    var urls = [];

    var mybody = document.getElementsByTagName("body")[0];
    var mytable = mybody.getElementsByTagName("table")[0];
    var mytablebody = mytable.getElementsByTagName("tbody")[0];
    for (var i = 0; i < 10; i++) {
      var row = document.getElementsByTagName("tr")[i + 1];
      var titleCel = row.getElementsByTagName("td")[0];
      var urlCel = row.getElementsByTagName("td")[1];

      if (urls != null) {
        urls.push({ title: titleCel.childNodes[0].nodeValue, url: urlCel.childNodes[0].nodeValue });
      } else {
        urls = { title: titleCel.childNodes[0].nodeValue, url: urlCel.childNodes[0].nodeValue };
      }
    }


    chrome.storage.sync.set({ 'urls': urls }, function () {
    })
  });
}, false);




//データ取得時

function createTable(strageValue) {
  var tblSpan = document.getElementById('tableSpan');
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  var r = document.createElement("tr");
  var c1 = document.createElement("td")
  var ct1 = document.createTextNode("title");
  c1.appendChild(ct1);
  r.appendChild(c1);

  r.appendChild(document.createElement("td").appendChild(document.createTextNode("url")));
  tblBody.appendChild(r);
  // creating all cells
  for (var i = 0; i < 10; i++) {
    // creates a table row
    var row = document.createElement("tr");

    for (var j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");

      //console.log(strageValue.urls[i]);

      //タイトル
      if (strageValue.urls != undefined) {
        var cellText = document.createTextNode(strageValue.urls[i].title);
        if (j == 1) {//2列目はurl
          cellText = document.createTextNode(strageValue.urls[i].url);
        }
      } else {
        cellText = document.createTextNode("");
      }

      cell.appendChild(cellText);
      cell.contentEditable = 'true';
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>

  var fc = tblSpan.firstChild;
  while (fc !== null) {
    tblSpan.removeChild(fc)
    fc = tblSpan.firstChild;
  };

  tblSpan.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");

  chrome.storage.sync.get(['urls'], function (value) {
    console.log(value);
  });
};

const loadTable = function () {
  chrome.storage.sync.get(['urls'], function (value) {
    createTable(value);
  })
};

getBtn.addEventListener('click', () => { loadTable() });

window.onload = loadTable();










//認証ボタンクリック時
document.addEventListener("DOMContentLoaded", function () {
  authBtn.addEventListener('click', () => {

    fetch(targetPath + "ShowAuthWindow");
  });
}, false);


//ピンコード送信ボタンクリック時
document.addEventListener("DOMContentLoaded", function () {
  pinBtn.addEventListener('click', () => {

    fetch(targetPath + "AuthPinCode?pin=" + pinTxt.value)
      .then(response => response.json())
      .then(textBody => { console.log(textBody); return textBody; })
      .then(textBody => {
        chrome.storage.sync.set({ 'token': textBody }, function () {
          alert('トークンをセットしました。');
        })
      })

  });
}, false);

//ピンコード送信ボタンクリック時
document.addEventListener("DOMContentLoaded", function () {
  chkBtn.addEventListener('click', () => {

    chrome.storage.sync.get('token', function (token) {
      fetch(targetPath + "CheckAuth", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(token.token)
      })
        .then(response => {
          console.log(response.status);
          if (!response.ok) {
            console.error("エラーレスポンス", response);
          } else {
            console.log("レスポンス", response);
          }
          return response.text();
        })
        .then(response => IDTxt.innerHTML = response)
        .catch(ex => { alert('あかん' + ex) });
    })
  });
}, false);

const editor = new EditorJS({ holder: 'editor'});