requirement(c.group)("データを保存")(_ => {
    c.log(reason("データを複数のUIで表示するため"));
    c.log(explanation(""));
    // 相互接続はやめました
    // requirement(c.group)("相互接続のtimelineが動作すること")(_ => {
    //     c.log(reason("管理を簡略化するため"));
    //     c.log(explanation(""));
    //     category()("")(_ => {
    //         (_ => {
    //             c.log(spec("相互接続のtimelineのデータが一致する"))
    //             const left = timeline.value.taskDataRepository;
    //             const right = taskDataRepository.value;
    //             c.assert(isEqualObjectJson(left)(right), { left, right });
    //         })();
    //         (_ => {
    //             c.log(spec("更新できる"))
    //             try {
    //                 taskDataRepository.next(insertTaskData(taskDataProperties.value)(taskDataRepository.value)(0));
    //             }
    //             catch {
    //                 c.assert(false, taskDataRepository);
    //             }
    //         })();
    //         (_ => {
    //             c.log(spec("更新後も一致する"))
    //             const left = timeline.value.taskDataRepository;
    //             const right = taskDataRepository.value;
    //             c.assert(isEqualObjectJson(left)(right), { left, right });
    //         })();
    //     });
    // });
    requirement(c.group)("tableHeaderのcolNumがかぶりなく割り振られていること")(_ => {
        c.log(reason("ソートして表示に使うため"));
        c.log(explanation(""));
        category()("")(_ => {
            (_ => {
                c.log(spec("かぶりないこと"));

                const left = Object.entries(repositories.value.tableTaskDataProperties).map(([_, value]) => value.col_num).length;
                const right = new Set(Object.entries(repositories.value.tableTaskDataProperties).map(([_, value]) => value.col_num)).size;
                c.assert(left === right, { left, right, repositories });
            })();
        });
    });
});