import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

export const DEFAULT_VARIABLES = {
  target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
  limit: 500,
  offset: 0
};
export const DATE_FORMAT_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZoneName: 'short'
};
