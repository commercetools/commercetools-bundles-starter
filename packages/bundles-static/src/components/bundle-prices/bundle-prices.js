import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { ListIcon, ExternalLinkIcon } from '@commercetools-uikit/icons';
import { PriceFilters } from '@commercetools-us-ps/bundles-core/components';
import { MASTER_VARIANT_ID } from '../../constants';
import messages from './messages';
import PricesTable from './prices-table';

const BundlePrices = ({ match, bundle }) => {
  const intl = useIntl();
  const { project } = useApplicationContext();
  const { currencies } = project;
  const [currency, setCurrency] = useState(currencies[0]);
  const [country, setCountry] = useState(null);
  const [customerGroup, setCustomerGroup] = useState(null);
  const [channel, setChannel] = useState(null);
  const [date, setDate] = useState('');

  const getMcPriceUrl = (productId, variantId) =>
    `/${match.params.projectKey}/products/${productId}/variants/${variantId}/prices`;

  function getViewPricesPath() {
    return `${getMcPriceUrl(bundle.id, MASTER_VARIANT_ID)}`;
  }

  function getAddPricePath() {
    return `${getMcPriceUrl(bundle.id, MASTER_VARIANT_ID)}/new`;
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
            to={getViewPricesPath}
            target={'_.blank'}
          />
          <SecondaryButton
            data-testid="add-price-btn"
            iconLeft={<ExternalLinkIcon />}
            label={intl.formatMessage(messages.addPriceButton)}
            to={getAddPricePath}
            target={'_.blank'}
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
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  bundle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    products: PropTypes.array,
  }).isRequired,
};

export default BundlePrices;
