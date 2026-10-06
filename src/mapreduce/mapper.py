#!/usr/bin/env python3

import sys
import csv

reader = csv.reader(sys.stdin)

for row in reader:

    # Skip CSV header
    if row and row[0] == "user_id":
        continue

    # Ignore malformed rows
    if len(row) < 3:
        continue

    user_id = row[0]
    product_id = row[1]

    print(f"{user_id}\t{product_id}\t1")
