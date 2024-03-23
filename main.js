

(async function () {
    // let taskDataRepository = new TaskDataRepository();
    // let taskDataTemplateRepository = new TaskDataTemplateRepository();


    // console.log(taskDataRepository);
    // console.log(taskDataTemplateRepository);
    // console.log(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE);
    // console.log(Object.keys(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE[0]));
    // console.log(Object.keys(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE[1]));
    // console.log(Object.values(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE[1]));
    // console.log(Object.keys(JSON.parse(JSON.stringify(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE[1]))));
    // console.log(typeof(Object.values(taskDataTemplateRepository.DEFAULT_TASK_DATA_TEMPLATE[1])[11]));

    // let mainPresenter = new MainPresenter();
    let taskTablePresenter = new TaskTablePresenter();
    new InsertTaskDataUseCase({ row: 0 }).do();
    new InsertTaskDataUseCase({ row: 0 }).do();
    new InsertTaskDataUseCase({ row: 0 }).do();
    console.log(new GetTaskDataUseCase().do().map((obj) => { return obj.id }));
    
    new MainPresenter();


    // new insertTaskDataUseCase({ row: 0 }).do();
    // if (secret_key_string == "") {
    //     let generated_key = await auto_generate_key();
    //     secret_key = generated_key;
    // } else {
    //     secret_key = await import_secret_key(JSON.parse(secret_key_string));
    // }
    // load_data();
    // let encrypt_data = await encrypt_string(secret_key, "暗号化したいデータ");
    // await decrypt_string(secret_key, encrypt_data);
})();

// var table_data = [
//     ['<span>On his 11th birthday, <b>Harry</b> receives a letter inviting him to study magic at the Hogwarts School of Witchcraft and Wizardry. <b>Harry</b> discovers that not only is he a wizard, but he is a famous one. He meets two best friends, Ron Weasley and Hermione Granger, and makes his first enemy, Draco Malfoy.</span>', 'Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
//     ['Civic', 'Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777', , "10:11"],
// ];





// var data_base = [];
// let tmp = data_template.map(data => ({ type: data.table_type, title: data.header, width: data.table_width, editor: data.table_editor, source: data.table_source, readOnly: data.table_read_only, options: data.table_options }));
// console.log(tmp);


// let timeoutID = 0;
// let was_added_row = false;
// let is_construct = false;
// var task_table = construct_table();

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


