class MainPresenter {
    constructor({ taskDataTemplateRepository = diContainer.container.taskDataTemplateRepository } = {} ) {
        this._taskDataTemplateRepository = taskDataTemplateRepository;
        this._spreadSheetView = new SpreadSheetView();

        this._spreadSheetView.makeTable(new GetTaskData2TableUseCase().do(), new GetTaskDataTemplate2TableUseCase().do());
        new UpdateTaskDataTemplateFromTableHeadersUseCase({ headers: this._spreadSheetView.headers }).do();


        ["onChangeBroadcaster",
            "onInsertrowBroadcaster",
            // "onInsertcolumnBroadcaster",
            "onDeleterowBroadcaster",
            // "onDeletecolumnBroadcaster",
            "onSortBroadcaster",
            "onResizerowBroadcaster",
            "onResizecolumnBroadcaster",//
            "onMoverowBroadcaster",
            "onMovecolumnBroadcaster",// 
            "onLoadBroadcaster",
            "onPasteBroadcaster"
        ].forEach((defaultBroadcaster) => {
            this._spreadSheetView[defaultBroadcaster].subscribe((_) => { console.log(defaultBroadcaster) });
            this._spreadSheetView[defaultBroadcaster].subscribe((data) => { console.log(data) });
        });


        this._spreadSheetView.onMovecolumnBroadcaster.subscribe((data) => {
            new UpdateTaskDataTemplateFromTableHeadersUseCase({ headers: this._spreadSheetView.headers }).do();
            console.log(diContainer.container.taskDataTemplateRepository);
        });


        this._spreadSheetView.onResizecolumnBroadcaster.subscribe((data) => {
            new UpdateTaskDataTemplateFromTableWidthUseCase({ colNum: Number(data.x1), width: Number(data.y1) }).do();
            console.log(diContainer.container.taskDataTemplateRepository.tableTaskDataTemplates);
        });

        this._spreadSheetView.onChangeBroadcaster.subscribe((data) => {
            console.log(new colNum2MemberUseCase({num: Number(data.y1)}).do());
            new ChangeTaskDataUseCase({ row: Number(data.x2), key: new colNum2MemberUseCase({ num: Number(data.y1) }).do(), data: data.y2 }).do();
            console.log(diContainer.container.taskDataRepository.taskData);
        });

        this._spreadSheetView.onInsertrowBroadcaster.subscribe((data) => {
            const input_row_num = function (data){
                let input_row_num = data.x1;
                if (!data.y2) {
                    input_row_num++;
                }
                return input_row_num;
            }(data);
            new InsertTaskDataUseCase({ row: input_row_num }).do();
            // this._spreadSheetView.setRow(input_row_num);
        });

        new taskDataInsertSubscriberUseCase({
            func: (data) => {
                this._spreadSheetView.setRow(data.row, new GetTaskData2TableUseCase().do()[data.row]);
                console.log(new GetTaskDataUseCase().do());
            }

        }).do();


        new taskDataChangeSubscriberUseCase({
            func: (data) => {
                console.log(data);
                console.log(new GetTaskDefaultValueUseCase({ key: data.key }).do());
                if (data.key == "state") {
                    if (data.data == null) {
                        
                    } else if (data.data == TASK_STATE.IN_PROGRESS) {
                        // console.log()
                        // new ChangeTaskDataUseCase({ row: data.row, key: "implementation_date", data: dayjs().tz(time_zone).format(DEFAULT_FORMAT.DATE) }).do();
                        new ImplementationDataStartLine({ row: data.row, data: new GetTodayUseCase().do() }).do();
                        return;
                        
                    }
                    // function (instance, x1, y1, x2, y2, origin) {
                    //     data_change_callback();
                    //     if (y2 == null) {
                    //         return;
                    //     } else if (y2 == TASK_STATE.IN_PROGRESS) {
                    //         let data = data_base[data_base.findIndex(data => data.table_row_num == x2)];
                    //         data.implementation_date.push(new interval(dayjs().tz(time_zone)));
                    //         task_table.setValueFromCoords(data_template.find(template => template.member == "implementation_date").table_col_num, x2, data.implementation_date.map((row) => row.ToString()).join("\n"), true);
                    //     } else if (origin == TASK_STATE.IN_PROGRESS && y2 != TASK_STATE.IN_PROGRESS) {
                    //         let data = data_base[data_base.findIndex(data => data.table_row_num == x2)];
                    //         data.implementation_date[data.implementation_date.length - 1].end = dayjs().tz(time_zone);
                    //         task_table.setValueFromCoords(data_template.find(template => template.member == "implementation_date").table_col_num, x2, data.implementation_date.map((row) => row.ToString()).join("\n"), true);
                    //         task_table.setValueFromCoords(data_template.find(template => template.member == "table_implementation_time").table_col_num, x2, data.implementation_date.reduce(function (sum, element) {
                    //             return sum + element.end.diff(element.start, 'hour');
                    //         }, 0), true);
                    //         // data_base.setValueFromCoords(y1, x2,);
                    //     }
                    //     data_change_callback();
                    // }
                }

                    this._spreadSheetView.setValue(new GetTableTaskDataTemplates().do()[data.key].col_num, data.row, data.data, false);
                
                console.log(new GetTaskData4TableDataUseCase({ row: data.row, key: data.key }).do());
                console.log(new GetTaskDataUseCase().do());

            }

        }).do();
        


    }





}