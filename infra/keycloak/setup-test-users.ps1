param(
  [string]$KeycloakUrl = 'http://localhost:8080',
  [string]$AdminUser = 'admin',
  [string]$AdminPassword = 'admin',
  [string]$DatabaseContainer = 'vidyaconnect-postgres',
  [string]$DatabaseUser = 'vidyaconnect_user',
  [string]$DatabaseName = 'vidyaconnect'
)

$ErrorActionPreference = 'Stop'
$realm = 'vidyaconnect'
$tokenResponse = Invoke-RestMethod -Method Post -Uri "$KeycloakUrl/realms/master/protocol/openid-connect/token" -ContentType 'application/x-www-form-urlencoded' -Body @{
  grant_type = 'password'
  client_id = 'admin-cli'
  username = $AdminUser
  password = $AdminPassword
}
$headers = @{ Authorization = "Bearer $($tokenResponse.access_token)" }
$accounts = @(
  @{ Username = 'testuser1admin'; Email = 'testuser1admin@vidyaconnect.local'; Role = 'ADMIN'; Password = 'useradmin1234' },
  @{ Username = 'testuser1student'; Email = 'testuser1student@vidyaconnect.local'; Role = 'STUDENT'; Password = 'userstudent' },
  @{ Username = 'testuser1teacher'; Email = 'testuser1teacher@vidyaconnect.local'; Role = 'TEACHER'; Password = 'userteacher' }
)

foreach ($account in $accounts) {
  $filter = [uri]::EscapeDataString($account.Username)
  $existing = Invoke-RestMethod -Headers $headers -Uri "$KeycloakUrl/admin/realms/$realm/users?username=$filter&exact=true"
  $userId = ($existing | Select-Object -First 1).id
  $user = @{
    username = $account.Username
    email = $account.Email
    firstName = 'Test'
    lastName = $account.Username.Replace('testuser1','').ToUpperInvariant()
    enabled = $true
    emailVerified = $true
  }

  if ($userId) {
    Invoke-RestMethod -Method Put -Headers $headers -ContentType 'application/json' -Uri "$KeycloakUrl/admin/realms/$realm/users/$userId" -Body ($user | ConvertTo-Json -Depth 8)
  } else {
    Invoke-RestMethod -Method Post -Headers $headers -ContentType 'application/json' -Uri "$KeycloakUrl/admin/realms/$realm/users" -Body ($user | ConvertTo-Json -Depth 8)
    $existing = Invoke-RestMethod -Headers $headers -Uri "$KeycloakUrl/admin/realms/$realm/users?username=$filter&exact=true"
    $userId = ($existing | Select-Object -First 1).id
  }

  $credential = @{ type = 'password'; value = $account.Password; temporary = $false } | ConvertTo-Json -Depth 4
  Invoke-RestMethod -Method Put -Headers $headers -ContentType 'application/json' -Uri "$KeycloakUrl/admin/realms/$realm/users/$userId/reset-password" -Body $credential

  $realmRoles = Invoke-RestMethod -Headers $headers -Uri "$KeycloakUrl/admin/realms/$realm/roles"
  $role = $realmRoles | Where-Object { $_.name -eq $account.Role -or ($_.name -replace '-','_').ToUpperInvariant() -eq $account.Role } | Select-Object -First 1
  if (-not $role) { throw "Keycloak realm does not define the required role $($account.Role). Available roles: $($realmRoles.name -join ', ')" }
  $mapping = ConvertTo-Json -InputObject @($role) -Depth 8
  try {
    Invoke-RestMethod -Method Post -Headers $headers -ContentType 'application/json' -Uri "$KeycloakUrl/admin/realms/$realm/users/$userId/role-mappings/realm" -Body $mapping
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 409) { throw }
  }
$syncSql = "UPDATE school_user.users SET `"keycloakId`" = '$userId' WHERE email = '$($account.Email)';"
  & docker exec $DatabaseContainer psql -U $DatabaseUser -d $DatabaseName -v ON_ERROR_STOP=1 -c $syncSql | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Could not sync $($account.Email) to the local school-user database." }
  Write-Output "Provisioned $($account.Email) with Keycloak role $($account.Role) and synced its local account."
}






