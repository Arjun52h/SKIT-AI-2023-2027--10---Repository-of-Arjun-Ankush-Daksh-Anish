# import pandas as pd

# df = pd.read_csv("data/events.csv")

# # Remove exact duplicate rows
# df = df.drop_duplicates()

# print("Shape after removing duplicates:", df.shape)

# print("\nMissing values after duplicate removal:")
# print(df.isnull().sum())


# # Rename columns for clarity
# df = df.rename(columns={
#     "visitorid": "user_id",
#     "itemid": "product_id",
#     "transactionid": "transaction_id"
# })

# # print("\nColumns after renaming:")
# # print(df.columns.tolist())

# # Convert timestamp from milliseconds to readable datetime
# df["datetime"] = pd.to_datetime(df["timestamp"], unit="ms")

# # print("\nFirst 5 timestamps:")
# # print(df[["timestamp", "datetime"]].head())

# # print("Invalid user IDs:", (df["user_id"] <= 0).sum())
# # print("Invalid product IDs:", (df["product_id"] <= 0).sum())

# # print("\nInvalid user ID records:")
# # print(df[df["user_id"] <= 0])

# df = df[df['user_id'] > 0]
# print("Invalid user IDs:", (df["user_id"] <= 0).sum())
# print("Shape after cleaning:", df.shape)


# # Select columns for the cleaned interaction dataset
# interactions_clean = df[
#     ["user_id", "product_id", "event", "datetime", "transaction_id"]
# ].copy()

# print("\nClean dataset shape:", interactions_clean.shape)

# print("\nClean dataset:")
# print(interactions_clean.head())


# # Save the cleaned dataset
# interactions_clean.to_csv(
#     "data/interactions_clean.csv",
#     index=False
# )

# print("\nClean dataset saved successfully!")

import pandas as pd

df_clean = pd.read_csv("data/interactions_clean.csv")

print("Shape:", df_clean.shape)

print("\nColumns:")
print(df_clean.columns.tolist())

print("\nMissing values:")
print(df_clean.isnull().sum())

print("\nEvent counts:")
print(df_clean["event"].value_counts())