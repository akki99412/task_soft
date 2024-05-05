

let timeoutID = 0;
let secret_key = {};

const secretKeyTimeline = Timeline.create()(null);
(async _ => {
    if (secret_key_string === "") {
        let generated_key = await auto_generate_key();
        return generated_key;
    } else {
        return await import_secret_key(JSON.parse(secret_key_string));
    }
})().then(value => secretKeyTimeline.next(value));
loggerTimelines.push(
    secretKeyTimeline.map(a => { c.groupCollapsed("secretKeyTimeline"); c.log(a); c.groupEnd(); return a })
);


const delayRepositoryGetter = Timeline.create()({});
const delayRepositoryUpdate = value => _ =>
    delayRepositoryGetter.next(value);
const delayRepositorySetter = repositories.bind(async parent => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(delayRepositoryUpdate(parent), 1 * 1000);
    c.log(parent);
    c.log("reset timeoutID");
    return delayRepositoryGetter;
});
loggerTimelines.push(
    delayRepositoryGetter.map(a => { c.groupCollapsed("delayRepositoryGetter"); c.log(a); c.groupEnd(); return a })
);

const repositoriesStringify2Json = delayRepositoryGetter.map(parent =>
    JSON.stringify(parent)
);
loggerTimelines.push(
    repositoriesStringify2Json.map(a => { c.groupCollapsed("repositoriesStringify2Json"); c.log(a); c.groupEnd(); return a })
);

const encryptTimelineGetter = Timeline.create()();
const encryptTimelineSetter = Timeline.create()(secretKey => async parent => {
    c.log(parent);
    // c.log(secretKey);
    // c.log(repositories);
    // c.log(secretKey);
    // c.log(secretKey === null);
    if (secretKey !== null&&parent!=="{}") {
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





// const encryptTimelineSetter = repositoriesStringify2Json.map(async parent => {
//     c.log(secret_key);
//     await encrypt_string(secret_key, parent)
// }
// );
// const localStorageSetter = encryptTimeline.map(parent => parent);
// loggerTimelines.push(
//     localStorageSetter.map(a => { c.groupCollapsed("localStorageSetter"); c.log(a); c.groupEnd(); return a })
// );






(async parent => {
    clearTimeout(timeoutID);
    // console.log(task_table.getJson());
    // console.log(data_template[0]);
    // console.log(data_template);
    // console.log(data_base);
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_template))));
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_base))));
    console.log("saved!");
    console.log(JSON.stringify(data_base));
    return parent
}
);



// const localStorageGetter