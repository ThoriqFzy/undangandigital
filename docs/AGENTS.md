# AGENTS.md — Hermes + OpenCode Operating Contract

**Version:** 1.0  
**Project:** Wedding Invitation Platform  
**Primary Orchestrator:** Hermes  
**Primary Engineering Executor:** OpenCode  
**Repository Source of Truth:** Git  
**Product Docs:** `PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`

---

# 1. Purpose

Dokumen ini mendefinisikan **cara Hermes dan OpenCode bekerja di repository ini**.

Tujuan utamanya:

```text
PRD
 ↓
Hermes
 ↓
Task decomposition
 ↓
OpenCode capabilities
 ↓
Implementation
 ↓
Verification
 ↓
Review
 ↓
Production
```

`AGENTS.md` bukan pengganti PRD.

Gunakan:

```text
PRD.md
→ WHAT harus dibangun

DATABASE.md
→ HOW data harus disimpan

ARCHITECTURE.md
→ HOW system harus bekerja

AGENTS.md
→ HOW Hermes + OpenCode harus mengerjakannya
```

---

# 2. Core Agent Principle

Hermes adalah **orchestrator**, bukan primary coder.

OpenCode adalah **primary engineering execution environment**.

Model:

```text
                         HERMES
                    Orchestrator
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
          Planning    Research      QA
              │          │          │
              └──────────┼──────────┘
                         ↓
                      OPENCODE
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
    Design          Engineering          Testing
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                      Git
                         ↓
                       CI/CD
                         ↓
                    Cloudflare
```

Hermes harus memaksimalkan kemampuan yang sudah tersedia di OpenCode sebelum membuat solusi baru.

---

# 3. Mandatory Documentation Order

Sebelum implementation, Hermes/OpenCode harus membaca:

```text
1. README.md
2. AGENTS.md
3. PRD.md
4. ARCHITECTURE.md
5. DATABASE.md
```

Jika README belum ada, mulai dari:

```text
AGENTS.md
PRD.md
ARCHITECTURE.md
DATABASE.md
```

---

# 4. Source of Truth Rules

Jika terjadi konflik:

### Product behavior

`PRD.md` adalah source of truth.

### Database

`DATABASE.md` adalah source of truth.

### Technical architecture

`ARCHITECTURE.md` adalah source of truth.

### Agent workflow

`AGENTS.md` adalah source of truth.

Jika implementasi repository berbeda dari documentation:

```text
STOP
 ↓
Inspect current implementation
 ↓
Determine whether documentation or implementation is outdated
 ↓
Architecture review if needed
 ↓
Update source of truth
 ↓
Continue
```

Jangan diam-diam membuat implementation menyimpang.

---

# 5. First Action — Reconnaissance

Hermes **MUST NOT start coding immediately** pada project baru.

Langkah pertama:

```text
Read documentation
 ↓
Inspect repository
 ↓
Inspect package.json
 ↓
Inspect existing architecture
 ↓
Inspect configuration
 ↓
Inspect OpenCode capabilities
 ↓
Inspect available skills
 ↓
Inspect plugins
 ↓
Inspect MCP
 ↓
Identify existing conventions
```

Output:

```text
architecture understanding
capability map
implementation plan
risk list
```

---

# 6. Capability Discovery

Hermes harus menganggap OpenCode sebagai capability platform.

Sebelum melakukan pekerjaan:

```text
Requirement
 ↓
Identify required capability
 ↓
Search existing OpenCode skill/plugin
 ↓
Use existing capability
 ↓
Only build custom solution if capability is missing
```

Jangan langsung menulis custom implementation jika skill/plugin yang sesuai sudah tersedia.

---

# 7. Capability Mapping

## Planning

Gunakan:

```text
brainstorming
writing-plans
```

Untuk:

- requirement decomposition
- implementation planning
- architecture exploration

---

## Repository Exploration

Gunakan capability:

```text
explorer
codemap
```

Untuk:

- memahami repository
- menemukan existing patterns
- dependency tracing
- locating relevant code

