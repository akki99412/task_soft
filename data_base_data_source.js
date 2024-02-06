function update_data_base() {
    update_data_template();
    var values = task_table.getData();
    // data_base = [];
    values.forEach((value, j) => {
        data_base_row = {
            //     _scheduled_date_time:"",
            //     set scheduled_date_time(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_date_time() {
            //         return Date();
            //     },
            //     set scheduled_date(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_date() {
            //         return Date();
            //     },
            //     set scheduled_time(value) {
            //         this._scheduled_date_time = value;
            //     }, get scheduled_time() {
            //         return Date();
            //     },
            //     _completion_date_time: Date(),
            //     set completion_date_time(value) {
            //         return Date();
            //     },
            //     get completion_date_time() {
            //         return Date();
            //     }
        };

        value.forEach((datum, i) => {
            if (data_template[i].member == "implementation_date") {
                if (datum == "") {
                    data_base_row[data_template[i].member] = [];
                } else {
                    data_base_row[data_template[i].member] = datum.split("\n").map(time => new interval(time));
                }

            } else {
                data_base_row[data_template[i].member] = datum;
            }
        });
        data_base_row.table_row_num = j;
        data_base[j] = data_base_row;
    });
}