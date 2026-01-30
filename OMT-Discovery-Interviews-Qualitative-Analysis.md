# OMT Discovery Interviews: Qualitative Analysis Report

**Prepared by:** StrideShift
**Date:** January 27, 2026
**Analysis Method:** AI-assisted thematic analysis (Claude Haiku 4.5 for individual transcript coding, Claude Sonnet 4.5 for cross-transcript synthesis)

---

## 1. Executive Summary

This report presents a comprehensive qualitative analysis of 11 discovery interviews conducted with Oppenheimer Memorial Trust (OMT) review committee members between January 12-27, 2026. The interviews explored current scholarship application review processes and assessed opportunities for AI-assisted review.

**Key findings:**

- **The rubric is the biggest pain point.** The current 1-4 scoring system was cited by 10 of 11 reviewers as too restrictive, forcing workarounds like "retrofitting" scores, starting at the top and adjusting down, and supplementing with narrative comments. Multiple reviewers called for expanded granularity. (Frelet De Villiers was the exception — she found academic marks the "least important" criterion and focused less on rubric mechanics.)

- **Reviewers value authenticity and narrative over pure metrics.** Across all disciplines, reviewers prioritize genuine personal motivation, coherent research trajectories, and societal impact potential above academic grades alone. Martin Clark captured this: *"I always value passion higher than I value cleverness."*

- **AI attitudes are cautiously optimistic.** Reviewers welcome AI for administrative tasks (data verification, bibliometric analysis, document screening) but insist human judgment must remain central to evaluative decisions. No reviewer supported fully autonomous AI decision-making.

- **AI-generated content is an escalating concern.** At least 6 of 11 reviewers independently raised alarm about distinguishing authentic motivation letters from AI-generated text, with several noting the problem visibly worsened between 2023-2025. Philippe Burger proposed interviews and timed writing as verification mechanisms; Maureen De Jager noted portfolios as the last reliable authenticity signal in creative arts.

- **The reviewer feedback loop is broken.** Reviewers receive minimal information about how their scores compare to peers or influence outcomes. Freedom Gumedze and Edzai Zvobwo explicitly asked about cross-reviewer calibration. Some reviewers (Pieter Pistorius) prefer independence, creating a tension between calibration and autonomy.

- **Structural inequalities affect application quality.** Multiple reviewers recognize that institutional disparities mean some applicants have access to better application preparation support than others. Edzai Zvobwo observed that *"certain schools seem to teach how to answer applications effectively"* while others don't, creating a systemic fairness challenge.

- **The "cold start problem" affects first applications.** Edzai Zvobwo identified that the first application reviewed in each cycle is *"the most difficult to judge due to the lack of a frame of reference,"* potentially prejudicing candidates reviewed early.

---

## 2. Methodology

- **Interviews conducted:** 15 recordings; 11 substantive interviews, 4 excluded (scheduling/internal discussions)
- **Interview period:** January 12-27, 2026
- **Format:** Semi-structured discovery interviews conducted by StrideShift
- **Transcription:** Google Gemini automated notes
- **Analysis approach:** Iterative thematic analysis
  - **Phase 1:** Individual transcript coding using Claude Haiku 4.5 (per-transcript structured extraction across 8 dimensions — ~4,096 output tokens per transcript)
  - **Phase 2:** Focused thematic deep dives using Claude Haiku 4.5 (AI attitudes, rubric/scoring, evaluation criteria — ~2,048 output tokens per interviewee per theme)
  - **Phase 3:** Cross-transcript synthesis using Claude Sonnet 4.5 (thematic integration, tension identification, strategic recommendations — two passes: initial synthesis + deep synthesis with raw transcript excerpts)
  - **Phase 4:** Agent review and compilation of final report with accuracy verification

**Excluded transcripts:** Andrew Macdonald (both sessions — contained scheduling discussion only), Ndumiso Luthuli (pre-interview technical discussion), Cephas Chikanda (internal team conversation about AI and education, not OMT review process).

---

## 3. Participant Profiles

