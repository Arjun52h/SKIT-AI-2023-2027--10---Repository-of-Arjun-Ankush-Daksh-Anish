
from collections import defaultdict, Counter
import csv
import os

INPUT_FILE = "output/train_weighted_scores.tsv"
OUTPUT_FILE = "output/top5_recommendations.csv"

# Start with a manageable sample for testing.
MAX_USERS = 5000
TOP_N = 5
SIMILAR_USERS_LIMIT = 20

user_products = defaultdict(dict)
product_users = defaultdict(dict)

with open(INPUT_FILE, "r", encoding="utf-8") as file:
    for line in file:
        parts = line.strip().split("\t")
        if len(parts) != 3:
            continue

        user_id, product_id, score = parts
        user_products[user_id][product_id] = int(score)
        product_users[product_id][user_id] = int(score)

        if len(user_products) >= MAX_USERS and user_id not in user_products:
            continue

# Use only the first 5,000 users for this prototype.
selected_users = list(user_products.keys())[:MAX_USERS]

os.makedirs("output", exist_ok=True)

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["user_id", "rank", "product_id", "score"])

    for user_id in selected_users:
        seen_products = user_products[user_id]
        similar_users = Counter()

        for product_id in seen_products:
            for other_user in product_users[product_id]:
                if other_user != user_id:
                    similar_users[other_user] += 1

        candidates = Counter()

        for other_user, _ in similar_users.most_common(
            SIMILAR_USERS_LIMIT
        ):
            for product_id, score in user_products[other_user].items():
                if product_id not in seen_products:
                    candidates[product_id] += score

        for rank, (product_id, score) in enumerate(
            candidates.most_common(TOP_N), start=1
        ):
            writer.writerow([user_id, rank, product_id, score])

print(f"Recommendations saved to {OUTPUT_FILE}")
print(f"Users processed: {len(selected_users)}")
