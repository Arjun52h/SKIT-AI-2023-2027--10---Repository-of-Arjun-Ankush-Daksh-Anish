
import sys
import csv

reader = csv.reader(sys.stdin)

weights = {
    "view": 1,
    "addtocart": 3,
    "transaction": 5
}

for row in reader:
    if not row or row[0] == "user_id":
        continue

    if len(row) < 3:
        continue

    user_id = row[0]
    product_id = row[1]
    event = row[2].strip().lower()

    if event in weights:
        score = weights[event]
        print(f"{user_id}\t{product_id}\t{score}")