| # | Interviewee | Institution | Discipline | OMT Tenure | Application Types Reviewed |
|---|-------------|-------------|------------|------------|---------------------------|
| 1 | Dina Ligaga | University of the Witwatersrand | Media & Cultural Studies, Gender Studies | Since 2022 | Humanities (Masters, PhD) |
| 2 | Edzai Conilias Zvobwo | Not specified | Science & Mathematics | Since 2019 | STEM applications |
| 3 | Philippe Burger | University of Free State | Economics, Macroeconomics | 2-3 years | Business, Economics |
| 4 | Martin Clark | University of Free State | Geology, Earth Sciences | 3-4 years | Masters, PhD, Sabbatical |
| 5 | Pieter Pistorius | University of Pretoria | Metallurgical Engineering | ~3 years | Engineering |
| 6 | Mohamed Cassim | Independent Consultant | Finance, Strategy, Innovation | Multiple years | Financial applications |
| 7 | Ryan Nefdt | University of Cape Town | Philosophy, Linguistics | Multiple years | Humanities (Philosophy, Linguistics, Fine Art, Sociology) |
| 8 | Maureen De Jager | Rhodes University | Fine Arts | ~3 years | Creative Arts |
| 9 | Freedom Gumedze | University of Cape Town | Biostatistics, Applied Health Research | Multiple years | Masters, PhD, Postdoc, Sabbatical |
| 10 | Frelet De Villiers | University of Free State | Music, Arts | 4-5 years | Arts/Music |
| 11 | Frasia Oosthuizen | Not specified | Pharmaceutical Sciences | Long-term (pre-online system) | Health Sciences |

**Source files:** All interview transcripts are located in `Oppenheimer Memorial Trust/OMT Transcripts/` as Gemini Notes (.docx files).

---

## 4. Thematic Analysis

### 4.1 The Review Workflow: From Application to Decision

Reviewers follow broadly similar workflows with individual variations reflecting disciplinary preferences and personal strategies.

**Common workflow phases:**
1. Initial scan or overview of the application batch
2. Deep reading of individual applications (all materials)
3. Rubric-based scoring with narrative comments
4. Comparative review and score adjustment across the batch

**Workflow variations:**

| Approach | Reviewers | Description |
|----------|-----------|-------------|
| Sequential deep reading | Freedom Gumedze, Frasia Oosthuizen, Ryan Nefdt | Read full portfolio first, then score systematically |
| Comparative overview first | Maureen De Jager, Philippe Burger | Scan all applications to establish landscape before deep reading |
| Batch by level | Martin Clark, Frasia Oosthuizen | Group by Masters/PhD/Sabbatical, process in sittings of 5-10 |

**Time investment** varies significantly:
- Pieter Pistorius: *"45-60 minutes per application over 2-3 evenings"* plus a *"final 20-minute consistency check"* (Pistorius, Jan 19)
- Frasia Oosthuizen: *"A good few solid hours"* per batch (Oosthuizen, Jan 27)
- Mohamed Cassim: Spreads review *"over several nights"* (Cassim, Jan 20)
- Martin Clark: Reviews *"5-10 applications per sitting to avoid 'adjudication fatigue'"* (Clark, Jan 15)

**Current tools:** All reviewers use OMT's online platform. Satisfaction is mixed:
- Dina Ligaga: *"Multi-window interface is frustrating and time-consuming"* (Ligaga, Jan 12)
- Edzai Conilias Zvobwo: Found the software *"quite convenient"* compared to the previous Excel-based process (Zvobwo, Jan 13)
- Frasia Oosthuizen: Found the *"split-screen application and rubric"* workable (Oosthuizen, Jan 27)

---

### 4.2 The Rubric Problem: Constraints and Workarounds

**This is the single most prominent finding across the interviews.** The 1-4 scoring rubric emerged as the dominant source of frustration, with 10 of 11 substantive interviewees describing limitations and most describing workarounds they've developed. The exception was Frelet De Villiers, who focused less on rubric mechanics and more on the qualitative aspects of creative arts assessment, though she did describe her own scoring strategy ("starting at four and adjusting down").

#### The core problem: insufficient granularity

