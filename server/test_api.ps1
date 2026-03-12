# Simple Test Script for HR Chatbot API
# - Registers or logs in a test user
# - Updates model preference, sends a chat message, and fetches history

$base = 'http://localhost:5000'
$email = 'test@example.com'
$password = 'password123'

Write-Output "Testing API at $base"

function Get-ErrorBody($ex) {
    try {
        $stream = $ex.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        if ($text) { return $text | ConvertFrom-Json }
    } catch { }
    return $null
}

# 1) Register (or login if already exists)
try {
    $register = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = $password } | ConvertTo-Json)
    Write-Output 'Registration successful:'
    $register | ConvertTo-Json
    $token = $register.token
} catch {
    $body = Get-ErrorBody($_)
    if ($body -and $body.error -and ($body.error -match 'Email already registered')) {
        Write-Output 'Email exists; attempting login...'
        try {
            $login = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = $password } | ConvertTo-Json)
            Write-Output 'Login successful:'
            $login | ConvertTo-Json
            $token = $login.token
        } catch {
            Write-Output 'Login failed:'
            (Get-ErrorBody($_) | ConvertTo-Json)
            exit 1
        }
    } else {
        Write-Output 'Registration failed:'
        ($body | ConvertTo-Json)
        exit 1
    }
}

$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }

# 2) Demonstrate forgot/reset (token is returned in response)
try {
    Write-Output 'Requesting password reset...'
    $forgot = Invoke-RestMethod -Uri "$base/auth/forgot" -Method Post -ContentType 'application/json' -Body (@{ email = $email } | ConvertTo-Json)
    Write-Output ($forgot | ConvertTo-Json)
    if ($forgot.token) {
        Write-Output 'Using token to reset password to "newpass123"'
        $reset = Invoke-RestMethod -Uri "$base/auth/reset" -Method Post -ContentType 'application/json' -Body (@{ token = $forgot.token; newPassword = 'newpass123' } | ConvertTo-Json)
        Write-Output ($reset | ConvertTo-Json)
        # try logging in with new password
        try {
            $login2 = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email = $email; password = 'newpass123' } | ConvertTo-Json)
            Write-Output 'Re-login successful:'
            $login2 | ConvertTo-Json
        } catch {
            Write-Output 'Re-login failed:'
            (Get-ErrorBody($_) | ConvertTo-Json)
        }
    }
} catch {
    Write-Output 'Forgot/reset failed:'
    (Get-ErrorBody($_) | ConvertTo-Json)
}

# 3) Update preferences
try {
    $preferences = Invoke-RestMethod -Uri "$base/user/preferences" -Method Patch -Headers $headers -Body (@{ modelPreference = 'openai' } | ConvertTo-Json)
    Write-Output 'Preferences updated:'
    $preferences | ConvertTo-Json
} catch {
    Write-Output 'Update preferences failed:'
    (Get-ErrorBody($_) | ConvertTo-Json)
}

# 3) Send a chat message
try {
    $chat = Invoke-RestMethod -Uri "$base/chat" -Method Post -Headers $headers -Body (@{ message = 'What can you help me with?'; context = @{} } | ConvertTo-Json)
    Write-Output 'Chat reply:'
    $chat | ConvertTo-Json
} catch {
    Write-Output 'Chat failed:'
    (Get-ErrorBody($_) | ConvertTo-Json)
}

# 4) Fetch chat history
try {
    $history = Invoke-RestMethod -Uri "$base/chat/history?limit=50" -Method Get -Headers $headers
    Write-Output 'Chat history:'
    $history | ConvertTo-Json
} catch {
    Write-Output 'Fetch history failed:'
    (Get-ErrorBody($_) | ConvertTo-Json)
}