
var table_data = [
    ['<span>On his 11th birthday, <b>Harry</b> receives a letter inviting him to study magic at the Hogwarts School of Witchcraft and Wizardry. <b>Harry</b> discovers that not only is he a wizard, but he is a famous one. He meets two best friends, Ron Weasley and Hermione Granger, and makes his first enemy, Draco Malfoy.</span>', 'Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777', , "10:11"],
];

var clock_editor = {
    // Methods
    picked_time: "00:00",
    closeEditor: function (cell, save) {
        var value = cell.children[0].value;
        ;
        cell.innerHTML = value;
        console.log(value);
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
                        task_table.closeEditor(cell, true);
                    }
                });
            },
        }).change(function () {
            picked_time = this.value;
            console.log(cell);
            task_table.setValue(cell, picked_time);
            cell.innerHTML = picked_time;
            // task_table.setValue(cell, this.picked_time);
            // cell.innerHTML = picked_time;
            // if (cell.children[0]) {
            //     task_table.closeEditor(cell, true);
            // }
            data_change_callback();
        });;
        // Focus on the element
        element.focus();
        // console.log(element);
        // console.log(document.getSelection())
        // console.log(document.body.children[document.body.children.length-1]);
    },
    getValue: function (cell) {
        return cell.innerHTML;
    },
    setValue: function (cell, value) {
        cell.innerHTML = value;
    }
};
const TASK_STATE = Object.freeze({
    SCHEDULED: "計画中",
    SCHEDULED_TODAY: "今日の予定",
    IN_PROGRESS: "実施中",
    // COMPLETED_TODAY: "今日完了",
    COMPLETED: "完了",
    POSTPONEMENT: "延期",
});

const LOCAL_STORAGE_KEY = Object.freeze({
    DATA_TEMPLATE: "data_template",
    DATA_BASE: "data_base",
});

const DEFAULT_FORMAT = Object.freeze({
    DATE: "YYYY/MM/DD",
    TIME: "HH:mm:ss",
    get DATE_TIME() { return this.DATE + " " + this.TIME },
});

class interval {
    start = null;
    end = null;

    ToString = function () {
        if (this.end == null) {
            return this.start.format() + "/";
        } else {
            return this.start.format() + "/" + this.end.format();
        }
    }

    constructor(start) {
        let type_of_start = Object.prototype.toString.call(start);
        if (type_of_start == "[object String]") {
            this.start = dayjs(start.split("/")[0]);
            this.end = dayjs(start.split("/")[1]);
        } else if (type_of_start == "[object Array]") {
            this.start = start[0];
            this.end = start[1];
        } else {
            this.start = start;
        }
    }
};

