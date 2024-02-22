import find from 'lodash/find';

// eslint-disable-next-line import/prefer-default-export
export const getAttribute = (attributes, name) => {
  const attribute = find(attributes, { name });
  return attribute ? attribute.value : null;
};
