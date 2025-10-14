import React, { useEffect, useState } from 'react'
import DashBoardLayout from '../../components/layout/DashBoardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import Infocard from '../../components/cards/Infocard';

import { LuHandCoins, LuWalletMinimal, } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import { addThousendsSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import IncomeTransactions from '../../components/Dashboard/IncomeTransactions';
import Last30DaysExpense from '../../components/Dashboard/Last30DaysExpense';
import RecentIncomewithChart from '../../components/Dashboard/RecentIncomewithChart';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchdeshboardData = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchdeshboardData();
    return () => {
    }
  }, [])


  return (
    <DashBoardLayout activeMenu={'dashboard'}>
      <div className='my-5 mx-auto'>
        <div className='grid gird-cols-1 md:grid-cols-3 gap-6'>
          <Infocard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousendsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <Infocard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousendsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <Infocard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousendsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
            transcations={dashboardData?.recentTransactios}
            onSeeMore={() => navigate('/expense')}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpense?.transactions || []}
            onSeeMore={() => navigate('/expense')}
          />

          <Last30DaysExpense
            data={dashboardData?.last30DaysExpense?.transactions || []}
          />

          <RecentIncomewithChart
            data={dashboardData?.last60dayIncome?.transaction?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <IncomeTransactions
            transactions={dashboardData?.last60dayIncome?.transaction || []}
            onSeeMore={() => navigate('/income')}
          />

        </div>
      </div>
    </DashBoardLayout>);
};

export default Home;