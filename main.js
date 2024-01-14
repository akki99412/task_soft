
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
});

const LOCAL_STORAGE_KEY = Object.freeze({
    DATA_TEMPLATE: "data_template",
    DATA_BASE: "data_base",

});

var data_template = [
    { header: "名前", member: "title", data_type: "string", table_type: "text", table_width: 200, table_row_num: 1, table_editor: null, table_source: [] },
    { header: "ID", member: "id", data_type: "string", table_type: "text", table_width: 200, table_row_num: 2, table_editor: null, table_source: [] },
    { header: "受領日", member: "receipt", data_type: "date", table_type: "calendar", table_width: 200, table_row_num: 3, table_editor: null, table_source: [] },
    { header: "メモ", member: "memo", data_type: "string", table_type: "html", table_width: 200, table_row_num: 4, table_editor: null, table_source: [] },
    { header: "タグ", member: "tag", data_type: "string", table_type: "text", table_width: 200, table_row_num: 5, table_editor: null, table_source: [] },
    { header: "期限", member: "limit", data_type: "date", table_type: "calendar", table_width: 200, table_row_num: 6, table_editor: null, table_source: [] },
    { header: "予定工数", member: "man_hours", data_type: "numeric", table_type: "numeric", table_width: 200, table_row_num: 7, table_editor: null, table_source: [] },
    { header: "着手予定日時", member: "scheduled_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_row_num: 8, table_editor: null, table_source: [] },
    { header: "着手予定日", member: "scheduled_date", data_type: "function", table_type: "calendar", table_width: 200, table_row_num: 9, table_editor: null, table_source: [] },
    { header: "着手予定時間", member: "scheduled_time", data_type: "function", table_type: "text", table_width: 200, table_row_num: 9, table_editor: clock_editor, table_source: [] },
    { header: "完了予定日時", member: "completion_date_time", data_type: "date", table_type: "hidden", table_width: 200, table_row_num: 10, table_editor: null, table_source: [] },
    { header: "完了予定日", member: "completion_date", data_type: "function", table_type: "calendar", table_width: 200, table_row_num: 11, table_editor: null, table_source: [] },
    { header: "完了予定時間", member: "completion_time", data_type: "function", table_type: "text", table_width: 200, table_row_num: 12, table_editor: null, table_source: [] },
    { header: "実際の実施日時", member: "implementation_date", data_type: "[date]", table_type: "html", table_width: 200, table_row_num: 13, table_editor: null, table_source: [] },
    { header: "ステータス", member: "state", data_type: "STATE", table_type: "dropdown", table_width: 200, table_row_num: 14, table_editor: null, table_source: Object.values(TASK_STATE) },
    { header: "類似タスクid", member: "similar_tasks_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_row_num: 15, table_editor: null, table_source: [] },
    { header: "類似タスク", member: "similar_tasks", data_type: "function", table_type: "html", table_width: 200, table_row_num: 16, table_editor: null, table_source: [] },
    { header: "後続タスクid", member: "successor_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_row_num: 17, table_editor: null, table_source: [] },
    { header: "後続タスク", member: "successor_task", data_type: "function", table_type: "html", table_width: 200, table_row_num: 18, table_editor: null, table_source: [] },
    { header: "内包タスクid", member: "connotative_task_id", data_type: "[string]", table_type: "hidden", table_width: 200, table_row_num: 19, table_editor: null, table_source: [] },
    { header: "内包タスク", member: "connotative_task", data_type: "function", table_type: "html", table_width: 200, table_row_num: 20, table_editor: null, table_source: [] },
    { header: "テーブル番号", member: "table_row_num", data_type: "numeric", table_type: "numeric", table_width: 200, table_row_num: 21, table_editor: null, table_source: [] },
];

var data_base = [];


var task_table = jspreadsheet(document.getElementById('spreadsheet'), {
    data: data,
    columns: data_template.map(({ header, member, data_type, table_type, table_width, table_row_num, table_editor, table_source }) => ({ type: table_type, title: header, width: table_width, editor: table_editor, source: table_source })),

    // [
    //     { type: 'html', title: 'html_test', width: 120 , fadfadfadfs: "ssss"},
    //     { type: 'text', title: 'Car', width: 120 },
    //     { type: 'dropdown', title: 'Make', width: 200, source: ["Alfa Romeo", "Audi", "Bmw"] },
    //     { type: 'calendar', title: 'Available', width: 200 },
    //     { type: 'image', title: 'Photo', width: 120 },
    //     { type: 'checkbox', title: 'Stock', width: 80 },
    //     { type: 'numeric', title: 'Price', width: 100, mask: '$ #.##,00', decimal: ',' },
    //     { type: 'color', width: 100, render: 'square', }
    // ],
    minDimensions: [2, 2],
    columnDrag: true
});

// import { nameText } from './import.js';
function save_file() {
    var headers = task_table.getHeaders().split(",");
    var values = task_table.getData();
    console.log(task_table.getJson());
    // console.log(headers);
    // console.log(values);
    // var table_headers2database = [];
    headers.forEach((header, i) => {
        // console.log(header);
        data_template.find(template => template.header === header).table_row_num = i;
    });
    data_template.sort((a, b) => a.table_row_num - b.table_row_num);
    // console.log(data_template);
    data_base = [];
    // data_base_row = {}
    // data_template.forEach(template => {
    //     data_base_row[template.member] = null;
    // });
    values.forEach(value => {
        data_base_row = {};
        value.forEach((datum, i) => {
            data_base_row[data_template[i].member] = datum;
        });
        data_base.push(data_base_row);
    });

    // data_template.forEach(template => {
    //     data_base_row[template.member] = null;
    // });
    console.log(data_base);
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
        JSON.stringify(data_template));
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
        JSON.stringify(data_base));
    // console.log(`こんにちは${nameText}さん`);
    // console.log(data_template.getStyle());
    // console.log(data_template.getMeta(1, "ID"));

}

function load_data() {
    data_base = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_BASE));
    old_data_template = data_template;
    data_template = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE));
    console.log(data_base);
    console.log(data_base.values);

    let table_data = [];
    data_base.forEach(data => {
        table_row = [];
        data_template.forEach((template, i) => {
            table_row[i] = data[template.member];
        });
        table_data.push(table_row);
    });
    // let data = [];
    // data_template.forEach(template => { 
    //     let datum = [];
    //     data.push(data_base[template.member]);
    // });
    // var headers = task_table.setHeaders().split(",");

    // var headers = task_table.getHeaders().split(",");
    // data_template.forEach((template, i) => {
    //     const found = headers.indexOf(template.header);
    //     data_template.moveColumn(found, i);
    //     console.log(found);
    // });
    let element = document.getElementById('spreadsheet');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    task_table = jspreadsheet(document.getElementById('spreadsheet'), {
        data: table_data,
        columns: data_template.map(({ header, member, data_type, table_type, table_width, table_row_num, table_editor, table_source }) => ({ type: table_type, title: header, width: table_width, editor: table_editor, source: table_source })),
        minDimensions: [2, 2],
        columnDrag: true
    });
    // task_table.setHeader(0, "test");
    // var values = task_table.setData();
    // type, editor, source
    
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
    // await encrypt_string(secret_key, "暗号化したいデータ");
    // await decrypt_string(secret_key);
})();

