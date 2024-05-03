const implementationDate2String = implementation_date => {
    const stringifyList = implementation_date.map((data) => {
        return data.start + " - " + data.end
    });
    const dst = stringifyList.join("\n");
    return dst;
}

c.log("make start table");
repositories.next(
    Object.fromEntries(
        Object.entries(repositories.value).map(
            ([key, value]) =>
                ([key, key === "taskDataRepository" ? insertTaskData(taskDataProperties.value)(repositories.value.taskDataRepository)(0) : value])
        )
    )

);
c.log("make start table finish");

// const taskDataTableSetter = Timeline.create()(header => taskData => taskData
//     .map(taskDatum =>
//         header.map(key =>
//             key !== "implementation_date" ?
//                 taskDatum[key] :
//                 implementationDate2String(taskDatum[key])
//         )
//     )
// )
//     .apply(tableHeaderKeys)
//     .apply(taskDataRepository.getter);



// const jspreadsheetColumnsSetter = Timeline.create()(
//     headerKeys => taskUi => tableTaskData => jspreadsheetTaskDataProperties =>
//         headerKeys.map(
//             data => ({
//                 title: taskUi[data].header,
//                 width: tableTaskData[data].width,
//                 readOnly: tableTaskData[data].read_only,
//                 type: jspreadsheetTaskDataProperties[data].type,
//                 editor: jspreadsheetTaskDataProperties[data].editor,
//                 source: jspreadsheetTaskDataProperties[data].source,
//                 options: jspreadsheetTaskDataProperties[data].options,
//             }))
// )
//     .apply(tableHeaderKeys)
//     .apply(taskUiProperties.getter)
//     .apply(tableTaskDataProperties.getter)
//     .apply(jspreadsheetTaskDataProperties.getter);


const repositories2Table = repositories.map(parent => {
    const tableHeaderKeys = Object.entries(parent.tableTaskDataProperties)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.col_num - b.value.col_num)
        .map(parent => parent.key);
    // c.log(tableHeaderKeys);
    const jspreadsheetColumns = tableHeaderKeys.map(key => ({
        title: parent.taskUiProperties[key].header,
        width: parent.tableTaskDataProperties[key].width,
        readOnly: parent.tableTaskDataProperties[key].read_only,
        type: parent.jspreadsheetTaskDataProperties[key].type,
        editor: parent.jspreadsheetTaskDataProperties[key].editor,
        source: parent.jspreadsheetTaskDataProperties[key].source,
        options: parent.jspreadsheetTaskDataProperties[key].options,
    }));
    // c.log(jspreadsheetColumns);
    const jspreadsheetData = parent.taskDataRepository
        .map(taskDatum =>
            tableHeaderKeys.map(key =>
                key !== "implementation_date" ?
                    taskDatum[key] :
                    implementationDate2String(taskDatum[key])
            )
        )
    // c.log(taskData);
    const header2Key = Object.fromEntries(Object.entries(parent.taskUiProperties).map(([key, value]) => ([value.header, key])))

    const destination = { jspreadsheetColumns, jspreadsheetData, header2Key };
    return destination;
});

loggerTimelines.push(
    repositories2Table.map(a => { c.groupCollapsed("repositories2Table"); c.log(a); c.groupEnd(); return a })
);