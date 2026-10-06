import express from "express";
import cors from "cors";

import {
  getBehaviorRecommendations,
  saveEvent,
  readEvents
} from "./recommendationEngine.js";


const app = express();

const PORT = 5000;


// =====================================
// Middleware
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// Product catalog
// =====================================

const products = [

  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 2,
    name: "Sport Running Shoes",
    category: "Fashion",
    price: 2299,
    rating: 4.3,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 3,
    name: "Classic Analog Watch",
    category: "Fashion",
    price: 1299,
    rating: 4.4,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 4,
    name: "Premium Sunglasses",
    category: "Fashion",
    price: 899,
    rating: 4.2,
    reviews: 61,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 5,
    name: "Smart LED TV",
    category: "Electronics",
    price: 24999,
    rating: 4.6,
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 6,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 3499,
    rating: 4.7,
    reviews: 153,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 7,
    name: "Minimal Study Lamp",
    category: "Home & Kitchen",
    price: 799,
    rating: 4.1,
    reviews: 47,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 8,
    name: "Classic Novel Collection",
    category: "Books",
    price: 599,
    rating: 4.8,
    reviews: 88,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 9,
    name: "Football Training Ball",
    category: "Sports",
    price: 999,
    rating: 4.4,
    reviews: 55,
    image:
      "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 10,
    name: "Gaming Controller",
    category: "Toy & Games",
    price: 2799,
    rating: 4.5,
    reviews: 116,
    image:
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=700&q=85"
  }

];


// =====================================
// Health check
// =====================================

app.get(
  "/api/health",
  (req, res) => {

    res.json({

      status: "ok",

      service:
        "ShopSmart Backend",

      recommendationEngine:
        "Behavior Based",

      hadoop:
        "Ready for integration"

    });

  }
);


// =====================================
// Products
// =====================================

app.get(
  "/api/products",
  (req, res) => {

    const {
      category,
      search
    } = req.query;


    let result =
      [...products];


    if (
      category &&
      category !== "All"
    ) {

      result =
        result.filter(
          (product) =>
            product.category ===
            category
        );

    }


    if (search) {

      const query =
        search.toLowerCase();


      result =
        result.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(query)
            ||
            product.category
              .toLowerCase()
              .includes(query)
        );

    }


    res.json(result);

  }
);


// =====================================
// Recommendations
// =====================================

app.get(
  "/api/recommendations/:userId",
  (req, res) => {

    const userId =
      Number(
        req.params.userId
      );


    const recommendations =
      getBehaviorRecommendations(
        userId,
        products,
        4
      );


    res.json({

      userId,

      algorithm:
        "Weighted User Behaviour + Category Similarity",

      hadoopReady:
        true,

      recommendations

    });

  }
);


// =====================================
// Save user event
// =====================================

app.post(
  "/api/events",
  (req, res) => {

    const {
      userId,
      productId,
      event,
      timestamp
    } = req.body;


    if (
      userId === undefined ||
      productId === undefined ||
      !event
    ) {

      return res
        .status(400)
        .json({

          message:
            "userId, productId and event are required"

        });

    }


    const allowedEvents = [
      "view",
      "add_to_cart",
      "transaction"
    ];


    if (
      !allowedEvents.includes(
        event
      )
    ) {

      return res
        .status(400)
        .json({

          message:
            "Invalid event type"

        });

    }


    saveEvent({

      userId,

      productId,

      event,

      timestamp

    });


    res.status(201).json({

      message:
        "Event stored successfully",

      event: {

        userId:
          Number(userId),

        productId:
          Number(productId),

        event,

        timestamp

      }

    });

  }
);


// =====================================
// Get user events
// =====================================

app.get(
  "/api/events/:userId",
  (req, res) => {

    const userId =
      Number(
        req.params.userId
      );


    const events =
      readEvents().filter(
        (event) =>
          Number(event.userId) ===
          userId
      );


    res.json({

      userId,

      totalEvents:
        events.length,

      events

    });

  }
);


// =====================================
// Start server
// =====================================

app.listen(
  PORT,
  () => {

    console.log(
      `ShopSmart backend running on http://localhost:${PORT}`
    );

  }
);