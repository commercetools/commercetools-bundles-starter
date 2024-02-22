// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'bundles-static';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

const ROOT_PATH = 'bundles-static';
const BUNDLE_PRODUCT_TYPE = 'static-bundle-parent';
const MASTER_VARIANT_ID = 1;
export { ROOT_PATH, BUNDLE_PRODUCT_TYPE, MASTER_VARIANT_ID };
