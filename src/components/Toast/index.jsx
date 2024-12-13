import React, { createContext, useContext } from "react";
import { notification } from 'antd';

// Create Toast Context
const ToastContext = createContext();

// Provider Component
export const ToastProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const openToast = (type, description) => {
    api[type]({
      message: <b>{type ==='success' ? "Success" : "Error"}</b> ,
      description: description,
    });
  };

  return (
    <ToastContext.Provider value={{ openToast }}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

// Custom Hook to Access Toast State
export const useToast = () => {
  return useContext(ToastContext);
};
