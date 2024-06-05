const calendarGetter = Timeline.create()();
const ganttGetter = Timeline.create()();
const kanbanGetter = Timeline.create()();
const tableGetter = Timeline.create()();

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

const repositoryGetter = Timeline.create()({
    // taskDataProperties: diContainer.container.TASK_DATA_TEMPLATES,
    taskUiProperties: diContainer.container.TASK_UI_TEMPLATES,
    tableTaskDataProperties: notDuplicateTableTaskDataColNum(diContainer.container.TABLE_TASK_DATA_TEMPLATES),
    jspreadsheetTaskDataProperties: diContainer.container.JSPREADSHEET_TASK_DATA_TEMPLATES,
    taskDataRepository: [],
});

// const repositoryGetter = Timeline.create()();
const taskUiPropertiesUpdater = repositoryGetter.map(parent => parent.taskUiProperties);
const tableTaskDataPropertiesUpdater = repositoryGetter.map(parent => parent.tableTaskDataProperties);
const jspreadsheetTaskDataPropertiesUpdater = repositoryGetter.map(parent => parent.jspreadsheetTaskDataProperties);
const taskDataEntityUpdater = repositoryGetter.map(parent => parent.taskDataRepository);

const repositorySetter = Timeline.create()(
    repositoryGetter =>
        uiResolved =>
            taskUiProperties =>
                tableTaskDataProperties =>
                    jspreadsheetTaskDataProperties =>
                        taskDataEntity =>
                            uiResolved
                                ? {
                                    taskUiProperties,
                                    tableTaskDataProperties,
                                    jspreadsheetTaskDataProperties,
                                    taskDataEntity,
                                }
                                : repositoryGetter
)
    .apply(repositoryGetter)
    .apply(uiResolved)
    .apply(taskUiPropertiesUpdater)
    .apply(tableTaskDataPropertiesUpdater)
    .apply(jspreadsheetTaskDataPropertiesUpdater)
    .apply(taskDataEntityUpdater);

const repository = repositorySetter.bind(parent => Timeline.create({ valueLength: 100 })(parent));
const isRepositoryResolved = Timeline.create()(true);
repository.lateBeforeMap(_ => false)(isRepositoryResolved);
repository.lateAfterMap(_ => true)(isRepositoryResolved);

c.log(repository.value);

const taskUiPropertiesView = repository.map(parent => parent.taskUiProperties);
c.log(taskUiPropertiesView.value);
const tableTaskDataPropertiesView = repository.map(parent => parent.tableTaskDataProperties);
c.log(tableTaskDataPropertiesView.value);
const jspreadsheetTaskDataPropertiesView = repository.map(parent => parent.jspreadsheetTaskDataProperties);
const taskDataEntityView = repository.map(parent => parent.taskDataEntity);



const tableHeaderKeys = Timeline.create()(tableTaskDataProperties => Object.entries(tableTaskDataProperties)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.value.col_num - b.value.col_num)
    .map(parent => parent.key)).apply(tableTaskDataPropertiesView);
c.log(tableHeaderKeys.value);
c.log(tableGetter.value);
c.log(taskUiPropertiesView.value);
const jspreadsheetColumns = Timeline.create()(
    keys =>
        taskUiProperties =>
            tableTaskDataProperties =>
                jspreadsheetTaskDataProperties => keys.map(key=>({
                    title: taskUiProperties[key].header,
                    width: tableTaskDataProperties[key].width,
                    readOnly: tableTaskDataProperties[key].read_only,
                    type: jspreadsheetTaskDataProperties[key].type,
                    editor: jspreadsheetTaskDataProperties[key].editor,
                    source: jspreadsheetTaskDataProperties[key].source,
                    options: jspreadsheetTaskDataProperties[key].options,
                }))
)
    .apply(tableHeaderKeys)
    .apply(taskUiPropertiesView)
    .apply(tableTaskDataPropertiesView)
    .apply(jspreadsheetTaskDataPropertiesView)
c.log(tableHeaderKeys);
c.log(taskDataEntityView.value);
const jspreadsheetData = Timeline.create()(taskDataRepository => tableHeaderKeys =>
    taskDataRepository
        .map(taskDatum =>
            tableHeaderKeys.map(key =>
                key !== "implementation_date" ?
                    taskDatum[key] :
                    implementationDate2String(taskDatum[key])
            )
    )).apply(taskDataEntityView).apply(tableHeaderKeys);
const header2Key = Timeline.create()(taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])))).apply(taskUiPropertiesView);

const ganttTasks = Timeline.create()(taskDataEntityView => taskDataEntityView.map(parent => ({
    id: parent.id,
    name: parent.title,
    description: parent.memo,
    start: parent.scheduled_date_time,
    end: parent.completion_date_time,
    // progress:parent.id,
})))
    .apply(taskDataEntityView);

const kanbanTasks = Timeline.create()(taskDataEntityView =>
    boardList.map(board => ({
        id: board.id,
        title: board.title,
        item: taskDataEntityView.filter(data => data.state === board.id)
            .sort((a, b) => a.kanbanNum - b.kanbanNum).map(parent => {
                ({
                    id: parent.id,
                    title: parent.title,
                    // class: 
                })
            })
    }))
)
    .apply(taskDataEntityView);


const calendarTasks = Timeline.create()(taskDataEntityView => taskDataEntityView.map(parent => ({
    id: parent.id,
    title: parent.title,
    // description: parent.memo,
    start: parent.scheduled_date_time,
    end: parent.completion_date_time,
    // progress:parent.id,
})))
    .apply(taskDataEntityView);


