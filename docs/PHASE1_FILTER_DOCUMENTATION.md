# OMT Phase 1: Submission Filter Documentation

## Overview

The Phase 1 Submission Filter is an automated completeness check system for the Oppenheimer Memorial Trust's funding application review process. It implements the first stage of filtering described in the Phase 1 proposal: validating that applications meet basic submission requirements before human review.

## What We're Filtering For

### 1. Completeness (Are all required fields present?)

The filter checks that applications have substantive content in required fields. Requirements vary by application type:

#### Common Required Fields (All Applications)
| Field | Description |
|-------|-------------|
| Application ID | Unique identifier |
| Primary Contact | Applicant name |
| Email | Contact email |
| What do you need funding for? | Masters/Doctoral/Postdoctoral/Sabbatical |
| Institution | Local or International |
| Faculty | Academic faculty |
| Study choice | Degree/program name |
| Study topic | Research topic description |
| Target institution | Where they're applying |
| Start date | When studies begin |
| Duration | Length of program |
| Motivation | Personal statement |
| Year 1 budget | First year funding request |

#### Additional Fields by Application Type

| Application Type | Additional Required Fields |
|-----------------|---------------------------|
| **Masters** | Description of programme, Significance and relevance of intended study |
| **Doctoral** | Synopsis of work programme/research plan, Significance of intended study |
| **Postdoctoral** | Synopsis of work programme, Significance of study, Host institution details |
| **Sabbatical** | Synopsis of work programme, Significance of study, Host institution details |
| **International** | Compelling reasons for studying abroad |

#### Minimum Content Thresholds

Key text fields must meet minimum character counts to be considered substantive:

| Field | Minimum Characters |
|-------|-------------------|
| Motivation | 200 |
| Description of programme | 100 |
| Significance and relevance | 100 |
| Synopsis of work programme | 100 |
| Compelling reasons (international) | 100 |

---

### 2. Eligibility (Does the application meet basic criteria?)

The filter checks system-level eligibility markers:

| Check | Criteria | Result if Failed |
|-------|----------|------------------|
| Status | Must NOT be "Not Eligible" | REJECT |
| Status | Must NOT be "Discarded" | REJECT |
| Status | "Revisions Requested" | WARNING (flagged) |
| Application Type | Must be Masters/Doctoral/Postdoctoral/Sabbatical | REJECT |
| Email | Must contain @ symbol | WARNING |
| Start Date | Must not be before 2025 | REJECT |

---

### 3. Quality Assessment (LLM-based analysis)

For applications that pass completeness and eligibility checks, Claude Haiku performs a quality assessment looking for:

#### Red Flags Detected

| Red Flag Category | What We Look For |
|-------------------|------------------|
| **Generic Content** | Boilerplate text that could apply to any application |
| **Field Mismatch** | Study topic doesn't match stated faculty/field |
| **Incomplete Submissions** | Text cuts off mid-sentence, missing sections |
| **AI-Generated Content** | Overly polished, generic phrasing patterns |
| **Quality Issues** | Spelling/grammar errors suggesting lack of care |
| **Missing Details** | Key information absent despite space available |
| **Unrealistic Plans** | Timelines or budgets that don't make sense |

#### Quality Tiers

| Tier | Description | Typical Outcome |
|------|-------------|-----------------|
| **A** | Strong application - clear, specific, well-articulated | PASS |
| **B** | Adequate - meets basic requirements but has some issues | FLAG_REVIEW |
| **C** | Weak - vague or generic content | FLAG_REVIEW |
| **D** | Problematic - significant issues | FLAG_REVIEW |

#### AI-Generated Content Detection

The LLM assesses likelihood of AI-generated content:
- **Low**: Appears human-written with personal voice
- **Medium**: Some generic patterns but unclear
- **High**: Strong indicators of AI generation

---

## How the Filter Works

### Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION INPUT                             │
│                  (Excel row from data)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 1: COMPLETENESS CHECK (No LLM)                │
│                                                                  │
│  • Check all required fields are present                        │
│  • Verify text fields meet minimum character thresholds         │
│  • Adjust requirements based on application type                │
│                                                                  │
│  Result: is_complete, missing_fields, insufficient_fields       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 2: ELIGIBILITY CHECK (No LLM)                 │
│                                                                  │
│  • Check application status (Not Eligible? Discarded?)          │
│  • Validate application type is recognized                      │
│  • Check email format                                           │
│  • Verify start date is valid                                   │
│                                                                  │
│  Result: is_eligible, eligibility_issues, eligibility_warnings  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Complete AND    │
                    │ Eligible?       │
                    └─────────────────┘
                     │              │
                    YES            NO
                     │              │
                     ▼              ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  STEP 3: QUALITY CHECK   │  │  SKIP LLM CHECK          │
