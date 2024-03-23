


diContainer.addForCallByReference("taskDataTemplateRepository",
    new class TaskDataTemplateRepository {
        // get DEFAULT_TASK_DATA_TEMPLATE() {
        //     return TEMPLATE_DATA_SOURCE;
        // }
        constructor({ TASK_DATA_TEMPLATES, TASK_UI_TEMPLATES, TABLE_TASK_DATA_TEMPLATES, JSPREADSHEET_TASK_DATA_TEMPLATES } = diContainer.container) {
            // this.defaultTaskDataTemplate = template_data_source;
            // this._taskDataTemplate = this.DEFAULT_TASK_DATA_TEMPLATE;

            this._taskDataTemplates = TASK_DATA_TEMPLATES;
            this._taskUiTemplates = TASK_UI_TEMPLATES;
            this._tableTaskDataTemplates = TABLE_TASK_DATA_TEMPLATES;
            Object.values(this._tableTaskDataTemplates).forEach((val, i) => { val.col_num = i });
            this._jspreadsheetTaskDataTemplates = JSPREADSHEET_TASK_DATA_TEMPLATES;


            this.onChangeBroadcaster = new Observable();
            this.onInsertBroadcaster = new Observable();
            this.onLoadBroadcaster = new Observable();
        }

        get taskDataTemplate() {
            return this._taskDataTemplates;
        }
        get taskUiTemplates() {
            return this._taskUiTemplates;
        }
        get tableTaskDataTemplates() {
            return this._tableTaskDataTemplates;
        }
        get jspreadsheetTaskDataTemplates() {
            return this._jspreadsheetTaskDataTemplates;
        }
        changeTaskDataTemplates(member, key, data) {
            this._taskDataTemplates[member][key] = data;
            this.onChangeBroadcaster.notify({ member: member, key: key, data: data });
        }
        loadTaskDataTemplates(data) {
            this._taskDataTemplates = data;
            this.onLoadBroadcaster.notify(data);
        }

        changeTaskUiTemplates(member, key, data) {
            // console.log('This function does not override.');
            this._taskUiTemplates[member][key] = data;
            this.onChangeBroadcaster.notify({ member: member, key: key, data: data });
        }
        loadTaskUiTemplates(data) {
            this._taskUiTemplates = data;
            this.onLoadBroadcaster.notify(data);
        }

        changeTableTaskDataTemplates(member, key, data) {
            // console.log('This function does not override.');
            this._tableTaskDataTemplates[member][key] = data;
            this.onChangeBroadcaster.notify({ member: member, key: key, data: data });
        }
        loadTableTaskDataTemplates(data) {
            this._tableTaskDataTemplates = data;
            this.onLoadBroadcaster.notify(data);
        }

        changeJspreadsheetTaskDataTemplates(member, key, data) {
            // console.log('This function does not override.');
            this._jspreadsheetTaskDataTemplates[member][key] = data;
            this.onChangeBroadcaster.notify({ member: member, key: key, data: data });
        }
        loadJspreadsheetTaskDataTemplates(data) {
            this._jspreadsheetTaskDataTemplates = data;
            this.onLoadBroadcaster.notify(data);
        }
        // get taskDataTemplate() {
        //     return this._taskDataTemplate;
        // }
        // set taskDataTemplate(args){
        //     this._taskDataTemplate.forEach((template) => {
        //         Object.keys(JSON.stringify(JSON.parse(template))).forEach((root_key) => {
        //             if (typeof (root_key) === "object") {

        //             }
        //         });
        //     });

        // load_template.forEach((src, i) => {
        //     Object.entries(src).forEach(([key, value]) => {
        //         if (!["table_editor", "default_value", "table_changed_function"].includes(key)) {
        //             // data_template[key] = value;
        //             data_template.find(template => template.header === src.header)[key] = value;
        //         }
        //     }
        //     );
        // });
        // }
    }()
);