---

## Documentation / Research

Gunakan:

```text
librarian
deepwork
```

Untuk:

- official documentation
- framework research
- API research
- dependency behavior
- implementation references

Prefer official documentation untuk technical decisions.

---

## Architecture

Gunakan:

```text
oracle
```

Jika:

- ada tradeoff architecture besar
- dependency boundary tidak jelas
- perlu memilih antara beberapa design
- perubahan dapat memengaruhi banyak subsystem

Jangan gunakan Oracle untuk pekerjaan sederhana.

---

# 8. UI / UX Capability

Untuk pekerjaan visual gunakan:

```text
impeccable
ui-ux-pro-max
design-system
ui-styling
brand
21st-components
```

Untuk animation:

```text
motion
```

Prioritas:

```text
Design system
 ↓
Layout
 ↓
Typography
 ↓
Responsive behavior
 ↓
Animation
```

Jangan memulai dari animation.

---

# 9. Engineering Capability

Gunakan:

```text
executing-plans
test-driven-development
systematic-debugging
verification-before-completion
```

Implementation harus mengikuti architecture.

Jika menemukan bug:

```text
Observe
 ↓
Reproduce
 ↓
Isolate
 ↓
Understand root cause
 ↓
Fix
 ↓
Test
 ↓
Verify
```

Jangan melakukan random patching.

---

# 10. Parallel Agent Strategy

Gunakan:

```text
dispatching-parallel-agents
```

hanya jika task independen atau dependency-safe.

Contoh aman:

```text
Database schema
      │
      ├── Design system
      │
      └── Template research
```

Contoh tidak aman:

```text
Database schema
      ↓
Repository
      ↓
Service
```

Jangan menjalankan dependent tasks paralel jika output parent belum stabil.

---

# 11. Git Worktree Strategy

Untuk pekerjaan paralel gunakan:

```text
using-git-worktrees
```

Contoh:

```text
main
 │
 ├── worktree/template-engine
 ├── worktree/admin-dashboard
 ├── worktree/rsvp
 └── worktree/media
```

Setiap agent harus bekerja di isolation yang jelas.

Jangan dua agent mengedit file yang sama secara bersamaan kecuali memang dikoordinasikan.

---

# 12. Task Decomposition

Hermes harus memecah feature besar menjadi task kecil.

Contoh:

```text
RSVP System
│
├── Database schema
├── Validation schema
├── Repository
├── Service
├── API endpoint
├── UI form
├── WhatsApp integration
├── Admin dashboard
├── Tests
└── E2E
```

Setiap task harus memiliki:

```text
Goal
Inputs
Dependencies
Expected files
Acceptance criteria
Verification
```

---

# 13. Task Dependency Graph

Sebelum dispatch, Hermes harus menentukan:

```text
What must exist first?
What can run in parallel?
What blocks other work?
What requires final integration?
```

Contoh:

```text
Architecture
    ↓
Database
    ↓
Repository
    ↓
Service
    ↓
API
    ↓
UI
    ↓
E2E
```

Design system dapat berjalan paralel dengan database setelah architecture baseline stabil.

---

# 14. Definition of Ready

Task belum boleh diberikan ke executor jika:

```text
[ ] Requirement jelas
[ ] Scope jelas
[ ] Dependencies diketahui
[ ] Expected output jelas
[ ] Acceptance criteria jelas
[ ] Verification method jelas
```

Jika belum jelas:

```text
STOP
 ↓
Research / clarify
 ↓
Update plan
```

---

# 15. Definition of Done

Task hanya dianggap selesai jika:

```text
[ ] Implementation complete
[ ] Typecheck passes
[ ] Lint passes
[ ] Relevant tests pass
[ ] Build passes when applicable
[ ] No critical console errors
[ ] Responsive behavior checked
[ ] Security implications reviewed
[ ] Existing functionality not broken
[ ] Code reviewed when required
[ ] Evidence provided
```

"Implemented" bukan bukti selesai.