│  (Claude Haiku)          │  │                          │
│                          │  │  Already failed basic    │
│  • Analyze motivation    │  │  requirements            │
│  • Check for red flags   │  │                          │
│  • Assess quality tier   │  │                          │
│  • Detect AI content     │  │                          │
└──────────────────────────┘  └──────────────────────────┘
                     │              │
                     ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FINAL DECISION                                │
│                                                                  │
│  REJECT:       Failed eligibility (Not Eligible/Discarded)      │
│  INCOMPLETE:   Missing required fields                          │
│  FLAG_REVIEW:  Quality concerns or red flags detected           │
│  PASS:         Quality A with no red flags                      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

#### 1. One Application at a Time
Each application is processed individually to avoid maxing out the LLM context window. This allows us to handle thousands of applications without memory issues.

#### 2. Fast Model (Claude Haiku)
We use Claude Haiku for quality checks because:
- Fast response times (~0.2-0.5 seconds per application)
- Cost-effective for high volume
- Sufficient capability for structured assessment tasks

#### 3. Conservative Flagging
The filter intentionally flags most applications for human review rather than auto-passing. This ensures:
- Human reviewers maintain oversight
- Edge cases don't slip through
- The system supports rather than replaces human judgment

#### 4. Structured Output
All results are saved as JSON for:
- Easy aggregation and reporting
- Integration with SmartSimple API (future)
- Audit trail of filtering decisions

---

## Filter Decisions Explained

| Decision | When Applied | Human Action Required |
|----------|--------------|----------------------|
| **PASS** | Quality A, no red flags | Proceed to full review |
| **FLAG_REVIEW** | Quality B/C OR any red flags detected | Review flagged concerns before proceeding |
| **INCOMPLETE** | Missing required fields | Return to applicant for completion |
| **REJECT** | Already marked Not Eligible/Discarded in system | No action (already rejected) |

---

## Sample Results

From testing on 50 applications:

| Decision | Count | Percentage | Notes |
|----------|-------|------------|-------|
| PASS | 1 | 2% | Only the strongest applications |
| FLAG_REVIEW | 23 | 46% | Adequate but need human attention |
| INCOMPLETE | 0 | 0% | Data appears well-structured |
| REJECT | 26 | 52% | Pre-filtered by existing system |

### Quality Distribution (of assessed applications)
- **Tier A**: 1 (4%)
- **Tier B**: 20 (83%)
- **Tier C**: 3 (13%)

### AI-Generated Content Likelihood
- **Low**: 15 applications (63%)
- **Medium**: 9 applications (37%)
- **High**: 0 applications (0%)

---

## Usage

### Basic Commands

```bash
# Dry run - only completeness/eligibility checks, no LLM
python scripts/phase1_submission_filter.py --dry-run

# Process limited number of applications
python scripts/phase1_submission_filter.py --limit 100

# Process all applications (with LLM quality checks)
python scripts/phase1_submission_filter.py

# Reprocess all (ignore previous results)
python scripts/phase1_submission_filter.py --reprocess

# Generate summary report
python scripts/phase1_generate_report.py
```

### Output Files

| File | Description |
|------|-------------|
| `scripts/filter_output/phase1_filter_results.json` | Full results with all details |
| `scripts/filter_output/phase1_report.md` | Human-readable summary report |

### Environment Requirements

```bash
# Required environment variable
export CLAUDE_API=your_anthropic_api_key

# Required packages
pip install pandas openpyxl anthropic
```

---

## Future Enhancements (Phase 2)

This Phase 1 filter is the foundation for more advanced capabilities:

1. **SmartSimple API Integration**: Directly update application status in the system
2. **Document Validation**: Check uploaded PDFs/documents are accessible
3. **GPA Extraction**: Automatically extract and normalize academic scores
4. **Batch Reporting**: Generate reports for committee review sessions
5. **Reviewer Assignment**: Suggest appropriate reviewers based on faculty/topic
