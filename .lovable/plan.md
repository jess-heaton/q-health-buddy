
# Card Redesign - Heidi-Inspired Split Layout

## Overview
Transform the results card into a full-width, Heidi-inspired split layout with a warm background (#f9f4f1), compelling text on the left, and a clean white content box on the right. The card remains flippable to show the edit form.

## Design Reference Analysis
From the Heidi screenshot:
- Full-width section with warm cream background (#f9f4f1)
- Left side: Large italic serif headline + descriptive text + subtle text links
- Right side: White rounded bordered box with content
- Clean typography, generous spacing, minimal UI chrome
- Navigation as text links (not buttons)

---

## Architecture Changes

### 1. New Component: `ResultCard.tsx`
Create a new wrapper component that implements the Heidi-style split layout:

```text
+------------------------------------------------------------------+
|  #f9f4f1 background - full width                                  |
|                                                                   |
|   LEFT HALF                    |   RIGHT HALF (white box)         |
|   ~~~~~~~~~~~~                 |   ~~~~~~~~~~~~~~~~~~~~~~         |
|   "Your Results"               |                                  |
|   Large italic headline        |   [Dynamic Content Area]         |
|   "Evidence-based              |   - Score display                |
|   risk assessment..."          |   - Gauge visualization          |
|   descriptive paragraph        |   - Risk interpretation          |
|                                |                                  |
|   Score · Factors · Projection |   BMI quick stat                 |
|   (text links, not buttons)    |                                  |
|                                |                                  |
|   "Tap card to edit details"   |                                  |
+------------------------------------------------------------------+
```

### 2. Simplified `RiskResult.tsx`
Strip down to just the core result display (for the white box):
- Large percentage display
- Risk level badge
- Color gradient gauge
- Interpretation text
- BMI stat
- No navigation buttons (moved to left panel)

### 3. Updated `FactorBreakdown.tsx`
Refactor to match the new layout pattern:
- Left: Navigation + insights text
- Right: White box with factor cards

### 4. Updated `ProjectionView.tsx`
Same split layout:
- Left: Navigation + motivational text
- Right: White box with projection comparison

### 5. Updated `EditForm.tsx`
When flipped, the entire card shows the edit form in the same aesthetic:
- Warm background with centered white form box
- Clean header with "Done" link to flip back

### 6. Updated `FlippableCard.tsx`
Ensure the flip mechanism works with the new full-width layout.

---

## Technical Implementation

### File: `src/components/ResultCard.tsx` (NEW)
```tsx
// Heidi-inspired split layout wrapper
// Props: view type, result data, navigation callbacks, flip state
// Structure:
// - Full-width container with #f9f4f1 bg
// - CSS Grid: 50/50 split
// - Left: headline, paragraph, text navigation links
// - Right: white rounded-2xl border box containing dynamic content
```

### File: `src/components/RiskResult.tsx` (MODIFY)
- Remove navigation buttons (moved to parent)
- Remove outer containers and backgrounds
- Keep: percentage, badge, gauge, interpretation, BMI
- Make it a "content-only" component for the white box

### File: `src/components/FactorBreakdown.tsx` (MODIFY)
- Restructure to split layout pattern
- Left panel: navigation + insight text
- Right panel: white box with factor grid
- Remove current button-based navigation

### File: `src/components/ProjectionView.tsx` (MODIFY)
- Same split layout treatment
- Cleaner typography hierarchy

### File: `src/components/EditForm.tsx` (MODIFY)
- Full-width with centered white card
- Cleaner styling matching the aesthetic
- Larger, more spacious form layout

### File: `src/components/FlippableCard.tsx` (MODIFY)
- Ensure proper handling of full-width content
- Fix any height issues with the new layout

### File: `src/components/QDiabetesCalculator.tsx` (MODIFY)
- Replace current card structure with new ResultCard
- Pass navigation state and callbacks
- Adjust outer container to be truly full-width

---

## Visual Specifications

### Colors
- Background: `#f9f4f1` (warm cream)
- White box: `#ffffff` with `border-gray-200`
- Primary text: `#28030f` (deep burgundy-brown)
- Secondary text: `#665073` (muted purple)
- Accent: `#fbf583` (soft yellow for highlights)

### Typography
- Headline: Large, light weight, with italic emphasis
- Body: Light weight (font-light), generous line height
- Navigation links: Small, underlined on hover, no button styling

### Spacing
- Container padding: 48-64px vertical, 40-80px horizontal
- Gap between columns: 40-60px
- White box padding: 40-48px
- Rounded corners on white box: 24px (rounded-2xl)

### Navigation Style (Text Links)
```tsx
<button className="text-sm font-light text-gray-600 hover:text-gray-900 
  hover:underline transition-all">
  Score
</button>
<span className="text-gray-300 mx-2">·</span>
<button className="text-sm font-light ...">Factors</button>
<span className="text-gray-300 mx-2">·</span>
<button className="text-sm font-light ...">Projection</button>
```

---

## Flip Behavior
- Front: Split layout with results in white box
- Back: Full form in same warm background aesthetic
- Flip trigger: Click anywhere on the card (except form inputs)
- Visual hint: "Tap to edit" subtle text on left panel

---

## Responsive Considerations
- On mobile: Stack vertically (left becomes top, right becomes bottom)
- Maintain white box prominence
- Reduce padding proportionally
