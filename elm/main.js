
const secretKey = (async _ => {
    if (secret_key_string === "") {
        let generated_key = await auto_generate_key();
        saveTextToFile("const secret_key_string=\'" + JSON.stringify(generated_key) + "\'", "key_file.js");
        return generated_key;
    } else {
        return await import_secret_key(JSON.parse(secret_key_string));
    }
})();

class ILocalStorageData {
    constructor({ taskUiProperties = null, tableTaskDataProperties = null, jspreadsheetTaskDataProperties = null, taskDataEntity = null, } = {}) {
        this.taskUiProperties = taskUiProperties;
        this.tableTaskDataProperties = tableTaskDataProperties;
        this.jspreadsheetTaskDataProperties = jspreadsheetTaskDataProperties;
        this.taskDataEntity = taskDataEntity;
    }
}
class LocalStorageMessage extends ILocalStorageData {
    constructor(value) {
        super(value);
    }
}
class LocalStorageView extends ILocalStorageData {
    constructor(value) {
        super(value);
    }
}

class ImportJsonMessage {
    constructor({ value = null } = {}) {
        this.value = value;
    }
}


let timeoutID = 0;

class IButtonData {
    constructor({ id = null } = {}) {
        this.id = id;
    }
}
class ButtonMessage extends IButtonData {
    constructor(id) {
        super(id);
    }
}
class ButtonView extends IButtonData {
    constructor(id) {
        super(id);
    }
}
class Undo { }
class Redo { }






