Set-Location $PSScriptRoot
Write-Host "Starting Doom Generator..."

if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $name, $value = $line -split '=', 2
            if ($name -and $value) {
                [System.Environment]::SetEnvironmentVariable($name, $value)
            }
        }
    }
}

python generator.py
Write-Host "Done."
