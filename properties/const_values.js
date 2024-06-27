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