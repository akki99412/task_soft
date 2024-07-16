

class TimelineSandwich {
    constructor(setterTimeline, getterTimeline) {
        this.SetterTimeline = setterTimeline;
        this.GetterTimeline = getterTimeline;
    }
    static create = (setterTimeline) => (getterTimeline) => new TimelineSandwich(setterTimeline, getterTimeline);
    next = data =>
        this.SetterTimeline.next(data);

    get getter() {
        return this.GetterTimeline;
    }
    get value() {
        return this.getter.value;
    }

    bind = data => this.GetterTimeline.bind(data);
    map = data => this.GetterTimeline.map(data);
    apply = data => this.GetterTimeline.apply(data);

}
const taskDataProperties = Timeline.create()(diContainer.container.TASK_DATA_TEMPLATES);


const repositorySetter = Timeline.create(100)({
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

const repositories = repositorySetter.map(parent => ({
    taskUiProperties: parent.taskUiProperties,
    tableTaskDataProperties: notDuplicateTableTaskDataColNum(parent.tableTaskDataProperties),
    jspreadsheetTaskDataProperties: parent.jspreadsheetTaskDataProperties,
    taskDataRepository: parent.taskDataRepository.map((data, i) => {

        if (data.state === null) {
        } else if (data.state === TASK_STATE.IN_PROGRESS) {
            c.log(repositories.value.taskDataRepository[i].state);
            if (repositories.value.taskDataRepository[i].state !== TASK_STATE.IN_PROGRESS && data.id === repositories.value.taskDataRepository[i].id) {

                data.implementationDate.push({ start: (dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME)), end: "" });
                // console.warn("change to in progress");
            }
        } else if (data.state !== TASK_STATE.IN_PROGRESS) {
            if (i<repositories.value.taskDataRepository.length  && repositories.value.taskDataRepository[i].state === TASK_STATE.IN_PROGRESS && data.id === repositories.value.taskDataRepository[i].id) {
                data.implementationDate[data.implementationDate.length - 1].end = dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME);
                const sumTime = data.implementationDate.reduce(function (sum, element) {
                    return sum + dayjs(element.end).diff(dayjs(element.start), 'hour');
                }, 0);
                // c.log(sumTime);
                data.implementationTime = sumTime;
            }
            // taskTable.setValueFromCoords(dataTemplate.find(template => template.member == "tableImplementationTime").tableColNum, x2, 
        }
        return data.id === "" ? Object.fromEntries(Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] })) : data
    }
    ),
}));


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

