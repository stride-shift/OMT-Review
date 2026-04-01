#!/usr/bin/env python3
"""
OMT Phase 1: Automated Completeness Check and Initial Filtering

This script implements the Phase 1 automated completeness check for the
Oppenheimer Memorial Trust's funding application review process.

Key Design Decisions:
1. Process ONE application at a time to avoid maxing out context window
2. Use Claude Haiku for fast, cost-effective initial filtering
3. Return structured JSON decisions for each application
4. Aggregate results for analysis and reporting

Phase 1 Checks:
- Completeness: Are all required text fields present and substantive?
- Eligibility: Does the application meet basic criteria?
- Red Flags: Any obvious issues that should flag manual review?
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Optional

import pandas as pd
import anthropic

# --- Configuration ---
API_KEY = os.environ.get("CLAUDE_API")
DATA_DIR = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Context")
OUTPUT_DIR = Path("/home/user/OMT-Review/scripts/filter_output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HAIKU_MODEL = "claude-haiku-4-5"

client = anthropic.Anthropic(api_key=API_KEY)

# --- Required fields by application type ---
REQUIRED_FIELDS = {
    "common": [
        "Application ID",
        "Primary Contact",
        "Email",
        "What do you need funding for?",
        "Institution",
        "FACULTY OMT UPDATED",
        "Study choice",
        "Please indicate the topic related to your study2",
        "Please indicate the institution you have applied to2",
        "Start date",
        "Duration",
        "Motivation",
        "Year 1",
    ],
    "Masters": [
        "Description of programme",
        "Significance and relevance of intended study",
    ],
    "Doctoral": [
        "A brief synopsis of the work programme or research plan",
        "Significance of intended study",
    ],
    "Postdoctoral": [
        "A brief synopsis of the work programme or research plan",
        "Significance of intended study",
        "The names and locations of host institutions, locally and/or abroad",
    ],
    "Sabbatical": [
        "A brief synopsis of the work programme or research plan",
        "Significance of intended study",
        "The names and locations of host institutions, locally and/or abroad",
    ],
    "International": [
        "Compelling reasons for undertaking the programme of study abroad including commentary on the unique or highly specialised character of the programme, institution or faculty",
    ],
}

# Minimum character thresholds for substantive responses
MIN_CHARS = {
    "Motivation": 200,
    "Description of programme": 100,
    "Significance and relevance of intended study": 100,
    "A brief synopsis of the work programme or research plan": 100,
    "Significance of intended study": 100,
    "Compelling reasons for undertaking the programme of study abroad including commentary on the unique or highly specialised character of the programme, institution or faculty": 100,
}


# --- Completeness Check (No LLM) ---
def check_completeness(row: pd.Series) -> dict:
    """
    Check if required fields are present and substantive.
    Returns a dict with completeness status and missing fields.
    """
    app_type = row.get("What do you need funding for?", "Unknown")
    institution = row.get("Institution", "Local")

    # Determine required fields for this application
    required = REQUIRED_FIELDS["common"].copy()
    if app_type in REQUIRED_FIELDS:
        required.extend(REQUIRED_FIELDS[app_type])
    if institution == "International":
        required.extend(REQUIRED_FIELDS["International"])

    # Check each required field
    missing = []
    insufficient = []
    for field in required:
        value = row.get(field)
        if pd.isna(value) or str(value).strip() == "":
            missing.append(field)
        elif field in MIN_CHARS:
            # Check minimum length for substantive fields
            clean_value = str(value).replace("_x000D_", "").replace("\n", " ").strip()
            if len(clean_value) < MIN_CHARS[field]:
                insufficient.append({
                    "field": field,
                    "length": len(clean_value),
                    "required": MIN_CHARS[field]
                })

    is_complete = len(missing) == 0 and len(insufficient) == 0

    return {
        "is_complete": is_complete,
        "missing_fields": missing,
        "insufficient_fields": insufficient,
        "required_field_count": len(required),
        "present_field_count": len(required) - len(missing),
    }


# --- Basic Eligibility Check (No LLM) ---
def check_eligibility(row: pd.Series) -> dict:
    """
    Check basic eligibility criteria.
    Returns a dict with eligibility status and reasons.
    """
    issues = []
    warnings = []

    # Check status
    status = row.get("Status", "")
    if status == "Not Eligible":
        issues.append("Application marked as Not Eligible in system")
    elif status == "Discarded":
        issues.append("Application marked as Discarded in system")
    elif status == "Revisions Requested":
        warnings.append("Revisions have been requested")

    # Check application type is valid
    app_type = row.get("What do you need funding for?", "")
    valid_types = ["Masters", "Doctoral", "Postdoctoral", "Sabbatical"]
    if app_type not in valid_types:
        issues.append(f"Invalid application type: {app_type}")

    # Check email is present
    email = row.get("Email", "")
    if pd.isna(email) or "@" not in str(email):
        warnings.append("Missing or invalid email address")

    # Check start date is in the future (relative to application cycle)
    start_date = row.get("Start date")
    if pd.notna(start_date):
        try:
            if hasattr(start_date, 'year'):
                if start_date.year < 2025:
                    issues.append(f"Start date in the past: {start_date}")
        except Exception:
            pass

    is_eligible = len(issues) == 0

    return {
        "is_eligible": is_eligible,
        "eligibility_issues": issues,
        "eligibility_warnings": warnings,
    }


# --- LLM-Based Quality Check ---
QUALITY_CHECK_PROMPT = """You are a scholarship application screener for the Oppenheimer Memorial Trust. Your job is to perform an initial quality check on applications to flag any obvious issues.

