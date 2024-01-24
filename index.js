import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Lazimrayan99*",
  port: 5433
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getItems(){
  const result = await db.query("SELECT * FROM items");
  let items = result.rows;
  return items;
};

app.get("/", async (req, res) => {
  const items = await getItems();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO items(title) VALUES ($1)",[item]);+
  res.redirect("/");
});

app.post("/edit",async (req, res) => {
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;
  const result = await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",[itemTitle,itemId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const itemid = req.body.deleteItemId;
  const result =  await db.query("DELETE FROM items WHERE id = ($1)",[itemid]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
