async function load_data() {
    console.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)));
    // console.log(await decrypt_string(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE))));
    let decrypt_data = await decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)))
    console.log(decrypt_data);
    let load_template = JSON.parse(decrypt_data);
    // var headers_and_editors = data_template.map((data) => ({
    //     header: data.header, editor: data.table_editor, default_value: data.default_value
    // }));
    // headers_and_editors.forEach((hae, i) => {
    //     // console.log(header);
    //     load_template.find(template => template.header === hae.header).table_editor = hae.editor;
    //     load_template.find(template => template.header === hae.header).default_value = hae.default_value;
    // });
    // console.log(load_template);
    // console.log(load_template[0]);
    // data_template = load_template;
    // Object.entries(load_template[0]).forEach(([key, value]) => {console.log(key+" "+value)})
    load_template.forEach((src, i) => {
        Object.entries(src).forEach(([key, value]) => {
            if (!["table_editor", "default_value", "table_changed_function"].includes(key)) {
                // data_template[key] = value;
                data_template.find(template => template.header === src.header)[key] = value;
            }
        }
        );
    });

    data_template.sort((a, b) => a.table_col_num - b.table_col_num);
    // console.log(data_template);

    // let load_template = JSON.parse(decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE)))); 
    decrypt_data = await decrypt_string(secret_key, JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.DATA_BASE)))
    json_data_base = JSON.parse(decrypt_data);
    // old_data_template = data_template;
    // Object.keys(json_data_base).forEach(function (key) {
    //     console.log('key:', key);
    //     // console.log('json_parse:', json_data_base.family);
    // });
    table_data = [];
    json_data_base.forEach((data, j) => {
        table_row = [];
        data_template.forEach((template, i) => {
            if (template.member == "implementation_date") {
                if (data[template.member].length == 0) {
                    console.log("blank");
                    // data_base[i][template.member] = [];
                    table_row[i] = "";
                } else {
                    data_base[j][template.member] = data[template.member].map((row) => new interval(row.start + "/" + row.end));
                    // console.log([data_base[i][template.member].start, data_base[i][template.member].end]);
                    // console.log(Object.prototype.toString.call(data_base[i][template.member]));
                    table_row[i] = data_base[j][template.member].map((row) => row.ToString()).join("\n");
                    // console.log(table_row[j]);

                }
            } else {
                table_row[i] = data[template.member];
            }
        });
        table_data.push(table_row);
    });
    console.log(table_data);

    //前のシート削除
    let element = document.getElementById('spreadsheet');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    // console.log(data_template.map((template) => ({ type: template.table_type, title: template.header, width: template.table_width, editor: template.table_editor, source: template.table_source, readOnly: template.table_read_only })));

    // console.log(clock_editor);
    //新規シート作成
    task_table = construct_table();
    // task_table.setHeader(0, "test");
    // var values = task_table.setData();
    // type, editor, source
    data_change_callback();

}
async function save_file() {
    clearTimeout(timeoutID);
    // console.log(task_table.getJson());
    // console.log(data_template[0]);
    // console.log(data_template);
    // console.log(data_base);
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_TEMPLATE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_template))));
    localStorage.setItem(LOCAL_STORAGE_KEY.DATA_BASE,
        JSON.stringify(await encrypt_string(secret_key, JSON.stringify(data_base))));
    console.log("saved!");
    console.log(JSON.stringify(data_base));
}