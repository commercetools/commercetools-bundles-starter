import { compact, find, map } from 'lodash';
import { SKU } from '../components/product-field/constants';

// eslint-disable-next-line import/prefer-default-export
export const getSkus = variants =>
  compact(
    map(variants, product => {
      const skuField = find(product, { name: SKU });
      return skuField && skuField.value;
    })
  );
