
let secretKey = {};

(async _ => {
    if (secretKeyString === "") {
        let generatedKey = await autoGenerateKey();
        saveTextToFile("const secretKeyString=\'" + JSON.stringify(generatedKey) + "\'", "keyFile.js");
        return generatedKey;
    } else {
        return await importSecretKey(JSON.parse(secretKeyString));
    }
})().then(value => secretKey=value);


