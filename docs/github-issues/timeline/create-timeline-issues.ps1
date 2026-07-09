# Creates timeline/milestone GitHub issues from this folder.
# Review all issue files before running.
# Requires GitHub CLI:
#   gh auth login
#
# Usage from repo root:
#   .\docs\github-issues\timeline\create-timeline-issues.ps1
#
# Safe to rerun:
# - Missing labels are created automatically.
# - Existing issues with the same title are skipped.

$ErrorActionPreference = "Stop"

$issues = @(
  @{ File = "phase-01-foundation-setup.md"; Title = "Phase 1: Foundation Setup"; Labels = "phase,foundation,local-env,planning" },
  @{ File = "phase-02-first-vertical-slice.md"; Title = "Phase 2: First Vertical Slice - Login and Announcements"; Labels = "phase,vertical-slice,announcements,foundation" },
  @{ File = "phase-03-attendance-file-upload.md"; Title = "Phase 3: Attendance and File Upload Slice"; Labels = "phase,attendance,files,localstack" },
  @{ File = "phase-04-ui-stabilization.md"; Title = "Phase 4: UI Completion and Stabilization Before Exams"; Labels = "phase,ui,stabilization,demo" },
  @{ File = "phase-05-exam-light-work.md"; Title = "Phase 5: Exam Period Light Work"; Labels = "phase,exam-period,documentation,low-risk" },
  @{ File = "phase-06-demo-readiness.md"; Title = "Phase 6: Mid-September Demo Readiness"; Labels = "phase,demo,milestone,university-review" },
  @{ File = "task-demo-script.md"; Title = "Task: Prepare Mid-September Demo Script"; Labels = "task,demo,presentation" },
  @{ File = "task-completion-evidence.md"; Title = "Task: Prepare Interim Progress Evidence"; Labels = "task,evidence,university-review" }
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

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

  $bodyPath = Join-Path $baseDir $issue.File
  Write-Host "Creating issue: $($issue.Title)"
  gh issue create --title $issue.Title --body-file $bodyPath --label $issue.Labels
}
