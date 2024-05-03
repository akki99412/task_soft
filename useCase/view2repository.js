


const string2ImplementationDate = source =>
    (source.split("\n").map(row => (startEnd => ({ start: startEnd[0], end: 1 < startEnd.length ? startEnd[1] : "" }))(row.split(/\s*-\s*/))));


const table2Repositories = jspreadsheetTimelineOutput.map(parent => {
    const target = repositories.value;
    const columns = Object.fromEntries(parent.jspreadsheetColumns.map((data, i) =>
        [data.title, Object.fromEntries(Object.entries(data).concat([["col_num", i]]))]));
    const taskUiProperties =
        Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
            ([key, Object.fromEntries(Object.entries(target.taskUiProperties[key]).map(([k, value])=>([k,k==="header"?columns[header].title:value])))])
    ));

    const tableTaskDataProperties = Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
        ([key, Object.fromEntries(Object.entries(target.tableTaskDataProperties[key]).map(([k, value]) => ([k, k === "read_only" ? columns[header]["readOnly"] :k === "width"  || k === "col_num" ? columns[header][k] : value])))])
    ));
    const jspreadsheetTaskDataProperties = Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
        ([key, Object.fromEntries(Object.entries(target.jspreadsheetTaskDataProperties[key]).map(([k, value]) => ([k, k === "type" || k === "source" || k === "options" ? columns[header][k] : value])))])
    ));
    const keys = Object.entries(columns).sort((a, b) => a[1].col_num - b[1].col_num).map(data => parent.header2Key[data[0]]);
    // c.log(keys);
    const taskDataRepository = parent.jspreadsheetData.map(data =>
        Object.fromEntries(data.map((datum, i) => ([keys[i],
            keys[i] === "implementation_date" ? string2ImplementationDate(datum) :datum
        ])))
    );

    return {
        taskUiProperties,
        tableTaskDataProperties,
        jspreadsheetTaskDataProperties,
        taskDataRepository,
    };
}
);

loggerTimelines.push(
    table2Repositories.map(a => { c.groupCollapsed("table2Repositories"); c.log(a); c.groupEnd(); return a })
);
table2Repositories.bind(data => {
    repositories.next(data);
    return repositories;
});

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
// c.log(isEqualObjectJson(repositories.value)(table2Repositories.value));
// c.assert(isEqualObjectJson(repositories.value.taskUiProperties)(table2Repositories.value.taskUiProperties), [JSON.stringify(repositories.value.taskUiProperties),JSON.stringify(table2Repositories.value.taskUiProperties)]);
// c.assert(isEqualObjectJson(repositories.value.tableTaskDataProperties)(table2Repositories.value.tableTaskDataProperties), [JSON.stringify(repositories.value.tableTaskDataProperties),JSON.stringify(table2Repositories.value.tableTaskDataProperties)]);
// c.assert(isEqualObjectJson(repositories.value.jspreadsheetTaskDataProperties)(table2Repositories.value.jspreadsheetTaskDataProperties), [JSON.stringify(repositories.value.jspreadsheetTaskDataProperties),JSON.stringify(table2Repositories.value.jspreadsheetTaskDataProperties)]);
// c.assert(isEqualObjectJson(repositories.value.taskDataRepository)(table2Repositories.value.taskDataRepository), [JSON.stringify(repositories.value.taskDataRepository), JSON.stringify(table2Repositories.value.taskDataRepository)]);
// c.log(JSON.stringify(repositories.value.taskDataRepository));
// c.log(JSON.stringify(table2Repositories.value.taskDataRepository));
// loggerTimelines.push(jspreadsheetColumns.bind(columns => {
//     let destination = taskUiProperties.value;
//     jspreadsheetHeaders2keys.value.forEach((key, i) => {
//         const source = data[i];
//         destination[key].header = source.title;
//     });
//     return taskUiProperties.next(destination);
// }).map(a => { c.groupCollapsed("return tableTaskDataProperties"); c.log(a); c.groupEnd(); return a; })
// );


// loggerTimelines.push(jspreadsheetColumns.bind(data => {
//     let destination = ((tableTaskDataProperties.value));
//     jspreadsheetHeaders2keys.value.forEach((key, i) => {
//         const source = data[i];
//         destination[key].width = source.width;
//         destination[key].read_only = source.readOnly;
//     });
//     return tableTaskDataProperties.next(destination);
// })
// );

// loggerTimelines.push(jspreadsheetColumns.bind(data => {
//     let destination = ((tableTaskDataProperties.value));
//     jspreadsheetHeaders2keys.value.forEach((key, i) => {
//         const source = data[i];
//         destination[key].type = source.type;
//         destination[key].editor = source.editor;
//         destination[key].source = source.source;
//         destination[key].options = source.options;
//     });
//     return jspreadsheetTaskDataProperties.next(destination);
// })
// );



// loggerTimelines.push(taskDataTable.bind(data => {
//     c.log(data);
//     const destination = data.map(row =>
//         Object.fromEntries(row.map((datum, i) =>
//             [jspreadsheetHeaders2keys.value[i],
//             jspreadsheetHeaders2keys.value[i] !== "implementation_date" ? datum : string2ImplementationDate(datum)])
//         )
//     );
//     c.log(taskDataTable);
//     c.log(destination);
//     c.log(taskDataRepository.value);
//     c.log(isEqualObjectJson(destination)(taskDataRepository.value));
//     return taskDataRepository
//     .next(destination)
//     ;
// })

// );

// c.log("make start table");
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// c.log("make start table finish");

