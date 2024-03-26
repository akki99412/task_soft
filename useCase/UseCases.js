function iUseCase(base) {
    return class extends base {
        constructor() {
            super();
        }
        do() {
            console.log('IUseCase.run() does not override.')
        }
    }
}

class GetTaskDataUseCase {
    constructor({ taskDataRepository } = diContainer.container) {
        this._taskDataRepository = taskDataRepository;
    }
    do() {
        return this._taskDataRepository.taskData;
    }
}

class GetTaskData2TableUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, tableHeaderArray = new tableHeaderKyeArrayUseCase().do() } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._tableHeaderArray = tableHeaderArray;
    }
    do() {
        return this._taskDataRepository.taskData.map((row) => {
            return this._tableHeaderArray.map((key) => {
                if (key == "implementation_date") {
                    return new ImplementationDate2String(row[key]).do();
                } else{
                    return row[key];
                }
            });
        });
    }
}

class GetTaskData4TableDataUseCase {
    constructor({ row, key, taskDataRepository = diContainer.container.taskDataRepository } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._row = row;
        this._key = key;
    }
    do() {
        if (this._key == "implementation_date") {
            return new ImplementationDate2String(this._taskDataRepository.taskData[this._row][this._key]).do();
        } else {
            return this._taskDataRepository.taskData[this._row][this._key];
        }
    }
}
class ImplementationDate2String {
    constructor(implementation_date) {
        this._implementation_date = implementation_date;
    }
    do() {
        const stringifyList = this._implementation_date.map((data) => {
            return data.start + " - " + data.end
        });
        const dst = stringifyList.join("\n");
        return dst; //JSON.stringify(this._implementation_date);
        // return this._implementation_date.reduce((str, data)=>{str=data+"\n"})
    }
}

// class GetTaskData2TableUseCase {
//     constructor() {
//         this._taskData = new GetTaskDataUseCase().do();

//     }
//     do() {
//         return this._taskDataRepository.taskData;
//     }
// }

class InsertTaskDataUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, row, data = null } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._row = row;
        this._data = data;
    }
    do() {
        if (this._data === null) {
            return this._taskDataRepository.insert(this._row);
        } else {
            return this._taskDataRepository.insert(this._row, this._data);
        }
    }
}

class ChangeTaskDataUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, row, key, data = null } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._row = row;
        this._key = key;
        this._data = data;
    }
    do() {
            return this._taskDataRepository.change(this._row, this._key, this._data);


    }
}

class GetTaskDataTemplate {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        return this._taskDataTemplateRepository.taskDataTemplate;
    }
}
class GetTaskUiTemplates {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        return this._taskDataTemplateRepository.taskUiTemplates;
    }
}
class GetTableTaskDataTemplates {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        return this._taskDataTemplateRepository.tableTaskDataTemplates;
    }
}
class GetJspreadsheetTaskDataTemplates {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        return this._taskDataTemplateRepository.jspreadsheetTaskDataTemplates;
    }
}



class GetTaskDataTemplate2TableUseCase {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        let taskDataTemplate = this._taskDataTemplateRepository.taskDataTemplate;
        let taskUiTemplates = this._taskDataTemplateRepository.taskUiTemplates;
        let tableTemplates = this._taskDataTemplateRepository.tableTaskDataTemplates;
        let jspreadsheetTemplates = this._taskDataTemplateRepository.jspreadsheetTaskDataTemplates;

        // colNumの順番にkeyを並べた配列を作る
        let result = Object.entries(tableTemplates)
            .map(([key, value]) => { return { key: value, value: key } })
            .sort((a, b) => a.key - b.key)
            .map((data) => { return data.value });

        // console.log(result);


        return result.map((data) => { return { type: jspreadsheetTemplates[data].type, title: taskUiTemplates[data].header, width: tableTemplates[data].width, editor: jspreadsheetTemplates[data].editor, source: jspreadsheetTemplates[data].source, readOnly: tableTemplates[data].read_only, options: jspreadsheetTemplates[data].options } });
    }
}

class GetTaskDefaultValueUseCase {
    constructor({ key="", taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
        this._key = key;
    }
    do() {
        const taskDataTemplate = this._taskDataTemplateRepository.taskDataTemplate;
        return taskDataTemplate[this._key].defaultValue; 
    }
}

class UpdateTaskDataTemplateFromTableHeadersUseCase {
    constructor({ headers, taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
        this._headers = headers;
    }
    _header2index(header) {
        return Object.fromEntries(
            this._headers.map(
                (value, index) => { return [value, index] }
            )
        )[header];
    }
    do() {
        Object.entries(this._taskDataTemplateRepository.tableTaskDataTemplates).forEach(([key, value]) => {
            value.col_num = (this._header2index(this._taskDataTemplateRepository.taskUiTemplates[key].header));
        });
    }
}

class UpdateTaskDataTemplateFromTableWidthUseCase {
    constructor({ colNum, width, taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
        this._colNum = colNum;
        this._width = width;
    }
    do() {
        Object.entries(this._taskDataTemplateRepository.tableTaskDataTemplates).find(([key, value]) => value.col_num == this._colNum)[1].width = this._width;
    }
}

class colNum2MemberUseCase {
    constructor({ num, taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository
        this._num = num;
    }
    do() {
        return Object.entries(this._taskDataTemplateRepository.tableTaskDataTemplates)
            .find(([key, value]) => value.col_num == this._num)[0];
    }
}
class tableHeaderKyeArrayUseCase {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {}) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
    }
    do() {
        const tableTemplates = this._taskDataTemplateRepository.tableTaskDataTemplates;

        return Object.entries(tableTemplates)
            .map(([key, value]) => { return { key: value, value: key } })
            .sort((a, b) => a.key - b.key)
            .map((data) => { return data.value });
    }
}

class taskDataChangeSubscriberUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, func } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._func = func;
    }
    do() {
        this._taskDataRepository.onChangeBroadcaster.subscribe(this._func);
    }
}
class taskDataInsertSubscriberUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, func } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._func = func;
    }
    do() {
        this._taskDataRepository.onInsertBroadcaster.subscribe(this._func);
    }
}
class taskDataLoadSubscriberUseCase {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, func } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._func = func;
    }
    do() {
        this._taskDataRepository.onLoadBroadcaster.subscribe(this._func);
    }
}
class GetTodayUseCase{
    constructor() { }
    do() {
        return dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME);
    }
}
class ImplementationDataStartLine {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, row, data } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._row = row;
        this._data = data;
    }
    do() {
        const src = this._taskDataRepository.taskData[this._row]["implementation_date"];
        console.log({ start: this._data, end: "" });
        console.log(this._row);
        new ChangeTaskDataUseCase({ row: this._row, key: "implementation_date", data: src.concat([{ start: this._data, end: "" }]) }).do();
    }
}

class ImplementationDataEndLine {
    constructor({ taskDataRepository = diContainer.container.taskDataRepository, row, data } = {}) {
        this._taskDataRepository = taskDataRepository;
        this._row = row;
        this._data = data;
    }
    do() {
        const src = this._taskDataRepository.taskData[this._row]["implementation_date"];
        const last_data = src.slice(-1)[0];
        const dst = src.toSpliced(-1, 1, { start: last_data.start, end: this._data });
        console.log({ start: last_data.start, end: this._data });
        console.log(this._row);
        new ChangeTaskDataUseCase({ row: this._row, key: "implementation_date", data: dst}).do();
    }
}