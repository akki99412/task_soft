class IGanttData {
    constructor({ id=null, name=null, start=null, end=null, progress=null, dependencies=null, custom_class=null,description=null } = {}) {
        this.id=id;
        this.name=name;
        this.start=start;
        this.end=end;
        this.progress=progress;
        this.dependencies=dependencies;
        this.custom_class = custom_class;
        this.description = description;
    }
}

class GanttMessage extends IGanttData {
    constructor(value) {
        super(value);
    }
}
class GanttView extends IGanttData {
    constructor(value) {
        super(value);
    }
}
// タスクを用意
let ganttTasks = [
    {
        id: 'id1',
        name: '確定申告する',
        description: '必ずやる!!',
        start: '2021-01-01',
        end: '2021-01-7',
        progress: 100,
        dependencies: "id2, id3"
    },
    {
        id: 'id2',
        name: 'クライアントに挨拶',
        description: '年賀状も確認した上で連絡する',
        start: '2021-01-4',
        end: '2021-01-8',
        progress: 100,
    },
    {
        id: 'id3',
        name: '請求書作成',
        description: 'みんなに稼働時間を記録してもらった上で請求を出す',
        start: '2021-01-5',
        end: '2021-01-6',
        progress: 40,
    },
    {
        id: 'id4',
        name: '案件A を開発',
        description: 'まずはフレームワークのアップデートやる!',
        start: '2021-01-5',
        end: '2021-01-11',
        progress: 50,
        dependencies: "id1",
    },
    {
        id: 'id5',
        name: 'フィードバック面談',
        description: '各メンバーシートを記入してもらった上で 1on1',
        start: '2021-01-12',
        end: '2021-01-16',
        progress: 20,
        dependencies: "id1",
    },
];

// gantt をセットアップ
var gantt = new Gantt("#gantt", ganttTasks, {
    // ダブルクリック時
    on_click: (task) => {
        main.update(new GanttMessage(task));
    },
    // 日付変更時
    on_date_change: (task, start, end) => {
        // console.log(`${task.name}: change date start: ${start} end: ${end}`);
        // c.log({ task, start, end });
        let data = new GanttMessage(task);
        data.start = start;
        data.end = end;
        main.update(new GanttMessage(data));
    },
    // 進捗変更時
    on_progress_change: (task, progress) => {
        // console.log(`${task.name}: change progress to ${progress}%`);
        // c.log({ task, progress });
        let data = new GanttMessage(task);
        data.progress = progress;
        main.update(new GanttMessage(data));
    },
    // on_double_click: (task) => {
    //   console.log("Double Click", task);
    // },
    // on_view_change: (mode) => {
    //   console.log("View Change", mode);
    // },
    // on_hover: (task, x, y) => {
    //   console.log("Hover", x, y);
    // },
    readonly: false,
});
