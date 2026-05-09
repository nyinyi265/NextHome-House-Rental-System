import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast/Toast';
import houseService from '../services/houseService';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareProperties, setCompareProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const { success, warning, error: showError, info } = useToast();

  // Fetch compare list on mount and when user changes
  useEffect(() => {
    if (token && user) {
      fetchCompareList();
    }
  }, [token, user]);

   const fetchCompareList = async () => {
     if (!token) return;
     
     setLoading(true);
     try {
       const response = await houseService.getCompare(token);
       const properties = response.data || [];
       setCompareProperties(properties);
     } catch (error) {
       console.error('Failed to fetch compare list:', error);
     } finally {
       setLoading(false);
     }
   };

  const addToCompare = useCallback(async (property) => {
    // Check for duplicates
    if (compareProperties.some(p => p.id === property.id)) {
      info('Property already in compare list');
      return false;
    }

    // Check limit
    if (compareProperties.length >= 4) {
      warning('Maximum 4 properties allowed');
      return false;
    }

    if (!token) {
      warning('Please login to use compare feature');
      return false;
    }

    try {
      await houseService.addToCompare(token, property.id);
      await fetchCompareList();
      success('Property added to compare');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add property';
      if (err.response?.status === 400) {
        showError(message);
      }
      return false;
    }

    return true;
  }, [compareProperties, token, fetchCompareList, success, warning, showError, info]);

  const removeFromCompare = useCallback(async (propertyId) => {
    if (!token) {
      showError('Please login to use compare feature');
      return;
    }

    try {
      await houseService.removeFromCompare(token, propertyId);
      await fetchCompareList();
      success('Property removed from compare');
    } catch (error) {
      console.error('Failed to remove property:', error);
      showError('Failed to remove property');
    }
  }, [token, fetchCompareList, success, showError]);

  const clearCompare = useCallback(async () => {
    if (!token) {
      showError('Please login to use compare feature');
      return;
    }

    try {
      await houseService.clearCompare(token);
      setCompareProperties([]);
      success('Compare list cleared');
    } catch (error) {
      console.error('Failed to clear compare list:', error);
      showError('Failed to clear compare list');
    }
  }, [token, success, showError]);

  const isInCompare = useCallback((propertyId) => {
    return compareProperties.some(p => p.id === propertyId);
  }, [compareProperties]);

  const getCompareCount = useCallback(() => {
    return compareProperties.length;
  }, [compareProperties]);

  const value = {
    compareProperties,
    loading,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    getCompareCount,
    refetch: fetchCompareList,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
