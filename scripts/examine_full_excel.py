#!/usr/bin/env python3
"""
Examine the text content fields in the Full version of applications.
"""

import pandas as pd
from pathlib import Path

DATA_DIR = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Context")

def main():
    full_file = DATA_DIR / "August 2025 Applications_Full.xlsx"

    xl = pd.ExcelFile(full_file)

    # Focus on the main applications sheet
    df = pd.read_excel(full_file, sheet_name="August 2025 call", header=1)

    print("COLUMNS IN FULL VERSION:")
    print("=" * 80)
    for i, col in enumerate(df.columns):
        print(f"{i+1:3}. {col}")

    print("\n\nSAMPLE ROW (first complete row):")
    print("=" * 80)

    # Get first row with reasonable data
    sample = df.iloc[5]  # Skip headers
    for col in df.columns:
        val = sample[col]
        if pd.notna(val):
            val_str = str(val)
            if len(val_str) > 200:
                val_str = val_str[:200] + "..."
            print(f"\n{col}:")
            print(f"  {val_str}")

    # Check unique values for key fields
    print("\n\nKEY FIELD UNIQUE VALUES:")
    print("=" * 80)

    key_fields = ['What do you need funding for?', 'Status', 'Institution', 'Internal review check']
    for field in key_fields:
        if field in df.columns:
            print(f"\n{field}:")
            for val in df[field].dropna().unique()[:15]:
                count = (df[field] == val).sum()
                print(f"  - {val}: {count}")


if __name__ == "__main__":
    main()
