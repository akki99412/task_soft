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

function update_data_template() {
    var headers = task_table.getHeaders().split(",");
    headers.forEach((header, i) => {
        // console.log(header);
        data_template.find(template => template.header === header).table_col_num = i;
    });
    data_template.sort((a, b) => a.table_col_num - b.table_col_num);
}