class IKanbanData {
    constructor({ boards = null, } = {}) {
        this.boards = boards;
    }
}

class KanbanMessage extends IKanbanData {
    constructor(value) {
        super(value);
    }
}
class KanbanView extends IKanbanData {
    constructor(value) {
        super(value);
    }
}

class IKanbanBoardData {
    constructor({ id = null, title = null, classes = null, item = null, order = null } = {}) {
        this.id = id;
        this.title = title;
        this.classes = classes;
        this.item = item;
        this.order = order;
    }
}

class KanbanBoardMessage {
    constructor({ el=null } = {}) {
        this.el = el;
    }
}
class KanbanBoardView extends IKanbanBoardData {
    constructor(value) {
        super(value);
    }
}
class IKanbanItemData {
    constructor({ id = null, title = null, classes = null, } = {}) {
        this.id = id;
        this.title = title;
        this.classes = classes;
    }
}


class KanbanItemMessage {
    constructor({ el=null }={}) {
        this.el = el;
    }
}
class KanbanItemView extends IKanbanItemData {
    constructor(value) {
        super(value);
    }
}
// カンバンに表示されるカラムやカードを定義

const dataContent = [
    {
        "id": "SCHEDULED",
        "title": TASK_STATE.SCHEDULED,
        "class": "orange",
        "item": [
            {
                "id": "item-id-1",
                "title": "AAA",
                "class": "todo"
            },
            {
                "id": "item-id-2",
                "title": "BBB",
                "class": "todo,orange",
            }
        ]
    },
    {
        "id": "SCHEDULED_TODAY",
        "title": TASK_STATE.SCHEDULED_TODAY,
        "class": "red",
        "item": [
        ]
    },
    {
        "id": "IN_PROGRESS",
        "title": TASK_STATE.IN_PROGRESS,
        "class": "blue",
        "item": [
            {
                "id": "item-id-3",
                "title": "<div class='item-title'>CCC</div><div class='item-body'><img src='https://i.imgur.com/b1dGytP.jpeg' /></div>",
                "class": "todo"
            }
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
        "class": "green,completed",
        "item": [
            {
                "id": "item-id-4",
                "title": "DDD",
                "class": "done"
            },
            {
                "id": "item-id-5",
                "title": "EEE",
                "class": "done"
            }
        ]
    },
    {
        "id": "POSTPONEMENT",
        "title": TASK_STATE.POSTPONEMENT,
        "item": [
        ]
    },
];
[

    {
        "id": "column-id-2",
        "title": "実行中",
        "class": "blue,in-progress",
        "item": [
        ]
    },
    {
        "id": "column-id-3",
        "title": "完了",
        "class": "green,completed",
        "item": [
            {
                "id": "item-id-4",
                "title": "DDD",
                "class": "done"
            },
            {
                "id": "item-id-5",
                "title": "EEE",
                "class": "done"
            }
        ]
    }
];
const elTest = (el) => {
    const kanbanItemMessage = new KanbanItemMessage({ id: el.dataset.eid, title: el.innerHTML, classes: el.dataset.class, });
    c.log(kanbanItemMessage);
    return kanbanItemMessage;
}
const boardTest = (el) => {
    // const kanbanItemMessage = new KanbanItemMessage({ id: el.dataset.eid, title: el.innerHTML, classes: el.dataset.class, });
    // c.log(kanbanItemMessage);
    // return kanbanItemMessage;
    // c.log({test:kanban.findBoard(el.dataset.id)});
    // c.log(kanban.getBoardElements(el.dataset.id));
    c.log("board list");
    c.log();
    const boardIds = Object.entries(TASK_STATE).map(([key, _]) => key);
    c.log(boardIds);
    const boardEls = boardIds.map((key) => kanban.findBoard(key));
    c.log(boardEls);
    const itemEls = boardIds.map((key) => kanban.getBoardElements(key));
    c.log(itemEls);
    const kanbanItems = itemEls.map(NodeList => {
        const boards = [...NodeList];
        return boards.map(el => ({ id: el.dataset.eid, title: el.innerHTML, classes: el.dataset.class, }));
    });
    c.log(kanbanItems);
    const boards = boardEls.map(el => ({ id: el.dataset.id, title: el.innerHTML }));
    c.log(boards);




    // c.log(kanban);
    return { el };
}
// ここで jKanban を実行する
const kanban = new jKanban({
    element: '#kanban-canvas',  // カンバンを表示する場所のID
    boards: dataContent,        // カンバンに表示されるカラムやカードのデータ
    gutter: '16px',             // カンバンの余白
    widthBoard: '250px',        // カラムの幅 (responsivePercentageの「true」設定により無視される)
    responsivePercentage: true, // trueを選択時はカラム幅は％で指定され、gutterとwidthBoardの設定は不要
    dragItems: true,            // trueを選択時はカードをドラッグ可能
    dragBoards: true,           // カラムをドラッグ可能にするかどうか

    // コールバック
    click: function (el) {
        // カードが左クリックされた時に実行
        // onKanbanItemClicked(el);
        // c.log(el);
        // c.log(elTest(el));
        // main.update(new KanbanItemMessage(el));
    },
    context: function (el, event) {
        // カードが右クリックされた時に実行
        // c.log({ el, event });
        // c.log(elTest(el));
    },
    dragEl: function (el, source) {
        // カードのドラッグが始まった時に実行
        // c.log({ el, source });
        // c.log(elTest(el));
    },
    dragendEl: function (el) {
        // カードがドラッグが終わった時に実行
        // c.log(el);
        // c.log(elTest(el));
    },
    dropEl: function (el, target, source, sibling) {
        // カードがドロップされたときに実行
        // onKanbanItemDropped(el, target, source, sibling);
        // c.log({ el, target, source, sibling });
        // c.log(elTest(el));
        main.update(new KanbanItemMessage({ el }));
    },
    dragBoard: function (el, source) {
        // カラムのドラッグを開始した時に実行
        // c.log({ el, source });
        // c.log(boardTest(el));
    },
    dragendBoard: function (el) {
        // カラムのドラッグが終わった時に実行
        // c.log(el);
        // c.log(boardTest(el));
        main.update(new KanbanBoardMessage({ el }));
    },
    buttonClick: function (el, boardId) {
        // ボタンがクリックされた時に実行
        // c.log({ el, boardId });
        // c.log(elTest(el));
    }
});

function onKanbanItemClicked(el) {
    showMessage('カード「' + el.innerText + '」が左クリックされました。');
}

function onKanbanItemDropped(el, target, source, sibling) {
    // 移動元カラムのタイトル
    const sourceTitle = source.parentNode.querySelector('header').innerText;
    // 移動元カラムのID
    const sourceId = source.parentNode.dataset.id;
    // 移動先カラムのタイトル
    const targetTitle = target.parentNode.querySelector('header').innerText;
    // 移動先カラムのID
    const targetId = target.parentNode.dataset.id;

    // 同じカラム内の移動か、それとも異なるカラム間の移動かを判別
    const sameColumn = (sourceId === targetId) ? true : false;

    // カラム内 or カラム間の移動によってメッセージを変える
    const alertMsg = (sameColumn) ?
        'カード「' + el.innerText + '」が、カラム『' + sourceTitle + '』内で移動しました。' :
        'カード「' + el.innerText + '」が、カラム『' + sourceTitle + '』からカラム『' + targetTitle + '』へ移動しました。';

    // メッセージを表示
    showMessage(alertMsg);

    // 異なるカラム間の移動なおかつ移動先カラムが「完了」の場合
    // カードのステータスを「done」にする。
    // 異なるカラム間の移動なおかつ移動先カラムが「完了」以外の場合
    // カードのステータスを「todo」にする。
    if (!sameColumn && targetTitle === '完了') {
        setKanbanItemStatus(el, 'done');
    } else if (!sameColumn && targetTitle !== '完了') {
        setKanbanItemStatus(el, 'todo');
    }

}

function setKanbanItemStatus(el, status) {
    // ステータスが「done」の場合は
    // カードの「todo」クラスを「done」に変更する。
    if (status === 'done') {
        el.classList.remove('todo');
        el.classList.add('done');
        // ステータスが「done」以外の場合は
        // カードの「done」クラスを「todo」に変更する。
    } else {
        el.classList.remove('done');
        el.classList.add('todo');
    }
}

function showMessage(msg) {
    // document.getElementById('show-message').innerHTML = msg;
    console.log(msg);
}

// カードに data-class= 属性が設定されていたら、
// その値を取得してクラス名に追加する。
// 今回はカンマ区切りで複数が設定されているので、
// まずは配列に変換してから処理する。
document.querySelectorAll('.kanban-item').forEach(item => {
    if (item.dataset.class) {
        const arrayClass = item.dataset.class.split(',');
        arrayClass.forEach(className => {
            item.classList.add(className);
        });
    }
});