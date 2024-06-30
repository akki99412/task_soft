const time_zone = "Asia/Tokyo";
diContainer.addForCallByValue("TASK_DATA_TEMPLATES",
    class {
        title = { defaultValue: "概要", };
        id = { get defaultValue() { return self.crypto.randomUUID(); } };
        receipt = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME); } };
        memo = { defaultValue: "詳細" };
        tag = { defaultValue: "#タグ" };
        limit = { get defaultValue() { return dayjs().add(1, 'd').tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME); } };
        man_hours = { defaultValue: 1 };
        scheduled_date_time = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME); }, };
        completion_date_time = { defaultValue: "", };
        implementation_date = { defaultValue: [{}], };
        state = { defaultValue: TASK_STATE.SCHEDULED, };
        similar_tasks_id = { defaultValue: "", };
        successor_task_id = { defaultValue: "", };
        connotative_task_id = { defaultValue: "", };
        row_num = { defaultValue: "", };
        implementation_time = { defaultValue: "", };
        kanbanNum = { defaultValue: 0 };
    });

diContainer.addForCallByValue("TASK_UI_TEMPLATES",
    class {
        title = { header: "名前", };
        id = { header: "ID", };
        receipt = { header: "受領日", };
        memo = { header: "メモ", };
        tag = { header: "タグ", };
        limit = { header: "期限", };
        man_hours = { header: "予定工数", };
        scheduled_date_time = { header: "着手予定日時", };
        scheduled_date = { header: "着手予定日", };
        scheduled_time = { header: "着手予定時間", };
        completion_date_time = { header: "完了予定日時", };
        completion_date = { header: "完了予定日", };
        completion_time = { header: "完了予定時間", };
        implementation_date = { header: "実際の実施日時", };
        state = { header: "ステータス", };
        similar_tasks_id = { header: "類似タスクid", };
        similar_tasks = { header: "類似タスク", };
        successor_task_id = { header: "後続タスクid", };
        successor_task = { header: "後続タスク", };
        connotative_task_id = { header: "内包タスクid", };
        connotative_task = { header: "内包タスク", };
        row_num = { header: "テーブル番号", };
        implementation_time = { header: "かかった時間", };
    });

diContainer.addForCallByValue("TABLE_TASK_DATA_TEMPLATES",
    class {
        title = { width: 200, col_num: 1, read_only: false, align: "left" };
        id = { width: 200, col_num: 1, read_only: true, align: "left" };
        receipt = { width: 200, col_num: 1, read_only: false, align: "left" };
        memo = { width: 200, col_num: 1, read_only: false, align: "left" };
        tag = { width: 200, col_num: 1, read_only: false, align: "left" };
        limit = { width: 200, col_num: 1, read_only: false, align: "left" };
        man_hours = { width: 200, col_num: 1, read_only: false, align: "left" };
        scheduled_date_time = { width: 200, col_num: 1, read_only: false, align: "left" };
        scheduled_date = { width: 200, col_num: 1, read_only: false, align: "left" };
        scheduled_time = { width: 200, col_num: 1, read_only: false, align: "left" };
        completion_date_time = { width: 200, col_num: 1, read_only: false, align: "left" };
        completion_date = { width: 200, col_num: 1, read_only: false, align: "left" };
        completion_time = { width: 200, col_num: 1, read_only: false, align: "left" };
        implementation_date = { width: 200, col_num: 1, read_only: false, align: "left" };
        state = { width: 200, col_num: 1, read_only: false, align: "left" };
        similar_tasks_id = { width: 200, col_num: 1, read_only: false, align: "left" };
        similar_tasks = { width: 200, col_num: 1, read_only: false, align: "left" };
        successor_task_id = { width: 200, col_num: 1, read_only: false, align: "left" };
        successor_task = { width: 200, col_num: 1, read_only: false, align: "left" };
        connotative_task_id = { width: 200, col_num: 1, read_only: false, align: "left" };
        connotative_task = { width: 200, col_num: 1, read_only: false, align: "left" };
        row_num = { width: 200, col_num: 1, read_only: false, align: "left" };
        implementation_time = { width: 200, col_num: 1, read_only: true, align: "left" };

    });

diContainer.addForCallByValue("JSPREADSHEET_TASK_DATA_TEMPLATES",
    class {
        title = { type: "text", editor: "", source: [], options: [], };
        id = { type: "text", editor: "", source: [], options: [], };
        receipt = { type: "calendar", editor: "", source: [], options: { format: DEFAULT_FORMAT.DATE }, };
        memo = { type: "html", editor: "", source: [], options: [] };
        tag = { type: "text", editor: "", source: [], options: [] };
        limit = { type: "text", editor: "", source: [], options: [] };
        man_hours = { type: "numeric", editor: "", source: [], options: [], };
        scheduled_date_time = { type: "text", editor: "", source: [], options: [], };
        scheduled_date = { type: "calendar", editor: "", source: [], options: { format: DEFAULT_FORMAT.DATE }, };
        scheduled_time = { type: "text", editor: clock_editor, source: [], options: { format: DEFAULT_FORMAT.TIME }, };
        completion_date_time = { type: "hidden", editor: "", source: [], options: [], };
        completion_date = { type: "calendar", editor: "", source: [], options: { format: DEFAULT_FORMAT.DATE } };
        completion_time = { type: "text", editor: clock_editor, source: [], options: [], };
        implementation_date = { type: "text", editor: "", source: [], options: [], };
        state = { type: "dropdown", editor: "", source: Object.values(TASK_STATE), options: [], };
        similar_tasks_id = { type: "hidden", editor: "", source: [], options: [], };
        similar_tasks = { type: "text", editor: "", source: [], options: [], };
        successor_task_id = { type: "text", editor: "", source: [], options: [], };
        successor_task = { type: "text", editor: "", source: [], options: [], };
        connotative_task_id = { type: "hidden", editor: "", source: [], options: [], };
        connotative_task = { type: "text", editor: "", source: [], options: [], };
        row_num = { type: "hidden", editor: "", source: [], options: [], };
        implementation_time = { type: "text", editor: "", source: [], options: [], };
    });



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


function update_data_template() {
    var headers = task_table.getHeaders().split(",");
    headers.forEach((header, i) => {
        // console.log(header);
        data_template.find(template => template.header === header).col_num = i;
    });
    data_template.sort((a, b) => a.col_num - b.col_num);
}
class interval {
    start = "";
    end = "";

    ToString = function () {
        if (this.end == "") {
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