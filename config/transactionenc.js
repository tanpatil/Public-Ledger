
module.exports  = {
    saltRounds: 9, 
    issuer: 'Ledger', 
    signOptions: {
        issuer:  "Transaction-Ledger",
        expiresIn:  "365d",
        algorithm:  "RS512"
    },
    verifyOptions: {
        issuer:  "Transaction-Ledger",
        expiresIn:  "365d",
        algorithm:  ["RS512"]
       }
}