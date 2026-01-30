#!/usr/bin/env python3
"""
Deep synthesis pass - uses Sonnet for a more comprehensive cross-transcript analysis.
Reads individual analyses and raw transcript text for deeper thematic coding.
"""

import os
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
import anthropic

API_KEY = os.environ.get("CLAUDE_API")
TRANSCRIPTS_DIR = Path("/home/user/OMT-Review/Oppenheimer Memorial Trust/OMT Transcripts")
OUTPUT_DIR = Path("/home/user/OMT-Review/scripts/analysis_output")

SONNET_MODEL = "claude-sonnet-4-5"
HAIKU_MODEL = "claude-haiku-4-5"

client = anthropic.Anthropic(api_key=API_KEY)


def extract_docx_text(filepath: str) -> str:
    text_parts = []
    with zipfile.ZipFile(filepath, 'r') as z:
        if 'word/document.xml' in z.namelist():
            with z.open('word/document.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
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
    start = filename.find('(') + 1
    end = filename.find(')')
    if start > 0 and end > start:
        return filename[start:end]
    return filename


# Valid interview files (excluding non-substantive ones)
VALID_INTERVIEWEES = [
    "Dina  Ligaga", "Edzai Conilias Zvobwo", "Philippe Burger", "Martin Clark",
    "Pieter Pistorius", "Mohamed Cassim", "Ryan Nefdt", "Maureen De Jager",
    "Freedom Gumedze", "Frelet De Villiers", "Frasia Oosthuizen"
]

# Andrew Macdonald (first interview) may have some content - let's check
EXCLUDED = ["Andrew Macdonald", "Ndumiso Luthuli", "Cephas Chikanda"]


def run_thematic_deep_dive():
    """Run deep thematic analysis with Sonnet on key themes, pulling quotes from raw transcripts."""

    # Load all individual analyses
    with open(OUTPUT_DIR / "all_individual_results.json") as f:
        all_results = json.load(f)

    valid_results = [r for r in all_results if not r.get("skipped") and r["name"] not in EXCLUDED]

    # Also load raw transcript excerpts for the valid ones
    docx_files = sorted(TRANSCRIPTS_DIR.glob("*Notes by Gemini.docx"))
    raw_texts = {}
    for fp in docx_files:
        name = get_interviewee_name(fp.name)
        if name in VALID_INTERVIEWEES:
            raw_texts[name] = extract_docx_text(str(fp))

    print(f"Loaded {len(valid_results)} valid analyses and {len(raw_texts)} raw transcripts")

    # Build comprehensive input for deep synthesis
    combined_input = []
    for r in valid_results:
        name = r["name"]
        combined_input.append(f"""
=== INTERVIEW: {name} ({r['date']}) ===
Source: {r.get('filename', 'N/A')}

--- ANALYSIS ---
{r['analysis']}

--- RAW TRANSCRIPT EXCERPT (first 3000 chars) ---
{raw_texts.get(name, 'N/A')[:3000]}
""")

    combined_text = "\n\n".join(combined_input)

    # Deep synthesis prompt
    prompt = f"""You are a senior qualitative researcher producing a comprehensive, publication-quality thematic analysis of {len(valid_results)} discovery interviews conducted for the Oppenheimer Memorial Trust (OMT).

The OMT awards postgraduate scholarships (Masters, PhD, Postdoc, Sabbatical) across all disciplines. These interviews were conducted with review committee members to understand the current application review process and explore opportunities for AI-assisted review.

I'm providing both the structured analysis AND raw transcript excerpts for each interview. Use the raw transcripts to find additional verbatim quotes and deeper insights beyond what the structured analysis captured.

Produce a COMPREHENSIVE thematic analysis report with the following structure. Be detailed and thorough - this is the primary deliverable.

---

# OMT Discovery Interview Analysis: Comprehensive Thematic Report

## 1. Executive Summary (400-500 words)
Provide a nuanced overview covering: key findings, tensions identified, consensus areas, and strategic implications.

## 2. Methodology
- 11 substantive semi-structured discovery interviews (Jan 12-27, 2026)
- Interviews conducted by StrideShift with OMT review committee members
- Notes captured via Google Gemini transcription
- Analyzed using iterative thematic analysis with AI-assisted coding (Haiku for individual extraction, Sonnet for synthesis)
- Note: 4 additional recordings contained scheduling/internal discussions and were excluded

## 3. Participant Profiles
For each interviewee provide: Name, Institution, Discipline, Years reviewing for OMT, Application types reviewed. Format as a detailed table.

## 4. Detailed Thematic Analysis

### 4.1 The Review Workflow: From Application to Decision
Analyze the end-to-end review process as described across interviews. Include:
- Common workflow patterns
- Individual variations and why they exist
- Time investment and workload
- Tools and systems currently used
- How scoring works (rubric mechanics)
Quote each insight with (Interviewee Name, Date)

### 4.2 The Rubric Problem: Constraints and Workarounds
This emerged as a dominant theme. Analyze:
- How the 1-4 scoring system works and its limitations
- Workarounds reviewers have developed (retrofitting, starting high, etc.)
- The gap between rubric scores and holistic judgment
- Specific suggestions for improvement
Quote each insight with (Interviewee Name, Date)

### 4.3 What Makes an Excellent Application: Criteria and Judgment
Analyze the evaluation criteria across disciplines:
- Universal criteria (what everyone looks for)
- Discipline-specific criteria (STEM vs. Humanities vs. Arts)
- The role of personal narrative and motivation
- Red flags and warning signs
- How reviewers handle edge cases and contextual factors
Quote each insight with (Interviewee Name, Date)

### 4.4 Bias, Subjectivity, and Fairness
Analyze how reviewers think about:
- Their own biases (acknowledged and unacknowledged)
- Structural inequalities affecting applications
- Language and cultural factors
- Strategies for fair evaluation
- The tension between objectivity and contextual sensitivity
Quote each insight with (Interviewee Name, Date)

### 4.5 AI in the Review Process: Hopes, Fears, and Boundaries
This is the most strategically important theme. Analyze:
- The spectrum of attitudes (map each reviewer)
- What reviewers want AI to do (consensus items)
- What reviewers explicitly don't want AI to do
- Trust conditions and transparency requirements
- The AI-generated content detection problem
- Specific feature requests and use cases
Quote each insight with (Interviewee Name, Date)

### 4.6 The Feedback Gap and Reviewer Experience
Analyze:
- Whether and how reviewers receive feedback on their reviews
- Cross-reviewer calibration (or lack thereof)
- Reviewer motivation and satisfaction
- The volunteer nature of the work
- Suggestions for improving the reviewer experience
Quote each insight with (Interviewee Name, Date)

## 5. Cross-Cutting Tensions and Paradoxes
Identify and analyze contradictions, tensions, and paradoxes that emerged:
- Between standardization and flexibility
- Between efficiency and depth
- Between technology and human judgment
- Between disciplines
- Between individual autonomy and collective consistency

## 6. Strategic Recommendations
Based on the evidence, provide specific, actionable recommendations organized by:

### 6.1 Quick Wins (Low effort, high impact)
### 6.2 System Design Priorities
### 6.3 AI Integration Strategy (phased approach)
### 6.4 Change Management
### 6.5 Risk Mitigation

## 7. Interviewee Quick Reference
For each of the 11 interviewees, provide a 2-3 sentence summary of their distinctive perspective and contribution.

---

INTERVIEW DATA:

{combined_text}
"""

    print(f"Sending deep synthesis to {SONNET_MODEL}...")
    print(f"Input length: ~{len(prompt)} chars")

    response = client.messages.create(
        model=SONNET_MODEL,
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )

    synthesis = response.content[0].text
    tokens_in = response.usage.input_tokens
    tokens_out = response.usage.output_tokens
    print(f"Done. Tokens: {tokens_in} in, {tokens_out} out")

    with open(OUTPUT_DIR / "deep_synthesis_report.md", 'w') as f:
        f.write(synthesis)

    print(f"Saved to {OUTPUT_DIR / 'deep_synthesis_report.md'}")
    return synthesis


def run_additional_thematic_passes():
    """Run focused thematic passes with Haiku on specific topics for more quotes."""

    with open(OUTPUT_DIR / "all_individual_results.json") as f:
        all_results = json.load(f)

    docx_files = sorted(TRANSCRIPTS_DIR.glob("*Notes by Gemini.docx"))
    raw_texts = {}
    for fp in docx_files:
        name = get_interviewee_name(fp.name)
        if name in VALID_INTERVIEWEES:
            raw_texts[name] = extract_docx_text(str(fp))

    themes = [
        {
            "name": "ai_attitudes",
            "title": "AI Attitudes Deep Dive",
            "prompt": """Analyze this interview transcript ONLY for attitudes toward AI and technology in the scholarship review process. Extract:
1. Every statement about AI (positive, negative, neutral)
2. Specific use cases they mention for AI
3. Specific concerns or fears about AI
4. Trust conditions they describe
5. Their mental model of what AI can/can't do
6. Any comparison to other technologies or processes
7. ALL relevant verbatim quotes (as many as possible)

Be exhaustive - capture every nuance about AI attitudes.

TRANSCRIPT:
{transcript}"""
        },
        {
            "name": "rubric_and_scoring",
            "title": "Rubric and Scoring Deep Dive",
            "prompt": """Analyze this interview transcript ONLY for information about the rubric, scoring system, and evaluation mechanics. Extract:
1. How they use the rubric
2. Specific complaints about the rubric
3. Workarounds they've developed
4. Scoring strategies (starting high, retrofitting, etc.)
5. How they handle edge cases in scoring
6. Suggestions for rubric improvement
7. ALL relevant verbatim quotes

TRANSCRIPT:
{transcript}"""
        },
        {
            "name": "evaluation_criteria",
            "title": "Evaluation Criteria Deep Dive",
            "prompt": """Analyze this interview transcript ONLY for the specific criteria and factors they use to evaluate applications. Extract:
1. Explicit criteria they mention
2. Implicit criteria (what they actually look for vs. what rubric says)
3. How they weigh different factors
4. What makes an application stand out positively
5. Red flags and warning signs
6. Discipline-specific criteria
7. How they handle applications outside their expertise
8. ALL relevant verbatim quotes

TRANSCRIPT:
{transcript}"""
        }
    ]

    for theme in themes:
        print(f"\n{'='*60}")
        print(f"Thematic pass: {theme['title']}")
        print(f"{'='*60}")

        theme_results = []
        for name, text in raw_texts.items():
            print(f"  Processing {name}...")
            prompt = theme["prompt"].format(transcript=text)

            try:
                response = client.messages.create(
                    model=HAIKU_MODEL,
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                result = response.content[0].text
                theme_results.append({"name": name, "analysis": result})
                print(f"    Done ({response.usage.output_tokens} tokens)")
            except Exception as e:
                print(f"    ERROR: {e}")
                theme_results.append({"name": name, "analysis": f"Error: {e}"})

        # Save theme results
        output_file = OUTPUT_DIR / f"theme_{theme['name']}.md"
        with open(output_file, 'w') as f:
            f.write(f"# {theme['title']}\n\n")
            for r in theme_results:
                f.write(f"## {r['name']}\n\n{r['analysis']}\n\n---\n\n")

        print(f"Saved to {output_file}")


if __name__ == "__main__":
    # First run the focused thematic passes to get richer quote extraction
    run_additional_thematic_passes()

    # Then run the deep synthesis
    run_thematic_deep_dive()