---

# 16. Evidence-Based Completion

OpenCode harus memberikan evidence.

Minimum:

```text
Files changed
Commands executed
Tests executed
Results
Known issues
Potential risks
```

Untuk visual task:

```text
Screenshots / visual evidence
```

Hermes tidak boleh menyatakan task selesai hanya berdasarkan agent statement:

```text
"Done"
"Looks good"
"Implemented successfully"
```

---

# 17. Verification Hierarchy

Gunakan verification bertingkat:

```text
Typecheck
   ↓
Lint
   ↓
Unit
   ↓
Integration
   ↓
Build
   ↓
E2E
   ↓
Visual QA
   ↓
Production-like verification
```

Tidak semua task membutuhkan semua layer.

Hermes harus memilih minimum verification yang tepat berdasarkan risk.

---

# 18. Risk-Based Verification

### Low risk

Contoh:

- copy change
- spacing
- static text

Verification:

```text
typecheck
visual check
```

### Medium risk

Contoh:

- UI component
- API endpoint
- theme system

Verification:

```text
typecheck
lint
unit/integration
build
visual if UI
```

### High risk

Contoh:

- authentication
- tenant isolation
- database migration
- RSVP
- upload
- security

Verification:

```text
typecheck
lint
tests
integration
E2E
security review
```

---

# 19. Database Rules

Untuk database:

```text
DATABASE.md
```

adalah contract.

OpenCode tidak boleh:

- membuat table tanpa alasan
- mengubah relationship secara diam-diam
- menghapus constraint untuk mempermudah implementation
- menambahkan JSONB sebagai shortcut
- melakukan cross-tenant query

Jika schema baru diperlukan:

```text
Requirement
 ↓
DATABASE.md review
 ↓
Architecture review if needed
 ↓
Update DATABASE.md
 ↓
Drizzle schema
 ↓
Migration
 ↓
Tests
```

---

# 20. Database Migration Rules

Migration harus:

```text
generated
reviewed
committed
tested
```

Jangan mengedit migration lama yang sudah digunakan production.

Buat migration baru.

Untuk breaking change:

```text
Expand
 ↓
Compatible deployment
 ↓
Data migration
 ↓
Contract
```

---

# 21. Tenant Isolation

Semua admin query wajib memastikan:

```text
authenticated user
        ↓
owns invitation
        ↓
owns resource
```

Invalid:

```text
getGuestById(id)
```

Valid:

```text
getGuestForOwner({
  guestId,
  ownerId
})
```

Cross-tenant data leak dianggap **critical security bug**.

---

# 22. Public Data Rules

Public invitation hanya boleh menerima projection yang diperlukan.

Jangan expose:

```text
owner_id
internal IDs
private notes
guest email
guest phone
sessions
tokens
credentials
audit logs
```

Raw database row tidak boleh dikirim ke browser.

---

# 23. Template Rules

Template:

```text
MUST NOT
 ↓
directly access database
```

Template menerima:

```text
InvitationViewModel
```

Flow:

```text
Database
 ↓
Repository
 ↓
Service
 ↓
ViewModel
 ↓
Template
```

Template harus reusable.

Wedding-specific content tidak boleh di-hardcode.

---

# 24. Theme Rules

Theme harus menggunakan design tokens.

Prefer:

```text
CSS variables
+
Tailwind utilities
```

Hindari:

```text
random inline styles
```

Theme customization harus tetap kompatibel dengan template contract.

---

# 25. Frontend Rules

Public invitation:

```text
Astro-first
```

React hanya untuk interactive islands.

Jangan mengubah public invitation menjadi SPA tanpa architecture review.

---

# 26. Performance Rules

Setiap frontend implementation harus mempertimbangkan:

```text
JS payload
image size
font loading
hydration
request count
LCP
CLS
INP
```

Target:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Target Lighthouse:

```text
Performance ≥ 90
Accessibility ≥ 90
Best Practices ≥ 90
SEO ≥ 90
```

---

