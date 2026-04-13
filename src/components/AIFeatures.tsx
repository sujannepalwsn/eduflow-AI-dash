import { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';
import { cn } from '../lib/utils';

interface AIFeaturesProps {
  role?: string;
}

export default function AIFeatures({ role }: AIFeaturesProps) {
  const [activeTab, setActiveTab] = useState(role === 'parent' ? 'recommendations' : 'grading');

  const tabs = [
    { id: 'grading', label: 'AI Grading', icon: CheckCircle2, roles: ['admin', 'teacher'] },
    { id: 'lesson-plan', label: 'Lesson Assistant', icon: BookOpen, roles: ['admin', 'teacher'] },
    { id: 'recommendations', label: 'Personalized Paths', icon: Sparkles, roles: ['admin', 'parent'] },
    { id: 'early-warning', label: 'Early Warning', icon: AlertCircle, roles: ['admin', 'teacher'] },
  ];

  const filteredTabs = tabs.filter(tab => !role || tab.roles.includes(role));

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI-Powered Tools</h2>
        </div>
        <div className="mt-4 flex space-x-4">
          {filteredTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              )}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'grading' && <AIGrading key="grading" />}
          {activeTab === 'lesson-plan' && <AILessonPlan key="lesson-plan" />}
          {activeTab === 'recommendations' && <AIRecommendations key="recommendations" />}
          {activeTab === 'early-warning' && <AIEarlyWarning key="early-warning" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AIGrading() {
  const [question, setQuestion] = useState('What is the Pythagorean theorem and how is it used?');
  const [answer, setAnswer] = useState('The Pythagorean theorem is a^2 + b^2 = c^2. It helps find the missing side of a right triangle.');
  const [correctAnswer, setCorrectAnswer] = useState('a² + b² = c², where c is the hypotenuse. Used to calculate side lengths in right-angled triangles.');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    setLoading(true);
    const result = await aiService.generateGradingFeedback(question, answer, correctAnswer);
    setFeedback(result || '');
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Question</label>
          <textarea 
            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Correct Answer (Reference)</label>
          <textarea 
            className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Student Answer</label>
        <textarea 
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows={4}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
      </div>
      <button 
        onClick={handleGrade}
        disabled={loading}
        className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
        Generate AI Feedback
      </button>

      {feedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100"
        >
          <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center">
            <BrainCircuit className="h-4 w-4 mr-2" />
            AI Feedback & Analysis
          </h4>
          <div className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
            {feedback}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function AILessonPlan() {
  const [topic, setTopic] = useState('Introduction to Fractions');
  const [content, setContent] = useState('Basic concepts of numerator and denominator, equivalent fractions, and simple addition.');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await aiService.suggestLessonPlan(topic, content);
    setPlan(result || '');
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Lesson Topic</label>
        <input 
          type="text"
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Core Content / Goals</label>
        <textarea 
          className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          rows={4}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What should the students learn?"
        />
      </div>
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <BookOpen className="h-5 w-5 mr-2" />}
        Draft Lesson Plan
      </button>

      {plan && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-lg bg-indigo-50 border border-indigo-100"
        >
          <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Suggested Lesson Plan
          </h4>
          <div className="text-sm text-indigo-800 whitespace-pre-wrap leading-relaxed prose prose-indigo max-w-none">
            {plan}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function AIRecommendations() {
  const recommendations = [
    { id: 1, title: 'Visualizing Fractions with Pizza', type: 'Video', difficulty: 'Easy', match: '98%' },
    { id: 2, title: 'Equivalent Fractions Practice', type: 'Interactive', difficulty: 'Medium', match: '92%' },
    { id: 3, title: 'Word Problems: Sharing Fairly', type: 'Worksheet', difficulty: 'Hard', match: '85%' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Personalized Learning Path</h3>
        <p className="text-blue-100 text-sm">Based on recent performance in "Fractions", we've curated these resources to help you master the topic.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                {item.type === 'Video' ? <Send className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{item.title}</h4>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="text-xs text-gray-500">{item.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{item.difficulty}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-green-600">{item.match} Match</span>
              <p className="text-xs text-gray-400">AI Recommended</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AIEarlyWarning() {
  const alerts = [
    { id: 1, student: 'John Doe', issue: 'High frustration detected in Algebra', risk: 'High', trend: 'Declining' },
    { id: 2, student: 'Jane Smith', issue: 'Inconsistent attendance', risk: 'Medium', trend: 'Stable' },
    { id: 3, student: 'Mike Ross', issue: 'Drop in quiz scores', risk: 'Medium', trend: 'Declining' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Students Requiring Attention</h3>
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">3 Active Alerts</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Insight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alerts.map(alert => (
              <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.student}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold",
                    alert.risk === 'High' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {alert.risk}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                  View Profile
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
