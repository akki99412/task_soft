const timeZone = "Asia/Tokyo";
diContainer.addForCallByValue("TASK_DATA_TEMPLATES",
    class {
        title = { defaultValue: "概要", };
        id = { get defaultValue() { return self.crypto.randomUUID(); } };
        receipt = { get defaultValue() { return dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME); } };
        memo = { defaultValue: "詳細" };
        tag = { defaultValue: "#タグ" };
        limit = { get defaultValue() { return dayjs().add(1, 'd').tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME); } };
        manHours = { defaultValue: 1 };
        scheduledDateTime = { get defaultValue() { return dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME); }, };
        completionDateTime = { get defaultValue() { return dayjs().add(1, 'd').tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME); }, };
        implementationDate = { defaultValue: [{}], };
        state = { defaultValue: TASK_STATE.SCHEDULED, };
        similarTasksId = { defaultValue: "", };
        successorTaskId = { defaultValue: [""], };
        dependencyTaskId = { defaultValue: [""], };
        connotativeTaskId = { defaultValue: [""], };
        rowNum = { defaultValue: "", };
        implementationTime = { defaultValue: "", };
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
        manHours = { header: "予定工数", };
        scheduledDateTime = { header: "着手予定日時", };
        scheduledDate = { header: "着手予定日", };
        scheduledTime = { header: "着手予定時間", };
        completionDateTime = { header: "完了予定日時", };
        completionDate = { header: "完了予定日", };
        completionTime = { header: "完了予定時間", };
        completionRate = { header: "完了率", };
        implementationDate = { header: "実際の実施日時", };
        state = { header: "ステータス", };
        similarTasksId = { header: "類似タスクid", };
        similarTasks = { header: "類似タスク", };
        successorTaskId = { header: "後続タスクid", };
        dependencyTaskId = { header: "依存タスクid", };
        successorTask = { header: "後続タスク", };
        connotativeTaskId = { header: "内包タスクid", };
        connotativeTask = { header: "内包タスク", };
        rowNum = { header: "テーブル番号", };
        implementationTime = { header: "かかった時間", };
    });

diContainer.addForCallByValue("TABLE_TASK_DATA_TEMPLATES",
    class {
        title = { width: 200, colNum: 1, readOnly: false, align: "left" };
        id = { width: 200, colNum: 1, readOnly: true, align: "left" };
        receipt = { width: 200, colNum: 1, readOnly: false, align: "left" };
        memo = { width: 200, colNum: 1, readOnly: false, align: "left" };
        tag = { width: 200, colNum: 1, readOnly: false, align: "left" };
        limit = { width: 200, colNum: 1, readOnly: false, align: "left" };
        manHours = { width: 200, colNum: 1, readOnly: false, align: "left" };
        // scheduledDateTime = { width: 200, colNum: 1, readOnly: false, align: "left" };
        scheduledDate = { width: 200, colNum: 1, readOnly: false, align: "left" };
        scheduledTime = { width: 200, colNum: 1, readOnly: false, align: "left" };
        // completionDateTime = { width: 200, colNum: 1, readOnly: false, align: "left" };
        completionDate = { width: 200, colNum: 1, readOnly: false, align: "left" };
        completionTime = { width: 200, colNum: 1, readOnly: false, align: "left" };
        completionRate = { width: 200, colNum: 1, readOnly: true, align: "left" };
        implementationDate = { width: 200, colNum: 1, readOnly: false, align: "left" };
        state = { width: 200, colNum: 1, readOnly: false, align: "left" };
        similarTasksId = { width: 200, colNum: 1, readOnly: false, align: "left" };
        // similarTasks = { width: 200, colNum: 1, readOnly: false, align: "left" };
        successorTaskId = { width: 200, colNum: 1, readOnly: false, align: "left" };
        dependencyTaskId = { width: 200, colNum: 1, readOnly: false, align: "left" };
        // successorTask = { width: 200, colNum: 1, readOnly: false, align: "left" };
        connotativeTaskId = { width: 200, colNum: 1, readOnly: false, align: "left" };
        connotativeTask = { width: 200, colNum: 1, readOnly: false, align: "left" };
        // rowNum = { width: 200, colNum: 1, readOnly: false, align: "left" };
        implementationTime = { width: 200, colNum: 1, readOnly: true, align: "left" };

    });

