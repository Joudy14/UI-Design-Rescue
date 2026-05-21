# UI Design Rescue — User Feedback Report v1

**Author:** Akylbek
**Role:** Documentation (User-facing)
**Version:** v1
**Date:** May 2026

---

## 1. Overview

This report summarizes the first round of user feedback for **UI Design Rescue**, an educational web-based game that teaches UI/UX design principles through interactive gameplay. Players fix intentionally broken interfaces by dragging, resizing, and reorganizing elements while receiving live feedback and a real-time score.

The goal of this first feedback cycle was to evaluate the **playability**, **clarity**, and **learning effectiveness** of v1 before moving on to v2.

---

## 2. Methodology

Feedback was collected through a dedicated **Google Form** distributed to:
- Internal team members (developers, testers, documentation team)
- External players (students from various backgrounds)

The form covered 21 questions across 8 sections: demographics, first impressions, gameplay mechanics, level experience, scoring, learning outcomes, bug reports, and overall rating.

---

## 3. Respondent Demographics

- **55.6%** of respondents were **CS / Engineering students**
- **33.3%** were students from other fields
- **11.1%** were Design students
- Self-reported UI/UX knowledge averaged around **level 3 out of 5**, meaning most respondents had only moderate prior exposure to design principles

This is a relevant demographic mix — most testers were not design experts, which matches the target audience of the game.

---

## 4. Key Findings

### 4.1 First Impressions Need Work

While **66.7%** of players said they understood how to play right away, **33.3% did NOT** — they reported being confused or needing time to figure things out. This is a meaningful portion of users and signals that **the game lacks an onboarding step**.

Open-text reactions to the broken UI were mixed and **mostly negative or neutral**:
- "Confused"
- "It's messy"
- "Sad"
- "Surprised"
- "That's so sad I'm crying"

Even players who eventually understood the game reported a rough first impression. The intentionally broken UI is the *point* of the game, but without context, new players may feel overwhelmed rather than challenged.

### 4.2 Level 2 (Payment) and Level 1 (Login) Are Problematic

The level enjoyment data revealed a clear issue:

| Level | Most Enjoyed | Most Frustrating |
|-------|--------------|------------------|
| Level 1 — Login | 0% | **33.3%** |
| Level 2 — Payment | 22.2% | **44.4%** |
| Level 3 — Profile | 55.6% | 11.1% |
| Level 4 — Settings | 22.2% | 11.1% |

**Almost half of all players found Level 2 (Payment) the most frustrating**, and another third pointed to Level 1 (Login). Combined, that's **77.7% of players reporting frustration with the first two levels they encounter** — meaning many players are getting a bad experience before they even reach the levels that work well.

Selected feedback:
- "I hate log in pages"
- "I don't like payment"
- "Felt overwhelmed in the profile, needed improvement"

### 4.3 The Game May Be Too Easy

Several responses suggest that v1 does not challenge players enough:
- "It's educational but too obvious — needs to be more difficult to learn something"
- "No, it was just easy to pass"
- "Easier than expected"

This is reinforced by the scoring data: **22.2% of players said they got a higher final grade than they actually deserved**, suggesting the scoring system is too lenient and does not push players to engage deeply with UI/UX principles.

### 4.4 Visual Clarity Issues

One respondent specifically stated: *"I got lost with all instructions and colors."*

Another summarized improvement areas as: *"Colors, instructions, more complex, more real world experience, less word using."*

This indicates that the broken UI screens may be **too visually noisy**, and the instructional overlays may need to be reduced or simplified.

### 4.5 Pop-up Feedback — Mostly Working, But Not Perfect

While **88.9%** of players found the live pop-up messages helpful and motivating, **11.1% reported them as "helpful but too frequent."** No respondents found them annoying, but the frequency may need tuning to avoid distraction in future versions.

### 4.6 Resize Mechanic — Minor Issue Reported

While **88.9%** of players said all mechanics felt smooth, **one respondent flagged the resize mechanic as awkward or buggy**. This should be investigated by the development team.

### 4.7 Learning Outcomes Are Inconsistent

While **77.8%** of players felt they learned something new about good design (rating 5/5), **22.2% gave only a 3/5** — meaning the learning impact is not yet strong enough for all players. Some open-text answers were also vague:
- "Settings"
- "Profile Design"
- "."
- "Love it."

These short answers suggest that some players could not clearly articulate *what* they learned — which means the educational message of the game is not landing as clearly as it should.

---

## 5. Issues Identified — Summary

The following issues should be addressed in **v2**:

1. **No onboarding / tutorial** — 33% of players didn't immediately understand how to play
2. **Level 1 (Login) and Level 2 (Payment) are frustrating** — together, 77.7% of players report frustration with these levels
3. **Difficulty is too low** — multiple players reported the game is too easy
4. **Scoring system is too lenient** — 22% received higher grades than deserved
5. **Visual noise** — the combination of broken UI + instructions + colors overwhelms some players
6. **Resize mechanic** — flagged as awkward by one player; needs investigation
7. **Pop-up frequency** — too frequent for some players
8. **Inconsistent learning outcomes** — not all players can articulate what they learned

---

## 6. Recommendations for v2

Based on the user feedback, the documentation team recommends the following priorities for the next version:

1. **Add a short visual onboarding** (a single intro screen or animated hint) so players understand the goal before entering Level 1
2. **Redesign Level 1 (Login) and Level 2 (Payment)** — these are the most frustrating levels and need rebalancing
3. **Increase difficulty / tighten the scoring thresholds** — make it harder to get a high grade without actually applying good design principles
4. **Reduce visual clutter** on the broken UIs — fewer simultaneous problems per screen, clearer hierarchy
5. **Investigate the resize mechanic** for the reported awkwardness
6. **Reduce pop-up frequency** or group similar messages together
7. **Add a short end-of-level summary** that explicitly states which design principles were applied, to strengthen the learning takeaway

---

## 7. Positive Signals (For Context)

While this report focuses on areas of improvement (as expected for a v1 testing cycle), the following positive signals are worth noting:
- No bugs or crashes were reported by testers
- The drag/reorder mechanics felt smooth for most players
- Level 3 (Profile) was clearly the favorite — its design pattern can serve as a reference for redesigning Levels 1 and 2

---

## 8. Conclusion

v1 of UI Design Rescue is a functional prototype with a clear concept and working mechanics, but several user experience issues prevent it from reaching its full educational potential. The most urgent issues are the **lack of onboarding**, the **frustrating early levels (Login and Payment)**, the **low difficulty**, and the **lenient scoring system**.

Addressing these in v2 should significantly improve both player satisfaction and learning outcomes.

---

## 9. Appendix — Raw Response Data

Screenshots of all Google Form charts and text responses are available in the `/docs/v1-feedback-screenshots/` folder of this repository.

**Report compiled by:** Akylbek
**Next report:** `docs-v2-Akylbek.md` (after v2 release)