> *"Excellence can be 75% and sometimes it can be 90% - and those are very different types of excellence."*
> — Dina Ligaga (Jan 12)

> *"The bin is too big. So, you see at three, a high-quality three and a low-quality three, they're all bunched up in there."*
> — Edzai Conilias Zvobwo (Jan 13)

> *"A definition of excellence that was a little bit more sensitive... could shift them right into a realm where they could be funded versus where they would not be."*
> — Martin Clark (Jan 15)

#### Reviewer workarounds

**Retrofitting scores:** Multiple reviewers described adjusting individual category scores to make the total match their holistic judgment. Dina Ligaga: *"Sometimes I have to go back and either mark up or mark down just so the final tally kind of looks like what the person deserves"* (Ligaga, Jan 12). Maureen De Jager described a similar "retrofit" practice of *"adjusting the final score if the initial impression suggests a different strength than the calculated rating"* (De Jager, Jan 22).

**Starting high and adjusting down:** Frelet De Villiers: *"I always start on a four. So, if I read through something, the candidate has a four. As I go further, I will then go, no, this is actually a three"* (De Villiers, Jan 26).

**Bayesian updating:** Edzai Conilias Zvobwo described *"a 'Bayesian' approach of adjusting beliefs with more evidence"* as he reviews more applications (Zvobwo, Jan 13).

**Narrative compensation:** Pieter Pistorius writes *"2-3 sentence rationale for scoring"* to capture what the numbers cannot (Pistorius, Jan 19).

#### The cold start problem

Edzai identified the first application as *"the most difficult to judge due to the lack of a frame of reference, which they suggested could prejudice the person reviewed first"* (Zvobwo, Jan 13). This systematic issue affects evaluation fairness.

#### Rubric and NRF alignment

Freedom Gumedze noted: *"The rubric is built on an NRF kind of model... the only thing that has been added is this social responsive impact"* (Gumedze, Jan 26). This raises questions about whether the rubric is fit for OMT's specific evaluation needs.

---

### 4.3 Evaluation Criteria: What Makes an Excellent Application

#### Universal criteria (consensus across all disciplines)

**1. Narrative coherence and authentic motivation**

Every reviewer prioritized genuine personal narrative over polished presentation:

> *"I always value passion higher than I value cleverness. You can always teach passion but you can't build passion always."*
> — Martin Clark (Jan 15)

> *"There's a genuineness to some of the applications that I appreciate."*
> — Dina Ligaga (Jan 12)

> *"I see the question as much more connected like tell me who you are as an academic."*
> — Ryan Nefdt (Jan 21)

**2. Societal impact potential**

> *"I have a personal bias towards impact programs that help the bottom of the pyramid."*
> — Edzai Conilias Zvobwo (Jan 13)

> *"Ultimately it's not quite simply about the merit of the intent... It's about the probability of that being delivered."*
> — Mohamed Cassim (Jan 20)

**3. Holistic alignment across application components**

> *"If everything if the big picture makes sense... I feel more confident."*
> — Frasia Oosthuizen (Jan 27)

> *"There needs to be a kind of coherence where the way the person articulates their work aligns with the work."*
> — Maureen De Jager (Jan 22)

#### Discipline-specific criteria

**STEM (Zvobwo, Pistorius, Gumedze, Oosthuizen):**
- Research feasibility and methodology
- Publication potential and bibliometric indicators
- Direct measurable societal impact
- Institutional research capacity

**Humanities (Ligaga, Nefdt):**
- Originality of proposed study
- Different pathways to societal impact: *"with humanities it's a little bit different. you have to figure out different conduits to um to getting some societal impact"* (Nefdt, Jan 21)
- Intellectual contribution to the field

**Arts (De Jager, De Villiers):**
- Portfolio quality as primary evidence: *"The portfolio is critical... one can talk things up, and especially with AI, it's very easy to write a convincing proposal"* (De Jager, Jan 22)
- Technical and conceptual sophistication
- Practice-based research trajectory: *"Practice in its nature is exploratory... it's very difficult to know before you've even set out on this journey where you're going to end up"* (De Jager, Jan 22)

