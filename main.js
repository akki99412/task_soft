
var data = [
    ['<span>On his 11th birthday, <b>Harry</b> receives a letter inviting him to study magic at the Hogwarts School of Witchcraft and Wizardry. <b>Harry</b> discovers that not only is he a wizard, but he is a famous one. He meets two best friends, Ron Weasley and Hermione Granger, and makes his first enemy, Draco Malfoy.</span>', 'Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777', , "10:11"],
];

var clock_editor = {
    // Methods
    closeEditor: function (cell, save) {
        var value = cell.children[0].value;
        cell.innerHTML = value;
        return value;
    },
    openEditor: function (cell) {
        // Create input
        var element = document.createElement('input');
        element.value = cell.innerHTML;
        // Update cell
        cell.classList.add('editor');
        cell.innerHTML = '';
        cell.appendChild(element);
        $(element).clockpicker({
            afterHide: function () {
                setTimeout(function () {
                    // To avoid double call
                    if (cell.children[0]) {
                        myTable.closeEditor(cell, true);
                    }
                });
            }
        });
        // Focus on the element
        element.focus();
    },
    getValue: function (cell) {
        return cell.innerHTML;
    },
    setValue: function (cell, value) {
        cell.innerHTML = value;
    }
}
const TASK_STATE = Object.freeze({
    SCHEDULED: "計画中",
    SCHEDULED_TODAY: "今日の予定",
    IN_PROGRESS: "実施中",
    COMPLETED_TODAY: "今日完了",
    COMPLETED: "完了",
    POSTPONEMENT: "延期",
});

const LOCAL_STORAGE_KEY = Object.freeze({
    DATA_TEMPLATE: "data_template",
    DATA_BASE: "data_base",

});

