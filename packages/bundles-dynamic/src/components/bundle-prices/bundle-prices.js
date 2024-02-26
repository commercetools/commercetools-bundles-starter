import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ExternalLinkIcon, ListIcon } from '@commercetools-uikit/icons';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PriceFilters } from '@commercetools-us-ps/bundles-core/components';
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

  const getMcPriceUrl = (productId, variantId) =>
    `/${match.params.projectKey}/products/${productId}/variants/${variantId}/prices`;

  function getViewPricesPath() {
    return `${getMcPriceUrl(id, MASTER_VARIANT_ID)}`;
  }

  function getAddPricePath() {
    return `${getMcPriceUrl(id, MASTER_VARIANT_ID)}/new`;
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
