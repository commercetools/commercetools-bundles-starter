import React from 'react';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';

const FormattedJSON = ({ name = false, json }) => {
  const iconStyle = 'triangle';

  return (
    <ReactJson
      name={name}
      src={json}
      iconStyle={iconStyle}
      enableClipboard={false}
      displayDataTypes={false}
      displayObjectSize={false}
    />
  );
};

FormattedJSON.displayName = 'FormattedJSON';
FormattedJSON.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  json: PropTypes.object,
};

export default FormattedJSON;
