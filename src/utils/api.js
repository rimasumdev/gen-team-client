export const getServerUrl = () => {
  return (
    import.meta.env.VITE_PRODUCTION_SERVER_URL || import.meta.env.VITE_SERVER_IP
  );
};

export const getApiUrl = () => {
  return (
    import.meta.env.VITE_PRODUCTION_API_URL || import.meta.env.VITE_API_URL
  );
};
