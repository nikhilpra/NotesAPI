const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //Use to parse the body of the request
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json()); //enables us to use any encoded message to json encoded message
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/keeper", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const NotesSchema = mongoose.Schema({
  id: Number,
  title: String,
  content: String,
});

const Notes = mongoose.model("Notes", NotesSchema);
/* const note = new Notes({ title: "title", content: "content" });
note.save(); */

app.get("/", (req, res) => {
  Notes.find().then((foundItems) => {
    res.json(foundItems);
  });
});

//get requests

app.post("/", (req, res) => {
  console.log(req);
  const title = req.body.title;
  const body = req.body.content;

  const note = new Notes({ title: title, content: body });
  note.save();

  res.redirect("/");
});

//post requests it is redirected at last so the we dont end with previous state of the database i.e if the notes is empty at the begining
//even after updating data in this post method we still end up with empty array from the database

app.route("/").delete((req, res) => {
  /* console.log(req.body.id); */
  const { id } = req.body;

  Notes.deleteOne({ _id: id })
    .then(() => {
      console.log("deleted successfully");
      Notes.find().then((foundItems) => {
        res.json(foundItems);
      });
    })
    .catch((err) => {
      console.log(err);
      //res.redirect("/");
    });
});

app.put("/", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  Notes.findByIdAndUpdate(id, { title: title, content: content })
    .then(() => {
      console.log("updated success");
      Notes.find().then((foundItems) => {
        res.json(foundItems);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete one item using the id and pass the databaseitems to client using res.json

app.listen(3001, () => console.log("Started at server 3001"));
