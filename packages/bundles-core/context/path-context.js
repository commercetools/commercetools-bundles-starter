import React, { useContext } from 'react';

const PathContext = React.createContext('');
const usePathContext = () => useContext(PathContext);
const PathProvider = PathContext.Provider;

export { PathContext, PathProvider, usePathContext };
