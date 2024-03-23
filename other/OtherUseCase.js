class OtherUseCase {
    static margeArray2Object(array, args = null) {
        let object = {};
        if (args === null) {
            array.forEach((member_name) => {
                object[member_name] = null;
            });
        } else if (Array.isArray(args)) {
            array.forEach((member_name) => {
                object[member_name] = null;
            });
            for (let i = 0; i < args.length && i < array.length; i++) {
                object[array[i]] = args[i];
            }
        } else {
            Object.entries(args).forEach((key, value) => {
                if (key in array) {
                    object[key] = value;
                }
            });
        }
        return object;
    }
}