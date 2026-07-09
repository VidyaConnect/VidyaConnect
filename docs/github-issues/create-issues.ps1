# Creates GitHub issues from the Markdown files in this folder.
# Review all issue files before running.
# Requires GitHub CLI:
#   gh auth login
#
# Usage from repo root:
#   .\docs\github-issues\create-issues.ps1
#
# Safe to rerun:
# - Missing labels are created automatically.
# - Existing issues with the same title are skipped.

$ErrorActionPreference = "Stop"

$issues = @(
  @{ File = "story-01-local-docker-compose.md"; Title = "Story 1: Set up local Docker Compose environment"; Labels = "story,devops,foundation,local-env" },
  @{ File = "story-02-keycloak-local-idp.md"; Title = "Story 2: Configure Keycloak local IdP"; Labels = "story,auth,keycloak,foundation" },
  @{ File = "story-03-local-postgresql-structure.md"; Title = "Story 3: Set up local PostgreSQL structure"; Labels = "story,database,postgresql,foundation" },
  @{ File = "story-04-backend-microservices-skeleton.md"; Title = "Story 4: Create backend microservices skeleton"; Labels = "story,backend,microservices,foundation" },
  @{ File = "story-05-jwt-validation-tenant-context.md"; Title = "Story 5: Implement JWT validation and tenant context"; Labels = "story,auth,backend,tenant-isolation" },
  @{ File = "story-06-school-user-foundation-service.md"; Title = "Story 6: Implement school/user foundation service"; Labels = "story,backend,school-user-service,tenant-isolation" },
  @{ File = "story-07-api-contracts-v1.md"; Title = "Story 7: Create API contracts v1"; Labels = "story,api-contracts,documentation,foundation" },
  @{ File = "story-08-login-announcement-vertical-slice.md"; Title = "Story 8: Build login + announcement vertical slice"; Labels = "story,vertical-slice,announcements,foundation" },
  @{ File = "story-09-localstack-s3-file-handling.md"; Title = "Story 9: Set up LocalStack S3 for file handling"; Labels = "story,files,localstack,s3" },
  @{ File = "story-10-local-observability-baseline.md"; Title = "Story 10: Add local observability baseline"; Labels = "story,observability,grafana,otel" },
  @{ File = "story-11-ec2-container-deployment-plan.md"; Title = "Story 11: Prepare EC2 container deployment plan"; Labels = "story,devops,aws,deployment" }
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$allLabels = $issues |
  ForEach-Object { $_.Labels -split "," } |
  ForEach-Object { $_.Trim() } |
  Sort-Object -Unique

Write-Host "Checking labels..."
$existingLabels = @(gh label list --limit 200 --json name | ConvertFrom-Json | ForEach-Object { $_.name })

foreach ($label in $allLabels) {
  if ($existingLabels -contains $label) {
    Write-Host "Label exists: $label"
    continue
  }

  Write-Host "Creating label: $label"
  gh label create $label --color "ededed" --description "VidyaConnect project label"
}

Write-Host "Checking existing issues..."
$existingIssueTitles = @(gh issue list --state all --limit 200 --json title | ConvertFrom-Json | ForEach-Object { $_.title })

foreach ($issue in $issues) {
  if ($existingIssueTitles -contains $issue.Title) {
    Write-Host "Skipping existing issue: $($issue.Title)"
    continue
  }

  $bodyPath = Join-Path $baseDir $issue.File
  Write-Host "Creating issue: $($issue.Title)"
  gh issue create --title $issue.Title --body-file $bodyPath --label $issue.Labels
}
