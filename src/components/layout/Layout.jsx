import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadRatesFromStorage } from '../../redux/slices/payoutSlice';

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load saved payout rates from localStorage
    dispatch(loadRatesFromStorage());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default Layout; 