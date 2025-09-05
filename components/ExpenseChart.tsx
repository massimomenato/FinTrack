import React, { useState, useMemo } from 'react';
import type { Expense, Income } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../contexts/LanguageContext';

interface AnalysisChartProps {
  expenses: Expense[];
  incomes: Income[];
  selectedAccountIds: string[];
  viewDate: Date;
}

type ChartView = 'category' | 'incomeVsExpense';

const CATEGORY_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#F97316', '#EC4899'];
const INCOME_EXPENSE_COLORS = ['#10B981', '#EF4444']; // Emerald for Income, Rose for Expense

const AnalysisChart: React.FC<AnalysisChartProps> = ({ expenses, incomes, selectedAccountIds, viewDate }) => {
  const { t, formatCurrency } = useTranslation();
  const [view, setView] = useState<ChartView>('incomeVsExpense');

  const { monthlyExpenses, totalMonthlyIncomes, totalMonthlyExpenses } = useMemo(() => {
    const filteredExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return selectedAccountIds.includes(exp.accountId) &&
               expDate.getMonth() === viewDate.getMonth() &&
               expDate.getFullYear() === viewDate.getFullYear();
    });
    const filteredIncomes = incomes.filter(inc => {
        const incDate = new Date(inc.date);
        return selectedAccountIds.includes(inc.accountId) &&
               incDate.getMonth() === viewDate.getMonth() &&
               incDate.getFullYear() === viewDate.getFullYear();
    });
    
    const totalIncomes = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return { monthlyExpenses: filteredExpenses, totalMonthlyIncomes: totalIncomes, totalMonthlyExpenses: totalExpenses };
  }, [expenses, incomes, selectedAccountIds, viewDate]);


  const categoryChartData = useMemo(() => {
    const dataByCategory = monthlyExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(dataByCategory).map(category => ({
        name: category,
        value: dataByCategory[category],
    })).sort((a, b) => b.value - a.value);
  }, [monthlyExpenses]);
  
  const incomeExpenseChartData = useMemo(() => [
    { name: t('income'), value: totalMonthlyIncomes },
    { name: t('expenses'), value: totalMonthlyExpenses },
  ].filter(d => d.value > 0), [t, totalMonthlyIncomes, totalMonthlyExpenses]);

  const chartData = view === 'category' ? categoryChartData : incomeExpenseChartData;
  const chartColors = view === 'category' ? CATEGORY_COLORS : INCOME_EXPENSE_COLORS;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="p-2 bg-slate-800/80 text-white rounded-md border border-slate-700 shadow-lg">
          <p className="font-semibold">{`${data.name}`}</p>
          <p>{`${formatCurrency(data.value)} ${data.percent ? `(${(data.percent * 100).toFixed(0)}%)` : ''}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 dark:text-slate-400">{t('noDataForChart')}</p>
        </div>
      );
    }
    
    return (
       <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} stroke={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
                iconType="circle" 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="text-slate-600 dark:text-slate-300 ml-2">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const tabButtonClasses = (isActive: boolean) => 
    `w-full text-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
        isActive
        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-gray-600/50'
    }`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-end sm:items-center mb-4 gap-4">
        <div className="flex items-center p-1 space-x-1 bg-slate-100 dark:bg-gray-700 rounded-lg w-full sm:w-auto">
           <button onClick={() => setView('incomeVsExpense')} className={tabButtonClasses(view === 'incomeVsExpense')}>
             {t('income')} vs {t('expenses')}
           </button>
           <button onClick={() => setView('category')} className={tabButtonClasses(view === 'category')}>
             {t('overview')}
           </button>
        </div>
      </div>
      {renderChart()}
    </div>
  );
};

export default AnalysisChart;