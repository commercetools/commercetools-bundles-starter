
variable "commercetools_token_url" {
  type = string
}

variable "commercetools_api_url" {
  type = string
}

variable "commercetools_client_id" {
  type = string
}

variable "commercetools_client_secret" {
  type = string
}

variable "commercetools_project_key" {
  type = string
}

variable "commercetools_scopes" {
  type = string
}

# FIXME: The below variables are just a workaround, see https://github.com/hashicorp/terraform/issues/22004
variable "commercetools_api_concurrency" {
}

variable "cache_ttl" {
}
