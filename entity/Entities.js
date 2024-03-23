
class TaskUiTemplate {
    static _member_names = ["title"];
    constructor(args = null) {
        Object.entries(OtherUseCase.margeArray2Object(_member_names, args)).forEach((key, value) => {
            this[key] = value;
        });

    }
}

class TableTaskDataTemplate {
    static _member_names = ["width", "colNum", "readOnly"];
    constructor(args = null) {
        Object.entries(OtherUseCase.margeArray2Object(_member_names, args)).forEach((key, value) => {
            this[key] = value;
        });

    }
}
class JspreadsheetTaskDataTemplate {
    static _member_names = ["editor", "source", "options"];
    constructor(args = null) {
        Object.entries(OtherUseCase.margeArray2Object(_member_names, args)).forEach((key, value) => {
            this[key] = value;
        });

    }
}



class TaskDataTemplate {
    static _member_names = ["member", "defaultValue"];
    constructor(args = null) {
        Object.entries(OtherUseCase.margeArray2Object(_member_names, args)).forEach((key, value) => {
            this[key] = value;
        });

    }
}
class TaskDataTemplateEntity {
    constructor(args = null) {
        if (args === null) {
            this.taskData = new TaskDataTemplate();
            this.taskUi = new TaskUiTemplate();
            this.jspreadsheetTaskData = new jspreadsheetTaskDataTemplate();
            this.tableTaskData = new tableTaskDataTemplate();
        } else {
            this.taskData = args.taskData;
            this.taskUi = args.taskUi;
            this.jspreadsheetTaskData = args.jspreadsheetTaskData;
            this.tableTaskData = args.tableTaskData;
        }
    }
}

// function getMethodNames(constructor) {
//     return Object.getOwnPropertyNames(constructor.prototype).filter(name => name !== 'constructor');
// }

// function haveSameMethods(class1, class2) {
//     const methods1 = getMethodNames(class1).sort();
//     const methods2 = getMethodNames(class2).sort();

//     if (methods1.length !== methods2.length) {
//         return false;
//     }

//     for (let i = 0; i < methods1.length; i++) {
//         if (methods1[i] !== methods2[i]) {
//             return false;
//         }
//     }

//     return true;
// }