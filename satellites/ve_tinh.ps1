$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$b = Get-ItemProperty 'HKLM:\HARDWARE\DESCRIPTION\System\BIOS'
$g = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Cryptography').MachineGuid
$u = (Get-CimInstance Win32_ComputerSystemProduct).UUID
$o = @(Get-PSDrive -PSProvider FileSystem | ForEach-Object { $_.Name })
$doc = [ordered]@{
  ten = hostname
  user = $env:USERNAME
  machineGuid = $g
  uuid = $u
  hang = $b.SystemManufacturer
  mach = $b.SystemProductName
  ho = $b.SystemFamily
  biosHang = $b.BIOSVendor
  bios = (@($b.BIOSVersion) -join ',')
  o = $o
  luc = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
  nhan = $null
}
$path = Join-Path $root 'doc.json'
$json = $doc | ConvertTo-Json -Compress
Set-Content -Path $path -Value $json -Encoding utf8
(Get-FileHash -Algorithm SHA256 -Path $path).Hash.ToLower()
