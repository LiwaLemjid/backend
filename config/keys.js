module.exports = {
    mongoURI:'mongodb+srv://liwa:Liwa54838108@cluster0.lcirv.mongodb.net/<devconnector>?retryWrites=true&w=majority',
    secretOrKey:'secret'
}
// const client = new MongoClient(db, { useNewUrlParser: true, useUnifiedTopology: true});
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log(err);
//   client.close();
// });