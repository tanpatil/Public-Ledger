
module.exports  = {
    saltRounds: 9, 
    issuer: 'Ledger', 
    signOptions: {
        issuer:  "Ledger",
        expiresIn:  "24h",
        algorithm:  "RS512"
    },
    verifyOptions: {
        issuer:  "Ledger",
        expiresIn:  "24h",
        algorithm:  ["RS512"]
       }
}