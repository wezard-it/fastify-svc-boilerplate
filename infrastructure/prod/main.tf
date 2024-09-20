# Provider GCP
provider "google" {
  project = var.project_id
  region  = var.region
}

# Abilitazione delle API necessarie
resource "google_project_service" "cloud_services" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com"
  ])
  project = var.project_id
  service = each.key
}

# Creazione del Service Accougoogle_cloud_run_v2_servicent per GitHub Actions
resource "google_service_account" "github_actions_sa" {
  account_id   = var.github_sa_name
  display_name = "GitHub Actions Service Account"
}

# Assegnazione dei ruoli necessari al Service Account
resource "google_project_iam_binding" "github_actions_artifact_registry" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"

  members = [
    "serviceAccount:${google_service_account.github_actions_sa.email}"
  ]
}

resource "google_project_iam_binding" "github_actions_service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"

  members = [
    "serviceAccount:${google_service_account.github_actions_sa.email}"
  ]
}

resource "google_project_iam_binding" "github_actions_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"

  members = [
    "serviceAccount:${google_service_account.github_actions_sa.email}"
  ]
}

# Creazione della chiave per il Service Account (da usare come secret in GitHub Actions dopo decodifica in base64)
resource "google_service_account_key" "github_actions_sa_key" {
  service_account_id = google_service_account.github_actions_sa.name
}

# Creazione dell'arctifact registry
resource "google_artifact_registry_repository" "my-repo" {
  location      = var.region
  repository_id = var.service_name
  description   = "Prod docker repository"
  format        = "DOCKER"
  cleanup_policy_dry_run = false
}

# Creazione dell'istanza postgres 16
resource "google_sql_database_instance" "postgres_instance" {
  name             = var.db_instance_name
  database_version = "POSTGRES_16"
  region           = var.region
  deletion_protection = true

  settings {
    tier = "db-f1-micro"
    edition = "ENTERPRISE"
    availability_type = "ZONAL"
    backup_configuration {
        enabled = true
        point_in_time_recovery_enabled = true
    }
    disk_type = "PD_SDD"
    disk_size = 10
    ip_configuration {
      authorized_networks {
        name  = "public-access"
        value = "0.0.0.0/0"
      }
    }
  }
}

# Creazione del database
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres_instance.name
}

# Creazione del db user
resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres_instance.name
  password = var.db_pwd
}

# Creazione del Cloud Storage Bucket
resource "google_storage_bucket" "public_bucket" {
  name     = var.bucket_name
  location = var.region
  force_destroy = false

  # Abilita l'accesso pubblico al bucket
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

# Imposta una policy IAM per consentire l'accesso pubblico agli oggetti nel bucket
resource "google_storage_bucket_iam_binding" "public_access" {
  bucket = google_storage_bucket.public_bucket.name
  role   = "roles/storage.objectViewer"

  members = [
    "allUsers",
  ]
}

# Read .env file
resource "local_file" "env_file" {
  filename = "${path.module}/../../.env.prod"
  content  = file("${path.module}/../../.env.prod")
}

# Legge il contenuto del file .env
data "local_file" "env_file" {
  filename = "${path.module}/../../.env.prod"
}

# Trasforma il contenuto del file .env in una lista di righe
locals {
  env_lines = split("\n", trimspace(data.local_file.env_file.content))
}

# Crea una mappa chiave-valore a partire dal contenuto del file .env
locals {
  env_variables = {
    for line in local.env_lines : 
    split("=", line)[0] => split("=", line)[1] 
    if length(line) > 0 && !startswith(line, "#")
  }
}

# Creazione dell'instanza cloud run
resource "google_cloud_run_v2_service" "cloud_run_service" {
  name     = var.service_name
  location = var.region
  deletion_protection = false
  ingress = "INGRESS_TRAFFIC_ALL"
  depends_on = [ google_sql_database_instance.postgres_instance, google_sql_user.db_user ]

  template {
    containers {
        ports {
            container_port = 8080
        }
        name = var.service_name
        image = var.tmp_image_enabled ? "gcr.io/google-samples/hello-app:1.0" :"${var.region}-docker.pkg.dev/${var.project_id}/${var.service_name}/${var.project_name}:latest"
        resources {
            limits = {
                cpu    = var.cpu_limit
                memory = var.memory_limit
            }
            cpu_idle = true
            startup_cpu_boost = true
        }
        dynamic "env" {
          for_each = local.env_variables
          content {
            name  = trimspace(env.key)
            value = trimspace(env.value)
          }
        }
        env {
          name = "DATABASE_URL"
          value = "postgresql://${google_sql_user.db_user.name}:${google_sql_user.db_user.password}@${google_sql_database_instance.postgres_instance.public_ip_address}:5432/${google_sql_database.database.name}"
        }
        env {
          name = "GOOGLE_PROJECT_ID"
          value = var.project_id
        }
        env {
          name = "GOOGLE_STORAGE_BUCKET"
          value = var.bucket_name
        }
    }
    
    scaling {
        min_instance_count = var.min_instances
        max_instance_count = var.max_instances
    }
  }

  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Fornire all'istanza cloud run accesso pubblico
resource "google_cloud_run_v2_service_iam_binding" "public_access" {
  location = google_cloud_run_v2_service.cloud_run_service.location
  project  = var.project_id
  name  = google_cloud_run_v2_service.cloud_run_service.name
  role     = "roles/run.invoker"

  members = [
    "allUsers",
  ]
}