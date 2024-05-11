


const string2ImplementationDate = source =>
(source.split("\n").map(row =>
    (startEnd => startEnd[0]!=="" ? ({ start: startEnd[0], end: (1 < startEnd.length ? startEnd[1] : "") }) : {})(row.split(/\s*-\s*/))
));

c.log("string2ImplementationDate()");
c.log(string2ImplementationDate(""));
// c.log("[]");
// c.log([]);
// c.log([].length);
// c.log("split");
// c.log("".split(/\s*-\s*/));
c.log("dayjs().tz(time_zone)");
c.log(dayjs().tz(time_zone));

const table2Repositories = jspreadsheetTimelineOutput.map(parent => {
    const target = repositories.value;
    const columns = Object.fromEntries(parent.jspreadsheetColumns.map((data, i) =>
        [data.title, Object.fromEntries(Object.entries(data).concat([["col_num", i]]))]));
    const taskUiProperties =
        Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
            ([key, Object.fromEntries(Object.entries(target.taskUiProperties[key]).map(([k, value]) => ([k, k === "header" ? columns[header].title : value])))])
        ));

    const tableTaskDataProperties = Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
        ([key, Object.fromEntries(Object.entries(target.tableTaskDataProperties[key]).map(([k, value]) => ([k, k === "read_only" ? columns[header]["readOnly"] : k === "width" || k === "col_num" ? columns[header][k] : value])))])
    ));
    const jspreadsheetTaskDataProperties = Object.fromEntries(Object.entries(parent.header2Key).map(([header, key]) =>
        ([key, Object.fromEntries(Object.entries(target.jspreadsheetTaskDataProperties[key]).map(([k, value]) => ([k, k === "type" || k === "source" || k === "options" ? columns[header][k] : value])))])
    ));
    const keys = Object.entries(columns).sort((a, b) => a[1].col_num - b[1].col_num).map(data => parent.header2Key[data[0]]);
    // c.log(keys);
    // c.log(taskDataProperties.value);
    // c.log(Object.fromEntries(
    //     Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] })
    // ));
    const taskDataRepository = parent.jspreadsheetData.map(data => {
        const buffer = Object.fromEntries(data.map((datum, i) => ([keys[i],
        keys[i] === "implementation_date" ? string2ImplementationDate(datum) : datum
        ])))
        // c.log(buffer);
        // if (buffer.id === "") return Object.fromEntries(Object.entries(taskDataProperties.value).map((obj) => { return [obj[0], obj[1].defaultValue] }));
        return buffer;
    }
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
    repositorySetter.next(data);
    return repositorySetter;
});

c.log("make start table");
repositorySetter.next(
    Object.fromEntries(
        Object.entries(repositories.value).map(
            ([key, value]) =>
                ([key, key === "taskDataRepository" ? insertTaskData(taskDataProperties.value)(repositories.value.taskDataRepository)(0) : value])
        )
    )

);
c.log("make start table finish");
