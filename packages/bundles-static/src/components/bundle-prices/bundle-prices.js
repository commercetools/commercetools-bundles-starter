import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  ExternalLinkIcon,
  ListIcon,
  SecondaryButton,
  Spacings,
  Text
} from '@commercetools-frontend/ui-kit';
import PriceFilters from '@commercetools-us-ps/mc-app-bundles-core/components/price-filters';
import { MASTER_VARIANT_ID } from '../../constants';
import messages from './messages';
import PricesTable from './prices-table';

const BundlePrices = ({ match, bundle }) => {
  const intl = useIntl();
  const { environment, project } = useApplicationContext();
  const { frontendHost } = environment;
  const { currencies } = project;
  const [currency, setCurrency] = useState(currencies[0]);
  const [country, setCountry] = useState(null);
  const [customerGroup, setCustomerGroup] = useState(null);
  const [channel, setChannel] = useState(null);
  const [date, setDate] = useState('');

  const getMcPriceUrl = (productId, variantId) =>
    `https://${frontendHost}/${match.params.projectKey}/products/${productId}/variants/${variantId}/prices`;

  function viewPrices() {
    window.open(`${getMcPriceUrl(bundle.id, MASTER_VARIANT_ID)}`, '_blank');
  }

  function addPrice() {
    window.open(`${getMcPriceUrl(bundle.id, MASTER_VARIANT_ID)}/new`, '_blank');
  }

  return (
    <Spacings.Stack scale="m">
      <Spacings.Inline
        scale="s"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text.Body intlMessage={messages.title} />

        <Spacings.Inline scale="m">
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
        variants={bundle.products}
        currency={currency}
        country={country}
        customerGroup={customerGroup}
        channel={channel}
        date={date}
        getMcPriceUrl={getMcPriceUrl}
      />
    </Spacings.Stack>
  );
};
BundlePrices.displayName = 'BundlePrices';
BundlePrices.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  bundle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    products: PropTypes.array
  }).isRequired
};

export default BundlePrices;
