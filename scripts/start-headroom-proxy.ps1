param(
    [int]$Port = 8787
)

# Start Headroom proxy in a new process and set common proxy env vars for the current PowerShell session.
# Run this from the repository root using: .\scripts\start-headroom-proxy.ps1

$headroomCmd = Join-Path $PSScriptRoot "..\headroom.cmd"
if (-not (Test-Path $headroomCmd)) {
    Write-Error "Cannot find headroom.cmd at $headroomCmd. Ensure the repo root contains headroom.cmd or install Headroom globally."
    return
}

# Ensure the proxy port is free before starting.
function Test-PortOpen {
    param([int]$Port)
    try {
        $listener = [System.Net.Sockets.TcpClient]::new()
        $listener.Connect('127.0.0.1', $Port)
        $listener.Close()
        return $true
    } catch {
        return $false
    }
}

if (Test-PortOpen -Port $Port) {
    Write-Host "Port $Port is already in use. If Headroom proxy is already running, environment variables will still be configured." -ForegroundColor Yellow
}

# Set common CLI proxy environment variables for this session.
$env:OPENAI_BASE_URL = "http://localhost:$Port/v1"
$env:ANTHROPIC_BASE_URL = "http://localhost:$Port"
$env:HEADROOM_PROXY_PORT = "$Port"

Write-Host "Headroom proxy environment set for this PowerShell session:" -ForegroundColor Green
Write-Host "  OPENAI_BASE_URL=$env:OPENAI_BASE_URL"
Write-Host "  ANTHROPIC_BASE_URL=$env:ANTHROPIC_BASE_URL"
Write-Host "  HEADROOM_PROXY_PORT=$env:HEADROOM_PROXY_PORT"
Write-Host "Starting Headroom proxy on port $Port..."

Start-Process -FilePath $headroomCmd -ArgumentList "proxy --port $Port" -NoNewWindow
Write-Host "Headroom proxy started. Keep this PowerShell session open while you use LLM clients that honor OPENAI_BASE_URL or ANTHROPIC_BASE_URL." -ForegroundColor Green
Write-Host "If you need the proxy to stop, close the proxy process or use Task Manager to stop the headroom.cmd process." -ForegroundColor Yellow