**Financial/Business (Cassim, Burger):**
- Probability of delivery
- Candidate's "skin in the game"
- Field alignment with prior qualifications

#### Red flags

- Misalignment between proposal and portfolio/background (De Jager, Jan 22)
- Suspected AI-generated motivation letters (Burger, Jan 13; Ligaga, Jan 12; De Villiers, Jan 26; De Jager, Jan 22)
- Weak foundational knowledge for proposed field (Burger, Jan 13; Gumedze, Jan 26)
- Generic, non-specific motivation statements (Ligaga, Jan 12)
- Inconsistencies between application documents (Pistorius, Jan 19; Oosthuizen, Jan 27)
- Unrealistic scope: *"four articles and three conferences and two books. I mean it's just not possible"* (De Villiers, Jan 26)
- "Last resort" applications lacking genuine commitment (Pistorius, Jan 19)
- Grandiose claims mismatched with basic proposals: *"candidate wants to cure cancer, but the project is so basic"* (Oosthuizen, Jan 27)

---

### 4.4 Bias, Subjectivity, and Fairness

Reviewers demonstrated remarkable self-awareness about bias, though strategies for mitigation vary.

#### Acknowledged biases

> *"I have a personal bias towards impact programs that help the bottom of the pyramid."*
> — Edzai Conilias Zvobwo (Jan 13)

Dina Ligaga acknowledged *"unconscious bias based on applicant's background (race, class)"* (Ligaga, Jan 12). Martin Clark described trying to *"adjudicate from multiple different angles because excellence... can be measured from different perspectives"* (Clark, Jan 15).

#### Structural inequality awareness

A critical insight emerged about institutional disparities in application preparation:

> *"Certain schools seem to teach how to answer applications effectively, while others produce applications with bad quality where candidates cannot articulate the impact of their studies."*
> — Edzai Conilias Zvobwo (Jan 13)

> *"Not every applicant has availability of word processing, spell-check engines."*
> — Martin Clark (Jan 15)

> *"You need to be conscious to not penalize people [for language differences]."*
> — Philippe Burger (Jan 13)

#### The subjectivity tension

> *"I try to be objective, but in something like this which is not based on quantitative values, there is a matter of subjectivity."*
> — Frasia Oosthuizen (Jan 27)

> *"The motivation essay is where the biggest subjective judgment comes in."*
> — Philippe Burger (Jan 13)

#### The reference letter problem

Multiple reviewers flagged issues:
- Ryan Nefdt: *"Recommendation letters lack comparative value"* (Nefdt, Jan 21)
- Frasia Oosthuizen: *"Referee reports don't always use 'exceptional' language expected by rubric"* (Oosthuizen, Jan 27)
- Maureen De Jager: *"Unreliable references"* as a specific challenge (De Jager, Jan 22)

---

### 4.5 AI in the Review Process: Hopes, Fears, and Boundaries

This is the most strategically important theme. Reviewers showed nuanced, sophisticated attitudes toward AI — neither dismissive nor uncritically enthusiastic.

#### Attitude spectrum

| Category | Reviewers | Characteristic Position |
|----------|-----------|------------------------|
| **AI Optimists** | Martin Clark, Mohamed Cassim | See broad potential; AI as "cognitive assistant" |
| **Cautious Adopters** | Dina Ligaga, Freedom Gumedze, Ryan Nefdt, Pieter Pistorius, Edzai Zvobwo, Frasia Oosthuizen | Welcome specific uses; insist on human primacy |
| **AI Skeptics** | Frelet De Villiers, Maureen De Jager | Doubt AI's ability to handle evaluative judgment |

#### Consensus: what AI should do

All receptive reviewers agreed on AI handling these tasks:

1. **Administrative verification:** Budget checking, document completeness, deadline tracking (Cassim, Jan 20)
2. **Data extraction and organization:** Academic timeline compilation, institutional data lookup (Pistorius, Jan 19)
3. **Bibliometric analysis:** Publication metrics, citation analysis, H-index lookup (Gumedze, Jan 26)
4. **Initial screening:** Minimum requirements checking, document completeness (Ligaga, Jan 12)
5. **Discipline-specific context:** *"If there was some sort of assistant who could give you context of the discipline... that might be useful"* (Nefdt, Jan 21)