# 27. Dependency Rules

Sebelum menambahkan dependency:

```text
1. Check existing dependencies
2. Check existing OpenCode capability
3. Check native browser/platform solution
4. Check bundle/runtime cost
5. Check Cloudflare compatibility
6. Add only if justified
```

Tidak boleh menambahkan library hanya karena populer.

---

# 28. Debugging Protocol

Gunakan:

```text
systematic-debugging
```

Urutan:

```text
1. Reproduce
2. Collect evidence
3. Identify affected layer
4. Form hypothesis
5. Test hypothesis
6. Fix root cause
7. Run regression test
8. Verify
```

Jangan:

```text
change random code
run
hope
```

---

# 29. Code Review Protocol

Gunakan:

```text
requesting-code-review
receiving-code-review
```

Code review harus memeriksa:

```text
Correctness
Security
Architecture
Maintainability
Performance
Tests
Regression
```

Review tidak hanya mengecek formatting.

---

# 30. Design Review Protocol

Untuk visual implementation:

```text
Design requirement
 ↓
Design system
 ↓
Implementation
 ↓
Browser render
 ↓
Screenshot
 ↓
Visual review
 ↓
Fix
 ↓
Re-check
```

Gunakan capability:

```text
impeccable
ui-ux-pro-max
design-system
motion
21st-components
```

jika relevan.

---

# 31. Visual QA Checklist

Minimum:

```text
[ ] 360px
[ ] 390px
[ ] 414px
[ ] 768px
[ ] 1024px
[ ] 1440px
```

Check:

```text
[ ] no horizontal overflow
[ ] typography hierarchy
[ ] image cropping
[ ] spacing
[ ] button size
[ ] touch targets
[ ] animation
[ ] contrast
[ ] loading state
[ ] empty state
[ ] error state
```

---

# 32. Accessibility Rules

Always consider:

```text
semantic HTML
keyboard navigation
focus state
alt text
labels
contrast
reduced motion
```

Respect:

```text
prefers-reduced-motion
```

Animation must not prevent content access.

---

# 33. API Rules

Every API endpoint:

```text
Request
 ↓
Authentication if needed
 ↓
Authorization
 ↓
Validation
 ↓
Service
 ↓
Repository
 ↓
Safe DTO
 ↓
Response
```

Never:

```text
Route
 ↓
raw Drizzle query
 ↓
raw database row
```

---

# 34. Error Handling Rules

Use stable error codes.

Example:

```text
INVITATION_NOT_FOUND
UNAUTHORIZED
FORBIDDEN
VALIDATION_ERROR
RSVP_LIMIT_EXCEEDED
ASSET_UPLOAD_FAILED
DATABASE_ERROR
```

Do not expose internal implementation details.

---

# 35. Security Priority

Security issues are prioritized:

```text
Critical
 ↓
High
 ↓
Medium
 ↓
Low
```

Critical examples:

```text
cross-tenant access
credential exposure
authentication bypass
token exposure
SQL injection
arbitrary file upload
private data exposure
```

Critical security bugs block completion.

---

# 36. R2 Rules

R2 object keys must be server-generated.

Uploads must validate:

```text
mime
size
extension
dimensions where relevant
```

Never trust client metadata blindly.

When deleting assets:

```text
Check references
 ↓
Remove/soft-delete DB record
 ↓
Remove R2 object safely
```

Avoid orphaned objects.

---

# 37. Git Rules

Use:

```text
main
development
feature/*
```

Do not commit directly to `main` during feature development unless the workflow explicitly requires it.

Commit messages should be meaningful.

Example:

```text
feat: add invitation template engine
fix: prevent cross-tenant guest access
test: add RSVP integration coverage
```

---

# 38. Worktree Rules

Parallel agents should use separate worktrees.

Before starting:

```text
git status
```

must be clean unless intentionally continuing existing work.

Agent must know:

```text
branch
worktree
base commit
task scope
```

Do not modify another agent's worktree.

---

# 39. Merge Rules

