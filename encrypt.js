async function password_generate_key() {
    // パスワードとして使う文字列。（ユーザーの入力を受け付ける）
    let password = prompt('パスワードを入力して下さい'); // 例：'開けゴマ'

    // 文字列をTyped Arrayに変換する。
    let passwordUint8Array = (new TextEncoder()).encode(password);

    // パスワードのハッシュ値を計算する。
    let digest = await crypto.subtle.digest(
        // ハッシュ値の計算に用いるアルゴリズム。
        { name: 'SHA-256' },
        passwordUint8Array
    );

    // 生パスワードからのハッシュ値から、salt付きでハッシュ化するための素材を得る
    let keyMaterial = await crypto.subtle.importKey(
        'raw',
        digest,
        { name: 'PBKDF2' },
        // 鍵のエクスポートを許可するかどうかの指定。falseでエクスポートを禁止する。
        false,
        // 鍵の用途。ここでは、「鍵の変換に使う」と指定している。
        ['deriveKey']
    );

    // 乱数でsaltを作成する。
    let salt = crypto.getRandomValues(new Uint8Array(16));

    // 素材にsaltを付与して、最終的なWeb Crypto API用の鍵に変換する。
    let secretKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000, // ストレッチングの回数。
            hash: 'SHA-256'
        },
        keyMaterial,
        // アルゴリズム。
        { name: 'AES-GCM', length: 256 },
        // 鍵のエクスポートを禁止する。
        false,
        // 鍵の用途は、「データの暗号化と復号に使う」と指定。
        ['encrypt', 'decrypt']
    );

    // console.log(secretKey);
    // => CryptoKey { type: "secret", extractable: false, algorithm: {…}, usages: (2) […] }

    // saltの保存。
    localStorage.setItem('passwordSalt',
        JSON.stringify(Array.from(salt)));

}
// password_generate_key();
// saltの復元。
// let salt = localStorage.getItem('passwordSalt');






async function auto_generate_key() {
    let secretKey = await crypto.subtle.generateKey(
        // アルゴリズムと鍵長。ここでは最長の256bitを指定している。
        { name: 'AES-GCM', length: 256 },
        // 鍵のエクスポートを許可するかどうか。trueでエクスポートを許可する。
        true,
        // 鍵の用途。
        ['encrypt', 'decrypt']
    );
    // console.log(secretKey);
    // => CryptoKey { type: 'secret', extractable: true, algorithm: Object, usages: Array[2] }



    // JSON Web Key（JWK）形式でのエクスポート。
    let exportedSecretKey = await crypto.subtle.exportKey('jwk', secretKey);
    // console.log(exportedSecretKey);
    // => Object { alg: "A256GCM", ext: true, k: "DAvha1Scb8jTqk1KUTQlMRdffegdam0AylWRbQTOOfc", key_ops: (2) […], kty: "oct" }
    return exportedSecretKey;
}

