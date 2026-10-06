import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTS_FILE = path.join(
  __dirname,
  "data",
  "events.json"
);


// -------------------------------------
// Interaction weights
// -------------------------------------

const EVENT_WEIGHTS = {
  view: 1,
  add_to_cart: 4,
  transaction: 8
};


// -------------------------------------
// Ensure events file exists
// -------------------------------------

function ensureEventsFile() {

  const dataDirectory =
    path.dirname(EVENTS_FILE);

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
      recursive: true
    });
  }

  if (!fs.existsSync(EVENTS_FILE)) {

    fs.writeFileSync(
      EVENTS_FILE,
      "[]",
      "utf8"
    );

  }
}


// -------------------------------------
// Read events
// -------------------------------------

export function readEvents() {

  ensureEventsFile();

  try {

    const data =
      fs.readFileSync(
        EVENTS_FILE,
        "utf8"
      );

    return JSON.parse(data);

  } catch (error) {

    console.error(
      "Error reading events:",
      error
    );

    return [];

  }
}


// -------------------------------------
// Save event
// -------------------------------------

export function saveEvent(event) {

  const events =
    readEvents();

  events.push({

    userId: Number(event.userId),

    productId: Number(event.productId),

    event: event.event,

    timestamp:
      event.timestamp ||
      new Date().toISOString()

  });

  fs.writeFileSync(

    EVENTS_FILE,

    JSON.stringify(
      events,
      null,
      2
    ),

    "utf8"

  );
}


// -------------------------------------
// Recommendation engine
// -------------------------------------

export function getBehaviorRecommendations(
  userId,
  products,
  limit = 4
) {

  const allEvents =
    readEvents();


  // User's events
  const userEvents =
    allEvents.filter(
      (event) =>
        Number(event.userId) ===
        Number(userId)
    );


  // -----------------------------------
  // Cold start
  // -----------------------------------

  if (userEvents.length === 0) {

    return [...products]
      .sort(
        (a, b) =>
          b.rating - a.rating
      )
      .slice(0, limit);

  }


  // -----------------------------------
  // Calculate interaction scores
  // -----------------------------------

  const scores = new Map();


  for (const event of userEvents) {

    const productId =
      Number(event.productId);

    const weight =
      EVENT_WEIGHTS[event.event] || 0;

    const previousScore =
      scores.get(productId) || 0;

    scores.set(
      productId,
      previousScore + weight
    );

  }


  // -----------------------------------
  // Products already interacted with
  // -----------------------------------

  const interactedProducts =
    new Set(scores.keys());


  // -----------------------------------
  // Category similarity
  // -----------------------------------

  for (const product of products) {

    if (
      interactedProducts.has(
        product.id
      )
    ) {
      continue;
    }


    let categoryScore = 0;


    for (
      const interactedId
      of interactedProducts
    ) {

      const interactedProduct =
        products.find(
          (item) =>
            item.id === interactedId
        );


      if (
        interactedProduct &&
        interactedProduct.category ===
          product.category
      ) {

        categoryScore += 2;

      }

    }


    const currentScore =
      scores.get(product.id) || 0;


    scores.set(
      product.id,
      currentScore +
        categoryScore +
        product.rating
    );

  }


  // -----------------------------------
  // Sort and return
  // -----------------------------------

  return products

    .filter(
      (product) =>
        !interactedProducts.has(
          product.id
        )
    )

    .map(
      (product) => ({

        product,

        score:
          scores.get(product.id) ||
          product.rating

      })
    )

    .sort(
      (a, b) =>
        b.score - a.score
    )

    .slice(0, limit)

    .map(
      (item) =>
        item.product
    );
}
