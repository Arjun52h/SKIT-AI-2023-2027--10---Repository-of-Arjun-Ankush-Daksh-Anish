
import csv
from collections import defaultdict

DATA = "data/interactions_clean.csv"
RECOMMENDATIONS = "output/top5_recommendations.csv"
CUTOFF = "2015-09-01"
K = 5

train_seen = defaultdict(set)
test_items = defaultdict(set)
recommended = defaultdict(list)

# Load chronological train/test interactions
with open(DATA, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        user = row["user_id"]
        item = row["product_id"]
        date = row["datetime"][:10]

        if date < CUTOFF:
            train_seen[user].add(item)
        else:
            test_items[user].add(item)

# Load updated recommendations
with open(RECOMMENDATIONS, newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        user = row["user_id"]
        item = row["product_id"]

        if item not in train_seen[user]:
            recommended[user].append(item)

# Users with training history and test interactions
eligible = [
    user for user in test_items
    if train_seen[user] and test_items[user]
]

precision_sum = 0.0
recall_sum = 0.0
hits = 0
users_with_recommendations = 0
total_recommendations = 0

for user in eligible:
    recs = list(dict.fromkeys(recommended.get(user, [])))[:K]

    if recs:
        users_with_recommendations += 1

    total_recommendations += len(recs)

    relevant = len(set(recs) & test_items[user])

    # Precision uses fixed K, even if fewer than K are returned
    precision_sum += relevant / K

    # Recall uses relevant held-out test items
    recall_sum += relevant / len(test_items[user])

    if relevant > 0:
        hits += 1

total_users = len(eligible)

print("\n=== Collaborative Recommendation Evaluation ===")
print("Eligible test users:", total_users)
print("Users receiving recommendations:", users_with_recommendations)
print("Total recommendations evaluated:", total_recommendations)

if total_users:
    print(f"Precision@{K}: {precision_sum / total_users:.6f}")
    print(f"Recall@{K}:    {recall_sum / total_users:.6f}")
    print(f"HitRate@{K}:   {hits / total_users:.6f}")
    print(
        f"Coverage@{K}:  "
        f"{users_with_recommendations / total_users:.6f}"
    )
