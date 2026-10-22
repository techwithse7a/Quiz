$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft David Desktop')
$speaker.Rate = 2
$speaker.Volume = 100
$clips = [ordered]@{
intro = "Can you name ten brand logos? Let's find out!"
challenge = 'Think you can get a perfect ten?'
a1 = 'Apple!'
a2 = 'Nike!'
a3 = 'Spotify!'
engage3 = 'Three down! How many have you guessed?'
a4 = "McDonald's!"
a5 = 'Adidas!'
a6 = 'Snapchat!'
engage6 = 'Keep going! Remember your score!'
a7 = 'PlayStation!'
a8 = 'Shell!'
a9 = 'Puma!'
final = 'Final question! Can you get this one?'
a10 = 'Pinterest!'
outro = 'How many did you get right? Comment your score, and follow Play With Momo!'
}
New-Item -ItemType Directory -Force 'public/brand-logos-001/audio' | Out-Null
$manifest = @{}
try {
 foreach ($id in $clips.Keys) {
  $relative = "brand-logos-001/audio/$id.wav"
  $target = Join-Path (Get-Location) "public/$relative"
  $speaker.SetOutputToWaveFile($target)
  $speaker.Speak($clips[$id])
  $speaker.SetOutputToNull()
  $duration = & 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe' -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $target
  $manifest[$id] = @{file=$relative;duration=[double]::Parse($duration,[Globalization.CultureInfo]::InvariantCulture);text=$clips[$id];provider='Windows Speech draft';voice='Microsoft David Desktop';rate=2}
 }
 $manifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 'data/logo-audio.json'
} finally { $speaker.Dispose() }
