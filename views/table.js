// const jspreadsheetEvent = {
//     onchange: Timeline.create()({}),
//     oninsertrow: Timeline.create()({}),
//     oninsertcolumn: Timeline.create()({}),
//     ondeleterow: Timeline.create()({}),
//     ondeletecolumn: Timeline.create()({}),
//     onsort: Timeline.create()({}),
//     onresizerow: Timeline.create()({}),
//     onresizecolumn: Timeline.create()({}),
//     onmoverow: Timeline.create()({}),
//     onmovecolumn: Timeline.create()({}),
//     onload: Timeline.create()({}),
//     onpaste: Timeline.create()({}),
//     onselection: Timeline.create()({}),
// };
let jspreadsheetObject = jspreadsheet(document.getElementById('spreadsheet'), {
    data: [[1, 2], [3, 4]],
});
// const jspreadsheetTimelineOutput = Timeline.create()().apply(jspreadsheetColumns).apply(jspreadsheetData);
//     repositories2Table.map(parent => ({
//     jspreadsheetData: jspreadsheetObject.getData(),
//     jspreadsheetColumns: JSON.parse(JSON.stringify(jspreadsheetObject.getConfig().columns)),
//     header2Key: parent.header2Key
// }));


// loggerTimelines.push(
//     jspreadsheetTimelineOutput.map(a => { c.groupCollapsed("jspreadsheetTimelineOutput"); c.log(a); c.groupEnd(); return a })
// );




let isConstructingJspreadsheet = false;
const createJspreadsheet =
    nextData => columns => eventFunc => {
        isConstructingJspreadsheet = true;
        const element = document.getElementById('spreadsheet');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
        jspreadsheetObject = jspreadsheet(element, {
            data: nextData,
            columns: columns,
            //パラメーター
            allowComments: true,//セルへのコメント追加を許可するか(デフォルト: false)。
            allowInsertColumn: false,//列追加を許可するか(デフォルト: true)。
            allowInsertRow: true,//行追加を許可するか（デフォルト: true)。
            allowManualInsertColumn: false,//タブキーで列追加を許可するか(デフォルト: true)。
            allowManualInsertRow: true,//改行キーで行追加を許可するか(デフォルト: true)。
            allowDeleteColumn: false,//列削除を許可するか(デフォルト: true)。
            allowDeleteRow: true,//行削除を許可するか(デフォルト: true)。
            allowDeletingAllRows: false,//すべての行を削除することを許可するか(デフォルト: false)。
            autoCasting: false,//1,234 などのカンマ付き数値を数字と見なすか(デフォルト: true)。
            autoIncrement: true,//数値ドラッグ時に自動インクリメントするか(デフォルト: true)。
            columnDrag: true,//カラムのドラッグを許可するか(デフォルト: false)。
            columnSorting: true,//ダブルクリックでカラムをソートするか(デフォルト: true)。
            columnResize: true,//カラムのリサイズを可能とするか(デフォルト: true)。
            defaultColAlign: "left",//デフォルトのカラムアライン(例: 'left')。
            defaultColWidth: 100,//デフォルトのカラム横幅(例: 100)。
            defaultRowHeight: 100,//デフォルトの行高さ(例: 100)。
            // editable: false,//セルを編集可能とするか（デフォルト: true)。
            fullscreen: false,//フルスクリーンモードにする(デフォルト: false)。
            lazyLoading: false,//遅延ローディングを行う(デフォルト: false)。
            loadingSpin: true,//ロード中のスピンを表示する(デフォルト: false)。
            minSpareRows: 0,//最小予備行数(例: 3)。
            minSpareCols: 0,//最小予備列数(例: 3)。
            pagination: 50,//ページネーション行数(例: 10)。
            paginationOptions: [10, 50, 100],//ページネーション行数候補。search: true の時に有効(例: [10, 50, 100])。
            parseFormulas: true,//計算式をサポートするか(デフォルト: true)。
            rowDrag: true,//行ドラッグを許可するか(デフォルト: true)。
            rowResize: true,//高さのリサイズを許可するか(デフォルト: false)。
            search: true,//検索を可能とするか(デフォルト: false)。
            selectionCopy: true,//セル選択時の右下の■ドラッグでコピーを許可するか(デフォルト: true)。
            stripHTML: true,//セル内のHTMLを無効化する(デフォルト: true)。
            stripHTMLOnCopy: false,//セルをコピーする際にHTMLもコピーするか(デフォルト: false)。
            tableHeight: "500px",//tableOverflow: true 時のテーブルの最大の高さ(例: "300px")。
            // tableWidth: "200px",//tableOverflow: true 時のテーブルの最大の横幅(例: "200px")。
            tableOverflow: true,//テーブルの高さや横幅を超えた場合にスクロールバーを表示するか(デフォルト: false)。
            wordWrap: true,//ALT + Enterでセル内改行を許可するか(デフォルト: false)。
            minDimensions: [2, 1],//最小列数・行数 (例：[5, 3])。

            //イベント
            // onchange: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onchange.next({instance, x1, y1, x2, y2, origin}),
            // oninsertrow: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.oninsertrow.next({instance, x1, y1, x2, y2, origin}),
            // oninsertcolumn: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.oninsertcolumn.next({instance, x1, y1, x2, y2, origin}),
            // ondeleterow: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.ondeleterow.next({instance, x1, y1, x2, y2, origin}),
            // ondeletecolumn: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.ondeletecolumn.next({instance, x1, y1, x2, y2, origin}),
            // onsort: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onsort.next({instance, x1, y1, x2, y2, origin}),
            // onresizerow: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onresizerow.next({instance, x1, y1, x2, y2, origin}),
            // onresizecolumn: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onresizecolumn.next({instance, x1, y1, x2, y2, origin}),
            // onmoverow: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onmoverow.next({instance, x1, y1, x2, y2, origin}),
            // onmovecolumn: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onmovecolumn.next({instance, x1, y1, x2, y2, origin}),
            // onload: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onload.next({instance, x1, y1, x2, y2, origin}),
            // onpaste: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onpaste.next({instance, x1, y1, x2, y2, origin}),
            // onselection: (instance, x1, y1, x2, y2, origin) => jspreadsheetEvent.onselection.next({instance, x1, y1, x2, y2, origin}),

            onevent: function (a, b, c, d, e, f, g, h) {

                // if (a === "onmovecolumn") {
                //     console.log("onmove");
                //     return
                // };
                if (isConstructingJspreadsheet) {
                    console.log("constructing");
                } else {
                    console.log(a);
                    eventFunc();
                }
            }
        });
        isConstructingJspreadsheet = false;
        // eventFunc();
        return jspreadsheetObject;
    };