var data_template = [
    { header: "名前", member: "title", data_type: "string", table_type: "text", table_width: 200, table_col_num: 1, table_editor: null, table_source: [], table_read_only: false, default_value: "概要", table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    {
        header: "ID", member: "id", data_type: "string", table_type: "text", table_width: 200, table_col_num: 2, table_editor: null, table_source: [], table_read_only: true, get default_value() {
            return self.crypto.randomUUID();
        }
        , table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    {
        header: "受領日", member: "receipt", data_type: "date", table_type: "calendar", table_width: 200, table_col_num: 3, table_editor: null, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME);
        }, table_options: { format: DEFAULT_FORMAT.DATE }, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    { header: "メモ", member: "memo", data_type: "string", table_type: "html", table_width: 200, table_col_num: 4, table_editor: null, table_source: [], table_read_only: false, default_value: "詳細", table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "タグ", member: "tag", data_type: "string", table_type: "text", table_width: 200, table_col_num: 5, table_editor: null, table_source: [], table_read_only: false, default_value: "#タグ", table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    {
        header: "期限", member: "limit", data_type: "date", table_type: "calendar", table_width: 200, table_col_num: 6, table_editor: null, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE);
        }, table_options: { format: DEFAULT_FORMAT.DATE }, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    { header: "予定工数", member: "man_hours", data_type: "numeric", table_type: "numeric", table_width: 200, table_col_num: 7, table_editor: null, table_source: [], table_read_only: false, default_value: 1, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "着手予定日時", member: "scheduled_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_col_num: 8, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    {
        header: "着手予定日", member: "scheduled_date", data_type: "function", table_type: "calendar", table_width: 200, table_col_num: 9, table_editor: null, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE);
        }, table_options: { format: DEFAULT_FORMAT.DATE }, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    {
        header: "着手予定時間", member: "scheduled_time", data_type: "function", table_type: "text", table_width: 200, table_col_num: 9, table_editor: clock_editor, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.TIME);
        }, table_options: { format: DEFAULT_FORMAT.TIME }, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    { header: "完了予定日時", member: "completion_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_col_num: 10, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    {
        header: "完了予定日", member: "completion_date", data_type: "function", table_type: "calendar", table_width: 200, table_col_num: 11, table_editor: null, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE);
        }, table_options: { format: DEFAULT_FORMAT.DATE }, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    {
        header: "完了予定時間", member: "completion_time", data_type: "function", table_type: "text", table_width: 200, table_col_num: 12, table_editor: clock_editor, table_source: [], table_read_only: false, get default_value() {
            return dayjs().tz(time_zone).format(DEFAULT_FORMAT.TIME);
        }, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { },
    },
    { header: "実際の実施日時", member: "implementation_date", data_type: "[date]", table_type: "text", table_width: 200, table_col_num: 13, table_editor: null, table_source: [], table_read_only: false, default_value: [], table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    {
        header: "ステータス", member: "state", data_type: "STATE", table_type: "dropdown", table_width: 200, table_col_num: 14, table_editor: null, table_source: Object.values(TASK_STATE), table_read_only: false, default_value: TASK_STATE.SCHEDULED, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) {
            data_change_callback();
            if (y2 == null) {
                return;
            } else if (y2 == TASK_STATE.IN_PROGRESS) {
                let data = data_base[data_base.findIndex(data => data.table_row_num == x2)];
                data.implementation_date.push(new interval(dayjs().tz(time_zone)));
                task_table.setValueFromCoords(data_template.find(template => template.member == "implementation_date").table_col_num, x2, data.implementation_date.map((row) => row.ToString()).join("\n"), true);
            } else if (origin == TASK_STATE.IN_PROGRESS && y2 != TASK_STATE.IN_PROGRESS) {
                let data = data_base[data_base.findIndex(data => data.table_row_num == x2)];
                data.implementation_date[data.implementation_date.length - 1].end = dayjs().tz(time_zone);
                task_table.setValueFromCoords(data_template.find(template => template.member == "implementation_date").table_col_num, x2, data.implementation_date.map((row) => row.ToString()).join("\n"), true);
                task_table.setValueFromCoords(data_template.find(template => template.member == "table_implementation_time").table_col_num, x2, data.implementation_date.reduce(function (sum, element) {
                    return sum + element.end.diff(element.start, 'hour');
                }, 0), true);
                // data_base.setValueFromCoords(y1, x2,);
            }
            data_change_callback();
        }
    },
    { header: "類似タスクid", member: "similar_tasks_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 15, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "類似タスク", member: "similar_tasks", data_type: "function", table_type: "text", table_width: 200, table_col_num: 16, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "後続タスクid", member: "successor_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 17, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "後続タスク", member: "successor_task", data_type: "function", table_type: "text", table_width: 200, table_col_num: 18, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "内包タスクid", member: "connotative_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_col_num: 19, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "内包タスク", member: "connotative_task", data_type: "function", table_type: "text", table_width: 200, table_col_num: 20, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "テーブル番号", member: "table_row_num", data_type: "numeric", table_type: "hidden", table_width: 200, table_col_num: 21, table_editor: null, table_source: [], table_read_only: false, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
    { header: "かかった時間", member: "table_implementation_time", data_type: "numeric", table_type: "text", table_width: 200, table_col_num: 21, table_editor: null, table_source: [], table_read_only: true, default_value: null, table_options: null, table_changed_function: function (instance, x1, y1, x2, y2, origin) { }, },
];

