---
name: migrate-to-typescript
description: Best practices for codebase migrations of any kind
---

A structured approach for executing codebase migrations safely and effectively. Applicable to language upgrades, framework migrations, architecture changes, and dependency updates.

## Migration Principles

### 1. Incremental Over Big Bang

- Migrate in small, testable chunks
- Each commit should leave the codebase in a working state
- Prefer feature flags over long-lived branches
- Ship intermediate states to production when possible

### 2. Parallel Run Before Cutover

- Run old and new implementations side-by-side
- Compare outputs to validate correctness
- Gradually shift traffic/usage to new implementation
- Keep rollback path available

### 3. Tests as Safety Net

- Write tests for existing behavior before changing it
- Tests should pass before AND after each migration step
- Add regression tests for edge cases discovered during migration

## Pre-Migration Phase

### Assess Scope

```
Questions to answer:
- What files/components are affected?
- What are the dependencies between them?
- What's the minimum viable migration?
- What can be deferred to follow-up work?
```

### Create Migration Plan

1. **Inventory**: List all files/components to migrate
2. **Order**: Determine safe migration sequence (leaf nodes first)
3. **Scope**: Define MVP vs nice-to-have
4. **Milestones**: Break into shippable increments

### Set Up Tooling

- Codemods for automated transformations
- Linting rules to catch anti-patterns
- CI checks to prevent regression
- Feature flags for gradual rollout

## Execution Phase

### Migration Order

Start from the edges, work toward the core:

```
1. Leaf dependencies (utilities, helpers)
2. Shared components
3. Feature modules
4. Core/critical paths
5. Entry points
```

### Per-File Checklist

- [ ] Read and understand existing code
- [ ] Run existing tests (should pass)
- [ ] Make migration changes
- [ ] Run tests again (should still pass)
- [ ] Manual verification if needed
- [ ] Commit with descriptive message

### Commit Strategy

```
feat: migrate auth module to new framework

- Convert AuthService to new pattern
- Update 3 dependent components
- Add adapter for legacy API compatibility

Migration: 12/47 files complete
```

Track progress in commit messages to maintain visibility.

## Common Migration Patterns

### Adapter Pattern

When interfaces change, create adapters for compatibility:

```
OldInterface → Adapter → NewImplementation
```

Keep adapters until all consumers are migrated, then remove.

### Strangler Fig Pattern

Gradually replace old system by:

1. Wrap old system with new interface
2. Implement new features in new system only
3. Migrate existing features incrementally
4. Remove old system when empty

### Branch by Abstraction

1. Create abstraction layer over code to change
2. Migrate consumers to use abstraction
3. Create new implementation behind abstraction
4. Switch abstraction to new implementation
5. Remove old implementation

## Risk Mitigation

### Feature Flags

```
if (featureFlags.useNewImplementation) {
  return newImplementation();
} else {
  return oldImplementation();
}
```

Enable gradual rollout and instant rollback.

### Dual Writes

For data migrations:

1. Write to both old and new storage
2. Read from old, validate against new
3. Switch reads to new storage
4. Stop writes to old storage
5. Remove old storage

### Shadow Testing

Run new implementation in parallel without affecting users:

1. Execute both old and new code paths
2. Log differences in outputs
3. Fix discrepancies
4. Switch over when outputs match

## Post-Migration Phase

### Cleanup Checklist

- [ ] Remove old implementation code
- [ ] Remove feature flags
- [ ] Remove adapters/compatibility layers
- [ ] Update documentation
- [ ] Archive or delete old dependencies

### Validation

- [ ] All tests passing
- [ ] No regression in performance
- [ ] No increase in error rates
- [ ] Stakeholder sign-off

## Anti-Patterns to Avoid

| Anti-Pattern                | Better Approach                       |
| --------------------------- | ------------------------------------- |
| Big bang rewrite            | Incremental migration                 |
| Migrating without tests     | Add tests first                       |
| Long-lived migration branch | Feature flags + trunk                 |
| Skipping cleanup            | Schedule cleanup as part of migration |
| No rollback plan            | Always have rollback ready            |

## Migration Metrics

Track throughout the migration:

- **Progress**: Files/components migrated vs remaining
- **Velocity**: Migration rate over time
- **Quality**: Test coverage, error rates
- **Risk**: Size of remaining work, complexity

## Example: Language/Framework Migration

1. **Setup**: Add new tooling alongside existing
2. **Config**: Create configuration for new system
3. **Types/Interfaces**: Define shared contracts
4. **Leaf nodes**: Migrate utilities and helpers
5. **Components**: Migrate features bottom-up
6. **Entry points**: Update main files last
7. **Cleanup**: Remove old tooling and configs

## Example: Database Migration

1. **Schema**: Create new tables/columns
2. **Dual write**: Write to both old and new
3. **Backfill**: Migrate historical data
4. **Validate**: Compare old and new data
5. **Switch reads**: Point queries to new schema
6. **Stop old writes**: Remove dual-write logic
7. **Cleanup**: Drop old tables/columns

Execute this migration workflow for the current project, adapting the patterns to the specific migration type.
