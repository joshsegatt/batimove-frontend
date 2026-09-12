import { useState, useEffect } from 'react';
import { 
  supabase, 
  fetchLeads, 
  fetchFleetVehicles, 
  fetchFinancialRecords,
  LeadItem, 
  FleetVehicle,
  FinancialRecord
} from '../../../../services/supabaseClient';

export function useDashboardData() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [leadsData, fleetData, financialData] = await Promise.all([
        fetchLeads(),
        fetchFleetVehicles(),
        fetchFinancialRecords()
      ]);
      
      setLeads(leadsData);
      setFleetVehicles(fleetData);
      setFinancialRecords(financialData);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Subscribe to realtime updates for leads
    const leadsSubscription = supabase
      .channel('public:leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        setTimeout(loadData, 1000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
    };
  }, []);

  return { leads, fleetVehicles, financialRecords, loading, error, reloadData: loadData };
}
