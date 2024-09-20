# Output dell'URL del servizio Cloud Run
output "cloud_run_url" {
  description = "L'URL pubblico del servizio Cloud Run"
  value       = google_cloud_run_v2_service.cloud_run_service.uri
}

# Output della stringa di connessione del database
output "database_connection_string" {
  description = "Stringa di connessione al database PostgreSQL"
  value       = "postgresql://${google_sql_user.db_user.name}:${google_sql_user.db_user.password}@${google_sql_database_instance.postgres_instance.public_ip_address}:5432/${google_sql_database.database.name}"
  sensitive = true
}

# Output dell'URL del bucket pubblico
output "bucket_url" {
  description = "L'URL pubblico del bucket Cloud Storage"
  value       = "https://storage.googleapis.com/${google_storage_bucket.public_bucket.name}/"
}

# Output della chiave del Service Account (da usare come secret in GitHub Actions)
output "github_actions_service_account_key" {
  description = "Chiave JSON del Service Account per GitHub Actions"
  value       = google_service_account_key.github_actions_sa_key.private_key
  sensitive = true
}

