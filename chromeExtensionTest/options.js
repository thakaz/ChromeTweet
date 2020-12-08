// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const setBtn = document.getElementById('setStrage');
const getBtn = document.getElementById('getStrage');

const titleTxt = document.getElementById('title');
const urlTxt = document.getElementById('url');

//データ保存時
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