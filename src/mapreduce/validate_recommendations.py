
import csv

scores_file = "output/weighted_scores.tsv"
recommendations_file = "output/top5_recommendations.csv"

# Products the user has already interacted with
seen = set()

with open(scores_file, "r", encoding="utf-8") as file:
    for line in file:
        parts = line.strip().split("\t")
        if len(parts) == 3:
            user_id, product_id, score = parts
            seen.add((user_id, product_id))

total = 0
already_seen = 0

with open(recommendations_file, "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total += 1
        key = (row["user_id"], row["product_id"])

        if key in seen:
            already_seen += 1

print("Total recommendations:", total)
print("Already-seen products recommended:", already_seen)
print("Unseen recommendations:", total - already_seen)
