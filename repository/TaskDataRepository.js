diContainer.addForCallByReference("taskDataRepository",
    new class TaskDataRepository {

        constructor({ TASK_DATA_TEMPLATES = diContainer.container.TASK_DATA_TEMPLATES } = {}) {
            this._defaultValue = TASK_DATA_TEMPLATES;
            // console.log()
            // console.log(this._defaultValue);
            this._taskData = [];
            // Object.fromEntries(Object.keys(this.defaultValue).forEach((key) => [key, this.defaultValue[key].defaultValue]));

            this.onChangeBroadcaster = new Observable();
            this.onInsertBroadcaster = new Observable();
            this.onLoadBroadcaster = new Observable();
        }
        get taskData() {
            return this._taskData;
        }
        change(row, key, data) {
            // console.log('This function does not override.');
            console.log(data);
            console.log(key);
            console.log(row);
            console.log(this._taskData[row][key]);
            if (this._taskData[row][key] != data) {
                const beforeData = this._taskData[row][key];
                this._taskData[row][key] = data;
                this.onChangeBroadcaster.notify({ row: row, key: key, data: data, origin: beforeData })
                console.log({ row: row, key: key, data: data });
            }
        }
        insert(row, data = this._defaultValue) {
            this._taskData.splice(row, 0, Object.fromEntries(Object.entries(data).map((obj) => { return [obj[0], obj[1].defaultValue] })));
            this.onInsertBroadcaster.notify({ row: row, data: data });
        }
        load(data) {
            this._taskData = data;
            this.onLoadBroadcaster.notify(data);
        }

    }());

// const taskDataRepository = Timeline.create()(diContainer.container.TASK_DATA_TEMPLATES);