#### What AI must not do (unanimous)

> *"Eventually the human being must make a final call."*
> — Pieter Pistorius (Jan 19)

> *"I prefer making those judgment calls because I don't want someone else to have told me."*
> — Frasia Oosthuizen (Jan 27)

> *"Assessing art requires time and a human element of interpretation, which cannot be easily short-circuited."*
> — Maureen De Jager (Jan 22)

No reviewer supported autonomous AI decision-making for application outcomes.

**Critical nuance on pre-flagging:** Frasia Oosthuizen explicitly rejected the idea of AI identifying red flags or inconsistencies for her to validate: *"If that person tells me what the red flags are, I already have decided in my mind no this is not going to work. So I'm really not objective."* (Oosthuizen, Jan 27). She argued that pre-structured information creates anchoring bias — the reviewer must form their own impression first. This was the strongest pushback against even "supportive" AI features and suggests a spectrum of acceptable AI involvement even within the cautious-adopter group.

#### Sophisticated AI understanding

Reviewers showed strong awareness of AI limitations:

> *"AI as it is can't reason. It's purely statistical, probabilistic."*
> — Edzai Conilias Zvobwo (Jan 13)

> *"AI right now... is built on data that is in the internet... by its very nature AI would go on historic trends when all of us know that the future is not told by history alone."*
> — Mohamed Cassim (Jan 20)

#### The AI-generated content problem

This emerged as a significant and **escalating** cross-cutting concern, independently raised by at least 6 reviewers:

> *"In 2023-2024 still know back then you could still see that something like a ChatGPT generated text was very bland and generalist... but of course now that will become more and more difficult."*
> — Philippe Burger (Jan 13)

> *"There's some way you get this feeling and it's become a lot fuzzier with AI interventions."*
> — Dina Ligaga (Jan 12)

> *"With AI these days even the reviewer or the reference referee can also put that through AI and I mean you can't even see if it's a student writing or whatever... you have to believe what you get."*
> — Frelet De Villiers (Jan 26)

> *"The portfolio is critical... one can talk things up, and especially with AI, it's very easy to write a convincing proposal... and you're sort of wondering how much of that is really this the student being able to articulate."*
> — Maureen De Jager (Jan 22)

> *"You get students who... all of a sudden improved a lot for some of these cases which suggest that it might be Chad writing them instead of the candidate."*
> — Philippe Burger (Jan 13)

Burger proposed concrete countermeasures: *"Interviews to verify essay authenticity... Timed, proctored essay writing"* (Burger, Jan 13). Several reviewers noted that portfolio/practical work (De Jager) and financial commitment signals (Cassim, Oosthuizen) serve as more reliable authenticity markers than written text.

#### A valued AI concept: pre-populated rubric with human override

Dina Ligaga articulated what several reviewers implied:

> *"I would absolutely [want a] pre-populated rubric... that allows me then to focus on just saying exactly what I think."*
> — Dina Ligaga (Jan 12)

This suggests AI could provide a starting point for evaluation while preserving full reviewer autonomy to modify every score.

---

### 4.6 The Feedback Gap and Reviewer Experience

#### Limited feedback on review quality

Most reviewers reported receiving minimal information about outcomes or peer calibration:

> *"I would like to know of the reviews that we have given, do they take a sort of combination of scores from the group?"*
> — Freedom Gumedze (Jan 26)

Edzai raised *"a standing question regarding how many reviewers assess the same candidate to potentially debias results"* (Zvobwo, Jan 13).

#### Cross-reviewer calibration is absent

Reviewers work in isolation with no mechanism to compare their scoring patterns with peers. This creates unquantified variance in evaluation standards.

#### Reviewer motivation

Despite challenges, reviewers find the work meaningful:

> *"I enjoy doing this because... it's amazing to see what some young people are achieving."*
> — Frasia Oosthuizen (Jan 27)