const init = _ => {
    const mainData = {
        taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
        tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
        jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
        taskDataEntity: [Object.fromEntries(Object.entries(diContainer.container.TASK_DATA_TEMPLATES).map(([key, value]) => [key, value.defaultValue]))],
    };
    return ({
        ...mainData,
        textarea: "",
        history: [mainData],
        index: 0,
    })
};
const view = model => {
    c.log("view");
    const taskUiProperties = model.taskUiProperties;
    const tableTaskDataProperties = model.tableTaskDataProperties;
    const jspreadsheetTaskDataProperties = model.jspreadsheetTaskDataProperties;
    const taskDataEntity = model.taskDataEntity;



    const tableHeaderKeys = generateTableHeaderKeys(tableTaskDataProperties);

    const jspreadsheetColumns =
        repository2jspreadsheetColumns(tableHeaderKeys)(taskUiProperties)(tableTaskDataProperties)(jspreadsheetTaskDataProperties);
    const jspreadsheetData = repository2jspreadsheetData(taskDataEntity)(tableHeaderKeys);
    const header2Key = Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])));
    // c.log(taskDataEntity.map(model => ));
    // c.log(taskDataEntity.map(model => model.limit));

    const ganttTasks = taskDataEntity.map(model => ({
        id: model.id,
        name: model.title,
        description: model.memo,
        start: dayjs.tz(model.scheduled_date_time, DEFAULT_FORMAT.DATE_TIME, time_zone).format("YYYY-MM-DD"),
        end: dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, time_zone).format("YYYY-MM-DD"),
        progress: 0,
        dependencies: model.successor_task_id,
    }));

    const kanbanTasks =
        boardList.map(board => ({
            id: board.id,
            title: board.title,
            item: taskDataEntity.filter(data => data.state === board.id)
                .sort((a, b) => a.kanbanNum - b.kanbanNum).map(model => {
                    ({
                        id: model.id,
                        title: model.title,
                        // class: 
                    })
                })
        }));
    const textarea = model.textarea;


    const calendarTasks = taskData2calendarTasks(taskDataEntity);
    return { tableView: new TableView({ jspreadsheetData, jspreadsheetColumns }), ganttTasks, model, textarea };
};
class Observable {
    constructor(value = null) {
        this.observers = [];
        this.value = value;
    }
    static Op = class {
        static subscribe = (func) => (observable) => observable.observers.push(func);
        static notify = value => observable => {
            observable.value = value;
            c.log(observable.observers);
            observable.observers.forEach(func => func(value));
        }
    }
    subscribe = (func) => Observable.Op.subscribe(func)(this);
    // unsubscribe
    notify = (value) => Observable.Op.notify(value)(this);
}
const textareaBuffer = new Observable("");
window.addEventListener('load',
    _ => textareaBuffer.subscribe(
        value => {
            c.log(value);
            $textarea.value = value
        }
    )
);
const render = table => gantt => ganttTasks => calendar => kanban => timeout => textarea => view => {
    c.log("render");
    const tableView = new TableMessage({
        jspreadsheetData: JSON.parse(JSON.stringify(table.getData())),
        jspreadsheetColumns: JSON.parse(JSON.stringify(table.getConfig().columns)),
    });
    // jspreadsheetObject.resetSelection(true);
    // isEqualObjectJson(view.tableView)(tableView);
    secretKey.then(value => c.log(value));

    if (!isEqualObjectJson(view.tableView)(tableView)) {
        // c.log(JSON.stringify(view.tableView));
        // c.log(JSON.stringify(tableView));
        c.log("updateJspreadsheet");
        updateJspreadsheet(table)(view.tableView.jspreadsheetData)(view.tableView.jspreadsheetColumns)(jspreadsheetEventInnerFunc);

    }
    if (!ganttTasks.isUpdate&&!isEqualObjectJson(view.ganttTasks)(ganttTasks.data)) {
        c.log("update gantt");
        c.log(view.ganttTasks);
        c.log(ganttTasks.data);
        ganttTasks.data = view.ganttTasks;
        gantt.refresh(JSON.parse(JSON.stringify(view.ganttTasks)));
    }





    clearTimeout(timeoutID);
    const delayModel = new Promise(resolve => {
        timeoutID = setTimeout(_ => {
            c.log("reset timeoutID");
            resolve(view.model);
        },
            saveTime * 1000);
        // c.log(parent);
    }).then(value => {
        return JSON.stringify(value);
    });
    const encryptData = Promise.all([secretKey, delayModel,])
        .then(([secretKey, delayModel]) => {
            return encrypt_string(secretKey, delayModel);
        });
    // Promise.all([secretKey, encryptData,])
    //     .then(([key, encryptData]) => (decrypt_string(key, encryptData)))
    //     .then(value => c.log(JSON.parse(value)));
    encryptData.then(value => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
        // c.log(value);
        c.log("saved!!");
    });


    if (!isEqualObjectJson(textarea.value)(view.textarea)) {
        c.log("update textarea");
        // c.log(textarea.value);
        // c.log(view.textarea);
        textarea.notify(view.textarea);

    }

    c.log("render end");
};
const zip = (...args) => {
    const length = Math.min(...args.map(value => value.length));
    let buffer = [];
    for (let i = 0; i < length; i++) {
        buffer.push(args.map(value => value[i]));
    }
    return buffer;
};
// c.log(zip([1, 2], [3, 4, 5], [6, 7, 8, 9]));