const updateJspreadsheet = spreadsheet => nextData => columns => eventFunc => {
    const nowData = spreadsheet.getData();
    c.log(nowData);
    const nowColumns = spreadsheet.getConfig().columns;
    if (nowColumns !== columns && 0 < nowData[0].filter(datum => datum !== '').length) {
        return createJspreadsheet(nextData)(columns)(eventFunc);
        
    }
        spreadsheet.setData(JSON.stringify(nextData));
        return spreadsheet;
};
    


const jspreadsheetEventInnerFunc = _ => {
    // c.log({ string: "jspreadsheetObject.getData()", data: jspreadsheetObject.getData() });
    // c.log({ string: "jspreadsheetObject.getConfig().columns", data: jspreadsheetObject.getConfig().columns });
    tableGetter.next({
        jspreadsheetData: jspreadsheetObject.getData(),
        jspreadsheetColumns: JSON.parse(JSON.stringify(jspreadsheetObject.getConfig().columns)),
    });
};


// const jspreadsheetTimeline = repositories2Table.map(parent => updateJspreadsheet(jspreadsheetObject)(parent.jspreadsheetData)(parent.jspreadsheetColumns)(jspreadsheetEventInnerFunc));

const jspreadsheetSetter = Timeline.create()(updateJspreadsheet(jspreadsheetObject)).apply(jspreadsheetData).apply(jspreadsheetColumns).apply(Timeline.create()(jspreadsheetEventInnerFunc));
// loggerTimelines.push(
//     jspreadsheetTimeline.map(a => { c.groupCollapsed("jspreadsheetTimeline"); c.log(a); c.groupEnd(); return a })
// );





