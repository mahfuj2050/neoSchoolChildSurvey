import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, UserPlus } from 'lucide-react';
import { studentService } from '../services/studentService';
import { DashboardStats, Student, AGE_GROUPS } from '../types';
import { useAppContext } from '../contexts/AppContext';

const COLORS = ['#059669', '#DC2626', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-colors">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, studentsData] = await Promise.all([
        studentService.getDashboardStats(),
        studentService.getAllStudents()
      ]);
      setStats(statsData);
      setStudents(studentsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !stats) return <div className="flex justify-center items-center h-64 dark:text-gray-300">{t('loading')}</div>;

  // Process data for Age Graph
  const ageData = AGE_GROUPS.map(age => ({
    name: age,
    count: students.filter(s => s.ageGroup === age).length
  }));

  // Process data for Class Chart
  const classData = [
    { name: 'Pre-Primary', value: students.filter(s => s.class === "Pre-Primary").length },
    { name: 'Class 1', value: students.filter(s => s.class === "1").length },
    { name: 'Class 2', value: students.filter(s => s.class === "2").length },
    { name: 'Class 3', value: students.filter(s => s.class === "3").length },
    { name: 'Class 4', value: students.filter(s => s.class === "4").length },
    { name: 'Class 5', value: students.filter(s => s.class === "5").length },
  ];

  // Process data for Source Chart
  const sourceData = [
    { name: t('coverageArea'), value: stats.fromCoverageArea },
    { name: t('otherSchools'), value: stats.fromOtherSchools },
    { name: t('newOther'), value: stats.totalStudents - (stats.fromCoverageArea + stats.fromOtherSchools) }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('dashOverview')}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t('realtimeStats')}</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('totalStudents')} value={stats.totalStudents} icon={Users} color="bg-blue-500" />
        <StatCard title={t('totalBoys')} value={stats.boysCount} icon={Users} color="bg-green-500" />
        <StatCard title={t('totalGirls')} value={stats.girlsCount} icon={Users} color="bg-pink-500" />
        <StatCard title={t('newAdmissions')} value={stats.newAdmission} icon={UserPlus} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Wise Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('ageDist')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis dataKey="name" fontSize={12} tickMargin={10} stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1F2937' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} name={t('students')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Wise Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('classDist')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" strokeOpacity={0.2} />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" width={90} fontSize={12} stroke="#9CA3AF" />
                <Tooltip contentStyle={{ borderRadius: '8px' }} itemStyle={{ color: '#1F2937' }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} name={t('students')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admission Source Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{t('admSources')}</h3>
          <div className="h-72 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend formatter={(value) => <span className="dark:text-gray-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;