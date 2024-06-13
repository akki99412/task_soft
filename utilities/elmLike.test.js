// const c = console;
// isEqualObjectJson = (objectA) => (objectB) => (JSON.stringify(objectA)) === (JSON.stringify(objectB));

const testFailString = (subject) => `失敗: ${subject}`;
const reason = (reason) => `理由: ${reason}`;
const explanation = (explanation) => `説明:${explanation}`;

const cGroupe = group => string => func => {
    group(string);
    func();
    c.groupEnd();
}

const requirement = (group = c.group) => (requirement) => func =>
    cGroupe(group)(`要求: ${requirement}`)(func);
const category = (group = c.group) => category => func =>
    cGroupe(group)(`<${category}>`)(func);

const spec = spec => (`仕様: ${spec}`);

//テンプレート
c.groupCollapsed("テンプレート");
requirement(c.group)("要求")(_ => {
    c.log(reason("理由"));
    c.log(explanation("説明"));
    category(c.group)("カテゴリー")(_ => {
        (_ => {
            c.log(spec("仕様"));
            const left = 1 + 2;
            const right = 3;
            c.assert(left === right, { left, right });
        })();
    });
});
c.groupEnd();

//テスト開始
requirement(c.group)("要求")(_ => {
    c.log(reason("理由"));
    c.log(explanation("説明"));
    category(c.group)("ElmLikeクラスについて")(_ => {
        {
            c.log(spec("init, view, update, renderの4つの関数を受け取れる"));
            try {
                const init = _ => _;
                const view = _ => _;
                const update = _ => _ => _;
                const render = _ => _;
                new ElmLike({ init, view, update, render });

            } catch (e) {
                c.assert(false);
            }
        }
        {
            c.log(spec("init, view, updateの3つの関数がないとエラー"));
            try {
                const init = _ => _;
                const view = _ => _;
                const update = _ => _ => _;
                const render = _ => _;
                new ElmLike({ render });

                c.assert(false);
            } catch (e) {
            }
        }
        {
            c.log(spec("init関数を実行するとmodelの中身がinit関数の戻り値が代入される"));
            const init = _ => "init";
            const view = _ => _;
            const update = _ => _ => _;
            const render = _ => _;
            const elmLike = new ElmLike({ init, view, update, render });

            elmLike.init();
            const left = init();
            const right = elmLike.model;
            c.assert(left === right, { left, right });
        }
        {
            c.log(spec("init関数を実行するとその戻り値がview関数に渡される"));
            let right = null;
            const init = _ => "init";
            const view = arg => right = "view" + arg;
            const update = _ => _ => _;
            const render = _ => _;
            const elmLike = new ElmLike({ init, view, update, render });

            elmLike.init();
            const left = view(init());
            // const right = elmLike.model;
            c.assert(left === right, { left, right });
        }
        {
            c.log(spec("update関数を実行すると第1引数にmodelが渡される"));
            let right = null;
            const init = _ => "init";
            const view = arg => "view" + arg;
            const update = model => __ => right = model;
            const render = _ => _;
            const elmLike = new ElmLike({ init, view, update, render });

            elmLike.init();
            elmLike.update();
            const left = init();
            c.assert(left === right, { left, right });
        }
        {
            c.log(spec("update関数を実行するとその戻り値がview関数に渡される"));
            let right = null;
            const init = _ => "init";
            const view = arg => right = arg;
            const update = _ => _ => "update";
            const render = _ => _;
            const elmLike = new ElmLike({ init, view, update, render });

            elmLike.init();
            elmLike.update();
            const left = (update()());
            // const right = elmLike.model;
            c.assert(left === right, { left, right });
        }
        {
            c.log(spec("view関数が実行されるとき、その戻り値がrenderに渡される"));
            let right = null;
            const init = _ => "init";
            const view = arg => "view" + arg;
            const update = _ => _ => "update";
            const render = value => right = value;
            const elmLike = new ElmLike({ init, view, update, render });

            elmLike.init();
            {
                const left = view(init());
                c.assert(left === right, { left, right });
            }
            elmLike.update();
            {
                const left = view(update()());
                c.assert(left === right, { left, right });
            }
        }
        {
            c.log(spec("render関数実行中にupdate関数が呼ばれても実行されない"));
            let isRender = false
            const functions = [];
            const init = _ => "init";
            const view = arg => "view" + arg;
            const update = _ => _ => {
                c.assert(!isRender);
                return "update";
            };
            const render = functions => value => {
                isRender = true;
                functions.forEach(value => value());
                isRender = false;
            }
            const elmLike = new ElmLike({ init, view, update, render: render(functions) });

            elmLike.init();
            elmLike.update();
        }
    });
});
