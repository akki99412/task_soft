
const notDuplicateTableTaskDataPropertiesColNum = (taskDataTemplate) => {
    return Object.entries(taskDataTemplate)
        .map(([key, value]) => { return { key: value, value: key } })
        .sort((a, b) => a.key - b.key)
        .map((data) => { return data.value });
}

const notDuplicateTableTaskDataColNum = data =>
    Object.fromEntries(
        Object.entries(data)
            .map(([key, value]) => ({ key: key, value: value }))
            .sort((a, b) => a.value.col_num - b.value.col_num)
            .map((data, i) => {
                data.value.col_num = i;
                return data;
            })
            .map(data => ([data.key, data.value]))
    );
class TimelineSandwich {
    constructor(setterTimeline, getterTimeline) {
        this._setterTimeline = setterTimeline;
        this._getterTimeline = getterTimeline;
    }
    static create = (setterTimeline) => (getterTimeline) => new TimelineSandwich(setterTimeline, getterTimeline);
    next = data =>
        this._setterTimeline.next(data);

    get getter() {
        return this._getterTimeline;
    }
    get value() {
        return this.getter.value;
    }

    bind = data => this._getterTimeline.bind(data);
    map = data => this._getterTimeline.map(data);
    apply = data => this._getterTimeline.apply(data);

}
// const taskDataPropertiesSetter = Timeline.create()(diContainer.container.TASK_DATA_TEMPLATES);
// const taskUiPropertiesSetter = Timeline.create()(diContainer.container.TASK_UI_TEMPLATES);
// const tableTaskDataPropertiesSetter = Timeline.create()(diContainer.container.TABLE_TASK_DATA_TEMPLATES);
// const jspreadsheetTaskDataPropertiesSetter = Timeline.create()(diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES);
// const taskDataRepositorySetter = Timeline.create()([]);

const taskDataProperties = Timeline.create()(diContainer.container.TASK_DATA_TEMPLATES);


const repositorySetter = Timeline.create(true)({
    // taskDataProperties: diContainer.container.TASK_DATA_TEMPLATES,
    taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
    tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
    jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
    taskDataRepository: [],
});
loggerTimelines.push(
    repositorySetter.map(a => { c.groupCollapsed("repositorySetter"); c.log(a); c.groupEnd(); return a })
);

Object.fromEntries(Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] }))
// const repositories = Timeline.create(true)({
//     // taskDataProperties: diContainer.container.TASK_DATA_TEMPLATES,
//     taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
//     tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
//     jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
//     taskDataRepository: [],
// });

const repositories = repositorySetter.map(parent => ({
    taskUiProperties: parent.taskUiProperties,
    tableTaskDataProperties: notDuplicateTableTaskDataColNum(parent.tableTaskDataProperties),
    jspreadsheetTaskDataProperties: parent.jspreadsheetTaskDataProperties,
    taskDataRepository: parent.taskDataRepository.map((data, i) => {

        if (data.state === null) {
        } else if (data.state === TASK_STATE.IN_PROGRESS) {
            c.log(repositories.value.taskDataRepository[i].state);
            if (repositories.value.taskDataRepository[i].state !== TASK_STATE.IN_PROGRESS && data.id === repositories.value.taskDataRepository[i].id) {

                data.implementation_date.push({ start: (dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME)), end: "" });
                // console.warn("change to in progress");
            }
        } else if (data.state !== TASK_STATE.IN_PROGRESS) {
            if (i<repositories.value.taskDataRepository.length  && repositories.value.taskDataRepository[i].state === TASK_STATE.IN_PROGRESS && data.id === repositories.value.taskDataRepository[i].id) {
                data.implementation_date[data.implementation_date.length - 1].end = dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME);
                const sum_time = data.implementation_date.reduce(function (sum, element) {
                    return sum + dayjs(element.end).diff(dayjs(element.start), 'hour');
                }, 0);
                // c.log(sum_time);
                data.implementation_time = sum_time;
            }
            // task_table.setValueFromCoords(data_template.find(template => template.member == "table_implementation_time").table_col_num, x2, 
        }
        return data.id === "" ? Object.fromEntries(Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] })) : data
    }
    ),
}));


