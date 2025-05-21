const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


const uri = process.env.MONGO_URI || "mongodb+srv://ashwinsebastian76:ashwin2001@sit725.jctfcnw.mongodb.net/inventoryDB?retryWrites=true&w=majority&appName=SIT725";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB using Mongoose");
});

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  description: String,
});

const Item = mongoose.model("Item", itemSchema);




app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});


app.post("/api/items", async (req, res) => {
  const item = new Item(req.body);
  const savedItem = await item.save();
  res.status(201).json(savedItem);
});


app.put("/api/items/:id", async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});


app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
