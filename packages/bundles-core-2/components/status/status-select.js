import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '@commercetools-uikit/select-input';
import StatusBadge, { PRODUCT_ACTIONS } from './status-badge';

export const StatusLabel = (props) => {
  const value = JSON.parse(props.data.value);
  const { hasStagedChanges, status } = value;
  const published = status === PRODUCT_ACTIONS.PUBLISH;
  const code = StatusBadge.getCode(published, hasStagedChanges);
  return (
    <SelectInput.SingleValue {...props}>
      <StatusBadge code={code} />
    </SelectInput.SingleValue>
  );
};
StatusLabel.displayName = 'StatusLabel';
StatusLabel.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }),
};

export const StatusOption = (props) => {
  const value = JSON.parse(props.data.value);
  return (
    <SelectInput.Option {...props}>
      <StatusBadge code={value.status} />
    </SelectInput.Option>
  );
};
StatusOption.displayName = 'StatusOption';
StatusOption.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }),
};

const StatusSelect = ({
  className,
  horizontalConstraint,
  published,
  hasStagedChanges,
  onChange,
}) => {
  const STATUS = {
    PUBLISHED: JSON.stringify({
      status: PRODUCT_ACTIONS.PUBLISH,
      hasStagedChanges,
    }),
    UNPUBLISHED: JSON.stringify({
      status: PRODUCT_ACTIONS.UNPUBLISH,
      hasStagedChanges,
    }),
  };

  const options = [{ value: STATUS.PUBLISHED }, { value: STATUS.UNPUBLISHED }];
  const initialValue = published ? STATUS.PUBLISHED : STATUS.UNPUBLISHED;
  const [value, setValue] = useState(initialValue);

  if (hasStagedChanges !== JSON.parse(value).hasStagedChanges) {
    setValue(initialValue);
  }

  function filterOption(option) {
    const modified = published && hasStagedChanges;
    return !modified ? !option.value.includes(value) : true;
  }

  function handleChange(event) {
    const targetValue = event.target.value;
    const changeValue = JSON.parse(targetValue);
    const { status } = changeValue;
    const publish = status === PRODUCT_ACTIONS.PUBLISH;
    setValue(targetValue);
    onChange(publish);
  }

  return (
    <div className={className}>
      <SelectInput
        horizontalConstraint={horizontalConstraint}
        value={value}
        options={options}
        filterOption={filterOption}
        onChange={handleChange}
        components={{
          SingleValue: StatusLabel,
          Option: StatusOption,
        }}
      />
    </div>
  );
};
StatusSelect.displayName = 'StatusSelect';
StatusSelect.propTypes = {
  className: PropTypes.string,
  horizontalConstraint: PropTypes.string,
  published: PropTypes.bool.isRequired,
  hasStagedChanges: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StatusSelect;
