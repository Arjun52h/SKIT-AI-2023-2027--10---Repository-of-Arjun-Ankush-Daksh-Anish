const { MongoClient } = require("mongodb");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "ecommerce_recommendation";
const COLLECTION_NAME = "interactions";

const filePath = path.join(
  __dirname,
  "../../data/interactions_clean.csv"
);

async function importData() {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const batch = [];
    const BATCH_SIZE = 1000;
    let totalInserted = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          batch.push({
            user_id: Number(row.user_id),
            product_id: Number(row.product_id),
            event: row.event,
            datetime: row.datetime,
            transaction_id:
              row.transaction_id === ""
                ? null
                : Number(row.transaction_id),
          });

          if (batch.length >= BATCH_SIZE) {
            const data = batch.splice(0, batch.length);

            try {
              await collection.insertMany(data, { ordered: false });
              totalInserted += data.length;
              console.log(`${totalInserted} records inserted`);
            } catch (error) {
              console.error("Batch insert error:", error.message);
            }
          }
        })
        .on("end", async () => {
          if (batch.length > 0) {
            try {
              await collection.insertMany(batch, { ordered: false });
              totalInserted += batch.length;
            } catch (error) {
              console.error("Final batch error:", error.message);
            }
          }

          resolve();
        })
        .on("error", reject);
    });

    await collection.createIndex({ user_id: 1 });
    await collection.createIndex({ product_id: 1 });
    await collection.createIndex({ user_id: 1, product_id: 1 });
    await collection.createIndex({ event: 1 });

    console.log("Indexes created successfully.");
    console.log(`Total records inserted: ${totalInserted}`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

importData();
