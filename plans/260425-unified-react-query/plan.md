# Plan: Unified React Query Integration
Created: 2026-04-25
Status: 🟡 In Progress

## Overview
Implement a unified data fetching and caching layer using **TanStack Query (React Query)** across the entire monorepo (`apps/reader` and `apps/web`). This plan focuses on leveraging the monorepo structure to share query keys, API services, and types to ensure consistency and reduce code duplication.

## Tech Stack
- **Framework**: TanStack Query (React Query) v5
- **Transport**: Axios (using existing instances)
- **Monorepo**: Shared logic via `packages/shared`

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Infrastructure Setup | ✅ Complete | 100% |
| 02 | Shared Logic Layer | ✅ Complete | 100% |
| 03 | Reader Migration | ✅ Complete | 100% |
| 04 | Admin Migration | ✅ Complete | 100% |
| 05 | DevTools & Polish | ✅ Complete | 100% |

## Implementation Strategy
- **Shared Query Keys**: Centralized in `packages/shared` to prevent key collisions and enable cross-app invalidation.
- **Service Functions**: Common API fetchers (e.g., `getBooks`, `getProfile`) will be moved to a shared location.
- **Provider Pattern**: Standardized `QueryClient` configuration for both apps but with app-specific defaults (e.g., Reader has longer `staleTime`).

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
