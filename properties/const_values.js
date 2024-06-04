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

const boardList = [
    {
        "id": "SCHEDULED",
        "title": "計画中",
        "item": [
        ]
    },
    {
        "id": "SCHEDULED_TODAY",
        "title": "今日の予定",
        "item": [
        ]
    },
    {
        "id": "IN_PROGRESS",
        "title": "実施中",
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
        "title": "完了",
        "item": [
        ]
    },
    {
        "id": "POSTPONEMENT",
        "title": "延期",
        "item": [
        ]
    },
];