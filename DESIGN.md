# DESIGN.md

# ClaimLens Design System Specification

Version: 1.0

This document formalises the existing **claims desk** visual language. The goal is to make the interface feel like a genuine insurance inspection document rather than a conventional SaaS dashboard.

The visual metaphor is **an adjudicator's physical claims desk**:
- paper
- inspection notes
- evidence sheets
- rubber verdict stamps
- procedural workflow

The design system intentionally avoids decorative UI trends. Every visual element exists to communicate process, evidence, or confidence.

---

# Design Principles

1. Evidence before aesthetics.
2. Process is always visible.
3. Every AI decision is explainable.
4. Motion communicates workflow, never delight.
5. The interface should feel trustworthy enough to print.

---

# Colour Tokens

| Token | Hex | Contrast on Ledger | Contrast on Sheet | Usage |
|---------|---------|---------|---------|---------|
| Ledger | #F6F5F0 | — | — | Primary application background |
| Sheet | #FFFEFB | 1.08:1 | — | Cards and inspection sheets |
| Ink | #1F2421 | 14.6:1 | 15.3:1 | Primary text |
| Ink Soft | #5C635E | 5.8:1 | 6.0:1 | Secondary text |
| Rule | #D8D6CC | 1.35:1 | 1.44:1 | Borders only |
| Form Blue | #2B4C8C | 8.0:1 | 8.4:1 | Links, buttons, focus actions |
| Form Blue Deep | #1F3865 | 11.0:1 | 11.5:1 | Hover states |
| Verdict Green | #1F7A4D | 5.0:1 | 5.2:1 | Verdict only |
| Verdict Red | #A83527 | 5.4:1 | 5.6:1 | Verdict only |
| Verdict Amber | #A06A00 | 3.9:1 | 4.0:1 | Verdict only |

## WCAG Adjustment

The amber fails AA for normal-sized text.

Replace only when amber text is rendered below 18px.

**Replacement**

```
Verdict Amber Accessible
#8B5B00
```

Contrast:

- Ledger: 5.1:1
- Sheet: 5.3:1

Reasoning:

Only darkened enough to meet AA while preserving the "inspection marker pen" appearance.

---

# Spacing Scale

Base unit = **4px**

| Token | Value |
|---------|---------|
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 8 | 32px |
| 10 | 40px |
| 12 | 48px |
| 16 | 64px |
| 20 | 80px |

---

# Radius Scale

ClaimLens is intentionally square.

| Component | Radius |
|------------|---------|
| Cards | 0px |
| Buttons | 2px |
| Inputs | 2px |
| Upload previews | 2px |
| Verdict stamp | 0px |
| Images | 2px |

Reasoning:

Paper does not have rounded corners.

Only interactive controls receive a subtle radius to improve touch usability.

---

# Borders

Primary rule

```
1px solid Rule
```

Heavy inspection dividers

```
2px solid Ink
```

Rubber stamp border

```
3px solid currentColor
```

---

# Shadow Policy

No shadows are used.

Hierarchy is created through

- borders
- spacing
- paper colour
- typography

Reasoning:

Physical inspection sheets are stacked visually through paper and rules rather than elevation.

---

# Typography

Primary family

IBM Plex Sans

Data

IBM Plex Mono

Verdict stamp

IBM Plex Sans Condensed Bold

---

| Style | Size | Line | Weight | Family | Letter spacing |
|--------|------|------|---------|---------|----------------|
| Page Title | 2.25rem | 2.5rem | 700 | Plex Sans Condensed | .08em |
| Section Label | .75rem | 1rem | 600 | Plex Sans | .12em |
| Body | 1rem | 1.5rem | 400 | Plex Sans | 0 |
| Data Mono | .875rem | 1.25rem | 500 | Plex Mono | .03em |
| Caption | .8125rem | 1.125rem | 400 | Plex Sans | 0 |
| Button | .9375rem | 1rem | 600 | Plex Sans | .02em |
| Verdict Stamp | 1.5rem | 1.5rem | 700 | Plex Sans Condensed | .12em |

---

# Icon Style

All icons use

- stroke only
- currentColor
- 1.5 stroke
- square caps
- square joins

No fills.

24×24 viewBox.

Reasoning:

Matches technical inspection drawings.

---

# ClaimLens Logo

```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="square"
stroke-linejoin="miter">

<rect x="4" y="3" width="12" height="16"/>

<circle cx="15" cy="14" r="4"/>

<line x1="18" y1="17" x2="21" y2="20"/>

</svg>
```

---

# Camera Icon

```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="square">

<rect x="3" y="6"
width="18"
height="13"/>

<circle cx="12"
cy="12.5"
r="3"/>

<line x1="7"
y1="6"
x2="9"
y2="3"/>

</svg>
```

---

# Checklist Tick

```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="square">

<polyline points="5 13 10 18 19 7"/>

</svg>
```

---

# Risk Flag

