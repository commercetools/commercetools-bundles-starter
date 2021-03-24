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

resource "commercetools_product_type" "static_bundle_child_variant" {
  key         = "static-bundle-child-variant"
  name        = "StaticBundleChildVariant"
  description = "The child product variant included in a bundle; for use as a nested product type only!"

  attribute {
    name = "quantity"
    label = {
      en = "Quantity"
    }
    required = true
    type {
      name = "number"
    }
  }

  attribute {
    name = "sku"
    label = {
      en = "SKU"
    }
    type {
      name = "text"
    }
  }

  attribute {
    name = "variant-id"
    label = {
      en = "Variant ID"
    }
    required = true
    type {
      name = "number"
    }
  }

  attribute {
    name = "product-ref"
    label = {
      en = "Product"
    }
    type {
      name              = "reference"
      reference_type_id = "product"
    }
  }

  attribute {
    name = "product-name"
    label = {
      en = "Product Name"
    }
    type {
      name = "ltext"
    }
  }
}

resource "commercetools_product_type" "static_bundle_parent" {
  key         = "static-bundle-parent"
  name        = "StaticBundleParent"
  description = "A static bundle of product variants"

  attribute {
    name = "products"
    label = {
      en = "Products"
    }
    searchable = true
    type {
      name = "set"
      element_type {
        name           = "nested"
        type_reference = commercetools_product_type.static_bundle_child_variant.id
      }
    }
  }

  attribute {
    name = "productSearch"
    label = {
      en = "Products (Search)"
    }
    searchable = true
    type {
      name = "set"
      element_type {
        name = "text"
      }
    }
  }
}

resource "commercetools_type" "static_bundle_parent_child_link" {
  key               = "static-bundle-parent-child-link"
  resource_type_ids = ["line-item", "custom-line-item"]
  name = {
    en = "StaticBundleParentChildLink"
  }
  description = {
    en = "Link to a parent static bundle product by custom ID"
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