diContainer.addForCallByValue("JSPREADSHEET_TASK_DATA_TEMPLATES",
    class {
        title = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        id = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        receipt = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE }, autocomplete:false, multiple:false };
        memo = { type: "html", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        tag = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        limit = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        manHours = { type: "numeric", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        scheduledDateTime = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        scheduledDate = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE }, autocomplete:false, multiple:false };
        scheduledTime = { type: "text", editor: clockEditor, source: [], options: { format: DEFAULT_FORMAT.TIME }, autocomplete:false, multiple:false };
        completionDateTime = { type: "hidden", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        completionDate = { type: "calendar", editor: null, source: [], options: { format: DEFAULT_FORMAT.DATE } };
        completionTime = { type: "text", editor: clockEditor, source: [], options: [], autocomplete: false, multiple: false };
        completionRate = { type: "numeric", editor: null, source: [], options: [], autocomplete: false, multiple: false };
        implementationDate = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        state = { type: "dropdown", editor: null, source: Object.values(TASK_STATE), options: [], autocomplete:false, multiple:false };
        similarTasksId = { type: "hidden", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        similarTasks = { type: "text", editor: null, source: [], options: [], autocomplete: false, multiple: false };
        successorTaskId = { type: "dropdown", editor: null, source: [], options: [], autocomplete: true, multiple: true };
        dependencyTaskId = { type: "dropdown", editor: null, source: [], options: [], autocomplete: true, multiple: true };
        successorTask = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        connotativeTaskId = { type: "dropdown", editor: null, source: [], options: [], autocomplete:true, multiple:true };
        connotativeTask = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        rowNum = { type: "hidden", editor: null, source: [], options: [], autocomplete:false, multiple:false };
        implementationTime = { type: "text", editor: null, source: [], options: [], autocomplete:false, multiple:false };
    });
const dataFilterTemplate=
     {
        title : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        id : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        receipt : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        memo : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        tag : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        limit : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        manHours : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        scheduledDateTime : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        completionDateTime : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        completionRate : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        implementationDate : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        state : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        similarTasksId : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        similarTasks : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        successorTaskId : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        dependencyTaskId : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        successorTask : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        connotativeTaskId : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        connotativeTask : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
        implementationTime : { type:"string",options:Object.entries(stringDataFilterOption).map(([_, value])=>value.value) },
    };

var clockEditor = {
    // Methods
    pickedTime: "00:00",
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
                        taskTable.closeEditor(cell, true);
                    }
                });
            },
        }).change(function () {
            pickedTime = this.value;
            console.log(cell);
            taskTable.setValue(cell, pickedTime);
            cell.innerHTML = pickedTime;
            // taskTable.setValue(cell, this.pickedTime);
            // cell.innerHTML = pickedTime;
            // if (cell.children[0]) {
            //     taskTable.closeEditor(cell, true);
            // }
            dataChangeCallback();
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


function updateDataTemplate() {
    var headers = taskTable.getHeaders().split(",");
    headers.forEach((header, i) => {
        // console.log(header);
        dataTemplate.find(template => template.header === header).colNum = i;
    });
    dataTemplate.sort((a, b) => a.colNum - b.colNum);
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
        let typeOfStart = Object.prototype.toString.call(start);
        if (typeOfStart == "[object String]") {
            this.start = dayjs(start.split("/")[0]);
            this.end = dayjs(start.split("/")[1]);
        } else if (typeOfStart == "[object Array]") {
            this.start = start[0];
            this.end = start[1];
        } else {
            this.start = start;
        }
    }
};