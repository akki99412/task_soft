const delayRepository = repositories.map(parent => parent);
loggerTimelines.push(
    delayRepository.map(a => { c.groupCollapsed("delayRepository"); c.log(a); c.groupEnd(); return a })
);
const repositoriesStringify2Json = delayRepository.map(parent => parent);
loggerTimelines.push(
    repositoriesStringify2Json.map(a => { c.groupCollapsed("repositoriesStringify2Json"); c.log(a); c.groupEnd(); return a })
);
const encryptTimeline = repositoriesStringify2Json.map(parent => parent);
loggerTimelines.push(
    encryptTimeline.map(a => { c.groupCollapsed("encryptTimeline"); c.log(a); c.groupEnd(); return a })
);
const localStorageSetter = encryptTimeline.map(parent => parent);
loggerTimelines.push(
    localStorageSetter.map(a => { c.groupCollapsed("localStorageSetter"); c.log(a); c.groupEnd(); return a })
);






// const localStorageSetter = repositories.bind(async parent => {
//     clearTimeout(timeoutID);
//     // console.log(task_table.getJson());
//     // console.log(data_template[0]);
//     // console.log(data_template);
//     // console.log(data_base);
//     localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
//         JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_template))));
//     localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
//         JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_base))));
//     console.log("saved!");
//     console.log(JSON.stringify(data_base));
//     return parent
// }
// );



// const localStorageGetter