const TableUpdate = model => message => {
    // nop(model)(message);
    const header2Kye = generateHeader2Key(model.taskUiProperties);
    c.log(header2Kye);
    const jspreadsheetData = message.jspreadsheetData;
    const jspreadsheetColumns = message.jspreadsheetColumns;
    const columns = (Object.fromEntries(jspreadsheetColumns.map((data, i) =>
        [header2Kye[data.title],
        Object.fromEntries(Object.entries(data)
            .concat([["col_num", i]]))])));
    c.log(columns);
    const tableTaskDataProperties = Object.fromEntries(
        Object.entries(columns).map(([key, value]) => [
            key,
            (_ => {
                const { width, col_num, readOnly, align } = { ...value };
                return ({ width, col_num, read_only: readOnly, align });
            })()
        ])
    );
    const jspreadsheetTaskDataProperties = Object.fromEntries(
        Object.entries(columns).map(([key, value]) => [
            key,
            (_ => {
                const { type, editor, source, options, } = { ...value };
                return ({ type, editor, source, options });
            })()
        ])
    );
    // c.log(tableTaskDataProperties);
    // jspreadsheetTaskDataProperties
    const sortedKeys = Object.entries(columns)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.col_num - b.value.col_num)
        .map(data => data.key);
    c.log(sortedKeys);

    const taskDataEntity = jspreadsheetData.map(row =>
        Object.fromEntries(zip(sortedKeys, row).map(([key, data]) => [key,
            key === "implementation_date" ? string2ImplementationDate(data) : data]))
    );


    // c.log(taskDataEntity);

    return { ...model, tableTaskDataProperties, jspreadsheetTaskDataProperties, taskDataEntity };
};
const nop = model => message => {
    const header2KeyUpdater = generateHeader2Key((diContainer.container.TASK_UI_TEMPLATES));
    c.log(header2KeyUpdater);

    const jspreadsheetDataUpdater = message.jspreadsheetData;
    // c.log(jspreadsheetDataUpdater);
    const jspreadsheetColumnsUpdater = message.jspreadsheetColumns;
    // c.log(jspreadsheetColumnsUpdater);
    const columnsUpdater = (Object.fromEntries(jspreadsheetColumnsUpdater.map((data, i) =>
        [data.title, Object.fromEntries(Object.entries(data).concat([["col_num", i]]))])));
    // c.log(columnsUpdater);
    // c.log(model.jspreadsheetTaskDataProperties);
    // c.log(header2KeyUpdater);
    const jspreadsheetTaskDataPropertiesUpdater =
        Object.fromEntries(
            Object.entries(header2KeyUpdater)
                .map(([header, key]) =>
                ([key, Object.fromEntries(
                    Object.entries(model.jspreadsheetTaskDataProperties[key])
                        .map(([k, value]) =>
                            ([k, k === "type" || k === "source" || k === "options" ? columnsUpdater[header][k] : value])))])
                ));
    // c.log(jspreadsheetTaskDataPropertiesUpdater);
    const header2KeyGetter = (taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key]))))(diContainer.container.TASK_UI_TEMPLATES);
    // c.log(header2KeyGetter);
    // c.log(jspreadsheetDataUpdater);
    const tableHeaderKeys = generateTableHeaderKeys(model.tableTaskDataProperties);
    c.log(tableHeaderKeys);

    const taskDataRepository = fillDefaultTaskData(diContainer.container.TASK_DATA_TEMPLATES)(stateChange2implementationDate(model.taskDataEntity)(jspreadsheetDataUpdater.map(data => {
        const buffer = Object.fromEntries(data.map((datum, i) => ([tableHeaderKeys[i],
        tableHeaderKeys[i] === "implementation_date" ? string2ImplementationDate(datum) : datum
        ])))
        // c.log(buffer);
        // if (buffer.id === "") return Object.fromEntries(Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] }));
        return buffer;
    }
    )));
    // c.log(taskDataRepository);
    // c.log(jspreadsheetTaskDataPropertiesUpdater);
    // c.log(model.tableTaskDataProperties);

    const taskUiProperties =
        Object.fromEntries(
            Object.entries(header2KeyGetter)
                .map(([header, key]) =>
                ([key, Object.fromEntries(
                    Object.entries(model.taskUiProperties[key])
                        .map(([k, value]) =>
                            ([k, k === "header" ? columnsUpdater[header].title : value])))])
                ));
    const repository = {
        ...model,
        taskUiProperties: taskUiProperties,
        jspreadsheetTaskDataProperties: jspreadsheetTaskDataPropertiesUpdater,
        taskDataEntity: taskDataRepository,
    };

    // c.log(repository);
    return repository;
};
const ganttUpdate = model => message => {
    // c.log(message);
    // c.log(model.taskDataEntity.find(data => data.id === message.id));
    const taskData = model.taskDataEntity.find(data => data.id === message.id);
    const scheduled_date_time = dayjs.tz(model.scheduled_date_time, DEFAULT_FORMAT.DATE_TIME, time_zone);
    const limit = dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, time_zone);
    // c.log();
    // c.log();
    taskData.id = message.id;
    taskData.title = message.name;
    taskData.memo = message.description;
    taskData.scheduled_date_time = dayjs(message.start).tz(time_zone)
        .hour(scheduled_date_time.format("H"))
        .minute(scheduled_date_time.format("m"))
        .second(scheduled_date_time.format("s"))
        .format(DEFAULT_FORMAT.DATE_TIME);
    taskData.limit = dayjs(message.end).tz(time_zone)
        .hour(limit.format("H"))
        .minute(limit.format("m"))
        .second(limit.format("s"))
        .format(DEFAULT_FORMAT.DATE_TIME);


    // taskData.progress = message.progress;
    // taskData.dependencies = message.dependencies;
    // taskData.custom_class = message.custom_class;


    //             start: dayjs.tz(model.scheduled_date_time, DEFAULT_FORMAT.DATE_TIME, time_zone).format("YYYY-MM-DD"),
    //                 end: dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, time_zone).format("YYYY-MM-DD"),
    return JSON.parse(JSON.stringify(model));
};
const kanbanBoardUpdate = model => message => {
    return model;
};
const localStorageUpdate = model => message => {
    return { ...model, ...message };
};
const kanbanItemUpdate = model => message => model;
const saveButtonUpdate = model => message => model;
const exportJsonButtonUpdate = model => message => {
    model.textarea = JSON.stringify({
        taskUiProperties: model.taskUiProperties,
        tableTaskDataProperties: model.tableTaskDataProperties,
        jspreadsheetTaskDataProperties: model.jspreadsheetTaskDataProperties,
        taskDataEntity: model.taskDataEntity,
    });
    return JSON.parse(JSON.stringify(model));
};
const importJsonButtonUpdate = model => message => model;
const loadButtonUpdate = model => message => model;
const importJsonUpdate = model => message => {
    try {
        const dstModel = JSON.parse(message.value);
        view(dstModel);
        c.log(model);
        c.log(dstModel);
        model = { ...model, ...dstModel };
        c.log(model);
        return JSON.parse(JSON.stringify(model));
    } catch (e) {
        c.log(e);
        return model;
    }
    return model;
};
const undoUpdate = model => message => {
    model.index = model.index > 0 ? model.index - 1 : 0;
    const { taskUiProperties, tableTaskDataProperties, jspreadsheetTaskDataProperties, taskDataEntity, } = model.history[model.index];
    const mainData = {
        taskUiProperties,
        tableTaskDataProperties,
        jspreadsheetTaskDataProperties,
        taskDataEntity,
    };
    c.log("undo");
    return { ...model, ...mainData };
};
const redoUpdate = model => message => {
    model.index = model.index > model.history.length - 2 ? model.history.length - 1 : model.index = model.index + 1;
    const { taskUiProperties, tableTaskDataProperties, jspreadsheetTaskDataProperties, taskDataEntity, } = model.history[model.index];
    const mainData = {
        taskUiProperties,
        tableTaskDataProperties,
        jspreadsheetTaskDataProperties,
        taskDataEntity,
    };
    c.log("redo");
    return { ...model, ...mainData };
};

