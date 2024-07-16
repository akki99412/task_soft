// const localStorageGetter = encryptTimelineGetter.map(parent => parent);

// c.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));

const localStorageGetter = Timeline.create()({});
getLocalStorage2Timeline = timeline =>
    timeline.next(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
getLocalStorage2Timeline(localStorageGetter);
loggerTimelines.push(
    localStorageGetter.map(a => { c.groupCollapsed("localStorageGetter"); c.log(a); c.groupEnd(); return a })
);
const decryptTimelineGetter = Timeline.create()(null);
const decryptTimelineSetter = Timeline.create()(secretKey => async parent => {
    if (secretKey !== null && parent !== undefined && 'data' in parent) {
        const buffer = await decryptString(secretKey, parent);
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
{
    const buffer = JSON.parse(parent);
    if(buffer!==null){
        repositorySetter.next(buffer);

    }
    return buffer;
}
);
loggerTimelines.push(
    parseJson2repositories.map(a => { c.groupCollapsed("parseJson2repositories"); c.log(a); c.groupEnd(); return a })
);
