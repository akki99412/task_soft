class FilterTableMessage extends IJspreadsheetData {
    constructor(value) {
        super(value);
    }
}
class FilterTableView extends IJspreadsheetData {
    constructor(value) {
        super(value);
    }
}


// c.log(new TableMessage({ jspreadsheetData: 100, jspreadsheetColumns: 200 }))
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
let filterJspreadsheetObject = jspreadsheet(document.getElementById('filterTable'), {
    data: [[1, 2], [3, 4]],
});
let filterJspreadsheetPosition = {}
// const jspreadsheetTimelineOutput = Timeline.create()().apply(jspreadsheetColumns).apply(jspreadsheetData);
//     repositories2Table.map(parent => ({
//     jspreadsheetData: jspreadsheetObject.getData(),
//     jspreadsheetColumns: JSON.parse(JSON.stringify(jspreadsheetObject.getConfig().columns)),
//     header2Key: parent.header2Key
// }));


// loggerTimelines.push(
//     jspreadsheetTimelineOutput.map(a => { c.groupCollapsed("jspreadsheetTimelineOutput"); c.log(a); c.groupEnd(); return a })
// );




let isConstructingFilterJspreadsheetObject = false;
const createFilterJspreadsheet =
    nextData => columns => eventFunc => {
        c.log("create jspreadsheet");
        c.log(columns);
        isConstructingFilterJspreadsheetObject = true;
        const element = document.getElementById('filterTable');
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        };
        filterJspreadsheetObject = jspreadsheet(element, {
            data: nextData,
            columns: columns,
            //パラメーター
            allowComments: false,//セルへのコメント追加を許可するか(デフォルト: false)。
            allowInsertColumn: false,//列追加を許可するか(デフォルト: true)。
            allowInsertRow: false,//行追加を許可するか（デフォルト: true)。
            allowManualInsertColumn: false,//タブキーで列追加を許可するか(デフォルト: true)。
            allowManualInsertRow: false,//改行キーで行追加を許可するか(デフォルト: true)。
            allowDeleteColumn: false,//列削除を許可するか(デフォルト: true)。
            allowDeleteRow: false,//行削除を許可するか(デフォルト: true)。
            allowDeletingAllRows: false,//すべての行を削除することを許可するか(デフォルト: false)。
            autoCasting: false,//1,234 などのカンマ付き数値を数字と見なすか(デフォルト: true)。
            autoIncrement: false,//数値ドラッグ時に自動インクリメントするか(デフォルト: true)。
            columnDrag: false,//カラムのドラッグを許可するか(デフォルト: false)。
            columnSorting: false,//ダブルクリックでカラムをソートするか(デフォルト: true)。
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
            // pagination: 50,//ページネーション行数(例: 10)。
            // paginationOptions: [10, 50, 100],//ページネーション行数候補。search: true の時に有効(例: [10, 50, 100])。
            parseFormulas: false,//計算式をサポートするか(デフォルト: true)。
            rowDrag: false,//行ドラッグを許可するか(デフォルト: true)。
            rowResize: true,//高さのリサイズを許可するか(デフォルト: false)。
            search: false,//検索を可能とするか(デフォルト: false)。
            selectionCopy: false,//セル選択時の右下の■ドラッグでコピーを許可するか(デフォルト: true)。
            stripHTML: true,//セル内のHTMLを無効化する(デフォルト: true)。
            stripHTMLOnCopy: false,//セルをコピーする際にHTMLもコピーするか(デフォルト: false)。
            tableHeight: "500px",//tableOverflow: true 時のテーブルの最大の高さ(例: "300px")。
            // tableWidth: "200px",//tableOverflow: true 時のテーブルの最大の横幅(例: "200px")。
            tableOverflow: true,//テーブルの高さや横幅を超えた場合にスクロールバーを表示するか(デフォルト: false)。
            wordWrap: false,//ALT + Enterでセル内改行を許可するか(デフォルト: false)。
            minDimensions: [2, 1],//最小列数・行数 (例：[5, 3])。
            filters: false,

            //イベント
            onchange: (instance, x1, y1, x2, y2, origin) => c.log({event:onchange,instance, x1, y1, x2, y2, origin}),
            oninsertrow: (instance, x1, y1, x2, y2, origin) => {
                console.log("oninsertrow");
            },
            oninsertcolumn: (instance, x1, y1, x2, y2, origin) => c.log({event:"oninsertcolumn",instance, x1, y1, x2, y2, origin}),
            ondeleterow: (instance, x1, y1, x2, y2, origin) => c.log({event:"ondeleterow",instance, x1, y1, x2, y2, origin}),
            ondeletecolumn: (instance, x1, y1, x2, y2, origin) => c.log({event:"ondeletecolumn",instance, x1, y1, x2, y2, origin}),
            onsort: (instance, x1, y1, x2, y2, origin) => c.log({event:"onsort",instance, x1, y1, x2, y2, origin}),
            onresizerow: (instance, x1, y1, x2, y2, origin) => c.log({event:"onresizerow",instance, x1, y1, x2, y2, origin}),
            onresizecolumn: (instance, x1, y1, x2, y2, origin) => c.log({event:"onresizecolumn",instance, x1, y1, x2, y2, origin}),
            onmoverow: (instance, x1, y1, x2, y2, origin) => c.log({event:"onmoverow",instance, x1, y1, x2, y2, origin}),
            onmovecolumn: (instance, x1, y1, x2, y2, origin) => c.log({event:"onmovecolumn",instance, x1, y1, x2, y2, origin}),
            onload: (instance, x1, y1, x2, y2, origin) => c.log({event:"onload",instance, x1, y1, x2, y2, origin}),
            onpaste: (instance, x1, y1, x2, y2, origin) => c.log({event:"onpaste",instance, x1, y1, x2, y2, origin}),
            onselection: (instance, x1, y1, x2, y2, origin) => c.log({event:"onselection",instance, x1, y1, x2, y2, origin}),

            onevent: function (a, b, c, d, e, f, g, h) {
                // console.log({event:"event", a, b, c, d, e, f, g, h});
                if (a === "onselection") {
                    // console.log("onselection");
                    // c.log({});
                    const columns = (filterJspreadsheetObject.getSelectedColumns());
                    const rows = (filterJspreadsheetObject.getSelectedRows(true));
                    if ((columns.length !== 0 && rows.length !== 0)) {
                        filterJspreadsheetPosition = {
                            column: { min: columns.reduce((a, b) => Math.min(a, b)), max: columns.reduce((a, b) => Math.max(a, b)) },
                            row: { min: rows.reduce((a, b) => Math.min(a, b)), max: rows.reduce((a, b) => Math.max(a, b)) },
                        };
                    }


                }
                if (a === "oninsertrow") {
                    // console.log("oninsertrow");
                    // c.log({});
                    filterJspreadsheetObject.updateSelectionFromCoords(filterJspreadsheetPosition.column.min, filterJspreadsheetPosition.row.min, filterJspreadsheetPosition.column.max, filterJspreadsheetPosition.row.max);
                };
                if (isConstructingFilterJspreadsheetObject) {
                    // console.log("constructing");
                } else {
                    // console.log(a);
                    eventFunc();
                }
                // console.log("event end");//なぜかエンターキーで行追加時にonevent関数を抜けた直後にjspreadsheetでエラーが発生する
            }
        });
        filterJspreadsheetObject.ignoreHistory = true;
        isConstructingFilterJspreadsheetObject = false;
        // eventFunc();
        return filterJspreadsheetObject;
    };