const isDuplicated = (elements) => {
    // Setを使って、配列の要素を一意にする
    const setElements = new Set(elements);
    return setElements.size !== elements.length;
}

const update = model => message => {
    c.log("update");
    c.log(model);
    c.log(message);
    const dstModel = (model => {
        switch (message.constructor.name) {
            case new TableMessage().constructor.name:
                {
                    const dstModel = TableUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;
                    break;
                }
            case new GanttMessage().constructor.name:
                {
                    c.log("gantt");
                    const dstModel = ganttUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;

                    break;
                }
            case new KanbanBoardMessage().constructor.name:
                {
                    c.log("kanban board");
                    const dstModel = kanbanBoardUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;

                    break;
                }
            case new KanbanItemMessage().constructor.name:
                {
                    c.log("kanban item");
                    const dstModel = kanbanItemUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;

                    break;
                }
            case new LocalStorageMessage().constructor.name:
                {
                    c.log("LocalStorage");
                    const dstModel = localStorageUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;
                }
            case new ImportJsonMessage().constructor.name:
                {
                    c.log("ImportJson");
                    const dstModel = importJsonUpdate(model)(message);

                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;
                }
            case new ButtonMessage().constructor.name:
                {
                    c.log("ButtonMessage");
                    const dstModel = (_ => {
                        switch (message.id) {
                            case $saveButton: {
                                c.log("saveButton");
                                return saveButtonUpdate(model)(message);
                                break;
                            }
                            case $exportJsonButton: {
                                c.log("exportJsonButton");
                                return exportJsonButtonUpdate(model)(message);
                                break;
                            }
                            case $importJsonButton: {
                                c.log("importJsonButton")
                                return importJsonButtonUpdate(model)(message);
                                break;
                            }
                            case $loadButton: {
                                c.log("loadButton")
                                return loadButtonUpdate(model)(message);
                                break;
                            }
                        }
                    })();


                    c.log(dstModel);
                    c.log(dstModel == model);
                    return dstModel;
                }
            default:
                c.log("default");
                return model;
        }
    })(model);
    if (dstModel === model) {
        switch (message.constructor.name) {
            case new Undo().constructor.name: {
                c.log("Undo")
                return undoUpdate(model)(message);
                break;
            }
            case new Redo().constructor.name: {
                c.log("Redo")
                return redoUpdate(model)(message);
                break;
            }
            default: return model;

        }
        return model;
    } else {
        return (dstModel => {
            const taskDataEntity =
                pipe(dstModel.taskDataEntity)((a => a)
                    ._(stateChange2implementationDate(model.taskDataEntity))
                    ._(fillDefaultTaskData(diContainer.container.TASK_DATA_TEMPLATES))
                    ._(data => {
                        return [...data];
                    })
                )
            // (fillDefaultTaskData
            // (diContainer.container.TASK_DATA_TEMPLATES)
            // (stateChange2implementationDate
            //     (model.taskDataEntity)
            //     (dstModel.taskDataEntity)));
            const jspreadsheetTaskDataProperties =
                pipe(dstModel.jspreadsheetTaskDataProperties)((a => a)
                    ._(data => {
                        const source = taskDataEntity.map(row => ({ id: row.id, name: row.title, title: row.id, groupe: "task", value: row.id, text: row.title }));
                        const { type, editor, options, } = data.successor_task_id;
                        const successor_task_id = { type, editor, source, options, };
                        c.log(successor_task_id);
                        return { ...data, successor_task_id };
                    })
                )


            const { taskUiProperties, tableTaskDataProperties, } = dstModel;
            const mainData = {
                taskUiProperties,
                tableTaskDataProperties,
                jspreadsheetTaskDataProperties,
                taskDataEntity,
            };
            const end = dstModel.index + 1;
            const start = 0 < (end - HISTORY_LENGTH) ? end - HISTORY_LENGTH : 0;


            const history = dstModel.history.slice(start, end).concat([mainData]);
            const index = dstModel.history.length - 1;

            const bufferModel = { ...dstModel, taskDataEntity, jspreadsheetTaskDataProperties, history, index }
            c.log(bufferModel);
            return bufferModel;
        })(dstModel);
    }
};
const main = new ElmLike({ init, view, update, render: view => render(jspreadsheetObject)(gantt)(ganttTasks)(calendar)(kanban)(timeoutID)(textareaBuffer)(view) });
main.init();


const loadLocalStorage = secretKey => func => {
    const getLocalStorage = _ => (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
    secretKey
        .then(key => (decrypt_string(key, getLocalStorage())))
        .then(value => func(new LocalStorageMessage(JSON.parse(value))));
};
// loadLocalStorage(secretKey)(main.update);
// secretKey.then(key => (decrypt_string(key, getLocalStorage()))).then(value => c.log(new LocalStorageMessage(JSON.parse(value))));


