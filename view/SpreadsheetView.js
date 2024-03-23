class SpreadSheetView {

    constructor() {
        this.onChangeBroadcaster = new Observable();
        this.onInsertrowBroadcaster = new Observable();
        this.onInsertcolumnBroadcaster = new Observable();
        this.onDeleterowBroadcaster = new Observable();
        this.onDeletecolumnBroadcaster = new Observable();
        this.onSortBroadcaster = new Observable();
        this.onResizerowBroadcaster = new Observable();
        this.onResizecolumnBroadcaster = new Observable();
        this.onMoverowBroadcaster = new Observable();
        this.onMovecolumnBroadcaster = new Observable();
        this.onLoadBroadcaster = new Observable();
        this.onPasteBroadcaster = new Observable();
        this.onSelectionBroadcaster = new Observable();

        this.jspreadsheet = {};
    }
    change({ }) {
        console.log('This function does not override.');
    }
    insert({ }) {
        console.log('This function does not override.');
    }
    load() {
        console.log('This function does not override.');
    }
    get headers() {
        return this._jspreadsheet.getHeaders().split(",");
    }
    makeTable(tableData, dataTemplate) {
        console.log(tableData);
        this._jspreadsheet = jspreadsheet(document.getElementById('spreadsheet'), {
            data: tableData,
            columns: dataTemplate,
            //パラメーター
            allowComments: true,//セルへのコメント追加を許可するか(デフォルト: false)。
            allowInsertColumn: false,//列追加を許可するか(デフォルト: true)。
            allowInsertRow: true,//行追加を許可するか（デフォルト: true)。
            allowManualInsertColumn: false,//タブキーで列追加を許可するか(デフォルト: true)。
            allowManualInsertRow: true,//改行キーで行追加を許可するか(デフォルト: true)。
            allowDeleteColumn: false,//列削除を許可するか(デフォルト: true)。
            allowDeleteRow: true,//行削除を許可するか(デフォルト: true)。
            allowDeletingAllRows: false,//すべての行を削除することを許可するか(デフォルト: false)。
            autoCasting: false,//1,234 などのカンマ付き数値を数字と見なすか(デフォルト: true)。
            autoIncrement: true,//数値ドラッグ時に自動インクリメントするか(デフォルト: true)。
            columnDrag: true,//カラムのドラッグを許可するか(デフォルト: false)。
            columnSorting: true,//ダブルクリックでカラムをソートするか(デフォルト: true)。
            columnResize: true,//カラムのリサイズを可能とするか(デフォルト: true)。
            defaultColAlign: "left",//デフォルトのカラムアライン(例: 'left')。
            defaultColWidth: 100,//デフォルトのカラム横幅(例: 100)。
            defaultRowHeight: 100,//デフォルトの行高さ(例: 100)。
            // editable: false,//セルを編集可能とするか（デフォルト: true)。
            fullscreen: false,//フルスクリーンモードにする(デフォルト: false)。
            lazyLoading: false,//遅延ローディングを行う(デフォルト: false)。
            loadingSpin: true,//ロード中のスピンを表示する(デフォルト: false)。
            minSpareRows: 0,//最小予備行数(例: 3)。
            minSpareCols: 0,//最小予備列数(例: 3)。
            pagination: 50,//ページネーション行数(例: 10)。
            paginationOptions: [10, 50, 100],//ページネーション行数候補。search: true の時に有効(例: [10, 50, 100])。
            parseFormulas: true,//計算式をサポートするか(デフォルト: true)。
            rowDrag: true,//行ドラッグを許可するか(デフォルト: true)。
            rowResize: true,//高さのリサイズを許可するか(デフォルト: false)。
            search: true,//検索を可能とするか(デフォルト: false)。
            selectionCopy: true,//セル選択時の右下の■ドラッグでコピーを許可するか(デフォルト: true)。
            stripHTML: true,//セル内のHTMLを無効化する(デフォルト: true)。
            stripHTMLOnCopy: false,//セルをコピーする際にHTMLもコピーするか(デフォルト: false)。
            tableHeight: "500px",//tableOverflow: true 時のテーブルの最大の高さ(例: "300px")。
            // tableWidth: "200px",//tableOverflow: true 時のテーブルの最大の横幅(例: "200px")。
            tableOverflow: true,//テーブルの高さや横幅を超えた場合にスクロールバーを表示するか(デフォルト: false)。
            wordWrap: true,//ALT + Enterでセル内改行を許可するか(デフォルト: false)。
            minDimensions: [2, 1],//最小列数・行数 (例：[5, 3])。

            //イベント
            onchange: (instance, x1, y1, x2, y2, origin) => { return this.onChangeBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            oninsertrow: (instance, x1, y1, x2, y2, origin) => { return this.onInsertrowBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            oninsertcolumn: (instance, x1, y1, x2, y2, origin) => { return this.onInsertcolumnBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            ondeleterow: (instance, x1, y1, x2, y2, origin) => { return this.onDeleterowBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            ondeletecolumn: (instance, x1, y1, x2, y2, origin) => { return this.onDeletecolumnBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onsort: (instance, x1, y1, x2, y2, origin) => { return this.onSortBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onresizerow: (instance, x1, y1, x2, y2, origin) => { return this.onResizerowBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onresizecolumn: (instance, x1, y1, x2, y2, origin) => { return this.onResizecolumnBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onmoverow: (instance, x1, y1, x2, y2, origin) => { return this.onMoverowBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onmovecolumn: (instance, x1, y1, x2, y2, origin) => { return this.onMovecolumnBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onload: (instance, x1, y1, x2, y2, origin) => { return this.onLoadBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onpaste: (instance, x1, y1, x2, y2, origin) => { return this.onPasteBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            onselection: (instance, x1, y1, x2, y2, origin) => { return this.onSelectionBroadcaster.notify({ instance, x1, y1, x2, y2, origin }) },
            // onevent: function (a, b, c, d, e, f, g, h) {
            //     console.log(a);
            //     console.log(b);
            //     console.log(c);
            //     console.log(d);
            //     console.log(e);
            //     console.log(f);
            //     console.log(g);
            //     console.log(h);
            // }
        });
        return this._jspreadsheet;
    }



    setRow(input_row_num, row) {
        this._jspreadsheet.setRowData(input_row_num, row);


        let headers = this._jspreadsheet.getHeaders().split(",");
        headers.forEach((header, i) => {
            // console.log(header);
            if (["ID"].includes(header)) {
                this._jspreadsheet.setValueFromCoords(i, input_row_num, row[i], true);
            } else if (["着手予定時間", "完了予定時間"].includes(header)) {
                this._jspreadsheet.setValueFromCoords(i, input_row_num, row[i], true);
                this._jspreadsheet.records[input_row_num][i].innerHTML = row[i];//htmlが更新されないため、強制入力
            }
        });
    }
    setValue(col, row, data, force) {
        console.log(data);
        if(this._jspreadsheet.getValueFromCoords(col, row) != data){

            this._jspreadsheet.setValueFromCoords(col, row, data, true);
            if (force) {
                this._jspreadsheet.records[row][i].innerHTML = row[i];
            }
        }
    }


    data_change_callback() {
        was_added_row = false;
        if (is_construct) {

            update_data_template();
            update_data_base();

            clearTimeout(timeoutID);
            // console.log("stacked!");
            timeoutID = setTimeout(save_file, 10 * 1000);

        } else {
            is_construct = true;
        }
    }
    on_insert_row_callback(instance, x1, y1, x2, y2, origin) {
        // console.log("on_insert_row_callback");
        // let cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
        // let cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
        // console.log('selection ' + x1 + ' ' + y1);
        // console.log(y2);
        let uuid = self.crypto.randomUUID();
        let input_row_num = x1;
        if (!y2) {
            input_row_num++;
        }

        // data_template.forEach((src, i) => {
        //     Object.entries(src).forEach((key, value) => {
        //         if (!["table_editor", "default_value"].includes(key)) {
        //             data_template[key] = value;
        //         }
        //     }
        //     );
        // });
        const buffer_data = [];
        data_template.forEach(template => {
            buffer_data.push(template.default_value);
        });
        // console.log(buffer_data);
        task_table.setRowData(input_row_num, buffer_data);


        let headers = task_table.getHeaders().split(",");
        headers.forEach((header, i) => {
            // console.log(header);
            if (["ID"].includes(header)) {
                // console.log(data_template.find(template => template.header === header).default_value);
                task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
                // task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
            } else if (["着手予定時間", "完了予定時間"].includes(header)) {
                // console.log(data_template.find(template => template.header === header).default_value);
                task_table.setValueFromCoords(i, input_row_num, data_template.find(template => template.header === header).default_value, true);
                task_table.records[input_row_num][i].innerHTML = data_template.find(template => template.header === header).default_value;//htmlが更新されないため、強制入力
            }
        });
        // console.log('id col is ' + id_col_num);
        data_change_callback();
        // was_added_row = true;
        // cellName1 = jspreadsheet.getColumnNameFromId([x1, y1]);
        // cellName2 = jspreadsheet.getColumnNameFromId([x2, y2]);
        // console.log('after add The selection from ' + cellName1 + ' to ' + cellName2 + '');
    }

    on_change_callback(instance, x1, y1, x2, y2, origin) {
        let changed_data_template = data_template.find(datum => datum.table_col_num == y1);
        console.log(changed_data_template);

        changed_data_template.table_changed_function(instance, x1, y1, x2, y2, origin);

        data_change_callback();
    }
}