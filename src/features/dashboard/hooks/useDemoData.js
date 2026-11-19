import { useContext } from 'react';
import { DashboardContext } from '../context/DashboardContext.js';

export function useDemoData() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('Dashboard screens require DashboardProvider.');
  return context;
}