function construct_table() {
    return jspreadsheet(document.getElementById('spreadsheet'), {
        data: table_data,
        columns: data_template.map(data => ({ type: data.table_type, title: data.header, width: data.table_width, editor: data.table_editor, source: data.table_source, readOnly: data.table_read_only, options: data.table_options })),
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
        onchange: on_change_callback,
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
}
var data_base = [];
const time_zone = "Asia/Tokyo";
let tmp = data_template.map(data => ({ type: data.table_type, title: data.header, width: data.table_width, editor: data.table_editor, source: data.table_source, readOnly: data.table_read_only, options: data.table_options }));
// console.log(tmp);


let timeoutID = 0;
let was_added_row = false;
let is_construct = false;
var task_table = construct_table();

// import { nameText } from './import.js';
function data_change_callback() {
    was_added_row = false;
    if (is_construct) {

        update_data_template();
        update_data_base();

        clearTimeout(timeoutID);
        // console.log("stacked!");
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
    // data_base = [];
    values.forEach((value, j) => {
        data_base_row = {
            //     _scheduled_date_time:"",
            //     set scheduled_date_time(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_date_time() {
            //         return Date();
            //     },
            //     set scheduled_date(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_date() {
            //         return Date();
            //     },
            //     set scheduled_time(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_time() {
            //         return Date();
            //     },
            //     _completion_date_time: Date(),
            //     set completion_date_time(value) {
            //         return Date();
            //     },
            //     get completion_date_time() {
            //         return Date();
            //     }
        };

        value.forEach((datum, i) => {
            if (data_template[i].member == "implementation_date") {
                if (datum == "") {
                    data_base_row[data_template[i].member] = [];
                } else {
                    data_base_row[data_template[i].member] = datum.split("\n").map(time => new interval(time));
                }
                
            } else {
                data_base_row[data_template[i].member] = datum;
            }
        });
        data_base_row.table_row_num = j;
        data_base[j]=data_base_row;
    });
}
async function save_file() {
    clearTimeout(timeoutID);
    // console.log(task_table.getJson());
    // console.log(data_template[0]);
    // console.log(data_template);
    // console.log(data_base);
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_template)))); 
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_base))));
    console.log("saved!");
    console.log(JSON.stringify(data_base));
}


