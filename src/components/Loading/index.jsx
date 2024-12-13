import React, { createContext, useContext, useState } from "react";
import { Spin } from "antd";

// Create Loading Context
const LoadingContext = createContext();

// Provider Component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Functions to control loading state
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {/* Use Ant Design Spin as global loader */}
      <Spin spinning={isLoading} tip="Loading..." size="large">
        {children}
      </Spin>
    </LoadingContext.Provider>
  );
};

// Custom Hook to Access Loading State
export const useLoading = () => {
  return useContext(LoadingContext);
};
