const localStorageGetter = Timeline.create()("");
loggerTimelines.push(
    localStorageGetter.map(a => { c.groupCollapsed("localStorageGetter"); c.log(a); c.groupEnd(); return a })
);
const decryptTimeline = localStorageGetter.map(parent => parent);
loggerTimelines.push(
    decryptTimeline.map(a => { c.groupCollapsed("decryptTimeline"); c.log(a); c.groupEnd(); return a })
);
const parseJson2repositories = decryptTimeline.map(parent => parent);
loggerTimelines.push(
    parseJson2repositories.map(a => { c.groupCollapsed("parseJson2repositories"); c.log(a); c.groupEnd(); return a })
);