
var table_data = [
    ['<span>On his 11th birthday, <b>Harry</b> receives a letter inviting him to study magic at the Hogwarts School of Witchcraft and Wizardry. <b>Harry</b> discovers that not only is he a wizard, but he is a famous one. He meets two best friends, Ron Weasley and Hermione Granger, and makes his first enemy, Draco Malfoy.</span>', 'Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777', , "10:11"],
];





var data_base = [];
const time_zone = "Asia/Tokyo";
let tmp = data_template.map(data => ({ type: data.table_type, title: data.header, width: data.table_width, editor: data.table_editor, source: data.table_source, readOnly: data.table_read_only, options: data.table_options }));
// console.log(tmp);


let timeoutID = 0;
let was_added_row = false;
let is_construct = false;
var task_table = construct_table();

// import { nameText } from './import.js';









// localStorage.setItem('localStrageSaveTestKey', 'localStrageSaveTestString');
// var value = localStorage.getItem('localStrageSaveTestKey');
// console.log(value);

// function saveTextToFile(text, filename) {
//     const blob = new Blob([text], { type: 'text/plain' });
//     const blobUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = blobUrl;
//     link.download = filename;
//     link.click();
// }
(async function () {
    if (secret_key_string == "") {
        // console.log("generate_key")
        let generated_key = await auto_generate_key();
        // console.log("secret_key_string=\'" + JSON.stringify(generated_key) + "\'");
        // saveTextToFile("secret_key_string=\'" + JSON.stringify(generated_key) + "\'", "key_file.js");
        secret_key = generated_key;
    } else {
        secret_key = await import_secret_key(JSON.parse(secret_key_string));
    }
    // load_data();
    // let encrypt_data = await encrypt_string(secret_key, "暗号化したいデータ");
    // await decrypt_string(secret_key, encrypt_data);
})();

function test_function() {
    console.log("test function")
    console.log(data_template.map(data => data.default_value));
    task_table.setRowData(1, data_template.map(data => data.default_value));
}