> *"It's always quite a humbling experience... the caliber of the candidates."*
> — Pieter Pistorius (Jan 19)

> *"We have a treasure trove of people who want to make this place better and we're using tools that could all be improved."*
> — Mohamed Cassim (Jan 20)

#### The volunteer burden

Martin Clark mentioned *"Time pressure of pro-bono work"* (Clark, Jan 15). Pieter Pistorius suggested starting the review process earlier to *"Allow time to 'sleep on' applications"* (Pistorius, Jan 19).

#### Feedback for applicants

Frelet De Villiers raised an important secondary theme: *"I really feel feedback is what this is about because now they apply next year you get the same student applying again"* (De Villiers, Jan 26). This suggests the review process could serve a developmental function beyond selection.

---

## 5. Cross-Cutting Tensions and Paradoxes

### Decision-Making Heuristics

The Sonnet 4.5 synthesis identified three distinct decision-making patterns across reviewers:

**1. The "Retrofit" Pattern** — Reviewers form holistic impressions first, then adjust rubric scores to match. Maureen De Jager described *"tweaking scores to reflect actual quality assessment"* (De Jager, Jan 22). Dina Ligaga: *"Sometimes I have to go back and either mark up or mark down just so the final tally kind of looks like what the person deserves"* (Ligaga, Jan 12). This suggests the rubric functions as post-hoc rationalization for some reviewers rather than primary decision mechanism.

**2. The "Comparative Adjustment" Pattern** — Reviewers calibrate scores iteratively within a cohort. Frasia Oosthuizen: *"If scoring a fifth candidate, may flip back to reconsider scores of earlier candidates... 'I gave this one a four but really then that one shouldn't have been a four. It should have been a three'"* (Oosthuizen, Jan 27). This produces relative rather than absolute assessments.

**3. The "Bias Counteraction" Strategy** — Some reviewers explicitly use the rubric as a check against their own intuitive biases. Ryan Nefdt: *"I see the rubric as a measurement that allows comparison... I would [err] on the side of using the rubric because I'm assuming that is a tool to neutralize the sort of like personal bias that might creep in"* (Nefdt, Jan 21). Pieter Pistorius: *"I wouldn't sort of push it towards my first intuition"* (Pistorius, Jan 19).

---

### Tension 1: Standardization vs. Flexibility
The rubric provides comparability across reviewers but constrains evaluative richness. Reviewers simultaneously rely on and subvert it, suggesting fundamental misalignment between tool design and evaluative practice.