async function import_secret_key(exportedSecretKey) {
    // JWK形式からのインポート。
    let importedSecretKey = await crypto.subtle.importKey(
        'jwk',
        exportedSecretKey,
        // 鍵を生成した際の暗号アルゴリズム。
        { name: 'AES-GCM' },
        // 再エクスポートを許可するかどうかの指定。falseでエクスポートを禁止する。
        false,
        // 鍵の用途。
        ['encrypt', 'decrypt']
    );
    // console.log(importedSecretKey);
    // => CryptoKey { type: 'secret', extractable: true, algorithm: Object, usages: Array[2] }
    return importedSecretKey;
}
async function getKey(passphrase, salt = null) {
    passphrase = (new TextEncoder()).encode(passphrase);
    let digest = await crypto.subtle.digest({ name: 'SHA-256' }, passphrase);
    let keyMaterial = await crypto.subtle.importKey('raw', digest, { name: 'PBKDF2' }, false, ['deriveKey']);
    if (!salt)
        salt = crypto.getRandomValues(new Uint8Array(16));
    let key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
    return [key, salt];
}
function getFixedField() {
    // 作成済みの値を取得する。
    let value = localStorage.getItem('96bitIVFixedField');
    // あれば、それを返す。
    if (value)
        return Uint8Array.from(JSON.parse(value));

    // 無ければ、新しい値（長さ96bit）を作成して保存する。
    // 96bitをUint8Arrayで表すため、96 / 8 = 12が桁数となる。
    value = crypto.getRandomValues(new Uint8Array(12));
    localStorage.setItem('96bitIVFixedField', JSON.stringify(Array.from(value)));
    return value;
}
function getInvocationField() {
    // 前回の値を取得。
    let counter = localStorage.getItem('32bitLastCounter');
    if (counter) { // あればそれを使う。
        counter = Uint32Array.from(JSON.parse(counter));
        // console.log("get local storage");
    }
    else { // 無ければ新しいカウンタ（長さ32bit）を生成する。
        counter = new Uint32Array(1);
        counter[0] = 0;
    }
    // counter[0]=2**32-1;
    counter[0]++; // 値を1増やす。

    // 結果を保存する。
    localStorage.setItem('32bitLastCounter', JSON.stringify(Array.from(counter)));
    // console.log("set local storage");
    // console.log(counter);
    return counter;
}
async function encrypt_string(secretKey, src_string) {

    // データをTyped Arrayに変換。
    let inputData = (new TextEncoder()).encode(src_string);
    // console.log(inputData);
    // => Uint8Array(27) [ 230, 154, 151, 229, 143, 183, 229, 140, 150, 227, … ]


    // 初期ベクトルとして、8bit * 16桁 = 128bit分の領域を確保し、乱数で埋める。
    // let iv = crypto.getRandomValues(new Uint8Array(16));
    let fixedPart = getFixedField();
    let invocationPart = getInvocationField();
    // console.log(invocationPart);
    let iv = Uint8Array.from([...fixedPart, ...new Uint8Array(invocationPart.buffer)]);

    // console.log(iv);

    let encryptedArrayBuffer = await crypto.subtle.encrypt(
        // 暗号アルゴリズムの指定とパラメータ。
        {
            name: 'AES-GCM',
            iv: iv
        },
        // 事前に用意しておいた鍵。
        secretKey,
        // ArrayBufferまたはTyped Arrayに変換した入力データ。
        inputData
    );
    // console.log(encryptedArrayBuffer);
    // => ArrayBuffer { byteLength: 27 }


    let encryptedBytes = Array.from(new Uint8Array(encryptedArrayBuffer), char => String.fromCharCode(char)).join('');
    // console.log(encryptedBytes);
    // => �����`Ù�¥ë�`û-Þm#þ'�¾��[�·�



    let encryptedBase64String = btoa(encryptedBytes);
    // console.log(encryptedBase64String);
    // => YPgdHZgguUeHpt9FcYy2IaZTfbTNswbfn93e



    localStorage.setItem('encryptedData',
        JSON.stringify({
            data: encryptedBase64String,
            iv: invocationPart
        }));
    // console.log("encrypt");
    console.log(JSON.parse(localStorage.getItem('encryptedData')));
    return encryptedBase64String;
}

async function decrypt_string(secretKey) {
    let encryptedResult = JSON.parse(localStorage.getItem('encryptedData'));
    // let encryptedBase64String = encryptedData.data;
    // // 通常のArrayとして保存しておいた初期ベクトルをUint8Arrayに戻す
    // let iv = Uint8Array.from(encryptedData.iv);
    // console.log(encryptedResult);

    let encryptedBase64String = encryptedResult.data;
    let invocationPart = encryptedResult.iv;
    // console.log(invocationPart);
    // let [key, _] = await getKey(passphrase, Uint8Array.from(salt));
    let invocationPartTypedArray = new Uint32Array(1);
    invocationPartTypedArray[0] = invocationPart[0];
    // console.log(invocationPartTypedArray);
    // 初期ベクトルを復元する。
    let iv = Uint8Array.from([...getFixedField(), ...(new Uint8Array(invocationPartTypedArray.buffer))]);

    // console.log(iv);

    // Base64エンコードされた文字列→Binary String
    encryptedBytes = atob(encryptedBase64String);

    // Binary String→Typed Array
    encryptedData = Uint8Array.from(encryptedBytes.split(''), char => char.charCodeAt(0));
    // console.log(encryptedData);

    let decryptedArrayBuffer = await crypto.subtle.decrypt(
        // 暗号アルゴリズムの指定とパラメータ。暗号化時と同じ内容を指定する。
        {
            name: 'AES-GCM',
            iv
        },
        // 暗号化の際に使用した物と同じ鍵。
        secretKey,
        // ArrayBufferまたはTyped Arrayに変換した暗号化済みデータ。
        encryptedData
    );
    // console.log(decryptedArrayBuffer);
    // => ArrayBuffer { byteLength: 27 }

    let decryptedString = (new TextDecoder()).decode(new Uint8Array(decryptedArrayBuffer));
    console.log(decryptedString);
    // => '暗号化したい文字列'
    // return decryptedString;
}