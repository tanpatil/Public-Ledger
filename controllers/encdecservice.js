var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
 
module.exports = {
     encryptionService: function encryptionService(key, text){
          var cipher = crypto.createCipher(algorithm, key);  
          var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
          return encrypted;
      },
      decryptionService:  function decryptionService(key, encrypted){
          var decipher = crypto.createDecipher(algorithm, key);
          var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
          return decrypted;
      }
}