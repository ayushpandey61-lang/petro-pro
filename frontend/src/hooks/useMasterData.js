import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

export const useMasterData = (tableName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiClient.getMasterData(tableName);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (tableName) {
      fetchData();
    }
  }, [tableName]);

  const refetch = () => {
    if (tableName) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const result = await apiClient.getMasterData(tableName);
          setData(result);
          setError(null);
        } catch (err) {
          console.error(`Error fetching ${tableName}:`, err);
          setError(err.message);
          setData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  return { data, loading, error, refetch };
};

// Specific hooks for common master data
export const useEmployees = () => useMasterData('employees');
export const useNozzles = () => useMasterData('nozzles');
export const useShifts = () => useMasterData('shifts');
export const useFuelProducts = () => useMasterData('fuel-products');
export const useLubricants = () => useMasterData('lubricants');
export const useVendors = () => useMasterData('vendors');
export const useTanks = () => useMasterData('tanks');
export const useExpenseTypes = () => useMasterData('expense-types');
export const useCreditParties = () => useMasterData('credit-parties');
export const useSwipeMachines = () => useMasterData('swipe-machines');
export const useExpiryItems = () => useMasterData('expiry-items');
export const usePrintTemplates = () => useMasterData('print-templates');
export const useGuestCustomers = () => useMasterData('guest-customers');
export const useDenominations = () => useMasterData('denominations');
export const useTankDips = () => useMasterData('tank-dips');
export const useTankLorryManagement = () => useMasterData('tank-lorry-management');
export const useBusinessCrDrParties = () => useMasterData('business-cr-dr-parties');