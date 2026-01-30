#!/usr/bin/env python3
"""
Generate a human-readable report from Phase 1 filter results.
"""

import json
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime

OUTPUT_DIR = Path("/home/user/OMT-Review/scripts/filter_output")


def generate_report():
    """Generate markdown report from filter results."""

    results_file = OUTPUT_DIR / "phase1_filter_results.json"
    if not results_file.exists():
        print("No results file found. Run phase1_submission_filter.py first.")
        return

    with open(results_file) as f:
        data = json.load(f)

    results = data["results"]
    stats = data["stats"]

    # Group by decision
    by_decision = defaultdict(list)
    for r in results:
        by_decision[r["filter_decision"]].append(r)

    # Count quality tiers
    quality_tiers = Counter()
    ai_likelihood = Counter()
    red_flags_all = []

    for r in results:
        if r.get("quality"):
            q = r["quality"]
            quality_tiers[q.get("quality_tier", "?")] += 1
            ai_likelihood[q.get("ai_generated_likelihood", "unknown")] += 1
            red_flags_all.extend(q.get("red_flags", []))

    # Generate markdown
    report = []
    report.append("# OMT Phase 1: Automated Completeness Check Report")
    report.append("")
    report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append(f"**Source:** {data.get('source_file', 'Unknown')}")
    report.append(f"**Run Timestamp:** {data.get('run_timestamp', 'Unknown')}")
    report.append("")

    report.append("## Summary Statistics")
    report.append("")
    report.append(f"| Metric | Count | Percentage |")
    report.append(f"|--------|-------|------------|")
    total = stats.get("total", 1)
    for key in ["pass", "incomplete", "flag_review", "reject"]:
        count = stats.get(key, 0)
        pct = 100 * count / max(1, total)
        label = key.upper().replace("_", " ")
        report.append(f"| {label} | {count} | {pct:.1f}% |")
    report.append(f"| **TOTAL** | **{total}** | **100%** |")
    report.append("")

    if quality_tiers:
        report.append("## Quality Tier Distribution")
        report.append("")
        report.append("| Tier | Count | Description |")
        report.append("|------|-------|-------------|")
        tier_desc = {
            "A": "Strong - clear and specific",
            "B": "Adequate - meets basic requirements",
            "C": "Weak - vague or generic",
            "D": "Problematic - significant issues",
            "?": "Error or not assessed",
        }
        for tier in ["A", "B", "C", "D", "?"]:
            if tier in quality_tiers:
                report.append(f"| {tier} | {quality_tiers[tier]} | {tier_desc.get(tier, '')} |")
        report.append("")

    if ai_likelihood:
        report.append("## AI-Generated Content Likelihood")
        report.append("")
        report.append("| Likelihood | Count |")
        report.append("|------------|-------|")
        for level in ["low", "medium", "high", "unknown"]:
            if level in ai_likelihood:
                report.append(f"| {level.title()} | {ai_likelihood[level]} |")
        report.append("")

    # Top red flags
    if red_flags_all:
        flag_counts = Counter(red_flags_all)
        report.append("## Top Red Flags Detected")
        report.append("")
        for flag, count in flag_counts.most_common(10):
            report.append(f"- **{count}x**: {flag[:100]}{'...' if len(flag) > 100 else ''}")
        report.append("")

    # Applications flagged for review
    if by_decision.get("FLAG_REVIEW"):
        report.append("## Applications Flagged for Review")
        report.append("")
        report.append("| Application ID | Type | Faculty | Quality | Notes |")
        report.append("|----------------|------|---------|---------|-------|")
        for r in by_decision["FLAG_REVIEW"][:50]:  # Limit to 50
            q = r.get("quality", {})
            notes = q.get("notes", "")[:60] + "..." if len(q.get("notes", "")) > 60 else q.get("notes", "")
            report.append(
                f"| {r.get('application_id')} | "
                f"{r.get('application_type', '')} | "
                f"{r.get('faculty', '')[:20]} | "
                f"{q.get('quality_tier', '-')} | "
                f"{notes} |"
            )
        report.append("")

    # Incomplete applications
    if by_decision.get("INCOMPLETE"):
        report.append("## Incomplete Applications")
        report.append("")
        for r in by_decision["INCOMPLETE"][:20]:
            missing = r.get("completeness", {}).get("missing_fields", [])
            insufficient = r.get("completeness", {}).get("insufficient_fields", [])
            report.append(f"### {r.get('application_id')}")
            if missing:
                report.append(f"**Missing fields:** {', '.join(missing)}")
            if insufficient:
                for inf in insufficient:
                    report.append(f"**Insufficient:** {inf['field']} ({inf['length']}/{inf['required']} chars)")
            report.append("")

    # Save report
    report_file = OUTPUT_DIR / "phase1_report.md"
    with open(report_file, "w") as f:
        f.write("\n".join(report))

    print(f"Report saved to: {report_file}")

    # Also print summary to console
    print("\n" + "=" * 60)
    print("PHASE 1 FILTER REPORT SUMMARY")
    print("=" * 60)
    print(f"Total: {total}")
    print(f"  Pass: {stats.get('pass', 0)}")
    print(f"  Incomplete: {stats.get('incomplete', 0)}")
    print(f"  Flag Review: {stats.get('flag_review', 0)}")
    print(f"  Reject: {stats.get('reject', 0)}")

    if quality_tiers:
        print(f"\nQuality Distribution: {dict(quality_tiers)}")

    if ai_likelihood:
        print(f"AI Likelihood: {dict(ai_likelihood)}")


if __name__ == "__main__":
    generate_report()
