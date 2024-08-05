const DEFAULT_FORMAT = Object.freeze({
    DATE: "YYYY/MM/DD",
    TIME: "HH:mm:ss",
    get DATE_TIME() { return this.DATE + " " + this.TIME },
});

const TASK_STATE = Object.freeze({
    SCHEDULED: "計画中",
    SCHEDULED_TODAY: "今日の予定",
    IN_PROGRESS: "実施中",
    // COMPLETED_TODAY: "今日完了",
    COMPLETED: "完了",
    POSTPONEMENT: "延期",
});

const LOCAL_STORAGE_KEY = "repositories";

const saveTime = 3;//second

const stringDataFilterOption = Object.freeze({
    equal: { value: "一致", checkFiltered: filter => data => filter === data },
    notEqual: { value: "一致しない", checkFiltered: filter => data => filter !== data },
    regex: { value: "正規表現", checkFiltered: filter => data => new RegExp(filter, "g").test(data) },
});
const numericDataFilterOption = Object.freeze({
    equal: { value: "一致", checkFiltered: filter => data => parseInt(filter, 10) === parseInt(data,10) },
    notEqual: { value: "一致しない", checkFiltered: filter => data => parseInt(filter, 10) !== parseInt(data, 10) },
    over: { value: "以上", checkFiltered: filter => data => parseInt(filter, 10) <= parseInt(data, 10) },
    under: { value: "以下", checkFiltered: filter => data => parseInt(filter, 10) >= parseInt(data, 10) },
});
const dateAndTimeDataFilterOption = Object.freeze({
    equal: { value: "一致", checkFiltered: filter => data => filter === data },
    notEqual: { value: "一致しない", checkFiltered: filter => data => filter === data },
    after: { value: "以前", checkFiltered: filter => data => dayjs(filter).isValid()?dayjs(filter).isSameOrAfter(dayjs(data)):false },
    before: { value: "以降", checkFiltered: filter => data => dayjs(filter).isValid()?dayjs(filter).isSameOrBefore(dayjs(data)):false },
});
const stateFilterOption = Object.freeze({
    equal: { value: "一致", checkFiltered: filter => data => filter === data },
    notEqual: { value: "一致しない", checkFiltered: filter => data => filter === data },
    regex: { value: "正規表現", checkFiltered: filter => data => new RegExp(filter, "g").test(data) },
});


const boardList = [
    {
        "id": "SCHEDULED",
        "title": TASK_STATE.SCHEDULED,
        "item": [
        ]
    },
    {
        "id": "SCHEDULED_TODAY",
        "title": TASK_STATE.SCHEDULED_TODAY,
        "item": [
        ]
    },
    {
        "id": "IN_PROGRESS",
        "title": TASK_STATE.IN_PROGRESS,
        "item": [
        ]
    },
    // {
    //     "id": "// COMPLETED_TODAY",
    //     "title": "今日完了",
    //     "class": "red,waiting",
    //     "item": [
    //     ]
    // },
    {
        "id": "COMPLETED",
        "title": TASK_STATE.COMPLETED,
        "item": [
        ]
    },
    {
        "id": "POSTPONEMENT",
        "title": TASK_STATE.POSTPONEMENT,
        "item": [
        ]
    },
];

const HISTORY_LENGTH = 100;