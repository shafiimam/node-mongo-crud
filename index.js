const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const ObjectId = require("mongodb").ObjectId;

const password = "7u1ZNSrII705Ui8L";

const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://shafiimam:7u1ZNSrII705Ui8L@cluster0.qz5k4.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection
      .insertOne(product)
      .then((result) => {
        console.log("data added successfully");
        res.redirect('/')
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((error, documents) => {
      res.send(documents);
    });
  });

  app.delete(`/delete/:id`, (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
      res.send(result.deletedCount>0);
      });
  });

  app.get(`/product/:id`, (req, res) => {
    
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
});

app.patch('/update/:id', (req,res)=>{
const productCollection = client.db("organicdb").collection("products");
 productCollection.updateOne({_id:ObjectId(req.params.id)},
 {$set:{price:req.body.price,stock:req.body.stock}})
  .then((result)=>{
    res.send(result.modifiedCount>0)
  })
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000);
