variable "commercetools_token_url" {
  type = string
}

variable "commercetools_api_url" {
  type = string
}

variable "commercetools_client_id" {
  type = string
  sensitive = true
}

variable "commercetools_client_secret" {
  type = string
  sensitive = true
}

variable "commercetools_project_key" {
  type = string
}

variable "commercetools_scopes" {
  type = string
}
