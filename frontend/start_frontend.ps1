# ClinicConnect - Frontend Local HTTP Server
# Serves frontend UI on http://localhost:8080 and opens the browser

$port = 8080
$url = "http://localhost:$port/"
$root = $PSScriptRoot
if ($root) { Set-Location $root }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ClinicConnect Frontend Web UI" -ForegroundColor Green
Write-Host "   Serving from: $root" -ForegroundColor Yellow
Write-Host "   URL:          $url" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $url

# Initialize HttpListener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host "Frontend server running at $url. Press Ctrl+C in this terminal to stop." -ForegroundColor Gray

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath
        if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
            $path = "/index.html"
        }

        $localPath = Join-Path $root $path.TrimStart('/')

        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor DarkGray
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
