## TypeScript Fixes Applied

I've applied the following fixes to resolve TypeScript strict mode errors:

### Changes Made:

- **Imports**: Removed unused React imports (jsx transform used)
- **react-json-tree**: Fixed to named export (`import { JSONTree }`)
- **Optional handlers**: Fixed onClick handlers with default values
- **keyPath types**: Fixed to `readonly (string | number)[]`
- **API change**: Fixed `shouldExpandNode` -> `shouldExpandNodeInitially` (react-json-tree v0.19)
- **StylingValue**: Workaround for type mismatch with react-json-tree v0.19
- **helpers.ts**: Fixed predicate type
- **history.ts**: Fixed index and Snapshot types
- **LogMonitorEntryList**: Fixed computedStates access

### Current Status:

- Typecheck: passing
- Tests: passing
- Build: passing

Please review and merge when CI passes.
