import { SORT_OPTIONS } from '../constants';
import { COLUMN_KEYS } from './column-definitions';

export const PAGE_SIZE = 30;
export const DEFAULT_SORT = `${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`;
export const DEFAULT_VARIABLES = {
  limit: PAGE_SIZE,
  offset: 0,
  sort: DEFAULT_SORT,
};
