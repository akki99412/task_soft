// const c = console;
// isEqualObjectJson = (objectA) => (objectB) => (JSON.stringify(objectA)) === (JSON.stringify(objectB));

// const testFailString = (subject) => `失敗: ${subject}`;
// const reason = (reason) => `理由: ${reason}`;
// const explanation = (explanation) => `説明:${explanation}`;
// // const category = (category) => `分類:${category}`;

// const cGroupe = group => string => func => {
//     group(string);
//     func();
//     c.groupEnd();
// }

// const requirement = (group = c.group) => (requirement) => func =>
//     cGroupe(group)(`要求: ${requirement}`)(func);
// const category = (group = c.group) => category => func =>
//     cGroupe(group)(`<${category}>`)(func);

// const spec = spec => (`仕様: ${spec}`);
/*
requirement(c.group)("要求")(_ => {
    c.log(reason("理由"));
    c.log(explanation("説明"));
    category(c.group)("shiftable無しで実行できる")(_ => {
        (_ => {
            c.log(spec("仕様"));
            const left = 1 + 2;
            const right = 3;
            c.assert(left === right, { left, right });
        })();
    });
});
*/
requirement(c.group)("モナド測を満たす演算子を定義できる")(_ => {
    c.log(reason("関数をチェーンして計算したいから"));
    c.log(explanation(""));
    category()("")(_ => {
        (_ => {
            c.log(spec("return x >>= f == f x"))
            const x = 0
            const func = (x) => Timeline.create()(x * 2);
            const left = Timeline.create()(x).bind(func);
            const right = func(x);
            c.assert(JSON.stringify(left) === JSON.stringify(right), { left, right });
        })();

        (_ => {
            c.log(spec("m >>= return == m"))
            const m = _ => Timeline.create()(0);
            const left = m().bind(Timeline.create());
            const right = m();
            c.assert(JSON.stringify(left) === JSON.stringify(right), { left, right });
        })();

        (_ => {
            c.log(spec("(m >>= f) >>= g == m >>= (\\x -> f x >>= g)"))
            const m = Timeline.create()(0);
            const f = (x) => Timeline.create()(x * 2);
            const g = (x) => Timeline.create()(x + 2);
            const left = (m.bind(f)).bind(g);
            const right = m.bind((x) => f(x).bind(g));
            c.assert(JSON.stringify(left) === JSON.stringify(right), { left, right });
        })();
    });
});


requirement()("関手測を満たす演算子を定義できる")(_ => {
    c.log(reason("関数をチェーンして計算したいから"));
    c.log(explanation(""));
    category()("")(_ => {
        c.log(spec("fmap id = id"));
        const m = () => Timeline.create()(0);
        const id = x => x;
        const left = m().map(id);
        const right = id(m());
        c.assert(isEqualObjectJson(left, right), { left, right });
    });
    category()("")(_ => {
        c.log(spec("fmap (f . g) = fmap f . fmap g"));
        const m = () => Timeline.create()(0);
        const f = x => x + 1;
        const g = x => x * 2;
        const left = m().map(x => g(f(x)));
        const right = m().map(f).map(g);
        c.assert(isEqualObjectJson(left)(right), { left, right });
    });
});

requirement(c.group)("値を記録できる")(_ => {
    c.log(reason(""));
    c.log(explanation(""));
    category(c.group)("")(_ => {
        c.log(spec("仕様"));
        const x = 0;
        const left = Timeline.create()(x).value;
        const right = x;
        c.assert(left === right, { left, right });
    });
});

