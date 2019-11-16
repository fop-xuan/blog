const { JSEncrypt } = require('jsencrypt')

function encryption(publicKey, str) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    return  encryptor.encrypt(str)
}

module.exports = encryption