// const tableHeaderKeys = Timeline.create()({});
// const masterTimeline = Timeline.create(true)(
//     taskDataProperties =>
//         taskUiProperties =>
//             tableTaskDataProperties =>
//                 jspreadsheetTaskDataProperties =>
//                     taskDataRepository => {
//                         c.log(tableTaskDataProperties);
//                         tableHeaderKeys.next(Object.entries(tableTaskDataProperties)
//                             .map(([key, value]) => ({ key, value }))
//                             .sort((a, b) => a.value.col_num - b.value.col_num)
//                             .map(data => data.key)
//                         );
//                         return ({
//                             taskDataProperties,
//                             taskUiProperties,
//                             tableTaskDataProperties,
//                             jspreadsheetTaskDataProperties,
//                             taskDataRepository,
//                         });
//                     })
// .apply(taskDataPropertiesSetter)
// .apply(taskUiPropertiesSetter)
// .apply(tableTaskDataPropertiesSetter.map(notDuplicateTableTaskDataColNum))
// .apply(jspreadsheetTaskDataPropertiesSetter)
// .apply(taskDataRepositorySetter);

// const taskDataPropertiesGetter = masterTimeline.map(data => (data.taskDataProperties));
// const taskUiPropertiesGetter = masterTimeline.map(data => (data.taskUiProperties));
// const tableTaskDataPropertiesGetter = masterTimeline.map(data => (data.tableTaskDataProperties));
// const jspreadsheetTaskDataPropertiesGetter = masterTimeline.map(data => (data.jspreadsheetTaskDataProperties));
// const taskDataRepositoryGetter = masterTimeline.map(data => (data.taskDataRepository));




// const taskDataProperties = TimelineSandwich.create(taskDataPropertiesSetter)(taskDataPropertiesGetter);
// const taskUiProperties = TimelineSandwich.create(taskUiPropertiesSetter)(taskUiPropertiesGetter);
// const tableTaskDataProperties = TimelineSandwich.create(tableTaskDataPropertiesSetter)(tableTaskDataPropertiesGetter);
// const jspreadsheetTaskDataProperties = TimelineSandwich.create(jspreadsheetTaskDataPropertiesSetter)(jspreadsheetTaskDataPropertiesGetter);
// const taskDataRepository = TimelineSandwich.create(taskDataRepositorySetter)(taskDataRepositoryGetter);

// loggerTimelines.push(taskDataProperties.map(a => { c.groupCollapsed("taskDataProperties"); c.log(a); c.groupEnd(); return a }));
// loggerTimelines.push(taskUiProperties.map(a => { c.groupCollapsed("taskUiProperties"); c.log(a); c.groupEnd(); return a }));
// loggerTimelines.push(tableTaskDataProperties.map(a => { c.groupCollapsed("tableTaskDataProperties"); c.log(a); c.groupEnd(); return a }));
// loggerTimelines.push(jspreadsheetTaskDataProperties.map(a => { c.groupCollapsed("jspreadsheetTaskDataProperties"); c.log(a); c.groupEnd(); return a }));
// loggerTimelines.push(taskDataRepository.map(a => { c.groupCollapsed("taskDataRepository"); c.log(a); c.groupEnd(); return a }));
loggerTimelines.push(
    repositories.map(a => { c.groupCollapsed("repositories"); c.log(a); c.groupEnd(); return a })
);


const insertTaskData =
    template => target => row => {
        const buffer = [].concat(target);
        buffer.splice(row, 0, Object.fromEntries(
            Object.entries(template).map((obj) => { return [obj[0], obj[1].defaultValue] })
        ));
        return buffer;
    }
