
import csv
from collections import defaultdict

DATA = "data/interactions_clean.csv"
COLLAB_FILE = "output/top5_recommendations.csv"
CUTOFF = "2015-09-01"
K = 5

train_seen = defaultdict(set)
test_items = defaultdict(set)
popularity = defaultdict(int)

weights = {"view": 1, "addtocart": 3, "transaction": 5}

# Load train and test data
with open(DATA, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        user = row["user_id"]
        item = row["product_id"]
        date = row["datetime"][:10]
        event = row["event"].strip().lower()

        if date < CUTOFF:
            train_seen[user].add(item)
            popularity[item] += weights.get(event, 1)
        else:
            test_items[user].add(item)

# Remove training products from test ground truth
for user in test_items:
    test_items[user] -= train_seen[user]

# Same eligible users for both models
eligible = [
    user for user in test_items
    if train_seen[user] and test_items[user]
]

# Load collaborative recommendations
collab = defaultdict(list)

with open(COLLAB_FILE, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        collab[row["user_id"]].append(row["product_id"])

# Build popularity recommendations
top_items = sorted(
    popularity.items(),
    key=lambda x: x[1],
    reverse=True
)


pop_recs = {}

for index, user in enumerate(eligible, start=1):
    recs = []

    for item, score in top_items:
        if item not in train_seen[user]:
            recs.append(item)

        if len(recs) == K:
            break

    pop_recs[user] = recs

    if index % 1000 == 0:
        print("Popularity users processed:", index)



def evaluate(name, recommendations):
    precision = recall = 0.0
    hits = users_with_recs = total_recs = 0

    for user in eligible:
        recs = list(dict.fromkeys(recommendations.get(user, [])))[:K]
        relevant = len(set(recs) & test_items[user])

        if recs:
            users_with_recs += 1

        total_recs += len(recs)
        precision += relevant / K
        recall += relevant / len(test_items[user])

        if relevant > 0:
            hits += 1

    n = len(eligible)

    print(f"\n=== {name} ===")
    print("Eligible users:", n)
    print("Users receiving recommendations:", users_with_recs)
    print("Total recommendations:", total_recs)

    if n:
        print(f"Precision@{K}: {precision / n:.6f}")
        print(f"Recall@{K}:    {recall / n:.6f}")
        print(f"HitRate@{K}:   {hits / n:.6f}")
        print(f"Coverage@{K}:  {users_with_recs / n:.6f}")


evaluate("Collaborative Filtering (Jaccard)", collab)
evaluate("Popularity Baseline", pop_recs)
