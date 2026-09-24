# E-Commerce Recommendation System Using Hadoop

## Sprint 2 — Dataset Collection & Data Understanding

**Status: Completed**

### Dataset

RetailRocket E-Commerce Recommender System Dataset

### Dataset Understanding

* Total raw interaction records: 2,756,101
* Events:

  * View
  * Add to Cart
  * Transaction
* Unique users: 1,407,580
* Unique products: 235,061
* Unique transactions: 17,672

### Data Preprocessing

The dataset was cleaned using Python and Pandas.

Completed tasks:

* Removed duplicate records
* Renamed columns for clarity
* Converted timestamps into datetime format
* Removed invalid user records
* Created the cleaned interaction dataset
* Verified missing values and event distributions

### Output

The cleaned dataset contains:

**2,755,638 interaction records**

Main columns:

```text
user_id
product_id
event
datetime
transaction_id
```

The preprocessing implementation is available in:

```text
src/preprocess.py
```

---

## Sprint 3 — Hadoop & HDFS Setup

**Status: In Progress**

Current setup:

* WSL 2 Ubuntu environment configured
* OpenJDK 17 installed
* JAVA_HOME configured
* Hadoop 3.4.2 download started
* HDFS configuration and testing are the next steps

### Planned Work

1. Complete Hadoop installation
2. Configure Hadoop environment variables
3. Configure HDFS
4. Initialize NameNode
5. Start HDFS services
6. Create project directories in HDFS
7. Upload the cleaned interaction dataset
8. Verify HDFS storage and file access

### MapReduce Plan

Python will be used for the Mapper and Reducer logic through Hadoop Streaming.

The planned processing flow is:

```text
Clean Interaction Dataset
          ↓
         HDFS
          ↓
   Python Mapper
          ↓
     Shuffle/Sort
          ↓
   Python Reducer
          ↓
Processed Interaction Data
          ↓
Recommendation Engine
```
