

// loggerTimelines.push(jspreadsheetColumns.bind(data => {
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

// const string2ImplementationDate = source =>
// (source.split("\n").map(row => (startEnd => ({ start: startEnd[0], end: 1 < startEnd.length ? startEnd[1] : "" }))(row.split(/\s*-\s*/))));


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

