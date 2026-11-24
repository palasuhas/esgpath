# Showcase verification

**Purpose.** Record the evidence behind presenting ESGpath as a working educational portfolio project.

**Summary.**

- Work is isolated on `codex/showcase-readiness`.
- Content claims are scoped and linked to primary sources.
- Six runtime regression tests pass, including storage-denied behavior.
- Local browser checks pass; the pull request records final production deployment evidence.

## Changes and reasoning

The update replaces unsupported promotional figures with counts of the guide's own content. Company cards now teach source evaluation, and fictional workdays are labelled. Source links, author attribution, navigation, a project share card and metadata help a visitor understand and share the project.

Theme storage failures no longer interrupt role-tab setup. Headings remain visible without web fonts; all workdays remain readable without JavaScript. Reduced-motion and print styles keep content accessible. Malformed icon markup and duplicate class attributes were corrected.

## Checks

Run `python tools/check.py` and `node --test tools/browser-runtime.test.mjs` from the repository root. Browser checks cover desktop and mobile views, both themes, role tabs by pointer and keyboard, source navigation, theme persistence and captured runtime errors.

Local browser checks passed on 24 November 2026: desktop and mobile hero, role and source sections; light and dark themes; theme persistence after reload; pointer and arrow-key role switching; source navigation; and no captured console errors. Measured document widths showed no horizontal page overflow at the tested desktop and mobile sizes. A light-theme footer contrast issue found during review was corrected. Storage denial and missing IntersectionObserver were verified in the runtime tests, not by changing browser security settings. Reduced-motion and no-JavaScript fallbacks were checked in source; they were not exercised with a screen reader or a disabled-JavaScript browser. The share card is designed artwork, not a screenshot. No claim of full WCAG conformance or exhaustive content validation is made. Existing licensing remains unchanged.

## Deployment follow-up

PR #1 merged as `7905cbe` and passed CI and the Pages build. The live browser then exposed an older cached stylesheet paired with the new HTML. A version query on both CSS links fixes that cache boundary; subsequent CSS edits must advance it. Final browser verification is recorded in the follow-up pull request.
