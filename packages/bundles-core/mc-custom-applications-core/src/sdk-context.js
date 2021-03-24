import React, { useContext } from 'react';

const SdkContext = React.createContext({});
const useSdkContext = () => useContext(SdkContext);
const SdkProvider = SdkContext.Provider;

export { SdkContext, SdkProvider, useSdkContext };
