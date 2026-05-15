$ErrorActionPreference = 'Stop'

$sourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillName = 'solid-js-best-practices'
$targets = @(
  Join-Path $env:USERPROFILE '.claude\skills\solid-js-best-practices'
  Join-Path $env:USERPROFILE '.ai\skills\solid-js-best-practices'
  Join-Path $env:USERPROFILE '.agents\skills\solid-js-best-practices'
  'D:\projects\web\recipe-tome-pwa\.agents\skills\solid-js-best-practices'
)

foreach ($target in $targets) {
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $target 'rules') | Out-Null

  Copy-Item -Path (Join-Path $sourceRoot 'SKILL.md') -Destination (Join-Path $target 'SKILL.md') -Force
  Copy-Item -Path (Join-Path $sourceRoot 'rules\*.md') -Destination (Join-Path $target 'rules') -Force

  Write-Host "Synced $skillName to $target"
}
