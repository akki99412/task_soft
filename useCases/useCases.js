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
            .sort((a, b) => a.value.colNum - b.value.colNum)
            .map((data, i) => {
                data.value.colNum = i;
                return data;
            })
            .map(data => ([data.key, data.value]))
    );

const implementationDate2String = implementationDate => {
    // c.log(implementationDate);
    const stringifyList = implementationDate.map((data) => {
        if (data.start === undefined) return "";
        return data.start + " - " + data.end
    });
    const dst = stringifyList.join("\n");
    return dst;
}

const taskData2calendarTasks = taskDataEntity => taskDataEntity.map(parent => ({
    id: parent.id,
    title: parent.title,
    // description: parent.memo,
    start: parent.scheduledDateTime,
    end: parent.completionDateTime,
    // progress:parent.id,
}));

const repository2jspreadsheetData = taskDataEntity => tableHeaderKeys =>
    taskDataEntity
        .map(taskDatum =>
            tableHeaderKeys.map(key =>

                key === "implementationDate" ? implementationDate2String(taskDatum[key])
                    : ["successorTaskId", "dependencyTaskId", "connotativeTaskId"].includes(key) ? (_ => ((taskDatum[key]).join(";")))()
                        : key === "scheduledDate" ? dayjs.tz(taskDatum.scheduledDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format(DEFAULT_FORMAT.DATE) 
                            : key === "scheduledTime" ? dayjs.tz(taskDatum.scheduledDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format(DEFAULT_FORMAT.TIME) 
                                : key === "completionDate" ? dayjs.tz(taskDatum.completionDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format(DEFAULT_FORMAT.DATE) 
                                    : key === "completionTime" ? dayjs.tz(taskDatum.completionDateTime, DEFAULT_FORMAT.DATE_TIME, timeZone).format(DEFAULT_FORMAT.TIME) 
                                        : key ==="connotativeTask"?""
                            
                        : taskDatum[key]
            )
        );

const repository2jspreadsheetColumns = keys =>
    taskUiProperties =>
        tableTaskDataProperties =>
            jspreadsheetTaskDataProperties => keys.map(key => ({
                title: taskUiProperties[key].header,
                width: tableTaskDataProperties[key].width,
                readOnly: tableTaskDataProperties[key].readOnly,
                type: jspreadsheetTaskDataProperties[key].type,
                editor: jspreadsheetTaskDataProperties[key].editor === "" ? null : jspreadsheetTaskDataProperties[key].editor,
                source: jspreadsheetTaskDataProperties[key].source,
                options: jspreadsheetTaskDataProperties[key].options,
                autocomplete: jspreadsheetTaskDataProperties[key].autocomplete,
                multiple: jspreadsheetTaskDataProperties[key].multiple,
                "name": tableTaskDataProperties[key].colNum.toString(),
                "allowEmpty": false,
                "align": tableTaskDataProperties[key].align,
            }));

const generateTableHeaderKeys = tableTaskDataProperties => Object.entries(tableTaskDataProperties)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.value.colNum - b.value.colNum)
    .map(parent => parent.key);

const generateHeader2Key = taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])));

const string2ImplementationDate = source =>
(source.split("\n").map(row =>
    (startEnd => startEnd[0] !== "" ? ({ start: startEnd[0], end: (1 < startEnd.length ? startEnd[1] : "") }) : {})(row.split(/\s*-\s*/))
));

const stateChange2implementationDate = srcTaskData => taskData => taskData.map((data, i) => {

    if (data.state === null) {
    } else if (data.state === TASK_STATE.IN_PROGRESS) {
        c.log(srcTaskData[i].state);
        if (srcTaskData[i].state !== TASK_STATE.IN_PROGRESS && data.id === srcTaskData[i].id) {

            data.implementationDate.push({ start: (dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME)), end: "" });
            // console.warn("change to in progress");
        }
    } else if (data.state !== TASK_STATE.IN_PROGRESS) {
        if (i < srcTaskData.length && srcTaskData[i].state === TASK_STATE.IN_PROGRESS && data.id === srcTaskData[i].id) {
            data.implementationDate[data.implementationDate.length - 1].end = dayjs().tz(timeZone).format(DEFAULT_FORMAT.DATE_TIME);
            const sumTime = data.implementationDate.reduce(function (sum, element) {
                return sum + dayjs(element.end).diff(dayjs(element.start), 'hour');
            }, 0);
            // c.log(sumTime);
            data.implementationTime = sumTime;
        }
        // taskTable.setValueFromCoords(dataTemplate.find(template => template.member == "tableImplementationTime").tableColNum, x2, 
    } return data;
});
const fillDefaultTaskData = taskDataProperties => taskDataRepository => {
    // c.log(taskDataProperties);
    // c.log(taskDataRepository);
    return taskDataRepository.map((data) => {
        return data.id === '' ? Object.fromEntries(Object.entries(taskDataProperties).map((obj) => { return [obj[0], obj[1].defaultValue] })) : data;
    })
};