```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="1.5">

<line x1="6" y1="3" x2="6" y2="21"/>

<polyline points="6 4 17 7 6 10"/>

</svg>
```

---

# Decorative Stamp Placeholder

```svg
<svg xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 320 220">

<g transform="rotate(-4 160 110)">

<rect
x="15"
y="15"
width="290"
height="190"
rx="6"
fill="none"
stroke="currentColor"
stroke-width="3"
stroke-dasharray="10 6"/>

</g>

</svg>
```

---

# Optional Paper Texture

```svg
<svg xmlns="http://www.w3.org/2000/svg"
width="400"
height="400">

<defs>

<pattern id="ledger"
width="400"
height="12"
patternUnits="userSpaceOnUse">

<line
x1="0"
y1="6"
x2="400"
y2="6"
stroke="currentColor"
opacity=".03"/>

</pattern>

</defs>

<rect
width="100%"
height="100%"
fill="url(#ledger)"/>

</svg>
```

---

# Landing Page

Desktop

```
-------------------------------------------------------

ClaimLens reads the claim, inspects the photos,
and issues a verdict.
This one took 14 seconds.

-------------------------------------------------------

+------------------------+--------------------------+

|                        |      SUPPORTED           |

| Claim Photo            |--------------------------|

|                        | Findings                 |

|                        |                          |

|                        | Justification            |

|                        |                          |

| Transcript             | Evidence                 |

+------------------------+--------------------------+

-------------------------------------------------------

Sample Claims

[ Fraud ]

[ Contradiction ]

[ Multi-image ]

-------------------------------------------------------

Architecture

-------------------------------------------------------

Footer

-------------------------------------------------------
```

Mobile

```
Photo

Verdict

Transcript

Findings

Samples

Architecture

Footer
```

---

# Submit Page

Desktop

```
---------------------------------------

Object Type

[ Car ▼ ]

---------------------------------------

Transcript

+---------------------------+

|                           |

|                           |

+---------------------------+

---------------------------------------

Images

[ + ]

[thumb] [thumb] [thumb]

× remove

---------------------------------------

Submit Claim

---------------------------------------
```

Button States

Default

```
Submit Claim
```

Submitting

```
Inspecting…
```

Disabled

```
Submit Claim
```

40% opacity.

---

# Inspection Pipeline

Five stages

```
✓ Validate Request

✓ Process Images

○ Inspect Damage

○ Compare Evidence

○ Produce Verdict
```

LLM stages use

- bold labels
- slightly darker rule
- mono timings

```
2.4s

4.8s

6.1s
```

---

# Verdict Card

```
SUPPORTED

Severity

Low

Evidence Standard

High

Justification

...

Finding

...

Flags

Duplicate reflection

Low image quality

Images

[✓]

[ ]

[✓]
```

Supporting images receive

```
2px solid Verdict Green
```

---

# Review Queue

```
--------------------------------------------------------------

CLAIM ID

STATUS

TIME

OBJECT

--------------------------------------------------------------

CLM-00182

SUPPORTED

14:02

Vehicle

--------------------------------------------------------------

CLM-00183

CONTRADICTED

14:06

Laptop

--------------------------------------------------------------
```

Mono font is used for

- IDs
- timestamps
- durations

---

# Motion

Only three animations exist.

## Running Stage Pulse

Applies only to active checklist row.

Duration

800ms

Infinite while active.

---

## Verdict Stamp

Scale

1.08 → 1.0

Rotation

-4°

Duration

220ms

Ease-out.

---

## Checklist Compression

After completion

```
✓ 5 stages

↓

5 stages • 14.2 s
```

Duration

180ms

---

# Microcopy

## Empty Queue

> No claims are awaiting review.

---

## Awaiting Verdict

> Inspection in progress. Evidence is being assessed.

---

## Claim Not Found

> No claim matches the supplied identifier.

---

## Pipeline Failure

> The inspection could not be completed. Submit the claim again.

---

## Demo Limit

> Demo limit reached today. Please try again tomorrow.

---

## Invalid Image

> Image format not supported.

---

## Image Too Large

> Image exceeds the maximum upload size.

---

## Duplicate Image

> Duplicate image detected.

---

# Accessibility

✔ AA contrast maintained across primary interface text.

✔ Focus indicator

```
2px Form Blue outline

2px offset
```

Visible against both Ledger and Sheet backgrounds.

✔ Verdict is never colour only.

Every verdict includes

- stamp
- label
- text
- iconography

✔ Motion

All animations disabled under

```
prefers-reduced-motion
```

Stamp appears instantly.

Checklist updates without animation.

---

# Design Rationale

The interface deliberately resembles a printed inspection folder rather than a software dashboard.

Trust is established through typography, spacing, procedural transparency, and restrained visual language rather than decorative effects. The adjudication process remains visible throughout the claim lifecycle, reinforcing that every verdict is supported by observable evidence rather than opaque automation.