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

const repositoryGetter = Timeline.create()();

// const repositoryGetter = Timeline.create()();
const taskUiPropertiesUpdater = repositoryGetter.map(parent => parent);
const tableTaskDataPropertiesUpdater = repositoryGetter.map(parent => parent);
const jspreadsheetTaskDataPropertiesUpdater = repositoryGetter.map(parent => parent);
const taskDataEntityUpdater = repositoryGetter.map(parent => parent);

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
    .apply(taskUiProperties)
    .apply(tableTaskDataProperties)
    .apply(jspreadsheetTaskDataProperties)
    .apply(taskDataEntity);

const repository = repositorySetter.bind(parent => Timeline.create({ valueLength: 100 })(parent));
const isRepositoryResolved = Timeline()(true);
repository.lateBeforeMap(_ => false)(isRepositoryResolved);
repository.lateAfterMap(_ => true)(isRepositoryResolved);


const taskUiPropertiesView = repository.map(parent => parent);
const tableTaskDataPropertiesView = repository.map(parent => parent);
const jspreadsheetTaskDataPropertiesView = repository.map(parent => parent);
const taskDataEntityView = repository.map(parent => parent);



const tableHeaderKeys = Timeline.create()(tableTaskDataProperties => tableTaskDataProperties).apply(tableTaskDataPropertiesView);
const jspreadsheetColumns = Timeline.create()(
    key =>
        taskUiProperties =>
            tableTaskDataProperties =>
                jspreadsheetTaskDataProperties => ({
                    title: taskUiProperties[key].header,
                    width: tableTaskDataProperties[key].width,
                    readOnly: tableTaskDataProperties[key].read_only,
                    type: jspreadsheetTaskDataProperties[key].type,
                    editor: jspreadsheetTaskDataProperties[key].editor,
                    source: jspreadsheetTaskDataProperties[key].source,
                    options: jspreadsheetTaskDataProperties[key].options,
                })
)
    .apply(tableHeaderKeys)
    .apply(taskUiProperties)
    .apply(tableTaskDataProperties)
    .apply(jspreadsheetTaskDataProperties)
const jspreadsheetData = Timeline.create()(taskDataRepository => tableHeaderKeys =>
    taskDataRepository
        .map(taskDatum =>
            tableHeaderKeys.map(key =>
                key !== "implementation_date" ?
                    taskDatum[key] :
                    implementationDate2String(taskDatum[key])
            )
        )).apply(taskDataRepository).apply(tableHeaderKeys);
const header2Key = Timeline.create()(taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])))).apply(taskUiProperties);

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
            .sort((a, b)=>a.kanbanNum-b.kanbanNum).map(parent => {
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


