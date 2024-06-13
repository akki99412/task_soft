

const isInit = Timeline.create()(true);
const initModel = (
    {
        taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
        tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
        jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
        taskDataEntity: [Object.fromEntries(Object.entries(diContainer.container.TASK_DATA_TEMPLATES).map(([key, value]) => [key, value.defaultValue]))]
    }
);


const calendarGetter = Timeline.create()(taskData2calendarTasks(initModel.taskDataEntity));
const ganttGetter = Timeline.create()();
const kanbanGetter = Timeline.create()();
const tableGetter = Timeline.create()({
    jspreadsheetData: repository2jspreadsheetData(initModel.taskDataEntity)(generateTableHeaderKeys(initModel.tableTaskDataProperties)),
    jspreadsheetColumns: repository2jspreadsheetColumns(generateTableHeaderKeys(initModel.tableTaskDataProperties))(initModel.taskUiProperties)(initModel.tableTaskDataProperties)(initModel.jspreadsheetTaskDataProperties),
});
loggerTimelines.push(
    tableGetter.map(a => { c.groupCollapsed("tableGetter"); c.log(a); c.groupEnd(); return a })
);


const isCalendarResolved = Timeline.create()(true);
const isGanttResolved = Timeline.create()(true);
const isKanbanResolved = Timeline.create()(true);
const isTableResolved = Timeline.create()(true);

calendarGetter.lateBeforeMap(_ => false)(isCalendarResolved);
ganttGetter.lateBeforeMap(_ => false)(isGanttResolved);
kanbanGetter.lateBeforeMap(_ => false)(isKanbanResolved);
tableGetter.lateBeforeMap(_ => false)(isTableResolved);
calendarGetter.lateAfterMap(_ => true)(isCalendarResolved);
ganttGetter.lateAfterMap(_ => true)(isGanttResolved);
kanbanGetter.lateAfterMap(_ => true)(isKanbanResolved);
tableGetter.lateAfterMap(_ => true)(isTableResolved);
const uiResolved = Timeline.create()(
    isCalendarResolved =>
        isGanttResolved =>
            isKanbanResolved =>
                isTableResolved =>
                    isCalendarResolved || isGanttResolved || isKanbanResolved || isTableResolved)
    .apply(isCalendarResolved)
    .apply(isGanttResolved)
    .apply(isKanbanResolved)
    .apply(isTableResolved);

const header2KeyUpdater = Timeline.create()(generateHeader2Key).apply(Timeline.create()(diContainer.container.TASK_UI_TEMPLATES));
const jspreadsheetDataUpdater = tableGetter.map(parent => parent.jspreadsheetData);
const jspreadsheetColumnsUpdater = tableGetter.map(parent => parent.jspreadsheetColumns);
const columnsUpdater = jspreadsheetColumnsUpdater.map(jspreadsheetColumns=>Object.fromEntries(jspreadsheetColumns.map((data, i) =>
    [data.title, Object.fromEntries(Object.entries(data).concat([["col_num", i]]))])));
loggerTimelines.push(
    tableGetter.map(a => { c.groupCollapsed("tableGetter"); c.log(a); c.groupEnd(); return a })
);
const jspreadsheetTaskDataPropertiesUpdater = Timeline.create()(header2Key => jspreadsheetTaskDataProperties=> columns=>Object.fromEntries(Object.entries(header2Key).map(([header, key]) =>
    ([key, Object.fromEntries(Object.entries(jspreadsheetTaskDataProperties[key]).map(([k, value]) => ([k, k === "type" || k === "source" || k === "options" ? columns[header][k] : value])))])
))).apply(header2KeyUpdater).apply(Timeline.create()(initModel.jspreadsheetTaskDataProperties)).apply(columnsUpdater);
loggerTimelines.push(
    jspreadsheetTaskDataPropertiesUpdater.map(a => { c.groupCollapsed("jspreadsheetTaskDataPropertiesUpdater"); c.log(a); c.groupEnd(); return a })
);




// const repositoryGetter = Timeline.create()({
//     // taskDataProperties: diContainer.container.TASK_DATA_TEMPLATES,
//     taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
//     tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
//     jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
//     taskDataEntity: [],
// });

