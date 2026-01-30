#!/usr/bin/env python3
"""
OMT Discovery Interview Transcript Qualitative Analysis
Uses Anthropic API (Haiku for per-transcript extraction, Sonnet for cross-transcript synthesis)
"""

import os
import sys
import json
import zipfile
import xml.etree.ElementTree as ET
import time
from pathlib import Path

import anthropic

# --- Config ---
API_KEY = os.environ.get("CLAUDE_API")
TRANSCRIPTS_DIR = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Transcripts")
OUTPUT_DIR = Path("/home/user/OMT-Review/scripts/analysis_output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HAIKU_MODEL = "claude-haiku-4-5"
SONNET_MODEL = "claude-sonnet-4-5"

client = anthropic.Anthropic(api_key=API_KEY)

# --- DOCX Text Extraction ---
def extract_docx_text(filepath: str) -> str:
    """Extract plain text from a .docx file using zipfile + XML parsing."""
    text_parts = []
    with zipfile.ZipFile(filepath, 'r') as z:
        # Read document.xml
        if 'word/document.xml' in z.namelist():
            with z.open('word/document.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                # Namespace
                ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                    para_text = []
                    for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}r'):
                        for text_elem in run.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                            if text_elem.text:
                                para_text.append(text_elem.text)
                    if para_text:
                        text_parts.append(''.join(para_text))
    return '\n'.join(text_parts)


def get_interviewee_name(filename: str) -> str:
    """Extract interviewee name from filename."""
    # Pattern: ... (Name) ...
    start = filename.find('(') + 1
    end = filename.find(')')
    if start > 0 and end > start:
        return filename[start:end]
    return filename


# --- Per-Transcript Analysis (Haiku) ---
PER_TRANSCRIPT_PROMPT = """You are a qualitative researcher analyzing a discovery interview transcript for the Oppenheimer Memorial Trust (OMT). The OMT manages postgraduate scholarship applications and is exploring how to improve their application review process, potentially with AI assistance.

Analyze this interview transcript and extract the following in a structured format:

## 1. Interviewee Role & Background
- Their role in the OMT review process
- How long they've been involved
- Their discipline/expertise area

## 2. Current Review Process Description
- How they currently review applications
- Steps they follow
- Tools/systems they currently use
- Time spent on reviews

## 3. Pain Points & Challenges
- What frustrations they experience
- What takes too long
- What's difficult or unclear
- Specific bottlenecks mentioned

## 4. What They Value in Applications
- Key criteria they look for
- Red flags they watch for
- What makes an application stand out
- How they weigh different factors

## 5. Views on AI/Technology
- Their attitude toward AI in the review process
- Specific concerns or hopes
- What they would/wouldn't want automated
- Trust and transparency requirements

## 6. Suggestions & Ideas
- Improvements they suggest
- Features they'd want in a new system
- Priorities for change

## 7. Key Direct Quotes
- Extract 5-10 significant verbatim quotes that capture important insights
- Include context for each quote

## 8. Unique Insights
- Anything distinctive this interviewee raised that others might not
- Novel perspectives or concerns

Be thorough and specific. Reference the transcript content directly.

TRANSCRIPT:
{transcript}
"""

SYNTHESIS_PROMPT = """You are a senior qualitative researcher synthesizing findings from {n_transcripts} discovery interviews conducted for the Oppenheimer Memorial Trust (OMT). The OMT manages postgraduate scholarship applications (Masters, PhD, Postdoc, Sabbatical) and is exploring how to improve their review process, potentially with AI assistance.

Below are individual analyses of each interview. Synthesize these into a comprehensive qualitative analysis report.

Structure your synthesis as follows:

# OMT Discovery Interviews: Qualitative Analysis Synthesis

## Executive Summary
A concise overview of the key findings across all interviews (300-400 words).

## Methodology
Brief description: {n_transcripts} semi-structured discovery interviews with OMT review committee members, analyzed using thematic analysis.

## Participant Overview
Table or list of all interviewees with their roles and areas of expertise.

## Thematic Analysis

### Theme 1: Current Review Process & Workflow
- Common patterns across reviewers
- Variations in approach
- Supporting quotes with attribution (Interviewee Name, Date)

### Theme 2: Pain Points & Bottlenecks
- Most frequently mentioned challenges
- Severity and impact
- Supporting quotes with attribution

### Theme 3: Evaluation Criteria & Decision-Making
- Shared criteria across reviewers
- Differences in prioritization
- Tacit knowledge and expert judgment patterns
- Supporting quotes with attribution

### Theme 4: Attitudes Toward AI & Technology
- Spectrum of attitudes (enthusiastic to cautious)
- Common concerns
- Desired capabilities
- Trust boundaries
- Supporting quotes with attribution

### Theme 5: Desired Improvements & Features
- Consensus areas
- Contested areas
- Priority ranking
- Supporting quotes with attribution

### [Additional Themes]
Identify and develop any other significant themes that emerged from the data.

## Cross-Cutting Insights
- Tensions or contradictions between interviewees
- Implicit assumptions
- Power dynamics and institutional factors
- Areas of strong consensus vs. divergence

## Recommendations
Based on the interview findings, provide actionable recommendations for:
1. System design priorities
2. AI integration approach
3. Change management considerations
4. Risk areas to address

## Appendix: Interviewee Reference Table
For each interviewee, list: Name, Date, Key role, Top 3 distinctive contributions

---

INDIVIDUAL INTERVIEW ANALYSES:

{analyses}
"""


def analyze_single_transcript(filepath: Path) -> dict:
    """Analyze a single transcript using Haiku."""
    name = get_interviewee_name(filepath.name)
    date_part = filepath.name.split('–')[1].strip().split('–')[0].strip() if '–' in filepath.name else "Unknown date"

    print(f"\n{'='*60}")
    print(f"Extracting text: {name}")

    text = extract_docx_text(str(filepath))
    word_count = len(text.split())
    print(f"  Extracted {word_count} words")

    if word_count < 50:
        print(f"  SKIPPING - too short ({word_count} words)")
        return {"name": name, "date": date_part, "text_length": word_count, "analysis": "Insufficient content for analysis", "skipped": True}

    print(f"  Sending to {HAIKU_MODEL} for analysis...")

    prompt = PER_TRANSCRIPT_PROMPT.format(transcript=text)

    try:
        response = client.messages.create(
            model=HAIKU_MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )
        analysis = response.content[0].text
        tokens_in = response.usage.input_tokens
        tokens_out = response.usage.output_tokens
        print(f"  Done. Tokens: {tokens_in} in, {tokens_out} out")

        # Save individual analysis
        output_file = OUTPUT_DIR / f"individual_{name.replace(' ', '_')}.md"
        with open(output_file, 'w') as f:
            f.write(f"# Interview Analysis: {name}\n")
            f.write(f"**Date:** {date_part}\n")
            f.write(f"**Source:** {filepath.name}\n")
            f.write(f"**Transcript word count:** {word_count}\n")
            f.write(f"**Analysis model:** {HAIKU_MODEL}\n\n")
            f.write(analysis)

        return {
            "name": name,
            "date": date_part,
            "filename": filepath.name,
            "text_length": word_count,
            "analysis": analysis,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "skipped": False
        }
    except Exception as e:
        print(f"  ERROR: {e}")
        return {"name": name, "date": date_part, "text_length": word_count, "analysis": f"Error: {e}", "skipped": True}


def run_synthesis(results: list[dict]) -> str:
    """Run cross-transcript synthesis using Sonnet."""
    valid = [r for r in results if not r.get("skipped")]

    # Build analyses text
    analyses_parts = []
    for r in valid:
        analyses_parts.append(f"### Interview: {r['name']} ({r['date']})\n**Source file:** {r['filename']}\n\n{r['analysis']}\n")

    analyses_text = "\n---\n\n".join(analyses_parts)

    prompt = SYNTHESIS_PROMPT.format(
        n_transcripts=len(valid),
        analyses=analyses_text
    )

    print(f"\n{'='*60}")
    print(f"Running synthesis across {len(valid)} interviews using {SONNET_MODEL}...")

    response = client.messages.create(
        model=SONNET_MODEL,
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )

    synthesis = response.content[0].text
    tokens_in = response.usage.input_tokens
    tokens_out = response.usage.output_tokens
    print(f"  Synthesis done. Tokens: {tokens_in} in, {tokens_out} out")

    return synthesis


def main():
    print("OMT Discovery Interview Qualitative Analysis")
    print("=" * 60)

    # Find all .docx transcript files
    docx_files = sorted(TRANSCRIPTS_DIR.glob("*Notes by Gemini.docx"))
    print(f"Found {len(docx_files)} transcript files\n")

    # Phase 1: Individual transcript analysis with Haiku
    print("PHASE 1: Individual transcript analysis (Haiku)")
    print("-" * 60)

    results = []
    for filepath in docx_files:
        result = analyze_single_transcript(filepath)
        results.append(result)
        time.sleep(0.5)  # Be polite to the API

    # Save all individual results
    with open(OUTPUT_DIR / "all_individual_results.json", 'w') as f:
        json.dump(results, f, indent=2, default=str)

    # Phase 2: Cross-transcript synthesis with Sonnet
    print("\n\nPHASE 2: Cross-transcript synthesis (Sonnet)")
    print("-" * 60)

    synthesis = run_synthesis(results)

    # Save synthesis
    with open(OUTPUT_DIR / "synthesis_report.md", 'w') as f:
        f.write(synthesis)

    print(f"\n\n{'='*60}")
    print("ANALYSIS COMPLETE")
    print(f"Individual analyses: {OUTPUT_DIR}/individual_*.md")
    print(f"Synthesis report: {OUTPUT_DIR}/synthesis_report.md")
    print(f"Raw results: {OUTPUT_DIR}/all_individual_results.json")

    # Print summary stats
    valid = [r for r in results if not r.get("skipped")]
    total_in = sum(r.get("tokens_in", 0) for r in valid)
    total_out = sum(r.get("tokens_out", 0) for r in valid)
    print(f"\nProcessed {len(valid)}/{len(results)} transcripts")
    print(f"Total Haiku tokens: {total_in} in, {total_out} out")


if __name__ == "__main__":
    main()
