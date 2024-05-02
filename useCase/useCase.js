
// c.log("make start table");
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
// c.log("make start table finish");

// const implementationDate2String = implementation_date => {
//     const stringifyList = implementation_date.map((data) => {
//         return data.start + " - " + data.end
//     });
//     const dst = stringifyList.join("\n");
//     return dst;
// }



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


// loggerTimelines.push(tableHeaderKeys.map(a => { c.groupCollapsed("tableHeaderKeys"); c.log(a); c.groupEnd(); return a; }));
// loggerTimelines.push(taskDataTableSetter.map(a => { c.groupCollapsed("taskDataTableSetter"); c.log(a); c.groupEnd(); return a; }));
// loggerTimelines.push(jspreadsheetColumnsSetter.map(a => { c.groupCollapsed("jspreadsheetColumnsSetter"); c.log(a); c.groupEnd(); return a; }));



