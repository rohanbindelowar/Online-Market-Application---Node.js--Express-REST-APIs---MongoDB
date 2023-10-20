
import { MongoClient } from "mongodb";

// Add your MongoDb connection string below
const connectionString = "mongodb+srv://rohanbin22:RbdR2002@cluster0.uzaluzu.mongodb.net/?retryWrites=true&w=majority"

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("connected");
} catch(e) {
  console.error(e);
}

let db = conn.db("MarketPlace");
try{
    // Define the "product" collection and its properties
    const productCollection = db.collection("product");
    const productSchema = {
      name: "string",
      description: "string",
      price: "number",
      quantity: "number",
      category: "string",
    };

    // Create the "products" collection if it doesn't exist
    if (!(await productCollection.indexExists("name_1"))) {
      await productCollection.createIndex({ name: 1 }, { unique: true });
    }
}catch (e) {
console.error("Error creating connection:", e);
}

export default db;