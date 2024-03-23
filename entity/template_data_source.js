const time_zone = "Asia/Tokyo";
diContainer.addForCallByValue("TASK_DATA_TEMPLATES",
    class {
        title = { defaultValue: "概要", };
        id = { get defaultValue() { return self.crypto.randomUUID(); } };
        receipt = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME); } };
        memo = { defaultValue: "詳細" };
        tag = { defaultValue: "#タグ" };
        limit = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE); } };
        man_hours = { defaultValue: 1 };
        scheduled_date_time = { defaultValue: null, };
        scheduled_date = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE); }, };
        scheduled_time = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.TIME); }, };
        completion_date_time = { defaultValue: null, };
        completion_date = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE); }, };
        completion_time = { get defaultValue() { return dayjs().tz(time_zone).format(DEFAULT_FORMAT.TIME); }, };
        implementation_date = { defaultValue: [], };
        state = { defaultValue: TASK_STATE.SCHEDULED, };
        similar_tasks_id = { defaultValue: null, };
        similar_tasks = { defaultValue: null, };
        successor_task_id = { defaultValue: null, };
        successor_task = { defaultValue: null, };
        connotative_task_id = { defaultValue: null, };
        connotative_task = { defaultValue: null, };
        row_num = { defaultValue: null, };
        implementation_time = { defaultValue: null, };
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
        title = { width: 200, col_num: 1, read_only: false, };
        id = { width: 200, col_num: 1, read_only: true, };
        receipt = { width: 200, col_num: 1, read_only: false, };
        memo = { width: 200, col_num: 1, read_only: false, };
        tag = { width: 200, col_num: 1, read_only: false, };
        limit = { width: 200, col_num: 1, read_only: false, };
        man_hours = { width: 200, col_num: 1, read_only: false, };
        scheduled_date_time = { width: 200, col_num: 1, read_only: false, };
        scheduled_date = { width: 200, col_num: 1, read_only: false, };
        scheduled_time = { width: 200, col_num: 1, read_only: false, };
        completion_date_time = { width: 200, col_num: 1, read_only: false, };
        completion_date = { width: 200, col_num: 1, read_only: false, };
        completion_time = { width: 200, col_num: 1, read_only: false, };
        implementation_date = { width: 200, col_num: 1, read_only: false, };
        state = { width: 200, col_num: 1, read_only: false, };
        similar_tasks_id = { width: 200, col_num: 1, read_only: false, };
        similar_tasks = { width: 200, col_num: 1, read_only: false, };
        successor_task_id = { width: 200, col_num: 1, read_only: false, };
        successor_task = { width: 200, col_num: 1, read_only: false, };
        connotative_task_id = { width: 200, col_num: 1, read_only: false, };
        connotative_task = { width: 200, col_num: 1, read_only: false, };
        row_num = { width: 200, col_num: 1, read_only: false, };
        implementation_time = { width: 200, col_num: 1, read_only: true, };

    });

diContainer.addForCallByValue("JSPREADSHEET_TASK_DATA_TEMPLATES",
    class {
        title = { type: "text", editor: null, source: [], options: null, };
        id = { type: "text", editor: null, source: [], options: null, };
        receipt = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE }, };
        memo = { type: "html", editor: null, source: [], options: null };
        tag = { type: "text", editor: null, source: [], options: null };
        limit = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE } };
        man_hours = { type: "numeric", editor: null, source: [], options: null, };
        scheduled_date_time = { type: "hidden", editor: null, source: [], options: null, };
        scheduled_date = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE }, };
        scheduled_time = { type: "text", editor: clock_editor, source: [], options: { format: DEFAULT_FORMAT.TIME }, };
        completion_date_time = { type: "hidden", editor: null, source: [], options: null, };
        completion_date = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE } };
        completion_time = { type: "text", editor: clock_editor, source: [], options: null, };
        implementation_date = { type: "text", editor: null, source: [], options: null, };
        state = { type: "dropdown", editor: null, source: Object.values(TASK_STATE), options: null, };
        similar_tasks_id = { type: "hidden", editor: null, source: [], options: null, };
        similar_tasks = { type: "text", editor: null, source: [], options: null, };
        successor_task_id = { type: "hidden", editor: null, source: [], options: null, };
        successor_task = { type: "text", editor: null, source: [], options: null, };
        connotative_task_id = { type: "hidden", editor: null, source: [], options: null, };
        connotative_task = { type: "text", editor: null, source: [], options: null, };
        row_num = { type: "hidden", editor: null, source: [], options: null, };
        implementation_time = { type: "text", editor: null, source: [], options: null, };
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