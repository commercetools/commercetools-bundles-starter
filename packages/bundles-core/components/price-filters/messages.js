import { defineMessages } from 'react-intl';

export default defineMessages({
  currency: {
    id: 'PriceFilters.filter.currency',
    description: 'The label for the currency filter',
    defaultMessage: 'Currency',
  },
  price: {
    id: 'PriceFilters.filter.price',
    description: 'The label for the price filter',
    defaultMessage: 'Price',
  },
  country: {
    id: 'PriceFilters.filter.country',
    description: 'The label for the country filter',
    defaultMessage: 'Country',
  },
  customerGroup: {
    id: 'PriceFilters.filter.customerGroup',
    description: 'The label for the customer group filter',
    defaultMessage: 'Customer Group',
  },
  channel: {
    id: 'PriceFilters.filter.channel',
    description: 'The label for the channel filter',
    defaultMessage: 'Channel',
  },
  date: {
    id: 'PriceFilters.filter.date',
    description: 'The label for the date filter',
    defaultMessage: 'Date',
  },
  errorLoading: {
    id: 'PriceFilters.error.loading',
    description: 'Message when querying for product prices fails',
    defaultMessage: 'Something went wrong loading the price filters.',
  },
});
