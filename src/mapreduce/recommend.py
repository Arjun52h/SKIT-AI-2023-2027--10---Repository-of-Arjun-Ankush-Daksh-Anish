
from collections import defaultdict, Counter
import csv
import os

INPUT_FILE = "output/train_weighted_scores.tsv"
OUTPUT_FILE = "output/top5_recommendations.csv"

TOP_N = 5
SIMILAR_USERS_LIMIT = 20

user_products = defaultdict(dict)
product_users = defaultdict(dict)

# Load weighted user-product interactions
with open(INPUT_FILE, "r", encoding="utf-8") as file:
    for line in file:
        parts = line.strip().split("\t")

        if len(parts) != 3:
            continue

        user_id, product_id, score = parts

        try:
            score = int(score)
        except ValueError:
            continue

        user_products[user_id][product_id] = score
        product_users[product_id][user_id] = score

print("Total users loaded:", len(user_products))
print("Total products loaded:", len(product_users))

os.makedirs("output", exist_ok=True)

total_recommendations = 0

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["user_id", "rank", "product_id", "score"])

    for index, (user_id, seen_products) in enumerate(
        user_products.items(), start=1
    ):

        similar_users = Counter()

        # Find users who interacted with common products
        for product_id in seen_products:
            for other_user in product_users[product_id]:
                if other_user != user_id:
                    similar_users[other_user] += 1

        # Calculate Jaccard similarity
        similarities = []

        for other_user, common_count in similar_users.items():
            other_products = user_products[other_user]

            union_count = (
                len(seen_products)
                + len(other_products)
                - common_count
            )

            similarity = common_count / union_count

            if similarity > 0:
                similarities.append((other_user, similarity))

        similarities.sort(key=lambda x: x[1], reverse=True)

        # Select top similar users
        top_similar_users = similarities[:SIMILAR_USERS_LIMIT]

        candidates = defaultdict(float)

        for other_user, similarity in top_similar_users:
            for product_id, score in user_products[other_user].items():

                if product_id not in seen_products:
                    candidates[product_id] += score * similarity

        # Generate top 5 recommendations
        top_products = sorted(
            candidates.items(),
            key=lambda x: x[1],
            reverse=True
        )[:TOP_N]

        for rank, (product_id, score) in enumerate(
            top_products, start=1
        ):
            writer.writerow([
                user_id,
                rank,
                product_id,
                round(score, 4)
            ])
            total_recommendations += 1

        if index % 10000 == 0:
            print("Users processed:", index)

print("\nRecommendations generated successfully!")
print("Total users processed:", len(user_products))
print("Total recommendations:", total_recommendations)
print("Output file:", OUTPUT_FILE)
