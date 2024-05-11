// const c = console;



const testFailString = (subject) => `失敗: ${subject}`;
const reason = (reason) => `理由: ${reason}`;
const explanation = (explanation) => `説明:${explanation}`;
// const category = (category) => `分類:${category}`;

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

//テストのひな形
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
