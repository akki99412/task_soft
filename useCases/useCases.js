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
                key !== "implementation_date" ?
                    taskDatum[key] :
                    implementationDate2String(taskDatum[key])
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
                editor: jspreadsheetTaskDataProperties[key].editor,
                source: jspreadsheetTaskDataProperties[key].source,
                options: jspreadsheetTaskDataProperties[key].options,
            }));

const generateTableHeaderKeys = tableTaskDataProperties => Object.entries(tableTaskDataProperties)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.value.col_num - b.value.col_num)
    .map(parent => parent.key);

const generateHeader2Key = taskUiProperties => Object.fromEntries(Object.entries(taskUiProperties).map(([key, value]) => ([value.header, key])));