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

const implementationDate2String = implementation_date => {
    // c.log(implementation_date);
    const stringifyList = implementation_date.map((data) => {
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
    start: parent.scheduled_date_time,
    end: parent.completion_date_time,
    // progress:parent.id,
}));

const repository2jspreadsheetData = taskDataEntity => tableHeaderKeys =>
    taskDataEntity
        .map(taskDatum =>
            tableHeaderKeys.map(key =>

                key === "implementation_date" ? implementationDate2String(taskDatum[key])
                    : key === "successor_task_id" ? (_ => ((taskDatum[key]).join(";")))()
                        : key === "dependency_task_id" ? (_ => ((taskDatum[key]).join(";")))()
                            : taskDatum[key]
            )
        );

const repository2jspreadsheetColumns = keys =>
    taskUiProperties =>
        tableTaskDataProperties =>
            jspreadsheetTaskDataProperties => keys.map(key => ({
                title: taskUiProperties[key].header,
                width: tableTaskDataProperties[key].width,
                readOnly: tableTaskDataProperties[key].read_only,
                type: jspreadsheetTaskDataProperties[key].type,
                editor: jspreadsheetTaskDataProperties[key].editor === "" ? null : jspreadsheetTaskDataProperties[key].editor,
                source: jspreadsheetTaskDataProperties[key].source,
                options: jspreadsheetTaskDataProperties[key].options,
                autocomplete: jspreadsheetTaskDataProperties[key].autocomplete,
                multiple: jspreadsheetTaskDataProperties[key].multiple,
                "name": tableTaskDataProperties[key].col_num.toString(),
                "allowEmpty": false,
                "align": tableTaskDataProperties[key].align,
            }));

const generateTableHeaderKeys = tableTaskDataProperties => Object.entries(tableTaskDataProperties)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.value.col_num - b.value.col_num)
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

            data.implementation_date.push({ start: (dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME)), end: "" });
            // console.warn("change to in progress");
        }
    } else if (data.state !== TASK_STATE.IN_PROGRESS) {
        if (i < srcTaskData.length && srcTaskData[i].state === TASK_STATE.IN_PROGRESS && data.id === srcTaskData[i].id) {
            data.implementation_date[data.implementation_date.length - 1].end = dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE_TIME);
            const sum_time = data.implementation_date.reduce(function (sum, element) {
                return sum + dayjs(element.end).diff(dayjs(element.start), 'hour');
            }, 0);
            // c.log(sum_time);
            data.implementation_time = sum_time;
        }
        // task_table.setValueFromCoords(data_template.find(template => template.member == "table_implementation_time").table_col_num, x2, 
    } return data;
});
const fillDefaultTaskData = taskDataProperties => taskDataRepository => {
    // c.log(taskDataProperties);
    // c.log(taskDataRepository);
    return taskDataRepository.map((data) => {
        return data.id === '' ? Object.fromEntries(Object.entries(taskDataProperties).map((obj) => { return [obj[0], obj[1].defaultValue] })) : data;
    })
};