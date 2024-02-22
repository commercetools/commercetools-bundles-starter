import React, { useContext } from 'react';

const BundleContext = React.createContext('');
const useBundleContext = () => {
  const id = useContext(BundleContext);
  return {
    id,
    where: `productType.id:"${id}"`,
  };
};
const BundleProvider = BundleContext.Provider;

export { BundleContext, BundleProvider, useBundleContext };
