import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController);
    
    setLoading(true);
    
    // Set default options with the abort signal
    const fetchOptions = {
      ...options,
      signal: abortController.signal
    };

    (async () => {
      try {
        const response = await axios(url, fetchOptions);
        setData(response.data);
        setError(null);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Request was aborted, no need to update state
          console.log('Request aborted');
          return;
        }
        setError(error.response?.data || error.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [url]);

  // Function to reload data
  const refetch = async () => {
    setLoading(true);
    try {
      const response = await axios(url, { ...options });
      setData(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data || error.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel the request
  const cancel = () => {
    if (controller) {
      controller.abort();
    }
  };

  return { data, loading, error, refetch, cancel };
} 