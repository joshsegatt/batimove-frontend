import { useState, useEffect } from 'react';
import { supabase, fetchLeads, fetchFleetVehicles, LeadItem, FleetVehicle } from '../../../../services/supabaseClient';

export function useDashboardData() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [leadsData, fleetData] = await Promise.all([
        fetchLeads(),
        fetchFleetVehicles()
      ]);
      
      setLeads(leadsData);
      setFleetVehicles(fleetData);
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
        // Debounce reload
        setTimeout(loadData, 1000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
    };
  }, []);

  return { leads, fleetVehicles, loading, error, reloadData: loadData };
}