var data_template = [
    { header: "名前", member: "title", data_type: "string", table_type: "text", table_width: 200, table_col_num: 1, table_editor: null, table_source: [], table_read_only: false},
    { header: "ID", member: "id", data_type: "string", table_type: "text", table_width: 200, table_col_num: 2, table_editor: null, table_source: [], table_read_only: true},
    { header: "受領日", member: "receipt", data_type: "date", table_type: "calendar", table_width: 200, table_col_num: 3, table_editor: null, table_source: [], table_read_only: false},
    { header: "メモ", member: "memo", data_type: "string", table_type: "html", table_width: 200, table_col_num: 4, table_editor: null, table_source: [], table_read_only: false},
    { header: "タグ", member: "tag", data_type: "string", table_type: "text", table_width: 200, table_col_num: 5, table_editor: null, table_source: [], table_read_only: false},
    { header: "期限", member: "limit", data_type: "date", table_type: "calendar", table_width: 200, table_col_num: 6, table_editor: null, table_source: [], table_read_only: false},
    { header: "予定工数", member: "man_hours", data_type: "numeric", table_type: "numeric", table_width: 200, table_col_num: 7, table_editor: null, table_source: [], table_read_only: false},
    { header: "着手予定日時", member: "scheduled_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_col_num: 8, table_editor: null, table_source: [], table_read_only: false},
    { header: "着手予定日", member: "scheduled_date", data_type: "function", table_type: "calendar", table_width: 200, table_col_num: 9, table_editor: null, table_source: [], table_read_only: false},
    { header: "着手予定時間", member: "scheduled_time", data_type: "function", table_type: "text", table_width: 200, table_col_num: 9, table_editor: clock_editor, table_source: [], table_read_only: false},
    { header: "完了予定日時", member: "completion_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_col_num: 10, table_editor: null, table_source: [], table_read_only: false},
    { header: "完了予定日", member: "completion_date", data_type: "function", table_type: "calendar", table_width: 200, table_col_num: 11, table_editor: null, table_source: [], table_read_only: false},
    { header: "完了予定時間", member: "completion_time", data_type: "function", table_type: "text", table_width: 200, table_col_num: 12, table_editor: null, table_source: [], table_read_only: false},
    { header: "実際の実施日時", member: "implementation_date", data_type: "[date]", table_type: "text", table_width: 200, table_col_num: 13, table_editor: null, table_source: [], table_read_only: false},
    { header: "ステータス", member: "state", data_type: "STATE", table_type: "dropdown", table_width: 200, table_col_num: 14, table_editor: null, table_source: Object.values(TASK_STATE), table_read_only: false},
    { header: "類似タスクid", member: "similar_tasks_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 15, table_editor: null, table_source: [], table_read_only: false},
    { header: "類似タスク", member: "similar_tasks", data_type: "function", table_type: "text", table_width: 200, table_col_num: 16, table_editor: null, table_source: [], table_read_only: false},
    { header: "後続タスクid", member: "successor_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 17, table_editor: null, table_source: [], table_read_only: false},
    { header: "後続タスク", member: "successor_task", data_type: "function", table_type: "text", table_width: 200, table_col_num: 18, table_editor: null, table_source: [], table_read_only: false},
    { header: "内包タスクid", member: "connotative_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 19, table_editor: null, table_source: [], table_read_only: false},
    { header: "内包タスク", member: "connotative_task", data_type: "function", table_type: "text", table_width: 200, table_col_num: 20, table_editor: null, table_source: [], table_read_only: false},
    { header: "テーブル番号", member: "table_row_num", data_type: "numeric", table_type: "numeric", table_width: 200, table_col_num: 21, table_editor: null, table_source: [], table_read_only: false},
];

var data_base = [];



var task_table = jspreadsheet(document.getElementById('spreadsheet'), {
    data: data,
    columns: data_template.map(({ header, member, data_type, table_type, table_width, table_row_num, table_editor, table_source, table_read_only }) => ({ type: table_type, title: header, width: table_width, editor: table_editor, source: table_source, 
        })),
    minDimensions: [2, 2],
    columnDrag: true
});

// import { nameText } from './import.js';

let timeoutID = 0;
let was_added_row = false;
let is_construct = false;
function data_change_callback() {
    was_added_row = false;
    if (is_construct) {

        update_data_template();
        update_data_base();

        clearTimeout(timeoutID);
        console.log("stacked!");
        timeoutID = setTimeout(save_file, 10 * 1000);

    } else {
        is_construct = true;
    }
}
function update_data_template() {
    var headers = task_table.getHeaders().split(",");
    headers.forEach((header, i) => {
        // console.log(header);
        data_template.find(template => template.header === header).table_col_num = i;
    });
    data_template.sort((a, b) => a.table_col_num - b.table_col_num);
}
function update_data_base() {
    update_data_template();
    var values = task_table.getData();
    data_base = [];
    values.forEach(value => {
        data_base_row = {};
        value.forEach((datum, i) => {
            data_base_row[data_template[i].member] = datum;
        });
        data_base.push(data_base_row);
    });
}
function save_file() {
    clearTimeout(timeoutID);
    // console.log(task_table.getJson());
    // console.log(data_template);
    // console.log(data_base);
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
        JSON.stringify(data_template));
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
        JSON.stringify(data_base));
    console.log("saved!");
}
function load_data() {
    data_base = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_BASE));
    // old_data_template = data_template;
    data_template = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE));

    let table_data = [];
    data_base.forEach(data => {
        table_row = [];
        data_template.forEach((template, i) => {
            table_row[i] = data[template.member];
        });
        table_data.push(table_row);
    });
    let element = document.getElementById('spreadsheet');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    task_table = jspreadsheet(document.getElementById('spreadsheet'), {
        data: table_data,
        columns: data_template.map(({ header, member, data_type, table_type, table_width, table_col_num, table_editor, table_source, table_read_only}) => ({ type: table_type, title: header, width: table_width, editor: table_editor, source: table_source, readOnly: table_read_only })),
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
        minDimensions: [2, 2],//最小列数・行数 (例：[5, 3])。

        //イベント
        onchange: data_change_callback,
        oninsertrow: on_insert_row_callback,
        oninsertcolumn: data_change_callback,
        ondeleterow: data_change_callback,
        ondeletecolumn: data_change_callback,
        onsort: data_change_callback,
        onresizerow: data_change_callback,
        onresizecolumn: data_change_callback,
        onmoverow: data_change_callback,
        onmovecolumn: data_change_callback,
        onload: data_change_callback,
        onpaste: data_change_callback,
        onselection: on_selection_callback,
        // onevent: function (a, b, c, d, e, f, g, h) {
        //     console.log(a);
        //     console.log(b);
        //     console.log(c);
        //     console.log(d);
        //     console.log(e);
        //     console.log(f);
        //     console.log(g);
        //     console.log(h);
        // }
    });
    // task_table.setHeader(0, "test");
    // var values = task_table.setData();
    // type, editor, source

}
function on_insert_row_callback(instance, x1, y1, x2, y2, origin) {
    console.log("on_insert_row_callback");
    // let cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
    // let cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
    // console.log('selection ' + x1 + ' ' + y1);
    // console.log(y2);
    id_col_num = data_template.find(object => object.member == "id").table_col_num;
    // console.log('id col is ' + id_col_num);
    let uuid = self.crypto.randomUUID();
    if (y2) {
        task_table.setValueFromCoords(id_col_num, x1,uuid, true);
    } else {
        let data_length = task_table.getData().length;
        task_table.setValueFromCoords(id_col_num, x1 + 1,uuid, true);
    }
    data_change_callback();
    // was_added_row = true;
    // cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
    // cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
    // console.log('after add The selection from ' + cellName1 + ' to ' + cellName2 + '');
}
var on_selection_callback = function (instance, x1, y1, x2, y2, origin) {
    // if (was_added_row) {
    //     // var cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
    //     // var cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
    //     id_col_num = data_template.find(object => object.member == "id").table_col_num;
    //     console.log('id col is' + id_col_num);
    //     // console.log(id_col_num);
    //     // myTable.getValueFromCoords([integer], [integer], [string], [bool]);
    //     // console.log('The selection from ' + cellName1 + ' to ' + cellName2 + '');
    // }
    // was_added_row = false;
}
// localStorage.setItem('localStrageSaveTestKey', 'localStrageSaveTestString');
// var value = localStorage.getItem('localStrageSaveTestKey');
// console.log(value);

function saveTextToFile(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
}
(async function () {
    if (secret_key_string == "") {
        // console.log("generate_key")
        let generated_key = await auto_generate_key();
        // console.log("secret_key_string=\'" + JSON.stringify(generated_key) + "\'");
        saveTextToFile("secret_key_string=\'" + JSON.stringify(generated_key) + "\'", "key_file.js");
        secret_key = generated_key;
    } else {
        secret_key = await import_secret_key(JSON.parse(secret_key_string));
    }
    load_data();
    // await encrypt_string(secret_key, "暗号化したいデータ");
    // await decrypt_string(secret_key);
})();

