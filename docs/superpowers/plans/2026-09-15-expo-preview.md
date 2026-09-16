# Expo preview implementation plan

Goal: a working preview preserving the user's existing design.
Architecture: Vite single HTML bundle embedded in Expo WebView, with native state persistence.
Spec: ../specs/2026-09-15-expo-design.md

- [ ] Test budget depletion, expense add/remove, and rollover using Node test runner and tsx; implement pure state functions in src/utils.
- [ ] Connect state functions and native storage bridge in src/App.tsx. Hide presentation controls on phones. Remove fabricated invoice/AI output; keep manual confirmation available.
- [ ] Add mobile/App.tsx, package/config/EAS files and scripts/build-mobile.mjs. Native shell loads saved state before UI, serializes saves, and reports storage failure.
- [ ] Run web typecheck/build and interactive mobile viewport checks. Export native bundles and run Expo dependency checks.
- [ ] Upload code and assets to the existing GitHub repository without replacing unrelated files. Verify commit and account-link availability; report exact remaining steps.