Before merge:

```text
[ ] task complete
[ ] tests pass
[ ] review completed
[ ] no unresolved critical issue
[ ] documentation updated if required
```

Merge conflicts must be resolved deliberately.

Never blindly accept one side of a conflict.

---

# 40. Documentation Update Rules

Update documentation when changing:

```text
architecture
database schema
public API contract
agent workflow
security model
deployment model
```

Do not update documentation for every trivial implementation detail.

Avoid documentation drift.

---

# 41. Hermes Decision Escalation

Hermes should escalate to Oracle / architecture review when:

```text
architecture choice affects multiple subsystems
database model changes
auth changes
tenant model changes
runtime changes
storage changes
major dependency changes
public URL changes
performance architecture changes
```

Do not escalate trivial coding decisions.

---

# 42. When to Parallelize

Parallelize when:

```text
tasks are independent
files are isolated
interfaces are already defined
outputs do not conflict
```

Do not parallelize when:

```text
shared contract is unstable
database schema is changing
architecture is unresolved
same core files are being modified
```

---

# 43. Agent Role Routing

## Hermes

Use for:

```text
orchestration
planning
dependency management
decision making
final verification
```

## Explorer

Use for:

```text
repository exploration
architecture discovery
code tracing
```

## Librarian

Use for:

```text
documentation
external research
API/framework research
```

## Designer

Use for:

```text
UI/UX
design system
visual refinement
motion
```

## Fixer

Use for:

```text
debugging
failed tests
runtime bugs
integration failures
```

## Observer

Use for:

```text
verification
QA
regression detection
performance checks
```

## Oracle

Use for:

```text
complex architecture
tradeoffs
high-risk technical decisions
```

---

# 44. Recommended Agent Workflow

For a typical feature:

```text
Hermes
 ↓
Read requirement
 ↓
Explorer
 ↓
Librarian if external research needed
 ↓
Planning
 ↓
Designer if UI feature
 ↓
OpenCode implementation
 ↓
Tests
 ↓
Observer verification
 ↓
Code review
 ↓
Fixer if failure
 ↓
Final verification
```

---

# 45. Feature Example — RSVP

Expected orchestration:

```text
Hermes
 │
 ├── Read PRD
 ├── Read DATABASE
 └── Read ARCHITECTURE
        │
        ▼
   Explorer
        │
        ▼
   Plan RSVP
        │
        ├── DB check
        ├── Service
        ├── API
        ├── UI
        └── WhatsApp
        │
        ▼
   OpenCode
        │
        ├── Implementation
        └── Tests
        │
        ▼
   Observer
        │
        ├── Integration
        ├── E2E
        └── Security
        │
        ▼
   Code Review
        │
        ▼
      Merge
```

---

# 46. Feature Example — New Template

Workflow:

```text
PRD review
 ↓
Existing template inspection
 ↓
Design research
 ↓
Design system review
 ↓
Template implementation
 ↓
Responsive QA
 ↓
Animation QA
 ↓
Performance QA
 ↓
E2E/public route verification
```

The new template must not alter existing template behavior.

---

# 47. Feature Example — Database Change

Workflow:

```text
Requirement
 ↓
DATABASE.md review
 ↓
Architecture impact analysis
 ↓
Update DATABASE.md
 ↓
Update Drizzle schema
 ↓
Generate migration
 ↓
Test fresh database
 ↓
Test existing data migration
 ↓
Repository tests
 ↓
Integration tests
```

---

# 48. Feature Example — Production Bug

Workflow:

```text
Bug report
 ↓
Reproduce
 ↓
Observe logs
 ↓
Identify layer
 ↓
Systematic debugging
 ↓
Root cause
 ↓
Minimal fix
 ↓
Regression test
 ↓
Production-like verification
 ↓
Deploy
```

Do not refactor unrelated code during a production bug fix unless necessary.

---

# 49. No Premature Abstraction

Do not create:

```text
generic framework
generic component factory
generic state engine
generic API wrapper
generic plugin system
```

