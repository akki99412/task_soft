
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
