
import csv
from collections import defaultdict

DATA = "data/interactions_clean.csv"
CUTOFF = "2015-09-01"
K = 5

train_seen = defaultdict(set)
test_items = defaultdict(set)
popularity = defaultdict(int)

weights = {
    "view": 1,
    "addtocart": 3,
    "transaction": 5
}

# Load training and test data
with open(DATA, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        user = row["user_id"]
        item = row["product_id"]
        date = row["datetime"][:10]
        event = row["event"].strip().lower()

        if date < CUTOFF:
            train_seen[user].add(item)
            popularity[item] += weights.get(event, 1)
        else:
            test_items[user].add(item)

# Remove products already seen during training
for user in test_items:
    test_items[user] -= train_seen.get(user, set())

# Popularity ranking based only on training data
top_items = sorted(
    popularity.items(),
    key=lambda x: x[1],
    reverse=True
)

eligible_users = [
    user for user in test_items
    if user in train_seen and test_items[user]
]

hits = 0
precision_sum = 0.0
recall_sum = 0.0
users_with_recommendations = 0
total_recommendations = 0

for user in eligible_users:
    recommendations = []

    for item, score in top_items:
        if item not in train_seen[user]:
            recommendations.append(item)

        if len(recommendations) == K:
            break

    if recommendations:
        users_with_recommendations += 1

    total_recommendations += len(recommendations)

    relevant = len(set(recommendations) & test_items[user])

    precision_sum += relevant / K
    recall_sum += relevant / len(test_items[user])

    if relevant > 0:
        hits += 1

total_users = len(eligible_users)

print("\n=== Popularity Baseline Evaluation ===")
print("Training cutoff:", CUTOFF)
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