const updateFilterJspreadsheet = spreadsheet => nextData => columns => eventFunc => {
    console.log("updateFilterJspreadsheet");
    const nowData = spreadsheet.getData();
    const nowColumns = spreadsheet.getConfig().columns;
    if (nowColumns !== columns && 0 < nowData[0].filter(datum => datum !== '').length) {
        return createFilterJspreadsheet(nextData)(columns)(eventFunc);

    }
    spreadsheet.setData(JSON.stringify(nextData));
    return spreadsheet;
};



function filterJspreadsheetEventInnerFunc() {
    // c.log({ string: "filterJspreadsheetObject.getData()", data: filterJspreadsheetObject.getData() });
    // c.log({ string: "filterJspreadsheetObject.getConfig().columns", data: filterJspreadsheetObject.getConfig().columns });
    // tableGetter.next({
    //     jspreadsheetData: filterJspreadsheetObject.getData(),
    //     jspreadsheetColumns: JSON.parse(JSON.stringify(filterJspreadsheetObject.getConfig().columns)),
    // });
    main.update(new FilterTableMessage({
        jspreadsheetData: filterJspreadsheetObject.getData(),
        jspreadsheetColumns: JSON.parse(JSON.stringify(filterJspreadsheetObject.getConfig().columns)),
    }))
};


// const jspreadsheetTimeline = repositories2Table.map(parent => updateJspreadsheet(filterJspreadsheetObject)(parent.jspreadsheetData)(parent.jspreadsheetColumns)(jspreadsheetEventInnerFunc));

// const jspreadsheetSetter = Timeline.create()(updateJspreadsheet(filterJspreadsheetObject)).apply(jspreadsheetData).apply(jspreadsheetColumns).apply(Timeline.create()(jspreadsheetEventInnerFunc));
// loggerTimelines.push(
//     jspreadsheetTimeline.map(a => { c.groupCollapsed("jspreadsheetTimeline"); c.log(a); c.groupEnd(); return a })
// );