async function load_data() {
    console.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)));
    // console.log(await decrypt_string(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE))));
    let decrypt_data = await decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)))
    console.log(decrypt_data);
    let load_template = JSON.parse(decrypt_data); 
    // var headers_and_editors = data_template.map((data) => ({
    //     header: data.header, editor: data.table_editor, default_value: data.default_value
    // }));
    // headers_and_editors.forEach((hae, i) => {
    //     // console.log(header);
    //     load_template.find(template => template.header === hae.header).table_editor = hae.editor;
    //     load_template.find(template => template.header === hae.header).default_value = hae.default_value;
    // });
    // console.log(load_template);
    // console.log(load_template[0]);
    // data_template = load_template;
    // Object.entries(load_template[0]).forEach(([key, value]) => {console.log(key+" "+value)})
    load_template.forEach((src, i) => {
        Object.entries(src).forEach(([key, value]) => {
            if (!["table_editor", "default_value", "table_changed_function"].includes(key)) {
                // data_template[key] = value;
                data_template.find(template => template.header === src.header)[key] = value;
            }
        }
        );
    });

    data_template.sort((a, b) => a.table_col_num - b.table_col_num);
    // console.log(data_template);

    // let load_template = JSON.parse(decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)))); 
    decrypt_data = await decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_BASE)))
    json_data_base = JSON.parse(decrypt_data);
    // old_data_template = data_template;
    // Object.keys(json_data_base).forEach(function (key) {
    //     console.log('key:', key);
    //     // console.log('json_parse:', json_data_base.family);
    // });
    table_data = [];
    json_data_base.forEach((data, j) => {
        table_row = [];
        data_template.forEach((template, i) => {
            if (template.member == "implementation_date") {
                if (data[template.member].length==0) {
                    console.log("blank");
                    // data_base[i][template.member] = [];
                    table_row[i] = "";
                } else  {
                    data_base[j][template.member] = data[template.member].map((row) => new interval(row.start + "/" + row.end));
                    // console.log([data_base[i][template.member].start, data_base[i][template.member].end]);
                    // console.log(Object.prototype.toString.call(data_base[i][template.member]));
                    table_row[i] = data_base[j][template.member].map((row) => row.ToString()).join("\n");
                    // console.log(table_row[j]);
                    
                }
            } else {
                table_row[i] = data[template.member];
            }
        });
        table_data.push(table_row);
    });
    console.log(table_data);

    //前のシート削除
    let element = document.getElementById('spreadsheet');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    // console.log(data_template.map((template) => ({ type: template.table_type, title: template.header, width: template.table_width, editor: template.table_editor, source: template.table_source, readOnly: template.table_read_only })));

    // console.log(clock_editor);
    //新規シート作成
    task_table = construct_table();
    // task_table.setHeader(0, "test");
    // var values = task_table.setData();
    // type, editor, source
    data_change_callback();

}

function on_insert_row_callback(instance, x1, y1, x2, y2, origin) {
    // console.log("on_insert_row_callback");
    // let cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
    // let cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
    // console.log('selection ' + x1 + ' ' + y1);
    // console.log(y2);
    let uuid = self.crypto.randomUUID();
    let input_row_num = x1;
    if (!y2) {
        input_row_num++;
    }

    // data_template.forEach((src, i) => {
    //     Object.entries(src).forEach((key, value) => {
    //         if (!["table_editor", "default_value"].includes(key)) {
    //             data_template[key] = value;
    //         }
    //     }
    //     );
    // });
    const buffer_data = [];
    data_template.forEach(template => {
        buffer_data.push(template.default_value);
    });
    // console.log(buffer_data);
    task_table.setRowData(input_row_num, buffer_data);


    let headers = task_table.getHeaders().split(",");
    headers.forEach((header, i) => {
        // console.log(header);
        if (["ID"].includes(header)) {
            // console.log(data_template.find(template => template.header === header).default_value);
            task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
            // task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
        } else if (["着手予定時間", "完了予定時間"].includes(header)) {
            // console.log(data_template.find(template => template.header === header).default_value);
            task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
            task_table.records[input_row_num][i].innerHTML = data_template.find(template => template.header === header).default_value;//htmlが更新されないため、強制入力
        }
    });
    // console.log('id col is ' + id_col_num);
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
function on_change_callback(instance, x1, y1, x2, y2, origin) {
    // console.log("instance");
    // console.log(instance);
    // console.log("x1");
    // console.log(x1);
    // console.log("y1");
    // console.log(y1);
    // console.log("x2");
    // console.log(x2);
    // console.log("y2");
    // console.log(y2);
    // console.log("origin");
    // console.log(origin);


    let changed_data_template = data_template.find(datum => datum.table_col_num == y1);
    console.log(changed_data_template);

    changed_data_template.table_changed_function(instance, x1, y1, x2, y2, origin);

    data_change_callback();
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
    // load_data();
    // let encrypt_data = await encrypt_string(secret_key, "暗号化したいデータ");
    // await decrypt_string(secret_key, encrypt_data);
})();

function test_function() {
    console.log("test function")
    console.log(data_template.map(data => data.default_value));
    task_table.setRowData(1, data_template.map(data => data.default_value));
}