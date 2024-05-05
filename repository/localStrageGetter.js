const localStorageGetter = encryptTimelineGetter.map(parent => parent);

// const localStorageGetter = Timeline.create()("");
loggerTimelines.push(
    localStorageGetter.map(a => { c.groupCollapsed("localStorageGetter"); c.log(a); c.groupEnd(); return a })
);
const decryptTimelineGetter = Timeline.create()(null);
// const decryptTimelineSetter = localStorageGetter.map(async parent =>{
//     const buffer = await decrypt_string(secret_key, parent);
//     decryptTimelineGetter.next(buffer);
//     return buffer;
// }
// );
const decryptTimelineSetter = Timeline.create()(secretKey => async parent => {
    if (secretKey !== null && parent !== undefined && 'data' in parent) {
        const buffer = await decrypt_string(secretKey, parent);
        decryptTimelineGetter.next(buffer);
        return buffer;
    } else {
        return null;
    }
}
)
    .apply(secretKeyTimeline)
    .apply(localStorageGetter);

loggerTimelines.push(
    decryptTimelineSetter.map(a => { c.groupCollapsed("decryptTimelineSetter"); c.log(a); c.groupEnd(); return a })
);

loggerTimelines.push(
    decryptTimelineGetter.map(a => { c.groupCollapsed("decryptTimelineGetter"); c.log(a); c.groupEnd(); return a })
);
const parseJson2repositories = decryptTimelineGetter.map(parent =>
    JSON.parse(parent));
loggerTimelines.push(
    parseJson2repositories.map(a => { c.groupCollapsed("parseJson2repositories"); c.log(a); c.groupEnd(); return a })
);

parseJson2repositories.map(parent => {
    c.log(parent);
    c.log(repositories.value);
    try{
    c.log(isEqualObjectJson(parent.taskUiProperties)(repositories.value.taskUiProperties));

    c.log(isEqualObjectJson(parent.tableTaskDataProperties)(repositories.value.tableTaskDataProperties));

    c.log(isEqualObjectJson(parent.jspreadsheetTaskDataProperties)(repositories.value.jspreadsheetTaskDataProperties));

        c.log(isEqualObjectJson(parent.taskDataRepository)(repositories.value.taskDataRepository));
        c.log(JSON.stringify(parent.taskDataRepository));
        c.log(JSON.stringify(repositories.value.taskDataRepository));
    } catch {
        
    }
    return parent;
});