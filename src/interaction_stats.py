import pandas as pd


def load_interactions(file_path):
    """Load the cleaned interaction dataset."""
    df = pd.read_csv(file_path)
    return df


def get_event_counts(df):
    """Count each type of user interaction."""
    return df["event"].value_counts()


def get_user_activity(df):
    """Calculate the number of interactions for each user."""
    return (
        df.groupby("user_id")
        .size()
        .sort_values(ascending=False)
    )


def get_product_activity(df):
    """Calculate the number of interactions for each product."""
    return (
        df.groupby("product_id")
        .size()
        .sort_values(ascending=False)
    )


if __name__ == "__main__":

    file_path = "data/interactions_clean.csv"

    df = load_interactions(file_path)

    print("Dataset shape:", df.shape)

    print("\nEvent counts:")
    print(get_event_counts(df))

    print("\nTop 10 active users:")
    print(get_user_activity(df).head(10))

    print("\nTop 10 popular products:")
    print(get_product_activity(df).head(10))