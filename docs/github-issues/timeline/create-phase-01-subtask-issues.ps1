# Creates Phase 1 subtask issues linked to parent issue #43.
# Review phase-01-subtasks-for-issue-43.md before running.
# Requires GitHub CLI:
#   gh auth login
#
# Usage from repo root:
#   .\docs\github-issues\timeline\create-phase-01-subtask-issues.ps1
#
# Safe to rerun:
# - Missing labels are created automatically.
# - Existing issues with the same title are skipped.

$ErrorActionPreference = "Stop"

$parentIssue = 43
$parentUrl = "https://github.com/VidyaConnect/VidyaConnect/issues/43"

$issues = @(
  @{ Title = "Phase 1 Subtask: Review and align Phase 1 scope"; Labels = "task,phase-1,planning"; Body = "Goal: Ensure all team members understand what Phase 1 must deliver.`n`nParent: #$parentIssue`n`nAcceptance:`n- Team agrees on Phase 1 scope.`n- Unclear items are documented.`n- Each team member understands their workstream.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create initial repository structure"; Labels = "task,phase-1,repo-structure"; Body = "Goal: Create the folder structure for microservices, frontend apps, and infrastructure.`n`nParent: #$parentIssue`n`nAcceptance:`n- Repo structure is clear.`n- Empty folders are preserved.`n- Team can identify where each type of work belongs.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create Docker Compose local skeleton"; Labels = "task,phase-1,devops,docker"; Body = "Goal: Create the first local Docker Compose file.`n`nParent: #$parentIssue`n`nAcceptance:`n- docker-compose.local.yml exists.`n- File is readable and documented.`n- Core local services are represented.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Add local environment variable templates"; Labels = "task,phase-1,devops,configuration"; Body = "Goal: Provide safe example environment files for local development.`n`nParent: #$parentIssue`n`nAcceptance:`n- Example env files exist.`n- No real credentials are committed.`n- Required values are documented.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Configure local PostgreSQL container"; Labels = "task,phase-1,database,postgresql"; Body = "Goal: Run PostgreSQL locally for application and Keycloak data.`n`nParent: #$parentIssue`n`nAcceptance:`n- PostgreSQL container starts successfully.`n- Connection details are documented.`n- Keycloak/app DB separation approach is documented.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Configure local Keycloak container"; Labels = "task,phase-1,auth,keycloak"; Body = "Goal: Run Keycloak locally as the Identity Provider.`n`nParent: #$parentIssue`n`nAcceptance:`n- Keycloak starts locally.`n- Admin console is accessible.`n- Keycloak uses PostgreSQL or the chosen local persistence approach.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create Keycloak realm clients and roles"; Labels = "task,phase-1,auth,keycloak"; Body = "Goal: Prepare Keycloak for VidyaConnect authentication.`n`nParent: #$parentIssue`n`nAcceptance:`n- VidyaConnect realm exists.`n- Clients and roles exist.`n- Sample users can log in.`n- Realm export exists with no real secrets.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Configure local Nginx routing skeleton"; Labels = "task,phase-1,nginx,devops"; Body = "Goal: Prepare local reverse proxy routing.`n`nParent: #$parentIssue`n`nAcceptance:`n- Nginx starts locally.`n- Nginx config is committed.`n- Planned route structure is documented.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Add LocalStack container for AWS simulation"; Labels = "task,phase-1,localstack,s3"; Body = "Goal: Prepare local AWS-like development services.`n`nParent: #$parentIssue`n`nAcceptance:`n- LocalStack starts locally.`n- Local S3 endpoint is documented.`n- Team understands LocalStack is for local development only.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create backend service health check skeleton"; Labels = "task,phase-1,backend,microservices"; Body = "Goal: Create at least one backend service skeleton with health endpoint.`n`nParent: #$parentIssue`n`nAcceptance:`n- Service runs locally.`n- /health returns success.`n- Service can be containerized.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create API contracts v1 draft"; Labels = "task,phase-1,api-contracts,documentation"; Body = "Goal: Start API design before parallel frontend/backend implementation.`n`nParent: #$parentIssue`n`nAcceptance:`n- API contracts document exists.`n- Each endpoint includes owning service, roles, tenant rule, request, response, and errors.`n- Team reviews the draft.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create web-admin UI shell"; Labels = "task,phase-1,web-admin,ui"; Body = "Goal: Create the first web/admin app shell for Phase 1.`n`nParent: #$parentIssue`n`nAcceptance:`n- Web/admin app shell exists.`n- Main navigation is visible.`n- Future screens have clear placeholders.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Create mobile app UI shell"; Labels = "task,phase-1,mobile,ui"; Body = "Goal: Create the first mobile app shell for Phase 1.`n`nParent: #$parentIssue`n`nAcceptance:`n- Mobile app shell exists.`n- Main navigation is visible.`n- Placeholder screens exist for core flows.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Document local startup steps"; Labels = "task,phase-1,documentation,local-env"; Body = "Goal: Make local setup repeatable for all students.`n`nParent: #$parentIssue`n`nAcceptance:`n- A student can follow the guide and start local environment.`n- Key local URLs are listed.`n- Common errors are documented.`n`nReference: $parentUrl" },
  @{ Title = "Phase 1 Subtask: Phase 1 review and evidence collection"; Labels = "task,phase-1,evidence,review"; Body = "Goal: Prepare evidence for logbooks and interim review.`n`nParent: #$parentIssue`n`nAcceptance:`n- Phase 1 progress is visible in GitHub.`n- Each student has individual evidence.`n- Team can explain what is complete and what remains.`n`nReference: $parentUrl" }
)

$allLabels = $issues |
  ForEach-Object { $_.Labels -split "," } |
  ForEach-Object { $_.Trim() } |
  Sort-Object -Unique

Write-Host "Checking labels..."
$existingLabels = @(gh label list --limit 300 --json name | ConvertFrom-Json | ForEach-Object { $_.name })

foreach ($label in $allLabels) {
  if ($existingLabels -contains $label) {
    Write-Host "Label exists: $label"
    continue
  }

  Write-Host "Creating label: $label"
  gh label create $label --color "ededed" --description "VidyaConnect project label"
}

Write-Host "Checking existing issues..."
$existingIssueTitles = @(gh issue list --state all --limit 300 --json title | ConvertFrom-Json | ForEach-Object { $_.title })

foreach ($issue in $issues) {
  if ($existingIssueTitles -contains $issue.Title) {
    Write-Host "Skipping existing issue: $($issue.Title)"
    continue
  }

  Write-Host "Creating issue: $($issue.Title)"
  gh issue create --title $issue.Title --body $issue.Body --label $issue.Labels
}