// const repositoryGetter = Timeline.create()();
const taskUiPropertiesGetter = Timeline.create()(initModel.taskUiProperties);
const tableTaskDataPropertiesGetter = Timeline.create()(initModel.tableTaskDataProperties);
const jspreadsheetTaskDataPropertiesGetter = Timeline.create()(initModel.jspreadsheetTaskDataProperties);
const taskDataEntityGetter = Timeline.create()(initModel.taskDataEntity);
const header2KeyGetter = Timeline.create()(taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])))).apply(Timeline.create()(diContainer.container.TASK_UI_TEMPLATES));

const taskUiPropertiesMixer=Timeline.create()();
const tableTaskDataPropertiesMixer=Timeline.create()();
const jspreadsheetTaskDataPropertiesMixer=Timeline.create()();
const taskDataEntityMixer=Timeline.create()();

const repositorySetter = Timeline.create()(
    isInit =>
        initModel =>
            repositoryGetter =>
                uiResolved =>
                    taskUiProperties =>
                        tableTaskDataProperties =>
                            jspreadsheetTaskDataProperties =>
                                taskDataEntity =>
                                    isInit
                                        ? initModel
                                        : uiResolved
                                            ? {
                                                taskUiProperties,
                                                tableTaskDataProperties,
                                                jspreadsheetTaskDataProperties,
                                                taskDataEntity,
                                            }
                                            : repositoryGetter
)
    .apply(isInit)
    .apply(Timeline.create()(initModel))
    .apply(repositoryGetter)
    .apply(uiResolved)
    .apply(taskUiPropertiesGetter)
    .apply(tableTaskDataPropertiesGetter)
    .apply(jspreadsheetTaskDataPropertiesGetter)
    .apply(taskDataEntityGetter);

const repository = repositorySetter.bind(parent => Timeline.create({ valueLength: 100 })(parent));
const isRepositoryResolved = Timeline.create()(true);
repository.lateBeforeMap(_ => false)(isRepositoryResolved);
repository.lateAfterMap(_ => true)(isRepositoryResolved);
loggerTimelines.push(
    repository.map(a => { c.groupCollapsed("repository"); c.log(a); c.groupEnd(); return a })
);
const taskUiProperties = repository.map(parent => parent.taskUiProperties);
c.log(taskUiProperties.value);
const tableTaskDataProperties = repository.map(parent => parent.tableTaskDataProperties);
c.log(tableTaskDataProperties.value);
const jspreadsheetTaskDataProperties = repository.map(parent => parent.jspreadsheetTaskDataProperties);
const taskDataEntity = repository.map(parent => parent.taskDataEntity);



const tableHeaderKeys = Timeline.create()(generateTableHeaderKeys).apply(tableTaskDataProperties);
c.log(tableHeaderKeys.value);
c.log(tableGetter.value);
c.log(taskUiProperties.value);

const jspreadsheetColumns = Timeline.create()(
    repository2jspreadsheetColumns
)
    .apply(tableHeaderKeys)
    .apply(taskUiProperties)
    .apply(tableTaskDataProperties)
    .apply(jspreadsheetTaskDataProperties)
c.log(tableHeaderKeys);
c.log(taskDataEntity.value);
const jspreadsheetData = Timeline.create()(repository2jspreadsheetData).apply(taskDataEntity).apply(tableHeaderKeys);
const header2Key = Timeline.create()(taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])))).apply(taskUiProperties);

const ganttTasks = Timeline.create()(taskDataEntity => taskDataEntity.map(parent => ({
    id: parent.id,
    name: parent.title,
    description: parent.memo,
    start: parent.scheduled_date_time,
    end: parent.completion_date_time,
    // progress:parent.id,
})))
    .apply(taskDataEntity);

const kanbanTasks = Timeline.create()(taskDataEntity =>
    boardList.map(board => ({
        id: board.id,
        title: board.title,
        item: taskDataEntity.filter(data => data.state === board.id)
            .sort((a, b) => a.kanbanNum - b.kanbanNum).map(parent => {
                ({
                    id: parent.id,
                    title: parent.title,
                    // class: 
                })
            })
    }))
)
    .apply(taskDataEntity);


const calendarTasks = Timeline.create()(taskData2calendarTasks)
    .apply(taskDataEntity);


