#!/usr/bin/env python3

import sys

current_key = None
current_count = 0

for line in sys.stdin:
    line = line.strip()

    if not line:
        continue

    user_id, product_id, count = line.split("\t")

    key = (user_id, product_id)

    if current_key == key:
        current_count += int(count)

    else:
        if current_key is not None:
            print(
                f"{current_key[0]}\t{current_key[1]}\t{current_count}"
            )

        current_key = key
        current_count = int(count)

# Output the final key
if current_key is not None:
    print(
        f"{current_key[0]}\t{current_key[1]}\t{current_count}"
    )
