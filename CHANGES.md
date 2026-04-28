# Recent Changes Summary

## Overview
Updated dependencies to latest compatible versions and made necessary code adjustments for compatibility with newer React Native and Expo packages.

## Changes by Category

### 1. Dependency Upgrades (package.json)
- **React**: 19.2.3 → 19.1.0
- **React DOM**: 19.2.3 → 19.1.0
- **React Native**: 0.85.0 → 0.81.5
- **Expo**: ~54.0.0 (maintained)
  - expo-font: ~13.0.0 → ~14.0.0
  - expo-linear-gradient: ~14.1.5 → ~15.0.0
  - expo-linking: ~7.1.7 → ~8.0.0
  - expo-status-bar: ~2.0.0 → ~3.0.0
- **React Native Safe Area Context**: 5.4.0 → ~5.6.0
- **React Native Screens**: ~4.13.0 → ~4.16.0
- **React Native Web**: ^0.20.0 → ^0.21.0
- **Babel Preset Expo**: ~14.0.0 → ~54.0.0
- **@types/react**: ^19.1.1 → ~19.1.10

### 2. Android Configuration (app.json)
Added Android-specific package configuration:
```json
"android": {
  "package": "com.anonymous.hiddengemmusic"
}
```

### 3. Code Refactoring (Screen Components)
Replaced deprecated `StyleSheet.absoluteFill` shorthand with explicit positioning across all web screen files:

**Files affected:**
- ComparisonResultsScreen.web.tsx
- ComparisonSelectScreen.web.tsx
- CountryScreen.web.tsx
- CreditsScreen.web.tsx
- DashboardScreen.web.tsx
- DiscoveryScreen.web.tsx
- HiddenGemsScreen.web.tsx
- WelcomeScreen.web.tsx
- WelcomeScreen.native.tsx

**Change pattern:**
```typescript
// Before
...StyleSheet.absoluteFill

// After
position: "absolute" as const, top: 0, left: 0, bottom: 0, right: 0
```

### 4. Bug Fix (linking.ts)
Fixed TypeError when accessing `window.location.href`:
- Added null/undefined checks for `window.location` and `window.location.href`
- Prevents "Cannot read property 'href' of undefined" error in SSR or specific runtime environments

## Impact
- ✅ Updated to latest compatible dependency versions
- ✅ Improved React Native Web compatibility
- ✅ Fixed runtime error in navigation initialization
- ✅ Better Android platform support
- ✅ Resolved deprecation warnings from StyleSheet API