Analyze this application and provide a structured assessment. Be concise and factual.

APPLICATION DATA:
- Application ID: {app_id}
- Application Type: {app_type}
- Institution: {institution}
- Faculty: {faculty}
- Study Choice: {study_choice}
- Study Topic: {study_topic}
- Target Institution: {target_institution}

MOTIVATION (excerpt):
{motivation}

STUDY DESCRIPTION (excerpt):
{description}

Respond in JSON format ONLY with these exact fields:
{{
    "quality_tier": "A" | "B" | "C" | "D",
    "red_flags": ["list of concerning issues if any"],
    "notes": "brief 1-2 sentence summary",
    "ai_generated_likelihood": "low" | "medium" | "high"
}}

Quality tiers:
- A: Strong application, clear and specific
- B: Adequate application, meets basic requirements
- C: Weak application, vague or generic content
- D: Problematic application, significant issues

Red flags to watch for:
- Generic/boilerplate text that could apply to any application
- Mismatch between stated field and study topic
- Unrealistic timelines or budgets
- Signs of AI-generated content (overly polished, generic phrasing)
- Spelling/grammar issues that suggest lack of care
- Missing key information despite space being available

Respond with ONLY the JSON, no other text."""


def check_quality_with_llm(row: pd.Series) -> Optional[dict]:
    """
    Use Claude Haiku to perform a quality check on application content.
    Returns structured quality assessment.
    """
    # Extract and truncate fields to avoid token overflow
    def truncate(val, max_chars=800):
        if pd.isna(val):
            return "N/A"
        s = str(val).replace("_x000D_", " ").strip()
        return s[:max_chars] + "..." if len(s) > max_chars else s

    motivation = truncate(row.get("Motivation", ""))
    description = truncate(
        row.get("Description of programme") or
        row.get("A brief synopsis of the work programme or research plan") or
        row.get("Significance of intended study") or
        ""
    )

    prompt = QUALITY_CHECK_PROMPT.format(
        app_id=row.get("Application ID", "Unknown"),
        app_type=row.get("What do you need funding for?", "Unknown"),
        institution=row.get("Institution", "Unknown"),
        faculty=row.get("FACULTY OMT UPDATED", "Unknown"),
        study_choice=truncate(row.get("Study choice", ""), 100),
        study_topic=truncate(row.get("Please indicate the topic related to your study2", ""), 200),
        target_institution=truncate(row.get("Please indicate the institution you have applied to2", ""), 100),
        motivation=motivation,
        description=description,
    )

    try:
        response = client.messages.create(
            model=HAIKU_MODEL,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        result_text = response.content[0].text.strip()

        # Parse JSON response
        # Handle potential markdown code blocks
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]

        result = json.loads(result_text)
        result["tokens_in"] = response.usage.input_tokens
        result["tokens_out"] = response.usage.output_tokens
        return result

    except json.JSONDecodeError as e:
        return {
            "quality_tier": "?",
            "red_flags": [f"LLM response parse error: {str(e)}"],
            "notes": result_text[:200] if 'result_text' in dir() else "Parse error",
            "ai_generated_likelihood": "unknown",
            "error": str(e)
        }
    except Exception as e:
        return {
            "quality_tier": "?",
            "red_flags": [f"LLM error: {str(e)}"],
            "notes": "Error during quality check",
            "ai_generated_likelihood": "unknown",
            "error": str(e)
        }


def process_single_application(row: pd.Series, use_llm: bool = True) -> dict:
    """
    Process a single application through all Phase 1 checks.
    """
    app_id = row.get("Application ID", "Unknown")

    # 1. Completeness check (no LLM)
    completeness = check_completeness(row)

    # 2. Eligibility check (no LLM)
    eligibility = check_eligibility(row)

    # 3. Quality check (with LLM) - only if complete and eligible
    quality = None
    if use_llm and completeness["is_complete"] and eligibility["is_eligible"]:
        quality = check_quality_with_llm(row)

    # Determine overall filter decision
    if not eligibility["is_eligible"]:
        filter_decision = "REJECT"
        filter_reason = "Failed eligibility check"
    elif not completeness["is_complete"]:
        filter_decision = "INCOMPLETE"
        filter_reason = "Missing required fields"
    elif quality and quality.get("quality_tier") == "D":
        filter_decision = "FLAG_REVIEW"
        filter_reason = "Quality concerns flagged"
    elif quality and len(quality.get("red_flags", [])) > 0:
        filter_decision = "FLAG_REVIEW"
        filter_reason = "Red flags detected"
    else:
        filter_decision = "PASS"
        filter_reason = "Passed all Phase 1 checks"

    return {
        "application_id": app_id,
        "primary_contact": row.get("Primary Contact", ""),
        "application_type": row.get("What do you need funding for?", ""),
        "institution": row.get("Institution", ""),
        "faculty": row.get("FACULTY OMT UPDATED", ""),
        "status": row.get("Status", ""),
        "filter_decision": filter_decision,
        "filter_reason": filter_reason,
        "completeness": completeness,
        "eligibility": eligibility,
        "quality": quality,
        "processed_at": datetime.now().isoformat(),
    }


def run_phase1_filter(
    excel_path: Path,
    sheet_name: str = "August 2025 call",
    limit: Optional[int] = None,
    use_llm: bool = True,
    skip_already_processed: bool = True,
):
    """
    Run Phase 1 filter on all applications in the Excel file.

    Args:
        excel_path: Path to the Excel file
        sheet_name: Name of the sheet to process
        limit: Optional limit on number of applications to process
        use_llm: Whether to use LLM for quality checks
        skip_already_processed: Skip applications already in output file
    """
    print(f"OMT Phase 1: Automated Completeness Check")
    print("=" * 60)
    print(f"Data source: {excel_path.name}")
    print(f"Sheet: {sheet_name}")
    print(f"LLM quality check: {'Enabled' if use_llm else 'Disabled'}")

    # Load data
    df = pd.read_excel(excel_path, sheet_name=sheet_name, header=1)
    print(f"Total applications: {len(df)}")

    # Load existing results if any
    output_file = OUTPUT_DIR / "phase1_filter_results.json"
    existing_results = {}
    if skip_already_processed and output_file.exists():
        with open(output_file) as f:
            existing_data = json.load(f)
            existing_results = {r["application_id"]: r for r in existing_data.get("results", [])}
        print(f"Existing results loaded: {len(existing_results)} applications")

    # Process applications
    results = []
    stats = {
        "total": 0,
        "pass": 0,
        "incomplete": 0,
        "reject": 0,
        "flag_review": 0,
        "skipped": 0,
        "errors": 0,
    }

    applications = df.iterrows()
    if limit:
        applications = list(applications)[:limit]
        print(f"Processing limit: {limit}")

    print("\nProcessing applications...")
    print("-" * 60)

    for idx, row in applications:
        app_id = row.get("Application ID", "")
        if not app_id or pd.isna(app_id):
            continue

        stats["total"] += 1

        # Skip if already processed
        if skip_already_processed and app_id in existing_results:
            results.append(existing_results[app_id])
            stats["skipped"] += 1
            continue

        try:
            result = process_single_application(row, use_llm=use_llm)
            results.append(result)

            # Update stats
            decision = result["filter_decision"]
            if decision == "PASS":
                stats["pass"] += 1
            elif decision == "INCOMPLETE":
                stats["incomplete"] += 1
            elif decision == "REJECT":
                stats["reject"] += 1
            elif decision == "FLAG_REVIEW":
                stats["flag_review"] += 1

            # Progress output
            quality_tier = result.get("quality", {}).get("quality_tier", "-") if result.get("quality") else "-"
            print(f"  [{stats['total']:4d}] {app_id}: {decision:12} (Quality: {quality_tier})")

            # Rate limiting for API calls
            if use_llm and result.get("quality"):
                time.sleep(0.2)

        except Exception as e:
            stats["errors"] += 1
            print(f"  [{stats['total']:4d}] {app_id}: ERROR - {str(e)}")
            results.append({
                "application_id": app_id,
                "filter_decision": "ERROR",
                "filter_reason": str(e),
                "processed_at": datetime.now().isoformat(),
            })

    # Save results
    output_data = {
        "run_timestamp": datetime.now().isoformat(),
        "source_file": str(excel_path),
        "sheet_name": sheet_name,
        "stats": stats,
        "results": results,
    }

    with open(output_file, "w") as f:
        json.dump(output_data, f, indent=2, default=str)

    # Print summary
    print("\n" + "=" * 60)
    print("PHASE 1 FILTER SUMMARY")
    print("=" * 60)
    print(f"Total processed: {stats['total']}")
    print(f"  PASS:         {stats['pass']:4d} ({100*stats['pass']/max(1,stats['total']):.1f}%)")
    print(f"  INCOMPLETE:   {stats['incomplete']:4d} ({100*stats['incomplete']/max(1,stats['total']):.1f}%)")
    print(f"  FLAG_REVIEW:  {stats['flag_review']:4d} ({100*stats['flag_review']/max(1,stats['total']):.1f}%)")
    print(f"  REJECT:       {stats['reject']:4d} ({100*stats['reject']/max(1,stats['total']):.1f}%)")
    if stats['skipped']:
        print(f"  (Skipped):    {stats['skipped']:4d}")
    if stats['errors']:
        print(f"  (Errors):     {stats['errors']:4d}")

    print(f"\nResults saved to: {output_file}")

    return output_data


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="OMT Phase 1: Automated Completeness Check")
    parser.add_argument("--limit", type=int, help="Limit number of applications to process")
    parser.add_argument("--no-llm", action="store_true", help="Disable LLM quality checks")
    parser.add_argument("--reprocess", action="store_true", help="Reprocess all applications (ignore existing results)")
    parser.add_argument("--dry-run", action="store_true", help="Dry run without LLM (completeness/eligibility only)")

    args = parser.parse_args()

    excel_path = DATA_DIR / "August 2025 Applications_Full.xlsx"

    if args.dry_run:
        args.no_llm = True

    run_phase1_filter(
        excel_path=excel_path,
        limit=args.limit,
        use_llm=not args.no_llm,
        skip_already_processed=not args.reprocess,
    )


if __name__ == "__main__":
    main()
