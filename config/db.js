
if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://tanayp:tanay@cluster0-shard-00-00-stwfe.mongodb.net:27017,cluster0-shard-00-01-stwfe.mongodb.net:27017,cluster0-shard-00-02-stwfe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'}
  } else {
    module.exports = {mongoURI: 'mongodb://tanayp:tanay@cluster0-shard-00-00-stwfe.mongodb.net:27017,cluster0-shard-00-01-stwfe.mongodb.net:27017,cluster0-shard-00-02-stwfe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'}
  }
