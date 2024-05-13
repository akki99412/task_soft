

let timeoutID = 0;

const delayRepositoryGetter = Timeline.create()({});
const delayRepositoryUpdate = value => 
    delayRepositoryGetter.next(value);
const delayRepositorySetter = repositories.map(parent => {
    clearTimeout(timeoutID);
    return new Promise(resolve => {
        timeoutID = setTimeout(_ => {
            delayRepositoryUpdate(parent);
            c.log("reset timeoutID");
            resolve(delayRepositoryGetter);
        },
            saveTime * 1000);
        // c.log(parent);
    })
});
loggerTimelines.push(
    delayRepositoryGetter.map(a => { c.groupCollapsed("delayRepositoryGetter"); c.log(a); c.groupEnd(); return a })
);
loggerTimelines.push(
    delayRepositorySetter.map(a => { c.group("delayRepositorySetter"); c.log(a); c.groupEnd(); return a })
);

const repositoriesStringify2Json = delayRepositoryGetter.map(parent =>
    JSON.stringify(parent)
);
loggerTimelines.push(
    repositoriesStringify2Json.map(a => { c.groupCollapsed("repositoriesStringify2Json"); c.log(a); c.groupEnd(); return a })
);

const encryptTimelineGetter = Timeline.create()();
const encryptTimelineSetter = Timeline.create()(secretKey => async parent => {
    // c.log(parent);
    // c.log(secretKey);
    // c.log(repositories);
    // c.log(secretKey);
    // c.log(secretKey === null);
    if (secretKey !== null && parent !== "{}") {
        const buffer = await encrypt_string(secretKey, parent);
        encryptTimelineGetter.next(buffer);
        return buffer;
    } else {
        return null;
    }
}
)
    .apply(secretKeyTimeline)
    .apply(repositoriesStringify2Json);
loggerTimelines.push(
    encryptTimelineSetter.map(a => { c.groupCollapsed("encryptTimelineSetter"); c.log(a); c.groupEnd(); return a })
);
loggerTimelines.push(
    encryptTimelineGetter.map(a => { c.groupCollapsed("encryptTimelineGetter"); c.log(a); c.groupEnd(); return a })
);


const localStorageSetter = encryptTimelineGetter.map(parent => {
    const buffer = JSON.stringify(parent);
    if (parent !== undefined) {
        localStorage.setItem(LOCAL_STORAGE_KEY,
            buffer);
    }
    // c.log(localStorage.getItem(LOCAL_STORAGE_KEY));
    c.log("saved!!")
    return buffer

});
loggerTimelines.push(
    localStorageSetter.map(a => { c.groupCollapsed("localStorageSetter"); c.log(a); c.groupEnd(); return a })
);


