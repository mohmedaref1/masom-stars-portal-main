import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, FileText, Percent } from 'lucide-react'; // Added Percent
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'; // Added Legend for new chart
import { useToast } from "@/hooks/use-toast";
import { BackToHomeButton } from "./BackToHomeButton";

// واجهات البيانات
interface IncomeExpenseTrendItem {
  month: string;
  income: number;
  expenses: number;
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeBreakdown: { [key: string]: number };
  expenseBreakdown: { [key: string]: number };
  incomeExpenseTrend: IncomeExpenseTrendItem[]; // Added for new chart
  period: {
    startDate: string;
    endDate: string;
  };
}

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
}

// خدمة وهمية للبيانات المالية
const financialService = {
  async getFinancialSummary(startDate: string, endDate: string): Promise<FinancialSummary> {
    // هنا يمكنك استبدال البيانات الوهمية ببيانات حقيقية من API
    // Simulating data based on startDate and endDate to show some variation
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    const currentYear = new Date(startDate).getFullYear();

    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const trendData: IncomeExpenseTrendItem[] = [];

    for (let i = 0; i < 6; i++) { // Generate 6 months of data for example
        const monthIndex = (startMonth + i) % 12;
        const income = Math.floor(Math.random() * 20000) + 40000; // Random income
        const expenses = Math.floor(Math.random() * 15000) + 20000; // Random expenses
        trendData.push({
            month: `${months[monthIndex]} ${currentYear}`,
            income: income,
            expenses: expenses,
        });
    }

    const totalIncomeFromTrend = trendData.reduce((acc, item) => acc + item.income, 0);
    const totalExpensesFromTrend = trendData.reduce((acc, item) => acc + item.expenses, 0);


    return {
      totalIncome: totalIncomeFromTrend || 75000, // Fallback if trend data is empty
      totalExpenses: totalExpensesFromTrend || 45000,
      netIncome: (totalIncomeFromTrend - totalExpensesFromTrend) || 30000,
      incomeExpenseTrend: trendData,
      incomeBreakdown: {
        'رسوم الطلاب': 45000,
        'تبرعات': 20000,
        'أنشطة أخرى': 10000,
      },
      expenseBreakdown: {
        'رواتب المعلمين': 30000,
        'مصاريف تشغيلية': 10000,
        'صيانة': 5000,
      },
      period: {
        startDate,
        endDate,
      },
    };
  },

  async getTransactions(startDate: string, endDate: string): Promise<Transaction[]> {
    // هنا يمكنك استبدال البيانات الوهمية ببيانات حقيقية من API
    return [
      {
        id: '1',
        date: '2024-06-01',
        type: 'income',
        category: 'رسوم الطلاب',
        description: 'دفعة شهر يونيو',
        amount: 2000,
      },
      {
        id: '2',
        date: '2024-06-05',
        type: 'expense',
        category: 'رواتب المعلمين',
        description: 'راتب شهر يونيو',
        amount: 15000,
      },
      {
        id: '3',
        date: '2024-06-10',
        type: 'income',
        category: 'تبرعات',
        description: 'تبرع من أحد المحسنين',
        amount: 5000,
      },
    ];
  },
};

export const AssociationIncome = () => {
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const fetchFinancialData = async () => {
    try {
      const summaryData = await financialService.getFinancialSummary(startDate, endDate);
      const transactionsData = await financialService.getTransactions(startDate, endDate);
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (error: any) {
      toast({
        title: "حدث خطأ!",
        description: "فشل في جلب البيانات المالية.",
        variant: "destructive",
      });
    }
  };

  // تنسيق البيانات للرسم البياني الخطي
  const lineChartData = Object.entries(summary?.incomeBreakdown || {}).map(([name, value]) => ({
    name,
    income: value,
  }));

  // تنسيق البيانات للرسم البياني الشريطي
  const barChartData = Object.entries(summary?.expenseBreakdown || {}).map(([name, value]) => ({
    name,
    expense: value,
  }));

  // تنسيق البيانات للرسم البياني الدائري
  const pieChartData = Object.entries(summary?.incomeBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <BackToHomeButton />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مداخيل الجمعية</h1>
          <p className="text-gray-400">تقارير مالية شاملة ومتابعة الأرباح</p>
        </div>

        {/* تحديد الفترة الزمنية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="startDate" className="text-gray-300">من تاريخ:</Label>
            <Input
              type="date"
              id="startDate"
              className="input-modern"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-gray-300">إلى تاريخ:</Label>
            <Input
              type="date"
              id="endDate"
              className="input-modern"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* زر جلب البيانات */}
        <div className="text-center mb-8">
          <Button className="btn-primary" onClick={fetchFinancialData}>
            <FileText className="w-4 h-4 ml-2" />
            جلب البيانات المالية
          </Button>
        </div>

        {/* عرض الملخص المالي */}
        {summary && (
          <Card className="card-modern mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                ملخص الفترة المالية: {summary.period.startDate} - {summary.period.endDate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted grid for 4 items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">إجمالي الإيرادات:</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">{summary.totalIncome.toLocaleString()} ل.س</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">إجمالي المصروفات:</span>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-2xl font-bold text-red-400">{summary.totalExpenses.toLocaleString()} ل.س</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">صافي الدخل:</span>
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{summary.netIncome.toLocaleString()} ل.س</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">هامش صافي الربح:</span>
                    <Percent className="w-4 h-4 text-purple-400" /> {/* Added Percent Icon */}
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {summary.totalIncome > 0
                      ? ((summary.netIncome / summary.totalIncome) * 100).toFixed(2) + '%'
                      : '0.00%'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* الرسوم البيانية */}
        {/* New Income vs Expenses Trend Chart */}
        {summary && summary.incomeExpenseTrend && summary.incomeExpenseTrend.length > 0 && (
          <Card className="card-modern mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">اتجاه الإيرادات والمصروفات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={summary.incomeExpenseTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="month" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#E2E8F0' }}
                    itemStyle={{ color: '#A0AEC0' }}
                  />
                  <Legend wrapperStyle={{ color: '#A0AEC0' }} />
                  <Line type="monotone" dataKey="income" name="الإيرادات" stroke="#34D399" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" name="المصروفات" stroke="#F87171" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* رسم بياني خطي للإيرادات */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl text-white">توزيع الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#63B3ED" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* رسم بياني شريطي للمصروفات */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-xl text-white">توزيع المصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#A0AEC0" />
                  <YAxis stroke="#A0AEC0" />
                  <Tooltip />
                  <Bar dataKey="expense" fill="#F56565" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* رسم بياني دائري للإيرادات */}
        <Card className="card-modern mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">تحليل مصادر الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* جدول المعاملات */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-xl text-white">تفاصيل المعاملات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      المبلغ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {transaction.amount.toLocaleString()} ل.س
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
