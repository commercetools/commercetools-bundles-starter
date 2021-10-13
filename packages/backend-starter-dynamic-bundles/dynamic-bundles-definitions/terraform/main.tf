# https://github.com/labd/terraform-provider-commercetools
# This plugin must be manually installed
provider "commercetools" {
  client_id     = var.commercetools_client_id
  client_secret = var.commercetools_client_secret
  project_key   = var.commercetools_project_key
  token_url     = var.commercetools_token_url
  api_url       = var.commercetools_api_url
  scopes        = var.commercetools_scopes
}

resource "commercetools_product_type" "dynamic_bundle_child_category" {
  key         = "dynamic-bundle-child-category"
  name        = "DynamicBundleChildCategory"
  description = "The category included in a dynamic bundle"

  attribute {
    name = "category-ref"
    label = {
      en = "Category Ref"
    }
    required = true
    type {
      name              = "reference"
      reference_type_id = "category"
    }
  }

  attribute {
    name = "min-quantity"
    label = {
      en = "Minimum Quantity"
    }
    type {
      name = "number"
    }
  }

  attribute {
    name = "max-quantity"
    label = {
      en = "Maximum Quantity"
    }
    type {
      name = "number"
    }
  }

  attribute {
    name = "additional-charge"
    label = {
      en = "Additional Charge"
    }
    type {
      name = "boolean"
    }
  }

  attribute {
    name = "category-path"
    label = {
      en = "Category Path"
    }
    required = true
    type {
      name = "text"
    }
  }
}

resource "commercetools_product_type" "dynamic_bundle_parent" {
  key         = "dynamic-bundle-parent"
  name        = "DynamicBundleParent"
  description = "A dynamic bundle of product categories"

  attribute {
    name = "categories"
    label = {
      en = "Categories"
    }
    type {
      name = "set"
      element_type {
        name           = "nested"
        type_reference = commercetools_product_type.dynamic_bundle_child_category.id
      }
    }
  }

  attribute {
    name = "category-search"
    label = {
      en = "Category Search"
    }
    searchable = true
    constraint = "None"
    type {
      name = "set"
      element_type {
        name = "text"
      }
    }
  }

  attribute {
    name = "min-quantity"
    label = {
      en = "Minimum Quantity"
    }
    searchable = true
    type {
      name = "number"
    }
  }

  attribute {
    name = "max-quantity"
    label = {
      en = "Maximum Quantity"
    }
    searchable = true
    type {
      name = "number"
    }
  }

  attribute {
    name = "dynamic-price"
    label = {
      en = "Dynamic Price"
    }
    searchable = true
    type {
      name = "boolean"
    }
  }
}

resource "commercetools_type" "dynamic_bundle_parent_child_link" {
  key               = "dynamic-bundle-parent-child-link"
  resource_type_ids = ["line-item", "custom-line-item"]
  name = {
    en = "DynamicBundleParentChildLink"
  }
  description = {
    en = "Link to a parent dynamic bundle product by custom ID"
  }

  field {
    name = "external-id"
    label = {
      en = "External ID"
    }
    type {
      name = "String"
    }
  }

  field {
    name = "parent"
    label = {
      en = "Parent External ID"
    }
    type {
      name = "String"
    }
  }
}
