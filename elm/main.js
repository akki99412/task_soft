
const init = _ => _;
const view = _ => _;
const update = _ => _ => _;
const render = table => gantt => calendar => kanban => view => view;
const main = new ElmLike({ init, view, update, render: render(table)(gantt)(calendar)(kanban) });