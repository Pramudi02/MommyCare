import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Baby, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Calendar,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RefreshCw,
  Filter,
  Search,
  Plus
} from 'lucide-react';

const AIPredictionsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPredictionType, setSelectedPredictionType] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const predictionStats = {
    totalPredictions: 1247,
    accuracyRate: 94.2,
    activePredictions: 89,
    completedPredictions: 1158
  };

  const birthWeightPredictions = [
    { id: 1, patientName: 'Sarah Johnson', gestationalAge: 34, predictedWeight: 2.8, confidence: 92, riskLevel: 'low' },
    { id: 2, patientName: 'Maria Rodriguez', gestationalAge: 36, predictedWeight: 2.4, confidence: 88, riskLevel: 'medium' },
    { id: 3, patientName: 'Aisha Patel', gestationalAge: 32, predictedWeight: 2.2, confidence: 85, riskLevel: 'high' },
    { id: 4, patientName: 'Emma Thompson', gestationalAge: 38, predictedWeight: 3.2, confidence: 95, riskLevel: 'low' }
  ];

  const gdmRiskAssessments = [
    { id: 1, patientName: 'Lisa Chen', age: 32, bmi: 28.5, riskScore: 0.75, riskLevel: 'high', factors: ['Age > 30', 'BMI > 25', 'Family History'] },
    { id: 2, patientName: 'Jennifer Wilson', age: 26, bmi: 23.2, riskScore: 0.32, riskLevel: 'low', factors: ['Normal BMI'] },
    { id: 3, patientName: 'Priya Sharma', age: 35, bmi: 30.1, riskScore: 0.85, riskLevel: 'high', factors: ['Age > 35', 'BMI > 30', 'Previous GDM'] }
  ];

  const performanceMetrics = {
    birthWeight: { accuracy: 92.5, totalPredictions: 678, successRate: 89.2 },
    gdmRisk: { accuracy: 87.3, totalPredictions: 456, successRate: 91.8 },
    overallAccuracy: 90.1
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getRiskBadgeColor = (risk) => {
    switch(risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          <div className="p-3 bg-blue-50 rounded-lg mb-2">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          {trend && (
            <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Predictions Dashboard</h1>
              <p className="text-sm text-gray-600">Advanced maternal health predictions and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'birth-weight', label: 'Birth Weight', icon: Baby },
            { id: 'gdm-risk', label: 'GDM Risk', icon: Activity },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'performance', label: 'Performance', icon: LineChart },
            { id: 'custom', label: 'Custom Predictions', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Predictions"
                value={predictionStats.totalPredictions.toLocaleString()}
                subtitle="This month"
                icon={Brain}
                trend={12.5}
              />
              <StatCard
                title="Overall Accuracy"
                value={`${predictionStats.accuracyRate}%`}
                subtitle="Last 30 days"
                icon={CheckCircle}
                trend={2.3}
              />
              <StatCard
                title="Active Predictions"
                value={predictionStats.activePredictions}
                subtitle="Pending validation"
                icon={Activity}
                trend={-5.2}
              />
              <StatCard
                title="Completed"
                value={predictionStats.completedPredictions.toLocaleString()}
                subtitle="With outcomes"
                icon={TrendingUp}
                trend={8.7}
              />
            </div>

            {/* Recent Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Birth Weight Predictions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Birth Weight Predictions</h3>
                    <Baby className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {birthWeightPredictions.slice(0, 3).map(prediction => (
                      <div key={prediction.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{prediction.patientName}</p>
                          <p className="text-sm text-gray-600">{prediction.gestationalAge} weeks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{prediction.predictedWeight} kg</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{prediction.confidence}% confidence</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(prediction.riskLevel)}`}>
                              {prediction.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* GDM Risk Assessments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent GDM Risk Assessments</h3>
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {gdmRiskAssessments.slice(0, 3).map(assessment => (
                      <div key={assessment.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{assessment.patientName}</p>
                          <p className="text-sm text-gray-600">Age {assessment.age}, BMI {assessment.bmi}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{Math.round(assessment.riskScore * 100)}%</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskBadgeColor(assessment.riskLevel)}`}>
                            {assessment.riskLevel} risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Model Performance Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Model Performance Overview</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                      <Baby className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Birth Weight Model</h4>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{performanceMetrics.birthWeight.accuracy}%</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {performanceMetrics.birthWeight.totalPredictions} predictions
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-3">
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">GDM Risk Model</h4>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{performanceMetrics.gdmRisk.accuracy}%</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {performanceMetrics.gdmRisk.totalPredictions} assessments
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Overall Accuracy</h4>
                    <p className="text-3xl font-bold text-green-600 mt-2">{performanceMetrics.overallAccuracy}%</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Combined performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab contents would be implemented here */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Section
            </h3>
            <p className="text-gray-600">
              This section is under development. Detailed {activeTab.replace('-', ' ')} functionality coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPredictionsDashboard;