<!--
  Sync Impact Report
  Version change: 0.0.0 → 1.0.0
  Modified principles: None (existing principles retained as-is)
  Added sections: Core Principles (renamed from Principles), Governance
  Removed sections: None
  Templates requiring updates: ✅ updated (constitution-template.md reference), ✅ updated (plan-template.md Constitution Check), ✅ updated (spec-template.md scope alignment), ✅ updated (tasks-template.md task categorization)
  Follow-up TODOs: None
-->

# Architectural Portfolio Constitution

## Core Principles

### I. Editorial Clarity First

Every page must make the engineer's work, role, and next action immediately clear. Content hierarchy, typography, and layout MUST prioritize readability over decoration.

### II. Images Carry the Portfolio

Project imagery MUST have meaningful alt text, be appropriately compressed, and never obscure project facts. Visual content supports the narrative; it does not replace it.

### III. Quiet, Responsive Interaction

Motion is purposeful, respects `prefers-reduced-motion` preferences, and the site remains usable from 320px upward. All interactive elements MUST be keyboard-accessible and meet WCAG 2.1 AA contrast requirements.

### IV. Performance Is Part of Design

Avoid unnecessary libraries and optimize media before publishing. Core Web Vitals (LCP, FID, CLS) MUST be within acceptable thresholds before deployment.

### V. Honest Project Stories

Do not invent project locations, scopes, dates, clients, or professional credentials. Flag missing facts for the portfolio owner before publishing.

## Quality Gates

- Run the production build (`npm run build`) before handoff.
- Verify keyboard navigation and sufficient text contrast.
- Verify mobile and desktop layouts.
- Add real project content only after it is approved by the portfolio owner.
- Ensure Supabase RLS policies are enabled before any public deployment.

## Governance

This constitution is the authoritative reference for all development decisions on the Architectural Portfolio project. All pull requests, code reviews, and deployment checks MUST verify compliance with the principles above.

**Amendment process**: Changes to this constitution require documentation of the rationale, explicit approval from the portfolio owner, and a migration plan for existing code if principles are materially altered.

**Versioning**: This document follows semantic versioning: MAJOR for backward-incompatible principle removals or redefinitions; MINOR for new principles or material expansions; PATCH for clarifications and wording refinements.

**Compliance review**: Before each feature merge, the implementer MUST confirm adherence to all five principles and the quality gates. Violations MUST be justified in the implementation plan's Complexity Tracking section.

**Version**: 1.0.0 | **Ratified**: 2026-07-18 | **Last Amended**: 2026-07-18
