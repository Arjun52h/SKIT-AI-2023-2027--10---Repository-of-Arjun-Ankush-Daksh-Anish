# E-Commerce Recommendation System Using Hadoop

## System Architecture

The project combines Hadoop, Python, MongoDB and the MERN stack to build an e-commerce recommendation system.

```text
                    React.js
                       ↓
              Node.js + Express.js
                       ↓
                    MongoDB
                       ↓
              Interaction Data
                       ↓
                    HDFS
                       ↓
             Hadoop MapReduce
                ↙           ↘
        Python Mapper    Python Reducer
                ↘           ↙
              Processed Data
                    ↓
         Recommendation Engine
                    ↓
             Top-N Products
                    ↓
                  MongoDB
                    ↓
             Express.js API
                    ↓
                React.js UI
```

## Role of Each Technology

### Hadoop HDFS

Used to store large-scale e-commerce interaction data.

### Hadoop MapReduce

Used to process and aggregate user-product interaction data.

### Python

Used for:

* Data preprocessing
* Mapper logic
* Reducer logic
* Recommendation processing

### MongoDB

Used to store application data and recommendation results.

### Node.js and Express.js

Used to provide backend REST APIs.

### React.js

Used to provide the user interface and display personalized recommendations.

## Recommendation Approach

The initial recommendation approach will use interaction-based collaborative filtering.

User interactions such as:

```text
view
addtocart
transaction
```

will be processed to identify relationships between users and products.

The system will eventually generate a ranked list of recommended products for a user.
