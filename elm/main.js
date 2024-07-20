
const secretKey = (async _ => {
    if (secretKeyString === "") {
        let generatedKey = await autoGenerateKey();
        saveTextToFile("const secretKeyString=\'" + JSON.stringify(generatedKey) + "\'", "keyFile.js");
        return generatedKey;
    } else {
        return await importSecretKey(JSON.parse(secretKeyString));
    }
})();

class IMainData {
    constructor({ taskUiProperties = null, tableTaskDataProperties = null, jspreadsheetTaskDataProperties = null, taskDataEntity = null, textarea = null, relationFilter = null } = {}) {
        this.taskUiProperties = taskUiProperties;
        this.tableTaskDataProperties = tableTaskDataProperties;
        this.jspreadsheetTaskDataProperties = jspreadsheetTaskDataProperties;
        this.taskDataEntity = taskDataEntity;
        this.textarea = textarea;
        this.relationFilter = relationFilter;
    }
}
class ILocalStorageData {
    constructor({ taskUiProperties = null, tableTaskDataProperties = null, jspreadsheetTaskDataProperties = null, taskDataEntity = null, relationFilter = null } = {}) {
        this.taskUiProperties = taskUiProperties;
        this.tableTaskDataProperties = tableTaskDataProperties;
        this.jspreadsheetTaskDataProperties = jspreadsheetTaskDataProperties;
        this.taskDataEntity = taskDataEntity;
        this.relationFilter = relationFilter;
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


// let timeoutID = {0};
const saveTimeout = new Observable({ id: 0, doneSave: false, });
saveTimeout.subscribe(value => {
    if (value.doneSave) {
        console.log("saved");
    } else {
        console.warn("reset")
    }
});

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
class IDropdownMenuData {
    constructor({ id = null } = {}) {
        this.id = id;
    }
}
class DropdownMenuMessage extends IDropdownMenuData {
    constructor(id) {
        super(id);
    }
}
class DropdownMenuView extends IDropdownMenuData {
    constructor(id) {
        super(id);
    }
}
class Undo { }
class Redo { }






const init = _ => {
    console.groupCollapsed("init");
    const mainData = {
        taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
        tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
        jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
        taskDataEntity: [Object.fromEntries(Object.entries(diContainer.container.TASK_DATA_TEMPLATES).map(([key, value]) => [key, value.defaultValue]))],
        relationFilter: {
            connotative: true,
            dependency: true,
            successor: true,
            similar: true,
        }
    };
    const module = {
        ...mainData,
        textarea: "",
        history: [mainData],
        index: 0,
    };
    console.log(module);
    console.groupEnd();
    return (module)
};
const view = model => {
    c.groupCollapsed("view");
    c.log(model);
    const relationFilter = model.relationFilter;
    const taskUiProperties = model.taskUiProperties;
    const tableTaskDataProperties = model.tableTaskDataProperties;
    const jspreadsheetTaskDataProperties = model.jspreadsheetTaskDataProperties;
    const taskDependencies = model.taskDataEntity.map(
        data => {
            const { title, id, similarTasksId, successorTaskId, dependencyTaskId, connotativeTaskId, } = data;
            const extensionTaskId = model.taskDataEntity.filter(value => value.connotativeTaskId.includes(data.id)).map(value => value.id);
            const completionRate = data.state === TASK_STATE.COMPLETED ? 100
                : 0 < connotativeTaskId.filter(value => value !== '').length ? -1
                    : 0;

            const dstData = { title, id, similarTasksId, successorTaskId, dependencyTaskId, connotativeTaskId, extensionTaskId, completionRate, };

            return dstData;
        }
    );
    // console.log({ taskDependencies });
    //完了率の計算(木構造で、関数プログラミング的に書く方法が思いつかなかった)
    for (let i = 0; taskDependencies.map(value => value.completionRate).includes(-1); i++) {
        const data = taskDependencies[i % taskDependencies.length];
        if (data.completionRate !== -1) continue;
        const connotativeTask = taskDependencies.filter(value => data.connotativeTaskId.includes(value.id));
        if (
            connotativeTask.some(value => value.completionRate === -1)) {
            continue;
        }
        // console.log({connotativeTask});
        const total = connotativeTask
            .map(value => value.completionRate)
            .reduce((sum, element) => sum + element, 0);
        const average = total / connotativeTask.length;
        data.completionRate = average;
    }
    const taskDataEntity = model.taskDataEntity
        .map(value => ({
            ...value,
            completionRate: taskDependencies.filter(data => data.id === value.id)[0].completionRate,
        }));


    const tableHeaderKeys = generateTableHeaderKeys(tableTaskDataProperties);

    const jspreadsheetColumns =
        repository2jspreadsheetColumns(tableHeaderKeys)(taskUiProperties)(tableTaskDataProperties)(jspreadsheetTaskDataProperties);
    const jspreadsheetData = repository2jspreadsheetData(taskDataEntity)(tableHeaderKeys);
    const header2Key = Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])));
    // c.log(taskDataEntity.map(model => ));
    // c.log(taskDataEntity.map(model => model.limit));

    // const successorTask2dependencies = taskDataEntity.map(model => 
    //     model.successorTaskId,
    // );
    const ganttTasks = taskDataEntity.map(model => ({
        id: model.id,
        name: model.title,
        description: model.memo,
        start: dayjs.tz(model.scheduledDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format("YYYY-MM-DD"),
        end: dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, timeZone).format("YYYY-MM-DD"),
        progress: model.completionRate,
        dependencies: taskDataEntity
            .filter(value => relationFilter.successor ? value.successorTaskId.includes(model.id) : false)
            .map(value => value.id)
            .concat(relationFilter.dependency ? model.dependencyTaskId : [])
            .concat(relationFilter.connotative ? model.connotativeTaskId : [])
            .join(", "),
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

    const buildTree = taskDependencies => parentId => taskId => {
        const data = taskDependencies.filter(value => value.id === taskId);
        if (data.length === 0) return "";
        const datum = data[0];

        const header = `subgraph ${parentId}${datum.id} [${datum.title}]\n`;
        const body = datum.connotativeTaskId.map(value => buildTree(taskDependencies)(datum.id)(value)).join("\n");

        return relationFilter.connotative ? header + "end\n" + body + "\n" : header + body + "\nend\n";

    }
    const treeGraph = "flowchart LR\n"
        + taskDependencies
            .filter(value => value.extensionTaskId.length === 0)
            .map(value => {
                return buildTree(taskDependencies)("")(value.id)
            })
            .join("\n")
        + taskDependencies
            .map(data => {
                // console.log(data.successorTaskId);
                const successorTaskId = relationFilter.successor ? data.successorTaskId
                    .map(datum => datum === '' ? "" : `${data.id} ----> ${datum}`).join("\n") : "";
                const dependencyTaskId = relationFilter.dependency ? data.dependencyTaskId
                    .map(datum => datum === '' ? "" : `${datum} ====> ${data.id}`).join("\n") : "";

                return successorTaskId + dependencyTaskId;
            }
            )
            .join("\n");

    // console.log(treeGraph);
    const calendarTasks = taskData2calendarTasks(taskDataEntity);
    // console.log({ tableView: new TableView({ jspreadsheetData, jspreadsheetColumns }), ganttTasks, model, textarea, treeGraph });
    c.groupEnd();
    return { tableView: new TableView({ jspreadsheetData, jspreadsheetColumns }), ganttTasks, model, textarea, treeGraph, ...relationFilter, };
};
const textareaBuffer = new Observable("");
window.addEventListener('load',
    _ => textareaBuffer.subscribe(
        value => {
            // c.log(value);
            $textarea.value = value
        }
    )
);
const showConnotativeTask = new Observable(true);
showConnotativeTask.subscribe(
    value => {
        if (value) {
            $connotativeTaskDropdownMenu.classList.add("active");
        } else {
            $connotativeTaskDropdownMenu.classList.remove("active");
        }
    }
)
const showDependencyTask = new Observable(true);
showDependencyTask.subscribe(
    value => {
        if (value) {
            $dependencyTaskDropdownMenu.classList.add("active");
        } else {
            $dependencyTaskDropdownMenu.classList.remove("active");
        }
    }
)
const showSuccessorTask = new Observable(true);
showSuccessorTask.subscribe(
    value => {
        if (value) {
            $successorTaskDropdownMenu.classList.add("active");
        } else {
            $successorTaskDropdownMenu.classList.remove("active");
        }
    }
)
const showSimilarTask = new Observable(true);
showSimilarTask.subscribe(
    value => {
        if (value) {
            $similarTasksDropdownMenu.classList.add("active");
        } else {
            $similarTasksDropdownMenu.classList.remove("active");
        }
    }
)

const render = table => filterTable => gantt => ganttTasks => calendar => kanban => saveTimeout => textarea => treeGraph => showConnotativeTask => showDependencyTask => showSuccessorTask => showSimilarTask => view => {
    c.groupCollapsed("render");
    c.log(view);
    const tableView = new TableMessage({
        jspreadsheetData: JSON.parse(JSON.stringify(table.getData())),
        jspreadsheetColumns: JSON.parse(JSON.stringify(table.getConfig().columns)),
    });
    // jspreadsheetObject.resetSelection(true);
    // isEqualObjectJson(view.tableView)(tableView);
    // secretKey.then(value => c.log(value));

    if (!isEqualObjectJson(view.tableView)(tableView)) {
        c.log(JSON.stringify(view.tableView));
        c.log(JSON.stringify(tableView));
        c.log("updateJspreadsheet");
        updateJspreadsheet(table)(view.tableView.jspreadsheetData)(view.tableView.jspreadsheetColumns)(jspreadsheetEventInnerFunc);

    }
    if (!ganttTasks.isUpdate && !isEqualObjectJson(view.ganttTasks)(ganttTasks.data)) {
        c.log("update gantt");
        // c.log(view.ganttTasks);
        // c.log(ganttTasks.data);
        ganttTasks.data = view.ganttTasks;
        gantt.refresh(JSON.parse(JSON.stringify(view.ganttTasks)));
    }




    saveTimeout.notify({ id: clearTimeout(saveTimeout.value.id), doneSave: false });
    const delayModel = new Promise(resolve => {
        saveTimeout.notify({
            id: setTimeout(_ => {
                resolve(view.model);
            }, saveTime * 1000),
            doneSave: false
        });
        // c.log(parent);
    }).then(value => {
        return JSON.stringify(value);
    });
    const encryptData = Promise.all([secretKey, delayModel,])
        .then(([secretKey, delayModel]) => {
            return encryptString(secretKey, delayModel);
        });
    // Promise.all([secretKey, encryptData,])
    //     .then(([key, encryptData]) => (decryptString(key, encryptData)))
    //     .then(value => c.log(JSON.parse(value)));
    encryptData.then(value => {
        // c.log(value);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
        saveTimeout.notify({ ...saveTimeout, doneSave: true });
    });


    if (!isEqualObjectJson(textarea.value)(view.textarea)) {
        c.log("update textarea");
        // c.log(textarea.value);
        // c.log(view.textarea);
        textarea.notify(view.textarea);

    }
    if ((treeGraph.value.value) !== (view.treeGraph)) {
        c.log("update treeGraph");
        // c.log(textarea.value);
        // c.log(view.textarea);
        treeGraph.notify({ value: view.treeGraph });

    }
    if (showConnotativeTask !== view.connotative) {
        c.log("update showConnotativeTask");
        showConnotativeTask.notify(view.connotative)
    }
    if (showDependencyTask !== view.dependency) {
        c.log("update showDependencyTask");
        showDependencyTask.notify(view.dependency)
    }
    if (showSuccessorTask !== view.successor) {
        c.log("update showSuccessorTask");
        showSuccessorTask.notify(view.successor)
    }
    if (showSimilarTask !== view.similar) {
        c.log("update showSimilarTask");
        showSimilarTask.notify(view.similar)
    }

    c.log("render end");
    c.groupEnd();
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
    // c.log(header2Kye);
    const jspreadsheetData = message.jspreadsheetData;
    const jspreadsheetColumns = message.jspreadsheetColumns;
    const columns = (Object.fromEntries(jspreadsheetColumns.map((data, i) =>
        [header2Kye[data.title],
        Object.fromEntries(Object.entries(data)
            .concat([["colNum", i]]))])));
    // c.log(columns);
    const tableTaskDataProperties = Object.fromEntries(
        Object.entries(columns).map(([key, value]) => [
            key,
            (_ => {
                const { width, colNum, readOnly, align } = { ...value };
                return ({ width, colNum, readOnly: readOnly, align });
            })()
        ])
    );
    const jspreadsheetTaskDataProperties = Object.fromEntries(
        Object.entries(columns).map(([key, value]) => [
            key,
            (_ => {
                const { type, editor, source, options, autocomplete, multiple } = { ...value };
                return ({ type, editor, source, options, autocomplete, multiple });
            })()
        ])
    );
    // c.log(tableTaskDataProperties);
    // jspreadsheetTaskDataProperties
    const sortedKeys = Object.entries(columns)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.colNum - b.value.colNum)
        .map(data => data.key);
    // c.log(sortedKeys);
    const taskDataKeys = Object.entries(model.taskDataEntity[0])
        .map(([k, _]) => k);
    // c.log(taskDataKeys);
    // c.log(jspreadsheetData.map(row =>
    //     Object.fromEntries(
    //         zip(sortedKeys, row)
    //             .filter(([key, _]) =>
    //                 taskDataKeys.includes(key)
    //             )
    //             .map(([key, data]) => [key,
    //                 key === "implementationDate" ? string2ImplementationDate(data)
    //                     : ["successorTaskId", "dependencyTaskId", "connotativeTaskId"].includes(key) ? data.split(";")
    //                         : data]
    //             ))
    // ));
    const taskDataEntity = jspreadsheetData.map(row => {
        const newData = Object.fromEntries(
            zip(sortedKeys, row)
                .filter(([key, _]) =>
                    taskDataKeys.includes(key)
                )
                .map(([key, data]) => [key,
                    key === "implementationDate" ? string2ImplementationDate(data)
                        : ["successorTaskId", "dependencyTaskId", "connotativeTaskId"].includes(key) ? data.split(";")
                            : data]
                ));
        const oldData = model.taskDataEntity.filter(value => value.id === newData.id)[0];
        return { ...oldData, ...newData }
    }
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
        [data.title, Object.fromEntries(Object.entries(data).concat([["colNum", i]]))])));
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
        tableHeaderKeys[i] === "implementationDate" ? string2ImplementationDate(datum) : datum
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
    const srcTaskData = model.taskDataEntity.find(data => data.id === message.id);
    const modelScheduledDateTime = dayjs.tz(model.scheduledDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone);
    const modelLimit = dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, timeZone);
    // c.log();
    // c.log();
    const id = message.id;
    const title = message.name;
    const memo = message.description;
    const scheduledDateTime = dayjs(message.start).tz(timeZone)
        .hour(modelScheduledDateTime.format("H"))
        .minute(modelScheduledDateTime.format("m"))
        .second(modelScheduledDateTime.format("s"))
        .format(DEFAULT_FORMAT.DATE_TIME);
    const limit = dayjs(message.end).tz(timeZone)
        .hour(modelLimit.format("H"))
        .minute(modelLimit.format("m"))
        .second(modelLimit.format("s"))
        .format(DEFAULT_FORMAT.DATE_TIME);
    const dstTaskData = { ...srcTaskData, id, title, memo, scheduledDateTime, limit, };
    const taskDataEntity = model.taskDataEntity.map(value => value.id === dstTaskData.id ? dstTaskData : value);


    // taskData.progress = message.progress;
    // taskData.dependencies = message.dependencies;
    // taskData.customClass = message.customClass;


    //             start: dayjs.tz(model.scheduledDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format("YYYY-MM-DD"),
    //                 end: dayjs.tz(model.limit, DEFAULT_FORMAT.DATE_TIME, timeZone).format("YYYY-MM-DD"),
    // return JSON.parse(JSON.stringify(model));
    return { ...model, taskDataEntity }
};
const kanbanBoardUpdate = model => message => {
    return model;
};
const kanbanItemUpdate = model => message => model;
const saveButtonUpdate = model => message => model;
const exportJsonButtonUpdate = model => message => {
    const textarea = JSON.stringify({
        taskUiProperties: model.taskUiProperties,
        tableTaskDataProperties: model.tableTaskDataProperties,
        jspreadsheetTaskDataProperties: model.jspreadsheetTaskDataProperties,
        taskDataEntity: model.taskDataEntity,
    });
    return { ...model, textarea };
};
const importJsonButtonUpdate = model => message => model;
const loadButtonUpdate = model => message => model;
const localStorageUpdate = model => message => {
    try {
        const srcModel = (message);
        const taskDataEntity = srcModel.taskDataEntity.map(value => {
            const defaultTaskData = Object.fromEntries(Object.entries(diContainer.container.TASK_DATA_TEMPLATES).map((obj) => { return [obj[0], obj[1].defaultValue] }));
            return { ...defaultTaskData, ...value }

        })

        const newModel = { ...model, ...srcModel, taskDataEntity };
        view(model);
        return newModel;
    } catch (e) {
        c.log(e);
        return model;
    }
    return model;
};
const importJsonUpdate = model => message => {
    try {
        const srcModel = JSON.parse(message.value);
        const taskDataEntity = srcModel.taskDataEntity.map(value => {
            const defaultTaskData = Object.fromEntries(Object.entries(diContainer.container.TASK_DATA_TEMPLATES).map((obj) => { return [obj[0], obj[1].defaultValue] }));
            return { ...defaultTaskData, ...value }

        })

        const newModel = { ...model, ...srcModel, taskDataEntity };
        view(model);
        return newModel;
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
const connotativeTaskDropdownMenuUpdate = (model) => (message) => ({ ...model, relationFilter: { ...model.relationFilter, connotative: !model.relationFilter.connotative } });
const dependencyTaskDropdownMenuUpdate = (model) => (message) => ({ ...model, relationFilter: { ...model.relationFilter, dependency: !model.relationFilter.dependency } });
const successorTaskDropdownMenuUpdate = (model) => (message) => ({ ...model, relationFilter: { ...model.relationFilter, successor: !model.relationFilter.successor } });
const similarTasksDropdownMenuUpdate = (model) => (message) => ({ ...model, relationFilter: { ...model.relationFilter, similar: !model.relationFilter.similar } });
const update = model => message => {
    c.group("update");
    c.log(model);
    c.log(message);
    // c.log(JSON.stringify(model));
    const dstModel = (model => {
        switch (message.constructor.name) {
            case new TableMessage().constructor.name:
                {
                    const dstModel = TableUpdate(model)(message);

                    c.log(dstModel);
                    return dstModel;
                    break;
                }
            case new GanttMessage().constructor.name:
                {
                    c.log("gantt");
                    const dstModel = ganttUpdate(model)(message);

                    c.log(dstModel);
                    return { ...dstModel };

                    break;
                }
            case new KanbanBoardMessage().constructor.name:
                {
                    c.log("kanban board");
                    const dstModel = kanbanBoardUpdate(model)(message);

                    c.log(dstModel);
                    return dstModel;

                    break;
                }
            case new KanbanItemMessage().constructor.name:
                {
                    c.log("kanban item");
                    const dstModel = kanbanItemUpdate(model)(message);

                    c.log(dstModel);
                    return dstModel;

                    break;
                }
            case new LocalStorageMessage().constructor.name:
                {
                    c.log("LocalStorage");
                    const dstModel = localStorageUpdate(model)(message);

                    c.log(dstModel);
                    return dstModel;
                }
            case new ImportJsonMessage().constructor.name:
                {
                    c.log("ImportJson");
                    const dstModel = importJsonUpdate(model)(message);

                    c.log(dstModel);
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
                    // c.log(dstModel == model);
                    return dstModel;
                }
            case new DropdownMenuMessage().constructor.name:
                {
                    c.log("DropdownMenuMessage");
                    const dstModel = (_ => {
                        switch (message.id) {
                            case $connotativeTaskDropdownMenu.id: {
                                c.log("connotativeTaskDropdownMenu");
                                return connotativeTaskDropdownMenuUpdate(model)(message);
                                break;
                            }
                            case $dependencyTaskDropdownMenu.id: {
                                c.log("dependencyTaskDropdownMenu");
                                return dependencyTaskDropdownMenuUpdate(model)(message);
                                break;
                            }
                            case $successorTaskDropdownMenu.id: {
                                c.log("successorTaskDropdownMenu")
                                return successorTaskDropdownMenuUpdate(model)(message);
                                break;
                            }
                            case $similarTasksDropdownMenu.id: {
                                c.log("similarTasksDropdownMenu")
                                return similarTasksDropdownMenuUpdate(model)(message);
                                break;
                            }
                            default:
                                console.log("default");
                        }
                    })();


                    c.log(dstModel);
                    // c.log(dstModel == model);
                    return dstModel;
                }
            default:
                c.log("default");
                return model;
        }
    })(model);
    // c.log(JSON.stringify(dstModel));
    c.log(isEqualObjectJson(new IMainData(dstModel))(new IMainData(model)))
    const newModel = (_ => {
        if (isEqualObjectJson(new IMainData(dstModel))(new IMainData(model))) {
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
                default:
                    c.log("no change");
                    return model;

            }
            return model;
        } else {
            return (dstModel => {
                const taskDataEntity =
                    pipe(dstModel.taskDataEntity)((a => a)
                        ._(stateChange2implementationDate(model.taskDataEntity))
                        ._(fillDefaultTaskData(diContainer.container.TASK_DATA_TEMPLATES))
                        ._(data => data.map(datum => {
                            //タスク同士の関係で自分を指しているidを取り除く処理
                            const successorTaskId = datum.successorTaskId.filter(value => value !== datum.id);
                            const dependencyTaskId = datum.dependencyTaskId.filter(value => value !== datum.id);
                            const connotativeTaskId = datum.connotativeTaskId.filter(value => value !== datum.id);
                            return { ...datum, successorTaskId, dependencyTaskId, connotativeTaskId }
                        })
                        )
                        ._(data => data)
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
                            const createJspreadsheetTaskDataProperties = ({ type, editor, source, options, autocomplete, multiple }) => ({ type, editor, source, options, autocomplete, multiple });
                            const successorTaskId = createJspreadsheetTaskDataProperties({ ...data.successorTaskId, source });
                            const dependencyTaskId = createJspreadsheetTaskDataProperties({ ...data.dependencyTaskId, source });
                            const connotativeTaskId = createJspreadsheetTaskDataProperties({ ...data.connotativeTaskId, source });
                            // const { type, editor, options, autocomplete, multiple } = data.successorTaskId;
                            // const successorTaskId = { type, editor, source, options, autocomplete, multiple };
                            return { ...data, successorTaskId, dependencyTaskId, connotativeTaskId };
                        })
                    )


                const { taskUiProperties, tableTaskDataProperties, relationFilter } = dstModel;
                const mainData = {
                    taskUiProperties,
                    tableTaskDataProperties,
                    jspreadsheetTaskDataProperties,
                    taskDataEntity,
                    relationFilter,
                };
                const end = dstModel.index + 1;
                const start = 0 < (end - HISTORY_LENGTH) ? end - HISTORY_LENGTH : 0;

                c.log("add history");
                const history = dstModel.history.slice(start, end).concat([mainData]);
                const index = history.length - 1;

                const bufferModel = { ...dstModel, taskDataEntity, jspreadsheetTaskDataProperties, history, index }
                c.log({ bufferModel });
                return bufferModel;
            })(dstModel);
        }
    })();
    c.log((newModel));
    c.log(newModel === model);
    c.groupEnd();
    return newModel;
};
const main = new ElmLike({
    init, view, update, render: view => render(jspreadsheetObject)(filterJspreadsheetObject)(gantt)(ganttTasks)(calendar)(kanban)(saveTimeout)(textareaBuffer)(treeGraph)(showConnotativeTask)(showDependencyTask)(showSuccessorTask)(showSimilarTask)(view)
});
main.init();


const loadLocalStorage = secretKey => func => {
    const getLocalStorage = _ => (JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
    secretKey
        .then(key => (decryptString(key, getLocalStorage())))
        .then(value => func(new LocalStorageMessage(JSON.parse(value))));
};
loadLocalStorage(secretKey)(main.update);
// secretKey.then(key => (decryptString(key, getLocalStorage()))).then(value => c.log(new LocalStorageMessage(JSON.parse(value))));


