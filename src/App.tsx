import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Shield, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Wallet, 
  Users, 
  BarChart3, 
  Zap,
  MoreVertical,
  Search,
  Bell,
  UserCircle,
  Megaphone,
  TrendingUp,
  Target,
  Video,
  Briefcase,
  Globe,
  Palette,
  FileText,
  Share2,
  GraduationCap,
  Code
} from 'lucide-react';
import { TIERS, MODULES, ICON_MAP } from './constants';
import { User, Module } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [isGodmode, setIsGodmode] = useState(false);
  const [activeTier, setActiveTier] = useState<number | null>(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminStats, setAdminStats] = useState({ totalRevenue: 0, userCount: 0 });

  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [dashboardView, setDashboardView] = useState<'modules' | 'solutions'>('modules');
  const [gigConnectView, setGigConnectView] = useState<'main' | 'nysc'>('main');
  const [eduStoreView, setEduStoreView] = useState<'login' | 'dashboard'>('login');
  const [modulePrompt, setModulePrompt] = useState('');
  const [moduleOutput, setModuleOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const handleGenerate = async () => {
    if (!activeModule || !modulePrompt) return;
    setIsGenerating(true);
    setModuleOutput('');
    try {
      const { generateModuleResponse } = await import('./services/geminiService');
      const output = await generateModuleResponse(activeModule.name, modulePrompt);
      setModuleOutput(output || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `infinityhub-record-${Date.now()}.webm`;
        a.click();
        setRecordedChunks([]);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setUser(data);
    
    if (email === 'simeonjrpictures123@gmail.com') {
      // Admin check
    }
  };

  const [isHunting, setIsHunting] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const handleHuntLeads = async () => {
    setIsHunting(true);
    try {
      const res = await fetch('/api/autopilot/hunt', { method: 'POST' });
      const data = await res.json();
      setLeads(data.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setIsHunting(false);
    }
  };

  const toggleGodmode = () => {
    if (user?.email === 'simeonjrpictures123@gmail.com') {
      setIsGodmode(!isGodmode);
      fetchAdminStats();
    }
  };

  const fetchAdminStats = async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setAdminStats(data);
  };

  const [nyscTasks, setNyscTasks] = useState<any[]>([]);

  const fetchNyscTasks = async () => {
    const res = await fetch('/api/nysc/tasks');
    const data = await res.json();
    setNyscTasks(data);
  };

  useEffect(() => {
    if (activeModule?.id === 'gig-connect') {
      fetchNyscTasks();
    }
  }, [activeModule]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">InfinityHub</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
              <a href="#platform" className="hover:text-white transition-colors">Platform</a>
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-white transition-colors py-8">
                  Portals <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 w-64 bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="space-y-1">
                    <button 
                      onClick={() => {
                        setEmail('demo@infinityhub.ai');
                        setTimeout(() => {
                          const nyscModule = MODULES.find(m => m.id === 'gig-connect');
                          if (nyscModule) {
                            setActiveModule(nyscModule);
                            setGigConnectView('nysc');
                          }
                        }, 100);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all"
                    >
                      <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-500">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">NYSC Portal</p>
                        <p className="text-[10px] text-white/40">For Corpers & Staff</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => {
                        setEmail('demo@infinityhub.ai');
                        setTimeout(() => {
                          const eduModule = MODULES.find(m => m.id === 'edu-store');
                          if (eduModule) setActiveModule(eduModule);
                        }, 100);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all"
                    >
                      <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-500">
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">EduStore</p>
                        <p className="text-[10px] text-white/40">Academic Marketplace</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => {
                        setEmail('demo@infinityhub.ai');
                        setTimeout(() => {
                          const gigModule = MODULES.find(m => m.id === 'gig-connect');
                          if (gigModule) setActiveModule(gigModule);
                        }, 100);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-all"
                    >
                      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">GigConnect</p>
                        <p className="text-[10px] text-white/40">Jobs & Opportunities</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setEmail('demo@infinityhub.ai')} className="text-sm font-medium text-white/60 hover:text-white transition-colors">Sign In</button>
              <button onClick={() => setEmail('demo@infinityhub.ai')} className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all">Get Started</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">Introducing InfinityHub v1.0</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8"
            >
              Build <span className="text-gradient">Anything</span><br />
              Ship <span className="text-white/40">Everywhere</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              The ultimate multi-tier SaaS ecosystem for creators, developers, and enterprises. 
              Automate your workflow, find clients, and scale revenue with AI-powered speed.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <form onSubmit={handleLogin} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
                  required
                />
                <button 
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] whitespace-nowrap"
                >
                  Start Building Free →
                </button>
              </form>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12"
            >
              {[
                { label: 'Apps Built', value: '50K+' },
                { label: 'Users Served', value: '1M+' },
                { label: 'Countries', value: '150+' },
                { label: 'Rating', value: '4.9★' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="platform" className="max-w-7xl mx-auto px-8 py-32">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight mb-4">Everything You Need to <span className="text-indigo-400">Ship Fast</span></h2>
            <p className="text-white/50 text-lg">From idea to production in minutes. Build any type of application with AI assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MODULES.slice(0, 6).map((module, i) => {
              const Icon = ICON_MAP[module.icon] || Zap;
              return (
                <div 
                  key={i} 
                  onClick={() => setEmail('demo@infinityhub.ai')}
                  className="group p-8 bg-[#111] border border-white/5 rounded-[32px] hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
                  <p className="text-white/40 leading-relaxed">{module.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight mb-4">Tailored <span className="text-indigo-400">Solutions</span></h2>
            <p className="text-white/50 text-lg">Industry-specific environments designed for maximum impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'GigConnect', desc: 'Freelance & Job Marketplace', icon: Briefcase, color: 'text-blue-400' },
              { name: 'GlobalNews', desc: 'Automated News Network', icon: Globe, color: 'text-emerald-400' },
              { name: 'Autolife', desc: 'YouTube Automation', icon: Video, color: 'text-red-400' },
              { name: 'Design Studio', desc: 'Product & Visual Design', icon: Palette, color: 'text-purple-400' },
            ].map((sol, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setEmail('demo@infinityhub.ai');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${sol.color}`}>
                  <sol.icon size={24} />
                </div>
                <h4 className="text-lg font-bold mb-2">{sol.name}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marketing AI Section */}
        <section className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-600/20 blur-3xl rounded-full" />
              <div className="relative bg-[#111] border border-white/10 rounded-[40px] p-12 overflow-hidden">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/40">
                    <Megaphone size={32} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Marketing AI</h4>
                    <p className="text-emerald-400 text-sm font-bold">Active & Learning</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {[
                    { name: 'Facebook', icon: 'Share2', color: 'bg-blue-600' },
                    { name: 'Instagram', icon: 'Palette', color: 'bg-pink-600' },
                    { name: 'X (Twitter)', icon: 'Zap', color: 'bg-white text-black' },
                    { name: 'LinkedIn', icon: 'Briefcase', color: 'bg-blue-700' },
                  ].map((social, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className={`w-8 h-8 ${social.color} rounded-lg flex items-center justify-center`}>
                        <Zap size={14} />
                      </div>
                      <span className="text-sm font-bold">{social.name}</span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-emerald-400" />
                    <span className="text-xl font-bold text-emerald-400">+284% Engagement</span>
                  </div>
                  <Zap size={20} className="text-emerald-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-600/20 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">AI Marketing Agent</span>
              </div>
              <h2 className="text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                Let AI <span className="text-gradient">Market</span> For You
              </h2>
              <p className="text-xl text-white/50 mb-10 leading-relaxed">
                Connect your social media accounts and watch our AI agent create content, 
                schedule posts, engage with your audience, and grow your app's presence automatically.
              </p>
              <ul className="space-y-4 mb-12">
                {[
                  'Automated content creation & scheduling',
                  'Smart audience targeting & engagement',
                  'Performance analytics & optimization',
                  'Multi-platform campaign management'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Zap size={10} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setEmail('demo@infinityhub.ai')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
              >
                Connect Your Accounts
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight mb-4">Simple, Transparent <span className="text-indigo-400">Pricing</span></h2>
            <p className="text-white/50 text-lg">Start free, upgrade when you're ready. No hidden fees, cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 'Free', desc: 'Perfect for trying out the platform', features: ['3 projects', 'Web deployment', 'Basic AI assistance', 'Community support'] },
              { name: 'Pro', price: '$29', desc: 'For serious creators and indie developers', features: ['Unlimited projects', 'iOS & Android publishing', 'Advanced AI features', 'Priority support', '50GB storage', 'Custom domains'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For teams and organizations', features: ['Everything in Pro', 'Unlimited team members', 'SSO & advanced security', 'Dedicated support', 'Unlimited storage', 'SLA guarantee'] },
            ].map((plan, i) => (
              <div key={i} className={`relative p-10 bg-[#111] border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-white/5'} rounded-[40px] flex flex-col`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  {plan.price !== 'Custom' && plan.price !== 'Free' && <span className="text-white/40 font-bold">/month</span>}
                </div>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">{plan.desc}</p>
                <div className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-white/80">
                      <Zap size={14} className="text-indigo-400" />
                      {feat}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setEmail('demo@infinityhub.ai')}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap size={18} />
                </div>
                <span className="font-bold text-xl tracking-tight">InfinityHub</span>
              </div>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                The ultimate multi-tier SaaS ecosystem for creators, developers, and enterprises. 
                Build, ship, and market your apps with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/30">Product</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/30">Resources</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/30">Company</h4>
              <ul className="space-y-4 text-sm text-white/50">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setModuleOutput("Loading About Us..."); }} className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setModuleOutput("Loading Privacy Policy..."); }} className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setModuleOutput("Loading Terms of Service..."); }} className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setModuleOutput("Loading Contact Information..."); }} className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-white/30">© 2026 InfinityHub AI. All rights reserved.</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Built and Developed by Afolabi Oluwadamilare Simeon</p>
            </div>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((social, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">{social}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div 
            className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer"
            onDoubleClick={toggleGodmode}
          >
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">InfinityHub</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setDashboardView('modules')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${dashboardView === 'modules' ? 'bg-white/5 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} className={dashboardView === 'modules' ? 'text-indigo-400' : ''} />
            Dashboard
          </button>

          <button 
            onClick={() => setDashboardView('solutions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${dashboardView === 'solutions' ? 'bg-white/5 text-white font-medium' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Globe size={18} className={dashboardView === 'solutions' ? 'text-indigo-400' : ''} />
            Solutions
          </button>
          
          <button 
            onClick={() => {
              const nyscModule = MODULES.find(m => m.id === 'gig-connect');
              if (nyscModule) {
                setActiveModule(nyscModule);
                setGigConnectView('nysc');
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeModule?.id === 'gig-connect' && gigConnectView === 'nysc' ? 'bg-emerald-600/10 text-emerald-400 font-medium' : 'text-white/60 hover:bg-white/5'}`}
          >
            <Users size={18} className={activeModule?.id === 'gig-connect' && gigConnectView === 'nysc' ? 'text-emerald-400' : ''} />
            NYSC Portal
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Tiers</p>
            {TIERS.map(tier => (
              <button 
                key={tier.id}
                onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTier === tier.id ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-white/5 text-white/60'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{tier.name}</span>
                </div>
                {activeTier === tier.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">Extras</p>
            {MODULES.filter(m => m.tier === 0).map(module => {
              const Icon = ICON_MAP[module.icon] || LayoutDashboard;
              return (
                <button 
                  key={module.id} 
                  onClick={() => setActiveModule(module)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeModule?.id === module.id ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-white/5 text-white/60'}`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{module.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {isGodmode && (
          <div className="p-4 m-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Shield size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Godmode Active</span>
            </div>
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-all"
            >
              Open Admin Panel
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email.split('@')[0]}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Tier {user.tier}</p>
            </div>
            <button onClick={() => setUser(null)} className="text-white/30 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-bottom border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-96">
            <Search size={16} className="text-white/30" />
            <input type="text" placeholder="Search modules, tools, docs..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <Wallet size={14} />
              <span className="text-xs font-bold">${user.balance.toLocaleString()}</span>
            </div>
            <button className="text-white/50 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              <UserCircle size={24} />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {dashboardView === 'modules' ? (
            <>
              {/* Dashboard Hero */}
              <section className="relative p-12 bg-indigo-600 rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-600/20">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/20 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 mb-6">
                    <Zap size={12} className="text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">System Status: Optimal</span>
                  </div>
                  <h2 className="text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                    Scale Your Vision with <br />AI-Powered Autopilot
                  </h2>
                  <p className="text-white/80 text-lg mb-8 leading-relaxed">
                    Your ecosystem is currently monitoring 1,240 data points. 
                    3 new high-intent leads were captured in the last hour.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setModuleOutput("Launching new marketing campaign across all channels...")}
                      className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg"
                    >
                      Launch Campaign
                    </button>
                    <button 
                      onClick={() => setModuleOutput("Generating comprehensive performance reports...")}
                      className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-2xl border border-white/20 hover:bg-indigo-400 transition-all"
                    >
                      View Reports
                    </button>
                  </div>
                </div>
                
                {/* Abstract Visual Element */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
                  <div className="relative w-64 h-64">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 border-2 border-dashed border-white/30 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                        <TrendingUp size={40} className="text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Available Modules</h3>
                    <p className="text-white/40 text-sm">Select a tool to begin your next project</p>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button 
                      onClick={() => setModuleOutput("Dashboard view set to Grid.")}
                      className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold"
                    >
                      Grid View
                    </button>
                    <button 
                      onClick={() => setModuleOutput("Dashboard view set to List.")}
                      className="px-4 py-2 text-white/40 rounded-lg text-xs font-bold hover:text-white transition-colors"
                    >
                      List View
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {MODULES.filter(m => m.tier === activeTier || (activeTier === null && m.tier !== 0)).map((module, idx) => {
                      const Icon = ICON_MAP[module.icon] || LayoutDashboard;
                      return (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative bg-[#111] border border-white/5 rounded-[32px] p-8 hover:bg-[#161616] hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={18} className="text-white/30" />
                          </div>
                          
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                            <Icon size={32} />
                          </div>
                          
                          <h3 className="text-2xl font-bold mb-3">{module.name}</h3>
                          <p className="text-white/40 leading-relaxed mb-8">{module.description}</p>
                          
                          <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${module.status === 'active' ? 'bg-emerald-400' : 'bg-white/20'}`} />
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${module.status === 'active' ? 'text-emerald-400' : 'text-white/20'}`}>
                                {module.status}
                              </span>
                            </div>
                            <button 
                              onClick={() => setActiveModule(module)}
                              className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all"
                            >
                              Launch
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </section>
            </>
          ) : (
            <section className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-5xl font-extrabold tracking-tight mb-4">Specialized <span className="text-gradient">Solutions</span></h2>
                <p className="text-white/40 text-lg">Standalone environments tailored for specific industry needs and high-impact results.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {MODULES.filter(m => m.tier === 0).map(module => {
                  const Icon = ICON_MAP[module.icon] || Zap;
                  return (
                    <div 
                      key={module.id} 
                      onClick={() => setActiveModule(module)}
                      className="group relative p-10 bg-[#111] border border-white/5 rounded-[40px] hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10 group-hover:bg-indigo-600/20 transition-all" />
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                          <Icon size={32} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold mb-1">{module.name}</h3>
                          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Active Solution</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-lg leading-relaxed mb-8">{module.description}</p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModule(module);
                          }}
                          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all"
                        >
                          Launch Environment
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setModuleOutput(`Loading documentation for ${module.name}...`);
                          }}
                          className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                        >
                          View Docs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Module Platform View */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[60] bg-[#050505] flex flex-col"
          >
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <header className="relative z-10 h-20 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-xl bg-[#050505]/50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setActiveModule(null);
                    setModuleOutput('');
                    setModulePrompt('');
                  }}
                  className="p-2 hover:bg-white/5 rounded-full transition-all text-white/50 hover:text-white"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    {React.createElement(ICON_MAP[activeModule.icon] || Zap, { size: 24 })}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{activeModule.name}</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">InfinityHub Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                >
                  <Video size={14} />
                  {isRecording ? 'Recording...' : 'Record Session'}
                </button>
                <div className="h-8 w-px bg-white/5 mx-2" />
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  <Wallet size={14} />
                  <span className="text-xs font-bold">${user.balance.toLocaleString()}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                  {user.email[0].toUpperCase()}
                </div>
              </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
              {activeModule.id === 'gig-connect' ? (
                gigConnectView === 'main' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full flex flex-col items-center"
                  >
                    {/* GigConnect Main Card */}
                    <div className="w-full max-w-2xl bg-white rounded-[40px] p-12 text-center shadow-2xl mb-16 relative overflow-visible">
                      <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 rounded-t-[40px]" />
                      <div className="mx-auto mb-8 flex justify-center">
                        <div className="relative">
                          <svg width="140" height="140" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
                            <rect x="12" y="32" width="72" height="48" rx="12" fill="#2563EB" />
                            <path d="M36 32V24C36 20.6863 38.6863 18 42 18H54C57.3137 18 60 20.6863 60 24V32" stroke="#2563EB" strokeWidth="6" />
                            <circle cx="38" cy="18" r="6" fill="#10B981" />
                            <circle cx="48" cy="18" r="6" fill="#FBBF24" />
                            <circle cx="58" cy="18" r="6" fill="#F97316" />
                            <rect x="44" y="52" width="8" height="8" rx="2" fill="white" opacity="0.9" />
                          </svg>
                        </div>
                      </div>
                      
                      <h1 className="text-6xl font-extrabold text-blue-600 mb-4 tracking-tight">Gig<span className="text-green-500">Connect</span></h1>
                      
                      <p className="text-2xl text-[#4a4a4a] font-bold mb-2">
                        We Rise by Sharing Updates and Gigs — Let Everyone Smile
                      </p>
                      <p className="text-base text-[#8a8a8a] mb-10 max-w-md mx-auto font-medium">
                        A community-driven platform where opportunities are shared to help everyone grow.
                      </p>
                      
                      <div className="space-y-4">
                        <button 
                          onClick={() => setModuleOutput("Searching for high-paying gigs in your area...\n\nFound 12 new opportunities matching your profile.")}
                          className="w-full py-5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 text-xl"
                        >
                          Find Jobs & Gigs
                        </button>
                        <button 
                          onClick={() => setModuleOutput("Opening opportunity posting form...\n\nYour gig will be visible to 5,000+ active freelancers.")}
                          className="w-full py-5 bg-[#64748b] hover:bg-[#475569] text-white font-bold rounded-2xl transition-all text-xl"
                        >
                          Post an Opportunity
                        </button>
                      </div>

                      <div className="mt-12 pt-8 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Built and Developed by Afolabi Oluwadamilare Simeon</p>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-8 text-white tracking-tight">Explore by Category</h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {['Latest Jobs', 'Remote Jobs', 'Quick Gigs', 'Internships', 'International'].map((cat, i) => (
                          <button 
                            key={i} 
                            onClick={() => setModuleOutput(`Filtering GigConnect for: ${cat}...`)}
                            className="px-10 py-4 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* NYSC Portal Link (Internal) */}
                    <div className="mt-20 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] max-w-2xl w-full flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-1">NYSC Career Portal</h4>
                        <p className="text-sm text-white/40">Access your PPA tasks and monthly clearance.</p>
                      </div>
                      <button 
                        onClick={() => setGigConnectView('nysc')}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all"
                      >
                        Enter Portal
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-[#111] border border-white/10 rounded-[40px] p-10">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-4xl font-extrabold tracking-tight">NYSC Career Portal</h2>
                          <button 
                            onClick={() => setGigConnectView('main')}
                            className="text-xs font-bold text-indigo-400 hover:underline"
                          >
                            Back to GigConnect
                          </button>
                        </div>
                        <p className="text-white/40 mb-8">Manage your PPA assignments, track monthly payments, and complete HR-assigned tasks.</p>
                        
                        <div className="space-y-4">
                          {nyscTasks.length > 0 ? nyscTasks.map((task, i) => (
                            <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between hover:border-indigo-500/30 transition-all">
                              <div>
                                <h4 className="font-bold text-lg mb-1">{task.title}</h4>
                                <p className="text-sm text-white/40">{task.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-emerald-400 font-bold mb-2">${task.payment.toLocaleString()}</p>
                                <button 
                                  onClick={() => setModuleOutput(`Task "${task.title}" submitted for review. Payment will be released upon HR approval.`)}
                                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                                >
                                  Complete Task
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                              <Briefcase size={48} className="mx-auto text-white/10 mb-4" />
                              <p className="text-white/20 italic">No active tasks assigned by HR.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-600/20">
                        <h3 className="text-xl font-bold mb-6">HR AI Manager</h3>
                        <div className="p-4 bg-white/10 rounded-2xl mb-6">
                          <p className="text-sm italic">"Hello Corp Member! I've reviewed your recent submissions. Your monthly stipend has been processed."</p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                            <span>Next Payment</span>
                            <span>Mar 1, 2026</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                            <span>Attendance</span>
                            <span>100%</span>
                          </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Developed by Afolabi Oluwadamilare Simeon</p>
                        </div>
                      </div>

                      <div className="bg-[#111] border border-white/10 rounded-[40px] p-8">
                        <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                          <button 
                            onClick={() => setModuleOutput("Leave request form submitted to HR AI Manager.")}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all"
                          >
                            Request Leave
                          </button>
                          <button 
                            onClick={() => setModuleOutput("Generating digital ID card... Download will start shortly.")}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all"
                          >
                            Download ID Card
                          </button>
                          <button 
                            onClick={() => setModuleOutput("Connecting to HR AI Manager live chat...")}
                            className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all"
                          >
                            Contact HR
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ) : activeModule.id === 'global-news' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full min-h-screen bg-white text-black flex flex-col"
                >
                  {/* News Header */}
                  <header className="h-20 border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 bg-white z-20">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl">GN</div>
                        <span className="font-bold text-2xl tracking-tighter">GlobalNews</span>
                      </div>
                      <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-500">
                        {['Politics', 'Business', 'Technology', 'Entertainment', 'Health', 'Sports', 'World'].map(cat => (
                          <a 
                            key={cat} 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setModuleOutput(`Filtering GlobalNews for: ${cat}...`);
                            }}
                            className="hover:text-red-600 transition-colors"
                          >
                            {cat}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="flex items-center gap-6">
                      <Search size={20} className="text-gray-400 cursor-pointer" onClick={() => setModuleOutput("Search bar activated.")} />
                      <button 
                        onClick={() => setModuleOutput("Subscription successful! You are now a GlobalNews Premium member.")}
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                      >
                        Subscribe
                      </button>
                    </div>
                  </header>

                  {/* News Hero */}
                  <main className="flex-1">
                    <div className="relative h-[600px] w-full overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=2000" 
                        alt="News Hero"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full p-16 text-white">
                        <div className="inline-block px-4 py-1 bg-red-600 text-[10px] font-bold uppercase tracking-widest mb-6">Breaking News</div>
                        <h1 className="text-7xl font-extrabold tracking-tighter max-w-4xl mb-8 leading-[0.9]">
                          Global Summit Addresses Climate Crisis and Economic Recovery
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mb-10 leading-relaxed font-medium">
                          World leaders convene to tackle pressing challenges facing humanity, with breakthrough agreements on sustainability and international cooperation.
                        </p>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => setModuleOutput("Loading full story: Global Summit Addresses Climate Crisis...")}
                            className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                          >
                            Read Full Story <ChevronRight size={18} />
                          </button>
                          <button 
                            onClick={() => setModuleOutput("Initializing video player for: Global Summit Highlights...")}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                          >
                            Watch Video
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* News Grid */}
                    <div className="max-w-7xl mx-auto px-8 py-20">
                      <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Latest Updates</h2>
                        <div className="flex gap-2">
                          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="rotate-180" size={20} /></button>
                          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight size={20} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                          { title: 'AI Breakthrough in Fusion Energy', cat: 'Technology', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995', content: 'Scientists have achieved a net energy gain in a fusion reaction, marking a historic milestone in the quest for clean, limitless energy.' },
                          { title: 'Global Markets Rally on Trade Deal', cat: 'Finance', img: 'https://images.unsplash.com/photo-1611974714024-462cd49769d1', content: 'Stock markets worldwide surged today following the announcement of a major trade agreement between the world\'s largest economies.' },
                          { title: 'New Species Discovered in Amazon', cat: 'Science', img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc', content: 'A team of biologists has identified a previously unknown species of colorful tree frog in a remote corner of the Amazon rainforest.' }
                        ].map((item, i) => (
                          <div 
                            key={i} 
                            className="group cursor-pointer"
                            onClick={() => {
                              setModuleOutput(`Reading: ${item.title}\n\n${item.content}`);
                              // Scroll to output if needed or show in a modal
                            }}
                          >
                            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                              <img src={`${item.img}?auto=format&fit=crop&q=80&w=800`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3 block">{item.cat}</span>
                            <h3 className="text-2xl font-bold leading-tight group-hover:text-red-600 transition-colors">{item.title}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  </main>
                </motion.div>
              ) : activeModule.id === 'autolife' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full min-h-screen bg-[#050505] text-white flex flex-col"
                >
                  {/* Autolife Header */}
                  <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                          <Zap size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter uppercase">Autolife</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-white/40">
                        {['Home', 'Automation', 'Pricing', 'Blog'].map(item => (
                          <a 
                            key={item} 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setModuleOutput(`Navigating to Autolife: ${item}...`);
                            }}
                            className={`hover:text-white transition-colors ${item === 'Home' ? 'text-cyan-400' : ''}`}
                          >
                            {item}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <button 
                      onClick={() => setModuleOutput("Autolife onboarding started. Let's build your YouTube empire.")}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                      Get Started
                    </button>
                  </header>

                  <main className="flex-1">
                    {/* Hero Section */}
                    <section className="flex flex-col items-center justify-center py-24 px-8 text-center relative overflow-hidden">
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
                      >
                        <Zap size={14} className="text-cyan-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/60">AI-Powered YouTube Automation</span>
                      </motion.div>

                      <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-8xl font-black tracking-tighter leading-[0.85] mb-8"
                      >
                        Automate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">YouTube Empire</span>
                      </motion.h1>

                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
                      >
                        We Automate Our Lives For The Better. Generate viral content, create stunning videos, and grow your channel on autopilot.
                      </motion.p>

                      {/* Terminal Window */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-3xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-left font-mono mb-16"
                      >
                        <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="ml-4 text-xs text-white/30">autolife-terminal</span>
                        </div>
                        <div className="p-8 space-y-4 text-sm">
                          <div className="flex gap-3">
                            <span className="text-cyan-400">$</span>
                            <span>autolife generate --niche "tech reviews"</span>
                          </div>
                          <div className="text-green-400 flex items-center gap-2">
                            <Zap size={14} /> Analyzing trending topics...
                          </div>
                          <div className="text-green-400 flex items-center gap-2">
                            <Zap size={14} /> Generating viral script...
                          </div>
                          <div className="text-green-400 flex items-center gap-2">
                            <Zap size={14} /> Creating video with AI voiceover...
                          </div>
                          {isGenerating && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-cyan-400 flex items-center gap-2"
                            >
                              <Zap size={14} className="animate-spin" /> Rendering final video assets...
                            </motion.div>
                          )}
                          <div className="flex gap-3 animate-pulse">
                            <span className="text-cyan-400">$</span>
                            <span className="w-2 h-5 bg-white/40" />
                          </div>
                        </div>
                      </motion.div>

                      <div className="flex gap-6">
                        <button 
                          onClick={() => {
                            setIsGenerating(true);
                            setModuleOutput("Autolife Engine Initialized...\n\nTarget Niche: Tech Reviews\nGenerating Script...\nSynthesizing Voiceover...\nAssembling Video Assets...");
                            setTimeout(() => {
                              setIsGenerating(false);
                              setModuleOutput("Automation Complete!\n\nVideo Title: 'The Future of AI in 2026'\nStatus: Scheduled for upload at 6:00 PM.");
                            }, 4000);
                          }}
                          className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-lg"
                        >
                          {isGenerating ? 'Automation Running...' : 'Start Automating Free'}
                        </button>
                        <button 
                          onClick={() => setModuleOutput("Loading Autolife feature walkthrough...")}
                          className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-lg"
                        >
                          See How It Works
                        </button>
                      </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-32 px-8 border-t border-white/5 bg-[#080808]">
                      <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                          <h2 className="text-5xl font-bold tracking-tight mb-4">Powerful Automation Features</h2>
                          <p className="text-white/40 text-lg">Everything you need to scale your YouTube presence with AI</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { title: 'AI Content Ideation', desc: 'Generate viral video ideas tailored to your niche using advanced AI analysis of trending topics.', icon: Target },
                            { title: 'Script Generation', desc: 'Create high-retention scripts with hooks, story beats, and CTAs that keep viewers engaged.', icon: FileText },
                            { title: 'Video Production', desc: 'Automatically generate videos with AI voiceover, dynamic text overlays, and stunning visuals.', icon: Video },
                            { title: 'Auto Publishing', desc: 'Schedule and publish directly to YouTube with optimized titles, descriptions, and tags.', icon: Share2 },
                            { title: 'SEO Optimization', desc: 'Maximize discoverability with AI-powered SEO suggestions for every video.', icon: Search },
                            { title: '24/7 Automation', desc: 'Set it and forget it. Your channel grows even while you sleep.', icon: Zap }
                          ].map((feature, i) => (
                            <div key={i} className="p-10 bg-white/5 border border-white/5 rounded-[40px] hover:border-cyan-500/30 transition-all group">
                              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-all">
                                <feature.icon size={28} className="text-cyan-400 group-hover:text-white" />
                              </div>
                              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                              <p className="text-white/40 leading-relaxed">{feature.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* How it Works */}
                    <section className="py-32 px-8 border-t border-white/5">
                      <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                          <h2 className="text-5xl font-bold tracking-tight mb-4">How AUTOLIFE Works</h2>
                          <p className="text-white/40 text-lg">Three simple steps to automate your content creation</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                          {[
                            { step: '1', title: 'Connect Your Channel', desc: 'Link your YouTube channel and tell us about your niche and content style preferences.' },
                            { step: '2', title: 'AI Creates Content', desc: 'Our AI generates scripts, voiceovers, and complete videos tailored to your audience.' },
                            { step: '3', title: 'Publish & Grow', desc: 'Videos are automatically published with optimized SEO. Watch your channel grow!' }
                          ].map((item, i) => (
                            <div key={i} className="relative text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-xl shadow-cyan-500/20">
                                {item.step}
                              </div>
                              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                              <p className="text-white/40 leading-relaxed">{item.desc}</p>
                              {i < 2 && (
                                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-24 px-8 bg-cyan-600">
                      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                          { label: 'Videos Generated', value: '10K+' },
                          { label: 'Active Creators', value: '500+' },
                          { label: 'Views Generated', value: '50M+' },
                          { label: 'Satisfaction Rate', value: '99%' }
                        ].map((stat, i) => (
                          <div key={i}>
                            <p className="text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</p>
                            <p className="text-cyan-100 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Final CTA */}
                    <section className="py-32 px-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5" />
                      <h2 className="text-6xl font-black tracking-tight mb-8">Ready to Transform Your Channel?</h2>
                      <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12">
                        Join thousands of creators who are already automating their YouTube success. Start your free trial today.
                      </p>
                      <button 
                        onClick={() => setModuleOutput("Autolife registration flow started.")}
                        className="px-12 py-6 bg-white text-black font-black rounded-2xl hover:bg-cyan-50 transition-all text-xl shadow-2xl"
                      >
                        Get Started Free
                      </button>
                    </section>
                  </main>

                  {/* Autolife Footer */}
                  <footer className="py-20 px-8 border-t border-white/5 bg-[#050505]">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                      <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
                            <Zap size={18} />
                          </div>
                          <span className="font-bold text-xl tracking-tight uppercase">Autolife</span>
                        </div>
                        <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                          We Automate Our Lives For The Better. The ultimate YouTube automation platform powered by AI to help creators scale their channels effortlessly.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/30">Product</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                          <li><a href="#" className="hover:text-white transition-colors">Automation</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/30">Legal</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                          <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 text-center">
                      <p className="text-xs text-white/30 mb-2">© 2026 AUTOLIFE. All rights reserved.</p>
                      <p className="text-sm font-black text-cyan-400 uppercase tracking-[0.3em]">DEVELOPED AND LEAD ARCHITECTED BY AFOLABI OLUWADAMILARE SIMEON</p>
                    </div>
                  </footer>
                </motion.div>
              ) : activeModule.id === 'global-boost' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col"
                >
                  {/* GlobalBoost Header */}
                  <header className="h-20 border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">GB</div>
                        <span className="font-bold text-2xl tracking-tighter">GlobalBoost</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                        {['Features', 'Pricing', 'Dashboard', 'About'].map(item => (
                          <a 
                            key={item} 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setModuleOutput(`Navigating to GlobalBoost: ${item}...`);
                            }}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {item}
                          </a>
                        ))}
                      </nav>
                    </div>
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setModuleOutput("Sign-in modal opened.")}
                        className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => setModuleOutput("GlobalBoost onboarding started. Let's maximize your ROI.")}
                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                      >
                        Get Started
                      </button>
                    </div>
                  </header>

                  <main className="flex-1 flex flex-col lg:flex-row items-center gap-20 max-w-7xl mx-auto px-8 py-20">
                    <div className="flex-1 text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-10">
                        <Zap size={14} className="text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Powered by AI</span>
                      </div>

                      <h1 className="text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                        <span className="text-blue-600">GlobalBoost</span> <br />
                        Marketing for <br />
                        Everyone
                      </h1>

                      <p className="text-2xl text-gray-500 max-w-xl mb-6 leading-relaxed font-medium">
                        <span className="font-bold text-gray-900">Stop wasting time on social media.</span> Our AI creates, posts, and optimizes campaigns across all platforms 24/7. You set the budget, we deliver the results.
                      </p>

                      <p className="text-xl text-cyan-600 font-bold mb-12">Average clients see 3x ROI in 30 days.</p>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setModuleOutput("GlobalBoost Free Trial started. Your marketing autopilot is now active.")}
                          className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-lg flex items-center gap-2"
                        >
                          Get Started Free <ChevronRight size={20} />
                        </button>
                        <button 
                          onClick={() => setModuleOutput("GlobalBoost Demo video starting... Learn how to 3x your ROI.")}
                          className="px-10 py-5 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all text-lg"
                        >
                          Watch Demo
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
                      <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                        <img 
                          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" 
                          alt="Marketing Dashboard"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Abstract Overlay to match image style */}
                        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="relative w-64 h-64">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
                                <Zap size={40} className="text-blue-600" />
                              </div>
                            </div>
                            {/* Social Icons Floating */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600"><TrendingUp size={20} /></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600"><Megaphone size={20} /></div>
                            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600"><Target size={20} /></div>
                            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600"><BarChart3 size={20} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </motion.div>
              ) : activeModule.id === 'edu-academy' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col"
                >
                  {/* Education Header */}
                  <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-12">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                          <GraduationCap size={24} className="text-white" />
                        </div>
                        <span className="font-bold text-2xl tracking-tighter uppercase">Infinity Academy</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-white/40">
                        {['Courses', 'Mentorship', 'Career', 'NYSC'].map(item => (
                          <a key={item} href="#" onClick={(e) => { e.preventDefault(); setModuleOutput(`Navigating to Academy: ${item}...`); }} className="hover:text-white transition-colors">{item}</a>
                        ))}
                      </nav>
                    </div>
                    <button onClick={() => setModuleOutput("Academy enrollment portal opened.")} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all">Enroll Now</button>
                  </header>

                  <main className="flex-1 p-12">
                    <div className="max-w-7xl mx-auto">
                      <div className="text-center mb-16">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 mb-6"
                        >
                          <Zap size={14} className="text-indigo-400" />
                          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Accredited Hybrid Learning</span>
                        </motion.div>
                        <h1 className="text-7xl font-black tracking-tighter mb-6 leading-[0.9]">Hybrid <span className="text-gradient">AI + Human</span> <br /> University</h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">Master the future with our industry-leading courses, expert mentorship, and automated career guidance. Accredited and recognized globally.</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                        {[
                          { label: 'Active Students', value: '45k+' },
                          { label: 'Course Modules', value: '1,200+' },
                          { label: 'Expert Mentors', value: '150+' },
                          { label: 'Job Placements', value: '92%' }
                        ].map((stat, i) => (
                          <div key={i} className="text-center p-8 bg-white/5 border border-white/5 rounded-3xl">
                            <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {[
                          { title: 'AI & Machine Learning', students: '12.4k', icon: Zap, level: 'Advanced' },
                          { title: 'Full-Stack Development', students: '8.2k', icon: Code, level: 'Beginner' },
                          { title: 'Cybersecurity', students: '5.1k', icon: Shield, level: 'Intermediate' },
                          { title: 'Blockchain & Web3', students: '3.9k', icon: Globe, level: 'Advanced' },
                          { title: 'Data Science', students: '6.7k', icon: BarChart3, level: 'Intermediate' },
                          { title: 'UI/UX Design', students: '4.5k', icon: Palette, level: 'Beginner' }
                        ].map((course, i) => (
                          <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-indigo-500/50 transition-all group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                              <span className="text-[10px] font-bold px-3 py-1 bg-white/5 rounded-full text-white/40 uppercase tracking-widest">{course.level}</span>
                            </div>
                            <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all">
                              <course.icon size={28} className="text-indigo-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                            <p className="text-sm text-white/40 mb-6">{course.students} students enrolled</p>
                            <button 
                              onClick={() => setModuleOutput(`Loading curriculum for ${course.title}...\n\nModule 1: Introduction\nModule 2: Core Concepts\nModule 3: Advanced Applications\nModule 4: Final Project`)} 
                              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all"
                            >
                              View Curriculum
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Tiers Section */}
                      <div className="mb-20">
                        <div className="text-center mb-12">
                          <h2 className="text-4xl font-bold tracking-tight mb-4">Education Packages</h2>
                          <p className="text-white/40">Choose the path that fits your career goals</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { name: 'Standard', price: 'Free', features: ['Access to basic courses', 'Community support', 'Public projects access'] },
                            { name: 'VIP', price: '₦25k/mo', features: ['All courses access', '1-on-1 Mentorship', 'Plagiarism checks', 'Career guidance'], popular: true },
                            { name: 'VVIP', price: '₦75k/mo', features: ['Priority mentorship', 'Internship placement', 'Final year project writing', 'Lifetime access'] }
                          ].map((pkg, i) => (
                            <div key={i} className={`p-10 rounded-[40px] border flex flex-col ${pkg.popular ? 'bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/20' : 'bg-white/5 border-white/5'}`}>
                              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                              <p className="text-4xl font-black mb-8">{pkg.price}</p>
                              <ul className="space-y-4 mb-10 flex-1">
                                {pkg.features.map((feat, j) => (
                                  <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                                    <Zap size={14} className={pkg.popular ? 'text-white' : 'text-indigo-400'} />
                                    {feat}
                                  </li>
                                ))}
                              </ul>
                              <button 
                                onClick={() => setModuleOutput(`Enrolling in ${pkg.name} package...`)}
                                className={`w-full py-4 rounded-2xl font-bold transition-all ${pkg.popular ? 'bg-white text-indigo-600 hover:bg-white/90' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                              >
                                Select Plan
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        <div className="p-10 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px]">
                          <h3 className="text-3xl font-bold mb-6">Academic Automation</h3>
                          <p className="text-white/60 mb-8 leading-relaxed">Generate assignments, essays, and full final-year projects with verified references in seconds. Our AI ensures academic integrity while saving you hundreds of hours.</p>
                          <div className="space-y-4">
                            <button onClick={() => setModuleOutput("Initializing Assignment Generator...\n\nPlease enter your topic and academic level.")} className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-white/90 transition-all">Generate Assignment</button>
                            <button onClick={() => setModuleOutput("Starting Final Year Project Builder...\n\nStep 1: Topic Selection\nStep 2: Literature Review\nStep 3: Methodology\nStep 4: Data Analysis")} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all">Start Project Builder</button>
                          </div>
                        </div>
                        <div className="p-10 bg-white/5 border border-white/5 rounded-[40px]">
                          <h3 className="text-3xl font-bold mb-6">VIP Mentorship</h3>
                          <p className="text-white/60 mb-8 leading-relaxed">Get 1-on-1 guidance from industry leaders, plagiarism checks, and dedicated career coaching to ensure you land your dream job.</p>
                          <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                            <div>
                              <p className="font-bold">Simeon Afolabi</p>
                              <p className="text-xs text-white/40">Lead Architect & Mentor</p>
                            </div>
                            <span className="ml-auto px-3 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] font-bold rounded-full">Online</span>
                          </div>
                          <button onClick={() => setModuleOutput("Connecting to VIP Mentor Live Chat...\n\nWaiting for mentor to join...")} className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">Book Session</button>
                        </div>
                      </div>

                      {/* Career Portal Section */}
                      <div className="p-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[50px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                          <Briefcase size={200} />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                          <h2 className="text-5xl font-black tracking-tight mb-6">Career Opportunities</h2>
                          <p className="text-xl text-white/80 mb-10 leading-relaxed">We don't just teach you; we get you hired. Access exclusive job listings, internships, and our automated CV builder.</p>
                          <div className="flex flex-wrap gap-4">
                            <button 
                              onClick={() => {
                                const nyscModule = MODULES.find(m => m.id === 'gig-connect');
                                if (nyscModule) {
                                  setActiveModule(nyscModule);
                                  setGigConnectView('nysc');
                                }
                              }}
                              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-white/90 transition-all"
                            >
                              Access NYSC Portal
                            </button>
                            <button 
                              onClick={() => setModuleOutput("Loading Career Marketplace...\n\nFound 1,240 active job listings matching your profile.")}
                              className="px-8 py-4 bg-black/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl hover:bg-black/30 transition-all"
                            >
                              Browse Jobs
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-20 pt-12 border-t border-white/5 text-center">
                      <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">DEVELOPED BY AFOLABI OLUWADAMILARE SIMEON</p>
                    </div>
                  </main>
                </motion.div>
              ) : activeModule.id === 'edu-store' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`w-full min-h-screen flex flex-col ${eduStoreView === 'login' ? 'bg-[#0f172a] items-center justify-center' : 'bg-[#f8fafc] text-[#0f172a]'}`}
                >
                  {eduStoreView === 'login' ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl text-center"
                    >
                      <div className="w-16 h-16 bg-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <GraduationCap size={32} className="text-white" />
                      </div>
                      <h2 className="text-4xl font-black text-[#0f172a] mb-2 tracking-tighter">EduStore</h2>
                      <p className="text-sm text-gray-500 mb-10 font-medium">Nigerian Academic Marketplace</p>
                      
                      <div className="space-y-4 mb-8">
                        <input 
                          type="email" 
                          placeholder="Email Address"
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#059669] transition-all"
                        />
                        <input 
                          type="password" 
                          placeholder="Password"
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-[#059669] transition-all"
                        />
                      </div>

                      <button 
                        onClick={() => setEduStoreView('dashboard')}
                        className="w-full py-5 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-lg mb-8"
                      >
                        Sign In
                      </button>

                      <p className="text-sm text-gray-500">
                        Need an account? <button className="text-[#059669] font-bold hover:underline">Sign Up</button>
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* EduStore Header */}
                      <header className="h-20 border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                        <div className="flex items-center gap-12">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#059669] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <GraduationCap size={24} className="text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tighter text-[#0f172a]">EduStore</span>
                          </div>
                          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                            {['Marketplace', 'AI Assistant', 'My Projects'].map(item => (
                              <a key={item} href="#" onClick={(e) => { e.preventDefault(); setModuleOutput(`EduStore: Navigating to ${item}...`); }} className="hover:text-[#059669] transition-colors">{item}</a>
                            ))}
                          </nav>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet Balance</p>
                            <p className="text-sm font-black text-[#0f172a]">₦1,000</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold text-xs">
                            {user.email[0].toUpperCase()}{user.email[1].toUpperCase()}
                          </div>
                        </div>
                      </header>

                      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                        {/* Hero Banner */}
                        <div className="relative h-[500px] rounded-[60px] overflow-hidden mb-16 shadow-2xl group">
                          <img 
                            src="https://images.unsplash.com/photo-1523050853064-8035a983e5db?auto=format&fit=crop&q=80&w=2000" 
                            alt="EduStore Hero"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-center p-20 text-white">
                            <h1 className="text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                              Zero Stress. <br />
                              <span className="text-[#10b981]">A-Grade Results.</span>
                            </h1>
                            <p className="text-xl text-white/70 max-w-xl mb-12 leading-relaxed font-medium">
                              Get your complete final year project written by our advanced Academic AI. Undetectable, original, and following Nigerian standards.
                            </p>
                            <div className="flex gap-4">
                              <button 
                                onClick={() => setModuleOutput("Initializing Academic AI Writer... Please provide your project topic.")}
                                className="px-10 py-5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-3xl transition-all shadow-xl shadow-emerald-500/20 text-lg"
                              >
                                Start Writing Now
                              </button>
                              <button 
                                onClick={() => setModuleOutput("Loading Project Marketplace...")}
                                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-3xl hover:bg-white/20 transition-all text-lg"
                              >
                                Marketplace
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Featured Projects */}
                        <div className="mb-20">
                          <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black tracking-tighter">Featured Projects</h2>
                            <button className="text-[#059669] font-bold text-sm hover:underline">View All Marketplace</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                              { title: 'AI in Nigerian Agriculture', dept: 'Computer Science', price: '₦15,000' },
                              { title: 'Impact of Fintech on Banking', dept: 'Economics', price: '₦12,500' },
                              { title: 'Modern Architecture in Lagos', dept: 'Architecture', price: '₦20,000' }
                            ].map((proj, i) => (
                              <div key={i} className="bg-white border border-gray-100 rounded-[40px] p-8 hover:shadow-xl transition-all group cursor-pointer">
                                <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 overflow-hidden">
                                  <img src={`https://picsum.photos/seed/${i+10}/800/450`} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest mb-2 block">{proj.dept}</span>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-[#059669] transition-colors">{proj.title}</h3>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                  <span className="text-lg font-black">{proj.price}</span>
                                  <button onClick={() => setModuleOutput(`Purchasing project: ${proj.title}...`)} className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-[#059669] transition-all">Buy Now</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </main>

                      <footer className="py-12 px-8 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400 mb-2">© 2026 EduStore Academic Marketplace. All rights reserved.</p>
                        <p className="text-[10px] font-bold text-[#059669] uppercase tracking-[0.3em]">DEVELOPED BY AFOLABI OLUWADAMILARE SIMEON</p>
                      </footer>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-4xl w-full text-center"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-600/20 mb-8">
                    <Zap size={14} className="text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">AI-Powered {activeModule.name}</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-6">
                    Hi <span className="text-gradient">{user.email.split('@')[0]}</span>,<br />
                    what will you like to build?
                  </h1>
                  
                  <p className="text-xl text-white/40 mb-12 max-w-2xl mx-auto">
                    Describe your vision and our AI will handle the rest. From architecture to deployment, we've got you covered.
                  </p>

                  <div className="relative group max-w-3xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative bg-[#111] border border-white/10 rounded-[32px] p-2 flex items-center gap-2">
                      <input 
                        type="text" 
                        value={modulePrompt}
                        onChange={(e) => setModulePrompt(e.target.value)}
                        placeholder={`I want to build a ${activeModule.name.toLowerCase()} for...`}
                        className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      />
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                      >
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </div>

                  {moduleOutput && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[32px] text-left max-w-4xl mx-auto overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-widest text-white/40">AI Generated Output</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setModuleOutput(`Exporting ${activeModule.name} project files...\n\nGenerating ZIP archive with all source code and assets.\nDownload will start automatically in 5 seconds.`)}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-500 transition-all"
                          >
                            Export Project
                          </button>
                        </div>
                      </div>
                      <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono bg-black/40 p-6 rounded-2xl border border-white/5 max-h-[400px] overflow-y-auto">
                        {moduleOutput}
                      </pre>
                    </motion.div>
                  )}

                  <div className="mt-12 flex flex-wrap justify-center gap-3">
                    {['E-commerce store', 'Portfolio site', 'SaaS Dashboard', 'Mobile Game'].map((suggestion, i) => (
                      <button 
                        key={i} 
                        onClick={() => setModulePrompt(suggestion)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-indigo-600/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Godmode Control Center</h2>
                    <p className="text-white/40 text-sm">Admin: simeonjrpictures123@gmail.com</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAdminPanel(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    {/* Stats Grid - Moved to Godmode */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Active Projects', value: '12', icon: LayoutDashboard, color: 'text-blue-400' },
                        { label: 'Total Revenue', value: '$45,280', icon: Wallet, color: 'text-emerald-400' },
                        { label: 'New Leads', value: '84', icon: Users, color: 'text-purple-400' },
                        { label: 'Conversion Rate', value: '3.2%', icon: BarChart3, color: 'text-orange-400' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                              <stat.icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Last 30 Days</span>
                          </div>
                          <p className="text-3xl font-bold mb-1">{stat.value}</p>
                          <p className="text-xs text-white/40">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Simulated Balance</p>
                        <p className="text-4xl font-bold text-indigo-400">$1,240,500.00</p>
                      </div>
                      <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Platform Revenue</p>
                        <p className="text-4xl font-bold text-emerald-400">${adminStats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>

                  <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Target size={18} className="text-indigo-400" />
                        Lead Hunting Results
                      </h3>
                      <button 
                        onClick={handleHuntLeads}
                        disabled={isHunting}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                      >
                        {isHunting ? 'Hunting...' : 'Start Hunt'}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {leads.length > 0 ? leads.map((lead, i) => (
                        <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm">{lead.name}</p>
                            <p className="text-xs text-white/30">Source: {lead.source}</p>
                          </div>
                          <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] font-bold rounded-md border border-emerald-400/20">
                            {lead.interest} Interest
                          </span>
                        </div>
                      )) : (
                        <p className="text-center py-8 text-white/20 text-sm italic">No active leads. Start a hunt to find clients.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Zap size={18} className="text-indigo-400" />
                      Autopilot Systems
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Client Hunting Engine', status: 'Running', desc: 'Finding B2B leads on LinkedIn/Twitter' },
                        { name: 'Auto-Promotion Bot', status: 'Active', desc: 'Posting to Social Media & Blogs' },
                        { name: 'Self-Updating Core', status: 'Standby', desc: 'Monitoring version control' },
                        { name: 'Revenue Trigger', status: 'Armed', desc: 'Auto-unlocking Tier 3 at $50k' }
                      ].map((sys, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                          <div>
                            <p className="font-bold text-sm">{sys.name}</p>
                            <p className="text-xs text-white/30">{sys.desc}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{sys.status}</span>
                            <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-600/10 rounded-3xl p-6 border border-indigo-500/20">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-indigo-400">AI Staff (Godmode)</h3>
                    <div className="space-y-4">
                      {[
                        { role: 'COO', name: 'AI Manager', status: 'Optimal' },
                        { role: 'HR', name: 'AI Recruiter', status: 'Screening' },
                        { role: 'CFO', name: 'AI Accountant', status: 'Auditing' },
                        { role: 'Legal', name: 'AI Lawyer', status: 'Reviewing' },
                        { role: 'Security', name: 'AI CyberTeam', status: 'Monitoring' },
                        { role: 'Dev', name: 'AI Architect', status: 'Scaling' }
                      ].map((staff, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-bold">
                              {staff.role}
                            </div>
                            <div>
                              <p className="text-xs font-bold">{staff.name}</p>
                              <p className="text-[10px] text-white/30">{staff.status}</p>
                            </div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setModuleOutput("Opening AI Staff management portal. You can now reassign roles or upgrade staff intelligence.")}
                      className="w-full mt-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-all"
                    >
                      Manage AI Staff
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-white/30">Bank Payouts</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase mb-1">Connected Account</p>
                        <p className="text-sm font-bold">GTBank **** 4291</p>
                      </div>
                      <button 
                        onClick={() => setModuleOutput("Withdrawal request of $1,240,500.00 sent to GTBank. Processing time: 2-4 hours.")}
                        className="w-full py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-all"
                      >
                        Withdraw Funds
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-white/30">Live Autopilot Logs</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {[
                        'Found 5 leads for TechCorp',
                        'Published blog: "AI Trends 2026"',
                        'Affiliate sale: $45.00 commission',
                        'User "John" unlocked Tier 2',
                        'NYSC Task #42 completed'
                      ].map((log, i) => (
                        <div key={i} className="text-[10px] text-white/40 font-mono border-l border-indigo-500/30 pl-2 py-1">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-white/30">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full py-2 text-left px-4 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all">Reset All Balances</button>
                      <button className="w-full py-2 text-left px-4 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all">Force Tier Unlock</button>
                      <button className="w-full py-2 text-left px-4 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all">Export Revenue Logs</button>
                      <button className="w-full py-2 text-left px-4 bg-red-500/10 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-all">Maintenance Mode</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