unless repeated requirements justify it.

Prefer simple concrete implementation first.

Abstract when:

```text
same pattern appears repeatedly
+
abstraction reduces complexity
+
contract is stable
```

---

# 50. No Premature Scaling

MVP should remain:

```text
One application
One Worker
One PostgreSQL
One R2
```

Do not introduce:

```text
microservices
message queues
Redis
Kubernetes
complex event buses
```

without evidence of a real requirement.

---

# 51. Performance vs Feature Tradeoff

When tradeoff exists:

```text
Public performance
>
animation complexity
>
developer convenience
```

For public invitation:

```text
UX quality
+
fast rendering
```

must dominate unnecessary client-side complexity.

---

# 52. Agent Communication Standard

Agent outputs should be concise and structured.

Recommended:

```text
Status:
Completed / Blocked / Failed

Task:
...

Changes:
- ...

Verification:
- ...

Risks:
- ...

Next:
- ...
```

Avoid long narrative reports unless the task is architecture/research.

---

# 53. Blocked Task Protocol

If blocked:

```text
DO NOT guess silently.
```

Report:

```text
Blocker
Evidence
Why it blocks progress
Possible options
Recommended option
```

Hermes decides whether to:

```text
research
escalate
change plan
ask user
```

---

# 54. Unknown Requirement Protocol

If requirement is ambiguous but low-risk:

```text
Use safest reasonable assumption
Document assumption
Proceed
```

If ambiguity affects:

```text
security
database
architecture
public behavior
cost
```

perform research or escalate.

---

# 55. Completion Protocol

Before declaring project/feature complete:

```text
Read acceptance criteria
 ↓
Run appropriate verification
 ↓
Inspect changed files
 ↓
Check git diff
 ↓
Check tests
 ↓
Check build
 ↓
Check visual output when applicable
 ↓
Check documentation
 ↓
Report evidence
```

---

# 56. Final Project Verification

Before MVP release:

```text
PRODUCT
[ ] All MVP features work

DATABASE
[ ] Schema matches DATABASE.md

ARCHITECTURE
[ ] Implementation matches ARCHITECTURE.md

SECURITY
[ ] Tenant isolation tested
[ ] Auth tested
[ ] Public/private boundaries tested

PERFORMANCE
[ ] Mobile verified
[ ] Core Web Vitals checked
[ ] Images optimized

UX
[ ] Responsive
[ ] Accessible
[ ] Visual QA passed

ENGINEERING
[ ] Typecheck
[ ] Lint
[ ] Tests
[ ] Build
[ ] E2E

DEPLOYMENT
[ ] Cloudflare production works
[ ] Database migration works
[ ] R2 works
[ ] Domain works
[ ] Logs work

DOCUMENTATION
[ ] PRD current
[ ] DATABASE current
[ ] ARCHITECTURE current
[ ] AGENTS current
```

---

# 57. Final Operating Principle

Hermes should behave like a **technical lead / orchestrator**.

OpenCode should behave like the **engineering execution environment**.

The system should optimize for:

```text
Correctness
   +
Security
   +
Performance
   +
Maintainability
   +
Agent efficiency
```

not merely:

```text
fastest code generation
```

The correct workflow is:

```text
UNDERSTAND
    ↓
PLAN
    ↓
DECOMPOSE
    ↓
SELECT CAPABILITIES
    ↓
EXECUTE
    ↓
VERIFY
    ↓
REVIEW
    ↓
FIX
    ↓
VERIFY AGAIN
    ↓
MERGE
```

Never skip directly from:

```text
Requirement
 ↓
Coding
```

---

# 58. Final Rule

**Use existing capabilities before creating new ones.**

**Use evidence before declaring success.**

**Use architecture before abstraction.**

**Use tests before confidence.**

**Use verification before merge.**

**Use Hermes for orchestration and OpenCode for execution.**

**Keep the infrastructure simple, the boundaries strict, and the public invitation fast.**

**End of AGENTS.md**
