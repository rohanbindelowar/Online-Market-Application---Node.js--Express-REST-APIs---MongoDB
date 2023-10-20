import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

//get all products
router.get("/", async (req, res) => {
  let collection =  db.collection("product");
  let results = await collection.find({})
    .limit(50)
    .toArray();

  res.send(results).status(200);
});


// Get a single product by ID
router.get("/:id", async (req, res) => {
  let collection = await db.collection("product");
  let query = {_id: ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a product 
router.post("/", async (req, res) => {
  let collection = await db.collection("product");
  let newDocument = req.body;
  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const collection = await db.collection("product");
    const productId = req.params.id;
    const updatedProduct = req.body;

    // Ensure the "date" field is updated with the current date
    updatedProduct.date = new Date();

    // Perform the update operation
    const result = await collection.updateOne(
      { _id: ObjectId(productId) },
      { $set: updatedProduct }
    );

    if (result.modifiedCount === 1) {
      res.status(204).send(); // Successfully updated
    } else {
      res.status(404).send("Product not found"); // Product with the given ID not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const updates = {
    $set: { comments: req.body.comments }
  };
  let result;
  try{
    let collection = await db.collection("product");
    result = await collection.updateOne(query, updates);

  }
  catch(e)
  {
    console.dir(e);
    res.send(e);
    return;
  }
  res.send(result).status(200);
});

// Delete an a product by ID
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("product");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

// Delete all products
router.delete("/", async (req, res) => {
  try {
    const collection = await db.collection("product");
    const result = await collection.deleteMany({});

    res.status(200).send(`Deleted ${result.deletedCount} products`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Find products by name containing 'kw'
router.get("/products", async (req, res) => {
  try {
    const collection = await db.collection("product");
    
    // Get the name query parameter from the request
    const nameQuery = req.query.name;

    // Define a regular expression pattern to match 'kw' anywhere in the product name
    const regexPattern = new RegExp(nameQuery, 'i'); // 'i' for case-insensitive search

    // Perform the query
    const productsWithKW = await collection.find({ name: { $regex: regexPattern } }).toArray();

    if (productsWithKW.length > 0) {
      res.status(200).json(productsWithKW);
    } else {
      res.status(404).send("No products found with the specified name.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