requirement(c.group)("bindでtimelineAとある関数でtimelineBを接続できること。timelineAが変化したらtimelineBも変化する")(_ => {
    c.log(reason(""));
    c.log(explanation(""));
    category()("")(_ => {
        c.log(spec("bind関数で接続できる"));
        const x = 0;
        const f = x => Timeline.create()(x + 2);
        const timelineA = Timeline.create()(x);
        const timelineB = timelineA.bind(f);
        c.log(spec("timelineAとtimelineBの関係が保たれている"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineAの内容を変えられる"));
        const y = 1;
        try {
            timelineA.next(y);
        } catch {
            c.assert(false);
        }
        c.log(spec("timelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
    });
});

requirement(c.group)("bindでtimelineAと複数のtimelineを接続できる")(_ => {
    c.log(reason(""));
    c.log(explanation(""));
    category()("")(_ => {
        c.log(spec("bind関数で接続できる"));
        const x = 0;
        const f = x => Timeline.create()(x + 2);
        const g = x => Timeline.create()(x * 2);
        const timelineA = Timeline.create()(x);
        const timelineB = timelineA.bind(f);


        c.log(spec("bind関数で追加で接続できる"));
        const timelineC = timelineA.bind(g);
        c.log(spec("timelineAとtimelineBの関係が保たれている"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();

        c.log(spec("timelineAとtimelineCの関係が保たれている"));
        (_ => {

            const left = timelineC.value;
            const right = g(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineAの内容を変えられる"));
        const y = 1;
        try {
            timelineA.next(y);
        } catch {
            c.assert(false);
        }
        c.log(spec("timelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineAとtimelineCの関係が保たれている"));
        (_ => {

            const left = timelineC.value;
            const right = g(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
    });
});
requirement(c.group)("timelineを数珠繋ぎにできる")(_ => {
    c.log(reason(""));
    c.log(explanation(""));
    category()("")(_ => {
        c.log(spec("bind関数で接続できる"));
        const x = 0;
        const f = x => Timeline.create()(x + 2);
        const g = x => Timeline.create()(x * 2);

        const timelineA = Timeline.create()(x);
        const timelineB = timelineA.bind(f);


        c.log(spec("bind関数で追加で接続できる"));
        const timelineC = timelineB.bind(g);
        c.log(spec("timelineAとtimelineBの関係が保たれている"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();

        c.log(spec("timelineBとtimelineCの関係が保たれている"));
        (_ => {

            const left = timelineC.value;
            const right = g(timelineB.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineAの内容を変えられる"));
        const y = 1;
        try {
            timelineA.next(y);
        } catch {
            c.assert(false);
        }
        c.log(spec("timelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineBとtimelineCの関係が保たれている"));
        (_ => {

            const left = timelineC.value;
            const right = g(timelineB.value).value;
            c.assert(left === right, { left, right });
        }
        )();
    });
});

requirement(c.group)("undo、redoできる")(_ => {
    c.log(reason(""));
    c.log(explanation(""));
    category()("undo")(_ => {
        const x = 0;
        const f = x => Timeline.create()(x + 2);
        const timelineA = Timeline.create(100)(x);
        const timelineB = timelineA.bind(f)
        c.log(spec("timelineAの内容を変えられる"));
        const y = 1;
        
        try {
            timelineA.next(y);
        } catch {
            c.assert(false);
        }
        c.log(spec("timelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("timelineAの内容を複数回変えられる"));
        const z = 2;
        try {
            timelineA.next(z);
        } catch {
            c.assert(false);
        }
        c.log(spec("timelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("これまでの変更履歴が保存される"));
            (_ => {
                const left = timelineA.values;
                const right = [x, y, z];
                c.assert(isEqualObjectJson(left, right), { left, right });
            })();
        c.log(spec("直前と同じ内容を追加できる"));

        try {
            timelineA.next(z);
        } catch {
            c.assert(false);
        }
        c.log(spec("変更履歴には追加されない"));

        (_ => {
            const left = timelineA.values;
            const right = [x, y, z];
            c.assert(isEqualObjectJson(left, right), { left, right });
        })();
        c.log(spec("undoできる"));
        (_ => {
            const left = timelineA.undo().value;
            const right = y;
            c.assert(left === right, { left, right });
        })();
        c.log(spec("undo後もtimelineAの内容が変わってもtimelineBとの関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("入力回数以上のundoでエラーになる"));
        (_ => {
            timelineA.undo();
            try {
                timelineA.undo();
                c.assert(false, timelineA);
            } catch {
                
            }
        })();
    });
    category()("redo")(_ => {
        const x = 0;
        const f = x => Timeline.create()(x + 2);
        const timelineA = Timeline.create(100)(x);
        const timelineB = timelineA.bind(f);
        const y = 1;
        try {
            timelineA.next(y);
        } catch {
            c.assert(false);
        }
        const z = 2;
        try {
            timelineA.next(z);
        } catch {
            c.assert(false);
        }
        timelineA.undo();
        timelineA.undo();
        c.log(spec("redoできる"));
        try {
            timelineA.redo();
        } catch {
            c.assert(false);
        }
        c.log(spec("redoの後もtimeline同士の関係が保たれる"));
        (_ => {

            const left = timelineB.value;
            const right = f(timelineA.value).value;
            c.assert(left === right, { left, right });
        }
        )();

        c.log(spec("undoの後にtimelineを変化させたらredoできなくなる"));
        timelineA.next(x);
        try {
            timelineA.redo();
            c.assert(false, timelineA);
        } catch {
        }

        c.log(spec("valuesLengthサイズより多くログを持たない"));
        timelineA.next(x);
        try {
            timelineA.redo();
            c.assert(false, timelineA);
        } catch {
        }
    });
    category()("valuesLengthサイズより多くログを持たない")(_ => {
        const x = 0;
        const timelineA = Timeline.create(3)(x);
        c.log(spec("valuesLengthサイズより多くnextできる"));
        try {
            [1, 2, 3, 4, 5].forEach(value => timelineA.next(value));
        } catch {
            c.assert(false, timelineA);
        }
        c.log(spec("undoできること"));
        try {
            timelineA.undo();
        } catch(e) {
            c.assert(false, {e, timelineA});
        }
        c.log(spec("undo後の値が正しいこと"));
        (_ =>{
            const left = timelineA.value;
            const right = 4;
            c.assert(left === right, { left, right });
        }
        )();
        c.log(spec("undoした回数がvalueLengthを超えるとエラーになる"))
        timelineA.undo();
        timelineA.undo();
        try {
            timelineA.undo();
            c.assert(false, timelineA);
        } catch {
            
        }

    });
    category()("データの更新前後にtimelineの更新処理を設定できる")(_ => {
        let logList = [];
        const timelineA = Timeline.create()(1);
        const logA = timelineA.map(parent =>logList.push({timeline: "timelineA", value: parent}));
        const timelineB = timelineA.map(parent => parent * 2);
        const logB = timelineB.map(parent => logList.push({ timeline: "timelineB", value: parent }));
        const timelineAIsResolved = Timeline.create()(true);
        const logResolved = timelineAIsResolved.map(parent => {
            return logList.push({ timeline: "timelineAIsResolved", value: parent })
        });

        c.log(spec("変更前に更新されるtimelineを設定できること"));
        try {
            timelineA.lateBeforeMap(parent => false)(timelineAIsResolved);
        } catch (e) {
            c.assert(false, { e, timelineA, timelineAIsResolved });
        }
        c.log(spec("変更後に更新されるtimelineを設定できること"));
        try {
            timelineA.lateAfterMap(parent => true)(timelineAIsResolved);
        } catch (e) {
            c.assert(false, { e, timelineA, timelineAIsResolved });
        }
        logList = [];
        c.log(spec("変更前後の処理が正しい順番で動作すること"));
        timelineA.next(2);
        const left = [
            { timeline: "timelineAIsResolved", value: false },
            { timeline: "timelineA", value: 2 },
            { timeline: "timelineB", value: 4 },
            { timeline: "timelineAIsResolved", value: true },
        ];
        c.assert(isEqualObjectJson(left)(logList), {logList, timelineA});
        


    })
});
