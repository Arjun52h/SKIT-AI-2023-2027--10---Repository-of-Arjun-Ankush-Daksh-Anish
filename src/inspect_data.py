import pandas as pd

# Load the dataset
df = pd.read_csv("data/events.csv")

print("Dataset Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 Rows:")
print(df.head())

print("\nEvent Types:")
print(df["event"].value_counts())

print("\nMissing Values:")
print(df.isnull().sum())