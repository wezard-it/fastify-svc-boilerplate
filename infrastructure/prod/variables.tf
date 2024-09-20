variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "db_instance_name" {
  description = "DB instance name"
  type        = string
}

variable "db_name" {
  description = "DB name"
  type        = string
}

variable "db_user" {
  description = "DB user"
  type        = string
}

variable "db_pwd" {
  description = "DB user"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west8"
}

variable "min_instances" {
  description = "Min number of instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Max number of instances"
  type        = number
  default     = 1
}

variable "cpu_limit" {
  description = "Cpu limit"
  type        = string
}

variable "memory_limit" {
  description = "Memory limit"
  type        = string
}

variable "bucket_name" {
  description = "Memory limit"
  type        = string
}

variable "github_sa_name" {
  description = "Github service account name"
  type        = string
}

variable "tmp_image_enabled" {
  description = "Tmp image enabled"
  type = bool
}