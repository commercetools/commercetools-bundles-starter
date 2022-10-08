import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  ExternalLinkIcon,
  ListIcon,
  SecondaryButton,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';
import { PriceFilters } from '../../../../bundles-core/components';
import { MASTER_VARIANT_ID } from '../../constants';
import PricesTable from './prices-table';
import messages from './messages';

const BundlePrices = ({ match, id, categories, dynamicPrice }) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { currencies } = project;
  const [currency, setCurrency] = useState(currencies[0]);
  const [country, setCountry] = useState(null);
  const [customerGroup, setCustomerGroup] = useState(null);
  const [channel, setChannel] = useState(null);
  const [date, setDate] = useState('');

  const MC_URL = `${window.location.origin}/${match.params.projectKey}`;
  const MC_PRICE_URL = `${MC_URL}/products/${id}/variants/${MASTER_VARIANT_ID}/prices`;

  function viewPrices() {
    window.open(MC_PRICE_URL, '_blank');
  }

  function addPrice() {
    window.open(`${MC_PRICE_URL}/new`, '_blank');
  }

  return (
    <Spacings.Stack scale="m">
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Spacings.Stack scale="xs">
          <Text.Body
            data-testid="price-title"
            intlMessage={
              dynamicPrice ? messages.dynamicTitle : messages.staticTitle
            }
          />
          {dynamicPrice && (
            <Text.Body
              data-testid="price-subtitle"
              isItalic={true}
              intlMessage={messages.dynamicSubtitle}
            />
          )}
        </Spacings.Stack>

        <Spacings.Inline scale="m" data-testid="price-actions">
          <SecondaryButton
            data-testid="view-prices-btn"
            iconLeft={<ListIcon />}
            label={intl.formatMessage(messages.viewPricesButton)}
            onClick={viewPrices}
          />
          <SecondaryButton
            data-testid="add-price-btn"
            iconLeft={<ExternalLinkIcon />}
            label={intl.formatMessage(messages.addPriceButton)}
            onClick={addPrice}
          />
        </Spacings.Inline>
      </Spacings.Inline>
      <PriceFilters
        currency={currency}
        country={country}
        customerGroup={customerGroup}
        channel={channel}
        date={date}
        setCurrency={setCurrency}
        setCountry={setCountry}
        setCustomerGroup={setCustomerGroup}
        setChannel={setChannel}
        setDate={setDate}
      />
      <PricesTable
        mcUrl={window.location.origin}
        categories={categories}
        currency={currency}
        country={country}
        customerGroup={customerGroup}
        channel={channel}
        date={date}
      />
    </Spacings.Stack>
  );
};
BundlePrices.displayName = 'BundlePrices';
BundlePrices.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  dynamicPrice: PropTypes.bool.isRequired,
};

export default BundlePrices;
