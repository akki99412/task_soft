const implementationDate2String = implementation_date => {
    // c.log(implementation_date);
    const stringifyList = implementation_date.map((data) => {
        if (data.start === undefined) return "";
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