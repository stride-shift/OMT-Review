#!/usr/bin/env python3
"""
Examine the structure of the OMT application Excel files.
"""

import pandas as pd
from pathlib import Path

DATA_DIR = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Context")

def examine_excel(filepath: Path):
    print(f"\n{'='*80}")
    print(f"FILE: {filepath.name}")
    print(f"{'='*80}")

    # Read all sheet names
    xl = pd.ExcelFile(filepath)
    print(f"\nSheets: {xl.sheet_names}")

    for sheet in xl.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = pd.read_excel(filepath, sheet_name=sheet)
        print(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns")
        print(f"\nColumns ({len(df.columns)}):")
        for i, col in enumerate(df.columns):
            dtype = str(df[col].dtype)
            non_null = df[col].notna().sum()
            sample_val = df[col].dropna().iloc[0] if non_null > 0 else "N/A"
            if isinstance(sample_val, str) and len(sample_val) > 60:
                sample_val = sample_val[:60] + "..."
            print(f"  {i+1:3}. {col[:50]:50} | {dtype:10} | {non_null:4} non-null | sample: {sample_val}")


def main():
    # Check the standard version first (smaller file)
    standard_file = DATA_DIR / "August 2025 Applications.xlsx"
    if standard_file.exists():
        examine_excel(standard_file)

    # Optionally check full version
    full_file = DATA_DIR / "August 2025 Applications_Full.xlsx"
    if full_file.exists():
        print("\n\n" + "="*80)
        print("FULL VERSION - Additional columns check")
        print("="*80)
        xl = pd.ExcelFile(full_file)
        for sheet in xl.sheet_names:
            df_full = pd.read_excel(full_file, sheet_name=sheet)
            df_std = pd.read_excel(standard_file, sheet_name=sheet) if standard_file.exists() else None

            print(f"\n--- Sheet: {sheet} ---")
            print(f"Full shape: {df_full.shape[0]} rows x {df_full.shape[1]} columns")

            if df_std is not None:
                extra_cols = set(df_full.columns) - set(df_std.columns)
                if extra_cols:
                    print(f"\nAdditional columns in Full version ({len(extra_cols)}):")
                    for col in sorted(extra_cols):
                        print(f"  - {col}")


if __name__ == "__main__":
    main()
