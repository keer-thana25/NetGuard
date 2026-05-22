import pandas as pd

def remove_low_variance_features(df: pd.DataFrame) -> tuple[pd.DataFrame, list]:
    """
    Identifies and removes constant or zero-variance columns to clean network telemetry.
    """
    low_variance_cols = []
    for col in df.columns:
        # Ignore label column during variance analysis
        if col == "label":
            continue
        if df[col].nunique() <= 1:
            low_variance_cols.append(col)
            
    df_clean = df.drop(columns=low_variance_cols, errors="ignore")
    return df_clean, low_variance_cols