### Tension 2: Efficiency vs. Depth
Reviewers want streamlined processes (Cassim's "reduce superfluous cognitive load") but insist that deep engagement is irreplaceable (De Jager: "cannot be easily short-circuited"). AI integration must navigate this carefully.

### Tension 3: Technology vs. Human Judgment
Most reviewers see AI's potential but resist replacement of human insight. Edzai wanted AI for "algorithmic/rubric scoring" but "rejects fully autonomous systems" — creating a complex integration challenge where AI must be useful without being threatening.

### Tension 4: Individual Autonomy vs. Collective Consistency
Reviewers value independent judgment (Oosthuizen: "I don't want someone else to have told me") while recognizing the need for consistency (Gumedze: wants "cross-reviewer score comparisons"). The system must enable both.

### Paradox: The Authenticity Arms Race
As AI-generated applications become more common, the very authenticity reviewers prize becomes harder to detect. The skills reviewers rely on (reading "genuineness" in motivation letters) may become less reliable, potentially undermining a cornerstone of the evaluation philosophy.

---

## 6. Strategic Recommendations

### 6.1 Quick Wins

| Recommendation | Evidence | Effort |
|---------------|----------|--------|
| **Expand rubric to 1-7 or 1-10 scale** | Universal complaint; Ligaga, Zvobwo, Clark, Burger all cited | Low |
| **Provide anonymized peer score comparisons** | Gumedze explicitly requested; Zvobwo asked about debiasing | Low |
| **Fix multi-window interface** | Ligaga cited as frustrating | Medium |
| **Start review periods earlier** | Pistorius recommended; Clark cited time pressure | Low |
| **Provide reviewer benchmarking/calibration session** | Addresses cold start problem (Zvobwo) and calibration gap | Medium |

### 6.2 System Design Priorities

1. **Rubric redesign** with discipline-specific variations maintaining core comparability (Clark: *"categories could be more nebulous or change based on discipline"*)
2. **Reference letter standardization** with comparative frameworks and guided questions (Nefdt, Oosthuizen both flagged issues)
3. **Application preparation resources** for candidates from under-resourced institutions (Zvobwo's institutional disparity finding)
4. **Reviewer feedback dashboard** showing score distributions, outcome data, and peer comparisons (Gumedze)

### 6.3 AI Integration Strategy (Phased)

**Phase 1 — Administrative Automation** (universally supported):
- Document completeness checking
- Budget verification and calculation
- Basic data extraction (academic timelines, institutional info)
- Deadline and eligibility screening

**Phase 2 — Information Enhancement** (broadly supported):
- Discipline-specific context provision (Nefdt's suggestion)
- Bibliometric analysis and citation data (Gumedze's request)
- Institutional performance data compilation
- Application component cross-referencing

**Phase 3 — Preliminary Assessment** (cautiously supported):
- Pre-populated rubric scores with full reviewer override (Ligaga's concept)
- Inconsistency flagging across application documents
- AI-generated content detection
- Comparative benchmarking against past cohorts

**Phase 4 — Advanced Support** (future, requires trust-building):
- Draft assessment summaries for reviewer editing
- Quality indicators for reviewer attention prioritization
- Cross-application thematic analysis

### 6.4 Change Management

- **Voluntary adoption first.** Allow reviewers to opt in based on comfort (addresses De Villiers's skepticism)
- **Transparency always.** All AI outputs must be clearly labeled and explainable (Nefdt: *"transparency and trusted insights"*)
- **Training on AI capabilities and limitations.** Build on reviewers' existing sophisticated understanding
- **Regular feedback loops.** Monitor AI tool effectiveness and reviewer satisfaction

### 6.5 Risk Mitigation

| Risk | Source | Mitigation |
|------|--------|------------|
| AI-generated application content | Burger, Ligaga, De Jager | Detection tools + interview/timed writing verification |
| AI bias amplification | Cassim: *"AI would go on historic trends"* | Regular bias audits, diverse training data |
| Reviewer agency loss | Oosthuizen: *"I prefer making those judgment calls"* | Full override capability, opt-in features |
| Over-reliance on AI screening | Clark: *"potential wrong answers"* | Human review of all AI-flagged decisions |
| Rubric gaming by applicants aware of AI | Emerging risk | Regular rubric evolution, human judgment primacy |

---

## 7. Interviewee Quick Reference

| Interviewee | Distinctive Perspective |
|-------------|------------------------|
| **Dina Ligaga** | Detailed interface usability feedback; developed rubric "retrofitting" workaround; wants AI pre-populated rubric with human override |
| **Edzai Conilias Zvobwo** | Identified cold start problem; explicit bias acknowledgment; champions "human in the loop"; most articulate about AI limitations |
| **Philippe Burger** | Most concerned about AI-generated applications; proposed interview/timed writing verification; systematic scoring approach |
| **Martin Clark** | "Passion over cleverness" philosophy; most AI-optimistic; strongest structural inequality awareness |
| **Pieter Pistorius** | Most systematic time allocation; integrity-focused; pragmatic about AI for preliminary screening |
| **Mohamed Cassim** | "Cognitive assistant" AI vision; probability-of-delivery evaluation lens; warned about historical bias in AI |
| **Ryan Nefdt** | Narrative coherence emphasis; wants discipline-specific AI context; comparative evaluation within cycles |
| **Maureen De Jager** | Portfolio-centric creative assessment; insists art assessment requires human interpretation; former OMT recipient |
| **Freedom Gumedze** | Cross-reviewer calibration advocate; bibliometric analysis requests; NRF-OMT rubric comparison |
| **Frelet De Villiers** | "Start high, adjust down" scoring; most AI-skeptical; strongest feedback-for-applicants advocate |
| **Frasia Oosthuizen** | Longest tenure; "picture creation" approach to holistic assessment; values independent judgment most strongly |

---

## 8. Source Files and Analysis Artifacts

### Interview Transcripts
All source transcripts are in `Oppenheimer Memorial Trust/OMT Transcripts/`:

| File | Interviewee | Date |
|------|-------------|------|
| `OMT Discovery Interview...Dina Ligaga...Notes by Gemini.docx` | Dina Ligaga | Jan 12, 2026 |
| `OMT Discovery Interview...Edzai Conilias Zvobwo...Notes by Gemini.docx` | Edzai C. Zvobwo | Jan 13, 2026 |
| `OMT Discovery Interview...Philippe Burger...Notes by Gemini.docx` | Philippe Burger | Jan 13, 2026 |
| `OMT Discovery Interview...Martin Clark...Notes by Gemini.docx` | Martin Clark | Jan 15, 2026 |
| `OMT Discovery Interview...Pieter Pistorius...Notes by Gemini.docx` | Pieter Pistorius | Jan 19, 2026 |
| `OMT Discovery Interview...Mohamed Cassim...Notes by Gemini.docx` | Mohamed Cassim | Jan 20, 2026 |
| `OMT Discovery Interview...Ryan Nefdt...Notes by Gemini.docx` | Ryan Nefdt | Jan 21, 2026 |
| `OMT Discovery Interview...Maureen De Jager...Notes by Gemini.docx` | Maureen De Jager | Jan 22, 2026 |
| `OMT Discovery Interview...Ndumiso Luthuli...Notes by Gemini.docx` | Ndumiso Luthuli | Jan 23, 2026 (excluded) |
| `OMT Discovery Interview...Andrew Macdonald...Notes by Gemini.docx` (x2) | Andrew Macdonald | Jan 21 & 23, 2026 (excluded) |
| `OMT Discovery Interview...Freedom Gumedze...Notes by Gemini.docx` | Freedom Gumedze | Jan 26, 2026 |
| `OMT Discovery Interview...Frelet De Villiers...Notes by Gemini.docx` | Frelet De Villiers | Jan 26, 2026 |
| `_OMT Discovery Interview...Frasia Oosthuizen...Notes by Gemini.docx` | Frasia Oosthuizen | Jan 27, 2026 |
| `OMT Discovery Interview...Cephas Chikanda...Notes by Gemini.docx` | Cephas Chikanda | Jan 21, 2026 (excluded) |

### Analysis Artifacts
Generated analysis files in `scripts/analysis_output/`:
- `individual_[Name].md` — Per-transcript structured analysis (15 files; 11 substantive, 4 excluded)
- `theme_ai_attitudes.md` — Deep dive: AI attitudes across all 11 interviewees
- `theme_rubric_and_scoring.md` — Deep dive: Rubric mechanics and workarounds
- `theme_evaluation_criteria.md` — Deep dive: Evaluation criteria by discipline
- `synthesis_report.md` — Cross-transcript synthesis (Sonnet 4.5, 8192 tokens)
- `deep_synthesis_report.md` — Comprehensive thematic synthesis with raw transcript excerpts (Sonnet 4.5, 8192 tokens)
- `all_individual_results.json` — Raw analysis data (all models, token counts, text)

### Analysis Scripts
- `scripts/analyze_transcripts.py` — Phase 1 analysis (Haiku 4.5 individual coding + Sonnet 4.5 synthesis)
- `scripts/deep_synthesis.py` — Phase 2 analysis (Haiku 4.5 thematic deep dives + Sonnet 4.5 deep synthesis with raw transcript excerpts)

### Token Usage Summary
| Phase | Model | Input Tokens | Output Tokens |
|-------|-------|-------------|---------------|
| Individual coding (15 transcripts) | Haiku 4.5 | ~136K | ~50K |
| Thematic deep dives (3 themes × 11) | Haiku 4.5 | ~300K | ~66K |
| Initial synthesis | Sonnet 4.5 | ~52K | ~8K |
| Deep synthesis | Sonnet 4.5 | ~55K | ~8K |
