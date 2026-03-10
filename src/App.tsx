import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  LayoutDashboard, School, GraduationCap, LogIn, LogOut, 
  Plus, Search, Menu, X, ChevronRight, MapPin, Award,
  ShieldCheck, Clock, AlertCircle, TrendingUp, Users, User,
  FileText, Download, Trash2, ExternalLink,
  Eye, EyeOff, CheckSquare, Square,
  Settings, CheckCircle2, Edit2, Info, ChevronDown, ChevronUp,
  Building2, Briefcase, Image as ImageIcon, Save, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import ImageCropperModal from './components/ImageCropperModal';

const TigerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5"/>
    <path d="M12 2V6M8 3L9.5 6.5M16 3L14.5 6.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 10H5M19 10H22M1 14H4M20 14H23" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8.5" cy="11.5" r="1.5" fill="#78350F"/>
    <circle cx="15.5" cy="11.5" r="1.5" fill="#78350F"/>
    <path d="M12 14.5L10.5 16.5H13.5L12 14.5Z" fill="#78350F"/>
    <path d="M12 16.5C12 16.5 10.5 19 8.5 18.5M12 16.5C12 16.5 13.5 19 15.5 18.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Types
interface SchoolData {
  id: number;
  name: string;
  district: string;
  scout_status: 'ตั้งกองลูกเสือแล้ว' | 'รอประเมิน' | 'ยังไม่ได้ประเมิน';
}

interface TeacherData {
  id: number;
  name: string;
  school_id: number;
  school_name: string;
  district: string;
  qualification: string;
  scout_type?: string;
  certificate_url?: string;
}

interface ExecutiveData {
  id: number;
  name: string;
  position: string;
  qualification: string;
  image_url?: string;
  order_index: number;
}

interface SettingsData {
  org_name: string;
  org_affiliation: string;
  banner_image_url?: string;
  banner_title_th?: string;
  banner_title_en?: string;
  logo_url?: string;
  banner_title_th_size?: number;
  banner_title_th_color?: string;
  banner_title_en_size?: number;
  banner_title_en_color?: string;
  banner_text_position?: string;
}

interface Stats {
  schoolStats: { scout_status: string; count: number }[];
  qualStats: { qualification: string; count: number }[];
  districtStats: { district: string; school_count: number; teacher_count: number }[];
  districtQualStats: any[];
}

interface DocumentData {
  id: number;
  title: string;
  file_url: string;
  file_size: string;
  upload_date: string;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const StatCard: React.FC<{ title: string; value: number | string; icon: any; color: string; subtitle?: string; className?: string; unit?: string }> = ({ title, value, icon: Icon, color, subtitle, className, unit }) => {
  const colorMap: Record<string, { bg: string, iconBg: string, iconText: string }> = {
    'bg-blue-500': { bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
    'bg-emerald-500': { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
    'bg-amber-500': { bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
    'bg-rose-500': { bg: 'bg-rose-50', iconBg: 'bg-rose-100', iconText: 'text-rose-600' },
    'bg-purple-500': { bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
    'bg-pink-500': { bg: 'bg-pink-50', iconBg: 'bg-pink-100', iconText: 'text-pink-600' },
  };

  const theme = colorMap[color] || { bg: 'bg-slate-50', iconBg: 'bg-slate-100', iconText: 'text-slate-600' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all h-full", className)}
    >
      <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out", theme.bg)}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-inner", theme.iconBg, theme.iconText)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-slate-800">{value}</span>
          {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
        </div>
        {subtitle && <p className="text-[10px] text-slate-400 mt-2 font-medium">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

const QualBadge: React.FC<{ qual: string; count: number }> = ({ qual, count }) => {
  const colors: Record<string, string> = {
    'TOTAL': 'bg-purple-600 text-white border-purple-700 shadow-purple-100',
    'BTC': 'bg-blue-100 text-blue-700 border-blue-200',
    'ATC': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'WB': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'ALTC': 'bg-violet-100 text-violet-700 border-violet-200',
    'ALT': 'bg-amber-100 text-amber-700 border-amber-200',
    'LT': 'bg-rose-100 text-rose-700 border-rose-200',
  };
  
  const isTotal = qual === 'TOTAL';
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-2 md:p-3.5 rounded-lg md:rounded-xl border flex flex-col items-center justify-center gap-0.5 md:gap-1.5 transition-all shadow-sm",
        colors[qual] || 'bg-slate-50 text-slate-600 border-slate-100'
      )}
    >
      <span className={cn("text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight", isTotal ? "opacity-90" : "opacity-70")}>
        {isTotal ? 'จำนวนครูทั้งหมด' : qual}
      </span>
      <span className="text-lg md:text-2xl font-black leading-none">{count}</span>
      <span className={cn("text-[8px] md:text-[9px] font-semibold", isTotal ? "opacity-80" : "opacity-60")}>
        {isTotal ? 'คน' : 'จำนวนบุคลากร'}
      </span>
    </motion.div>
  );
};

const districtExecutives = [
  { id: 0, name: 'นายผู้อำนวยการ นามสมมติ', position: 'ผู้อำนวยการ สพป.สุพรรณบุรี เขต 3', qualification: 'L.T.' },
  { id: 1, name: 'นายอำนาจ นามสมมติ', position: 'รอง ผอ.สพป.สุพรรณบุรี เขต 3', qualification: 'A.L.T.C.' },
  { id: 2, name: 'นางสาวสมศรี ใจดี', position: 'รอง ผอ.สพป.สุพรรณบุรี เขต 3', qualification: 'A.L.T.' },
  { id: 3, name: 'นายสมชาย รักชาติ', position: 'ผู้อำนวยการกลุ่มนิเทศฯ', qualification: 'L.T.' },
  { id: 4, name: 'นางสมรักษ์ พิทักษ์', position: 'ผู้อำนวยการกลุ่มส่งเสริมฯ', qualification: 'A.L.T.C.' },
  { id: 5, name: 'นายวิชาญ ชำนาญ', position: 'ศึกษานิเทศก์', qualification: 'W.B.' },
  { id: 6, name: 'นายกิตติพงษ์ จงเจริญ', position: 'ศึกษานิเทศก์', qualification: 'A.L.T.' },
  { id: 7, name: 'นางสาววิไลวรรณ สุขสม', position: 'ผู้อำนวยการกลุ่มบริหารงานบุคคล', qualification: 'W.B.' },
  { id: 8, name: 'นายประเสริฐ เลิศล้ำ', position: 'ผู้อำนวยการกลุ่มนโยบายและแผน', qualification: 'A.L.T.C.' },
  { id: 9, name: 'นางนงนุช สุดสวย', position: 'ผู้อำนวยการกลุ่มการเงินและสินทรัพย์', qualification: 'B.T.C.' },
  { id: 10, name: 'นายธนพล คนขยัน', position: 'ผู้อำนวยการกลุ่มอำนวยการ', qualification: 'W.B.' },
];

const getPositionClasses = (position?: string) => {
  switch (position) {
    case 'top-left': return 'justify-start items-start text-left';
    case 'top-center': return 'justify-start items-center text-center';
    case 'top-right': return 'justify-start items-end text-right';
    case 'center-left': return 'justify-center items-start text-left';
    case 'center-right': return 'justify-center items-end text-right';
    case 'bottom-left': return 'justify-end items-start text-left';
    case 'bottom-center': return 'justify-end items-center text-center';
    case 'bottom-right': return 'justify-end items-end text-right';
    case 'center':
    default: return 'justify-center items-center text-center';
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schools' | 'teachers'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [showAllExecutives, setShowAllExecutives] = useState(false);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', file_url: '', file_size: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  // New Admin States
  const [executives, setExecutives] = useState<ExecutiveData[]>([]);
  const [settings, setSettings] = useState<SettingsData>({ org_name: '', org_affiliation: '' });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState<'schools' | 'teachers' | 'executives' | 'settings'>('schools');
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<ExecutiveData | null>(null);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string;
    aspectRatio: number;
    targetField: 'logo_url' | 'banner_image_url';
  }>({
    isOpen: false,
    imageSrc: '',
    aspectRatio: 1,
    targetField: 'logo_url'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'logo_url' | 'banner_image_url', aspectRatio: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropperModal({
          isOpen: true,
          imageSrc: reader.result?.toString() || '',
          aspectRatio,
          targetField
        });
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setSettings(prev => ({ ...prev, [cropperModal.targetField]: croppedImage }));
    setCropperModal(prev => ({ ...prev, isOpen: false }));
  };

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_user');
    const savedPass = localStorage.getItem('remembered_pass');
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, schoolsRes, teachersRes, docsRes, execsRes, settingsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/schools'),
        fetch('/api/teachers'),
        fetch('/api/documents'),
        fetch('/api/executives'),
        fetch('/api/settings')
      ]);
      
      const statsData = await statsRes.json();
      const schoolsData = await schoolsRes.json();
      const teachersData = await teachersRes.json();
      const docsData = await docsRes.json();
      const execsData = await execsRes.json();
      const settingsData = await settingsRes.json();

      setStats(statsData);
      setSchools(schoolsData);
      setTeachers(teachersData);
      setDocuments(docsData);
      setExecutives(execsData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
      if (res.ok) {
        setSuccessModal({ isOpen: true, message: 'เพิ่มเอกสารสำเร็จ' });
        setShowAddDocModal(false);
        setNewDoc({ title: '', file_url: '', file_size: '' });
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการเพิ่มเอกสาร', 'error');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('ยืนยันการลบเอกสารนี้?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('ลบเอกสารสำเร็จ');
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการลบเอกสาร', 'error');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem('remembered_user', username);
          localStorage.setItem('remembered_pass', password);
        } else {
          localStorage.removeItem('remembered_user');
          localStorage.removeItem('remembered_pass');
        }
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginError('');
        addToast('เข้าสู่ระบบสำเร็จ');
      } else {
        setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      setLoginError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    }
  };

  const handleTeacherDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบข้อมูลบุคลากรนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('ลบข้อมูลบุคลากรสำเร็จ');
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
  };

  const handleExecutiveDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบข้อมูลทำเนียบนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/executives/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('ลบข้อมูลทำเนียบสำเร็จ');
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
    }
  };

  const handleTeacherSave = async (teacher: any) => {
    try {
      const method = teacher.id ? 'PUT' : 'POST';
      const url = teacher.id ? `/api/teachers/${teacher.id}` : '/api/teachers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher)
      });
      if (res.ok) {
        setSuccessModal({ isOpen: true, message: 'บันทึกข้อมูลครูสำเร็จ' });
        setShowTeacherModal(false);
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  const handleExecutiveSave = async (executive: any) => {
    try {
      const method = executive.id ? 'PUT' : 'POST';
      const url = executive.id ? `/api/executives/${executive.id}` : '/api/executives';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(executive)
      });
      if (res.ok) {
        setSuccessModal({ isOpen: true, message: 'บันทึกข้อมูลผู้บังคับบัญชาสำเร็จ' });
        setShowExecutiveModal(false);
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  const handleSettingsSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSuccessModal({ isOpen: true, message: 'บันทึกการตั้งค่าสำเร็จ' });
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า', 'error');
    }
  };

  const handleSchoolStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/schools/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scout_status: status })
      });
      if (res.ok) {
        setSuccessModal({ isOpen: true, message: 'อัปเดตสถานะโรงเรียนสำเร็จ' });
        fetchData();
      }
    } catch (error) {
      addToast('เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'error');
    }
  };

  const filteredSchools = schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(s.district);
    return matchesSearch && matchesDistrict;
  });

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredSchools.length / pageSize);
  const displaySchools = pageSize === 'all' 
    ? filteredSchools 
    : filteredSchools.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistricts, pageSize]);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.school_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allDistricts = Array.from(new Set(schools.map(s => s.district))).sort();

  const qualOrder = ['BTC', 'ATC', 'WB', 'ALTC', 'ALT', 'LT'];
  const qualColors: Record<string, string> = {
    'BTC': '#10b981',
    'ATC': '#f59e0b',
    'WB': '#3b82f6',
    'ALTC': '#6366f1',
    'ALT': '#8b5cf6',
    'LT': '#f43f5e'
  };

  const sortedQualStats = [...(stats?.qualStats || [])].sort((a: any, b: any) => {
    return qualOrder.indexOf(a.qualification) - qualOrder.indexOf(b.qualification);
  });

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between min-h-[5rem] py-3 items-center">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0 overflow-hidden">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <TigerIcon className="text-white w-6 h-6 md:w-8 md:h-8" />
                )}
              </div>
              <div className="min-w-0 py-1">
                <h1 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 leading-normal truncate pb-1">
                  {settings.org_name || 'ศูนย์สารสนเทศลูกเสือ'}
                </h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-semibold leading-normal truncate">
                  {settings.org_affiliation || 'สพป.สุพรรณบุรี เขต 3'}
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center md:gap-4 lg:gap-8">
              <button 
                onClick={() => { setActiveTab('dashboard'); setShowAdminPanel(false); }}
                className={cn(
                  "flex items-center gap-2 font-semibold transition-all duration-300 px-3 py-2 rounded-xl",
                  activeTab === 'dashboard' && !showAdminPanel
                    ? "text-emerald-700 bg-emerald-50" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" /> 
                <span className="hidden lg:inline text-sm">แดชบอร์ด</span>
                <span className="lg:hidden text-xs">แดชบอร์ด</span>
              </button>
              <button 
                onClick={() => { setActiveTab('schools'); setShowAdminPanel(false); }}
                className={cn(
                  "flex items-center gap-2 font-semibold transition-all duration-300 px-3 py-2 rounded-xl",
                  activeTab === 'schools' && !showAdminPanel
                    ? "text-emerald-700 bg-emerald-50" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <School className="w-5 h-5 shrink-0" /> 
                <span className="hidden lg:inline text-sm">ข้อมูลโรงเรียน</span>
                <span className="lg:hidden text-xs">โรงเรียน</span>
              </button>
              <button 
                onClick={() => { setActiveTab('teachers'); setShowAdminPanel(false); }}
                className={cn(
                  "flex items-center gap-2 font-semibold transition-all duration-300 px-3 py-2 rounded-xl",
                  activeTab === 'teachers' && !showAdminPanel
                    ? "text-emerald-700 bg-emerald-50" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <GraduationCap className="w-5 h-5 shrink-0" /> 
                <span className="hidden lg:inline text-sm">ข้อมูลบุคลากร</span>
                <span className="lg:hidden text-xs">บุคลากร</span>
              </button>

              {isLoggedIn && (
                <button 
                  onClick={() => setShowAdminPanel(true)}
                  className={cn(
                    "flex items-center gap-2 font-semibold transition-all duration-300 px-3 py-2 rounded-xl border-l border-slate-200 pl-4",
                    showAdminPanel
                      ? "text-amber-700 bg-amber-50" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Settings className="w-5 h-5 shrink-0" /> 
                  <span className="hidden lg:inline text-sm">จัดการระบบ</span>
                  <span className="lg:hidden text-xs">จัดการ</span>
                </button>
              )}

              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                {isLoggedIn ? (
                  <button 
                    onClick={() => { setIsLoggedIn(false); setShowAdminPanel(false); }}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> <span className="hidden lg:inline">ออกจากระบบ</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4" /> เข้าสู่ระบบ
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-600 font-medium">แดชบอร์ด</button>
              <button onClick={() => { setActiveTab('schools'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-600 font-medium">ข้อมูลโรงเรียน</button>
              <button onClick={() => { setActiveTab('teachers'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-600 font-medium">วุฒิลูกเสือ</button>
              <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-emerald-600 font-bold">เข้าสู่ระบบ</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
          </div>
        ) : showAdminPanel && isLoggedIn ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <Settings className="w-10 h-10 text-amber-500" /> จัดการระบบ
                </h2>
                <p className="text-slate-500 mt-2 text-lg">แผงควบคุมสำหรับผู้ดูแลระบบ</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              {[
                { id: 'schools', label: 'จัดการโรงเรียน', icon: School },
                { id: 'teachers', label: 'จัดการบุคลากร', icon: GraduationCap },
                { id: 'executives', label: 'จัดการทำเนียบ', icon: Users },
                { id: 'settings', label: 'ตั้งค่าหน่วยงาน', icon: Building2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                    adminTab === tab.id 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {adminTab === 'schools' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">รายชื่อโรงเรียนและสถานะ</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">โรงเรียน</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">อำเภอ</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะปัจจุบัน</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {schools.map((school) => (
                        <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{school.name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">อ.{school.district}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5",
                              school.scout_status === 'ตั้งกองลูกเสือแล้ว' ? "bg-emerald-100 text-emerald-700" :
                              school.scout_status === 'รอประเมิน' ? "bg-amber-100 text-amber-700" :
                              "bg-rose-100 text-rose-700"
                            )}>
                              {school.scout_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select 
                              className="text-xs font-bold bg-slate-100 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                              value={school.scout_status}
                              onChange={(e) => handleSchoolStatusUpdate(school.id, e.target.value)}
                            >
                              <option value="ตั้งกองลูกเสือแล้ว">ตั้งกองลูกเสือแล้ว</option>
                              <option value="รอประเมิน">รอประเมิน</option>
                              <option value="ยังไม่ได้ประเมิน">ยังไม่ได้ประเมิน</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'teachers' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">จัดการข้อมูลบุคลากร</h3>
                  <button 
                    onClick={() => { setEditingTeacher({}); setShowTeacherModal(true); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                  >
                    <Plus className="w-4 h-4" /> เพิ่มบุคลากร
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">โรงเรียน</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">วุฒิ</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ประเภท</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{teacher.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{teacher.school_name}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">
                              {teacher.qualification}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{teacher.scout_type}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => { setEditingTeacher(teacher); setShowTeacherModal(true); }}
                              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleTeacherDelete(teacher.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'executives' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">จัดการทำเนียบผู้บังคับบัญชา</h3>
                  <button 
                    onClick={() => { setEditingExecutive({}); setShowExecutiveModal(true); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
                  >
                    <Plus className="w-4 h-4" /> เพิ่มทำเนียบ
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ลำดับ</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ตำแหน่ง</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">วุฒิ</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {executives.map((exec) => (
                        <tr key={exec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500">{exec.order_index}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{exec.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{exec.position}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100">
                              {exec.qualification}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => { setEditingExecutive(exec); setShowExecutiveModal(true); }}
                              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleExecutiveDelete(exec.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'settings' && (
              <div className="max-w-2xl mx-auto w-full">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800">ตั้งค่าหน่วยงาน</h3>
                    <p className="text-slate-500 mt-1">ข้อมูลที่จะแสดงในส่วนหัวและส่วนท้ายของเว็บไซต์</p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">ชื่อหน่วยงาน (ภาษาไทย)</label>
                      <input 
                        type="text" 
                        value={settings.org_name || ''} 
                        onChange={(e) => setSettings({...settings, org_name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="เช่น ศูนย์สารสนเทศลูกเสือ"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">สังกัด / Affiliation</label>
                      <input 
                        type="text" 
                        value={settings.org_affiliation || ''} 
                        onChange={(e) => setSettings({...settings, org_affiliation: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="เช่น สพป.สุพรรณบุรี เขต 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">โลโก้หน่วยงาน (Logo)</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {settings.logo_url ? (
                            <img src={settings.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'logo_url', 1)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                          <p className="text-xs text-slate-500 mt-2">แนะนำรูปภาพอัตราส่วน 1:1 (สี่เหลี่ยมจัตุรัส)</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">รูปภาพแบนเนอร์ (Banner Image)</label>
                      <div className="flex flex-col gap-4">
                        {(settings.banner_image_url || settings.banner_title_th || settings.banner_title_en) && (
                          <div className="w-full aspect-[4/1] min-h-[160px] rounded-[2rem] overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] group bg-[#064e3b]">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20"></div>
                            {settings.banner_image_url && (
                              <>
                                <img src={settings.banner_image_url} alt="Banner Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 shadow-[inset_0_0_60px_30px_rgba(15,23,42,1)] z-10 pointer-events-none"></div>
                                <button
                                  onClick={() => setSettings({...settings, banner_image_url: ''})}
                                  className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 text-white transition-all shadow-lg"
                                  title="ลบรูปภาพแบนเนอร์"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {(settings.banner_title_th || settings.banner_title_en) && (
                              <div className={`absolute inset-0 ${settings.banner_image_url ? 'bg-gradient-to-t from-[#064e3b]/80 via-[#064e3b]/40 to-transparent' : 'bg-transparent'} flex flex-col p-6 md:p-8 z-10 ${getPositionClasses(settings.banner_text_position)}`}>
                                {settings.banner_title_th && (
                                  <div className="flex flex-col max-w-full">
                                    <h1 
                                      className="font-extrabold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight break-words"
                                      style={{ 
                                        fontSize: settings.banner_title_th_size ? `${settings.banner_title_th_size}px` : '36px',
                                        color: settings.banner_title_th_color || '#ffffff'
                                      }}
                                    >
                                      {settings.banner_title_th}
                                    </h1>
                                    {settings.banner_title_en && (
                                      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 rounded-full mt-3 mb-3 shadow-[0_0_15px_rgba(52,211,153,0.6)]"></div>
                                    )}
                                  </div>
                                )}
                                {settings.banner_title_en && (
                                  <h2 
                                    className="font-medium leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 tracking-wide break-words max-w-full"
                                    style={{ 
                                      fontSize: settings.banner_title_en_size ? `${settings.banner_title_en_size}px` : '20px',
                                      color: settings.banner_title_en_color || '#e2e8f0'
                                    }}
                                  >
                                    {settings.banner_title_en}
                                  </h2>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'banner_image_url', 4/1)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                          />
                          <p className="text-xs text-slate-500 mt-2">แนะนำรูปภาพแนวนอนกว้างพิเศษ อัตราส่วน 4:1</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 border-t border-slate-100 pt-6 mt-6">
                      <h4 className="font-bold text-slate-800">ตั้งค่าข้อความแบนเนอร์</h4>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">ตำแหน่งข้อความ</label>
                        <select 
                          value={settings.banner_text_position || 'center'} 
                          onChange={(e) => setSettings({...settings, banner_text_position: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                          <option value="top-left">บน-ซ้าย</option>
                          <option value="top-center">บน-กลาง</option>
                          <option value="top-right">บน-ขวา</option>
                          <option value="center-left">กลาง-ซ้าย</option>
                          <option value="center">ตรงกลาง</option>
                          <option value="center-right">กลาง-ขวา</option>
                          <option value="bottom-left">ล่าง-ซ้าย</option>
                          <option value="bottom-center">ล่าง-กลาง</option>
                          <option value="bottom-right">ล่าง-ขวา</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">ข้อความแบนเนอร์ (ภาษาไทย)</label>
                            <input 
                              type="text" 
                              value={settings.banner_title_th || ''} 
                              onChange={(e) => setSettings({...settings, banner_title_th: e.target.value})}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                              placeholder="เช่น ระบบสารสนเทศลูกเสือ"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex justify-between">
                                <span>ขนาดตัวอักษร</span>
                                <span className="text-emerald-600">{settings.banner_title_th_size || 36}px</span>
                              </label>
                              <input 
                                type="range" 
                                min="16" max="72" 
                                value={settings.banner_title_th_size || 36} 
                                onChange={(e) => setSettings({...settings, banner_title_th_size: parseInt(e.target.value)})}
                                className="w-full accent-emerald-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">สีข้อความ</label>
                              <div className="h-10 w-full overflow-hidden rounded-lg border border-slate-200">
                                <input 
                                  type="color" 
                                  value={settings.banner_title_th_color || '#ffffff'} 
                                  onChange={(e) => setSettings({...settings, banner_title_th_color: e.target.value})}
                                  className="w-full h-16 -mt-2 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">ข้อความแบนเนอร์ (ภาษาอังกฤษ)</label>
                            <input 
                              type="text" 
                              value={settings.banner_title_en || ''} 
                              onChange={(e) => setSettings({...settings, banner_title_en: e.target.value})}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                              placeholder="เช่น Scout Information System"
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex justify-between">
                                <span>ขนาดตัวอักษร</span>
                                <span className="text-emerald-600">{settings.banner_title_en_size || 20}px</span>
                              </label>
                              <input 
                                type="range" 
                                min="12" max="48" 
                                value={settings.banner_title_en_size || 20} 
                                onChange={(e) => setSettings({...settings, banner_title_en_size: parseInt(e.target.value)})}
                                className="w-full accent-emerald-600"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">สีข้อความ</label>
                              <div className="h-10 w-full overflow-hidden rounded-lg border border-slate-200">
                                <input 
                                  type="color" 
                                  value={settings.banner_title_en_color || '#e2e8f0'} 
                                  onChange={(e) => setSettings({...settings, banner_title_en_color: e.target.value})}
                                  className="w-full h-16 -mt-2 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button 
                        onClick={handleSettingsSave}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        <Save className="w-5 h-5" /> บันทึกการตั้งค่า
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6 md:space-y-8">
                {/* Banner Section */}
                {(settings.banner_image_url || settings.banner_title_th || settings.banner_title_en) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] min-h-[200px] md:min-h-[300px] overflow-hidden bg-[#064e3b] -mt-10 mb-2 flex justify-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20"></div>
                    
                    {settings.banner_image_url && (
                      <div className="absolute inset-0 max-w-7xl mx-auto w-full h-full">
                        <img 
                          src={settings.banner_image_url} 
                          alt="Banner" 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Fade edges to blend with background */}
                        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#064e3b] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#064e3b] to-transparent z-10 pointer-events-none"></div>
                      </div>
                    )}
                    {(settings.banner_title_th || settings.banner_title_en) && (
                      <div className={`absolute inset-0 ${settings.banner_image_url ? 'bg-gradient-to-t from-[#064e3b]/80 via-[#064e3b]/40 to-transparent' : 'bg-transparent'} z-10`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full relative">
                          <div className={`absolute inset-0 flex flex-col py-8 md:py-12 px-4 sm:px-6 lg:px-8 ${getPositionClasses(settings.banner_text_position)}`}>
                            {settings.banner_title_th && (
                              <div className="flex flex-col max-w-full">
                                <h1 
                                  className="font-extrabold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight break-words"
                                  style={{ 
                                    fontSize: settings.banner_title_th_size ? `${settings.banner_title_th_size}px` : '36px',
                                    color: settings.banner_title_th_color || '#ffffff'
                                  }}
                                >
                                  {settings.banner_title_th}
                                </h1>
                                {settings.banner_title_en && (
                                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 rounded-full mt-3 mb-3 shadow-[0_0_15px_rgba(52,211,153,0.6)]"></div>
                                )}
                              </div>
                            )}
                            {settings.banner_title_en && (
                              <h2 
                                className="font-medium leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 tracking-wide break-words max-w-full"
                                style={{ 
                                  fontSize: settings.banner_title_en_size ? `${settings.banner_title_en_size}px` : '20px',
                                  color: settings.banner_title_en_color || '#e2e8f0'
                                }}
                              >
                                {settings.banner_title_en}
                              </h2>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">ภาพรวมข้อมูลลูกเสือ</h2>
                    <p className="text-slate-500 mt-2 text-lg">สรุปสถิติการดำเนินงานของโรงเรียนและบุคลากรในสังกัด</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-700">อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}</span>
                  </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="flex flex-col gap-4 lg:gap-6">
                  
                  {/* Top Row: Profile + Stats & Quals */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-4 xl:col-span-3 flex flex-col items-start">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-emerald-900 to-emerald-800 rounded-[2rem] p-1 shadow-xl relative overflow-hidden shrink-0 w-full"
                      >
                        {/* Scout Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fbbf24 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-[30px] p-5 flex flex-col items-center text-center border border-emerald-700/50 relative z-10">
                          <div className="relative mb-3 mt-1">
                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            {/* Conditional Profile Image */}
                            {(() => {
                              const profileName = ""; // Empty string to trigger fallback
                              const profileImage = ""; // Empty string
                              return (
                                <>
                                  {profileName && profileImage ? (
                                    <img 
                                      src={profileImage} 
                                      alt="ผู้อำนวยการลูกเสือ" 
                                      className="w-24 h-24 rounded-full object-cover border-[4px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] relative z-10 transition-transform duration-500 hover:scale-105"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-100 border-[4px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] relative z-10 flex items-center justify-center transition-transform duration-500 hover:scale-105">
                                      <User className="w-12 h-12 text-slate-400" />
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            {/* Tiger Icon removed as requested */}
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 tracking-wide drop-shadow-md">{"ยังไม่ได้ระบุชื่อ"}</h3>
                          <div className="h-0.5 w-10 bg-amber-400 rounded-full mb-3"></div>
                          <div className="flex flex-col gap-1.5 w-full mt-3">
                            <p className="text-emerald-100 font-medium text-[13px] px-3 py-1.5 bg-emerald-950/50 rounded-full border border-emerald-800/50 w-full">
                              ผู้อำนวยการลูกเสือ
                            </p>
                            <p className="text-emerald-100 font-medium text-[13px] px-3 py-1.5 bg-emerald-950/50 rounded-full border border-emerald-800/50 w-full">
                              สพป.สุพรรณบุรี เขต 3
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Right Content Area (Top) */}
                    <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-start space-y-4">
                      {/* Stat Cards */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                          <h3 className="text-2xl font-bold text-slate-800">ข้อมูลโรงเรียนในสังกัด</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                          <StatCard 
                            title="โรงเรียนทั้งหมด" 
                            value={schools.length} 
                            icon={School} 
                            color="bg-blue-500"
                            subtitle="ในสังกัด สพป.สุพรรณบุรี เขต 3"
                            unit="แห่ง"
                          />
                          <StatCard 
                            title="ตั้งกองแล้ว" 
                            value={stats?.schoolStats.find(s => s.scout_status === 'ตั้งกองลูกเสือแล้ว')?.count || 0} 
                            icon={ShieldCheck} 
                            color="bg-emerald-500"
                            subtitle="ดำเนินการเสร็จสิ้น"
                            unit="แห่ง"
                          />
                          <StatCard 
                            title="รอประเมิน" 
                            value={stats?.schoolStats.find(s => s.scout_status === 'รอประเมิน')?.count || 0} 
                            icon={Clock} 
                            color="bg-amber-500"
                            subtitle="อยู่ระหว่างดำเนินการ"
                            unit="แห่ง"
                          />
                          <StatCard 
                            title="ยังไม่ได้จัดตั้งกอง" 
                            value={stats?.schoolStats.find(s => s.scout_status === 'ยังไม่ได้ประเมิน')?.count || 0} 
                            icon={AlertCircle} 
                            color="bg-rose-500"
                            subtitle="ยังไม่ได้ประเมิน"
                            unit="แห่ง"
                          />
                        </div>
                      </div>

                      {/* Qualification Detailed Stats */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-8 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                          <h3 className="text-2xl font-bold text-slate-800">บุคลากรครูผู้มีวุฒิลูกเสือ</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
                          <QualBadge 
                            qual="TOTAL" 
                            count={teachers.length} 
                          />
                          {['BTC', 'ATC', 'WB', 'ALTC', 'ALT', 'LT'].map((q) => (
                            <QualBadge 
                              key={q} 
                              qual={q} 
                              count={stats?.qualStats.find(s => s.qualification === q)?.count || 0} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Executives + Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    {/* Executives Directory Card */}
                    <div className="lg:col-span-4 xl:col-span-3 flex flex-col">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-[2rem] overflow-hidden shadow-lg flex flex-col h-[500px]"
                      >
                        {/* Header Bar */}
                        <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                          <div className="p-1.5 bg-emerald-800 rounded-lg text-amber-400">
                            <Users className="w-5 h-5" />
                          </div>
                          <h3 className="text-base font-bold text-white tracking-wide">ทำเนียบผู้บังคับบัญชา</h3>
                        </div>

                        <div className="p-5 flex flex-col flex-grow min-h-0">
                          <div className="relative overflow-hidden rounded-2xl bg-slate-50/50 border border-slate-100/50 p-2 flex-grow min-h-0">
                            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                            <div className="animate-scroll-up flex flex-col gap-3 pt-2">
                              {[...executives, ...executives].map((exec, idx) => (
                                <div key={`exec-${exec.id}-${idx}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer relative z-20">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform shadow-inner overflow-hidden">
                                    {exec.image_url ? (
                                      <img src={exec.image_url} alt={exec.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <User className="w-8 h-8" />
                                    )}
                                  </div>
                                  <div className="flex-grow min-w-0 flex flex-col items-center gap-1.5 w-full">
                                    <p className="font-bold text-slate-800 text-sm leading-normal group-hover:text-emerald-700 transition-colors break-words w-full">{exec.name}</p>
                                    <p className="text-xs text-slate-500 leading-normal break-words w-full">{exec.position}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-100 shadow-sm">
                                        วุฒิทางลูกเสือ: {exec.qualification}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => setShowAllExecutives(true)}
                            className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-4 py-3 rounded-xl transition-colors border border-emerald-100 shrink-0"
                          >
                            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Charts Section */}
                    <div className="lg:col-span-8 xl:col-span-9">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-card overflow-hidden flex flex-col h-[500px]"
                        >
                          <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                            <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                            <h3 className="text-base font-bold text-white tracking-wide">สถานะการตั้งกองลูกเสือ</h3>
                          </div>
                          <div className="p-8 flex-grow w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats?.schoolStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={8}
                            dataKey="count"
                            nameKey="scout_status"
                          >
                            {stats?.schoolStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card overflow-hidden flex flex-col h-[500px]"
                  >
                    <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                      <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                      <h3 className="text-base font-bold text-white tracking-wide">สถิติวุฒิลูกเสือบุคลากร</h3>
                    </div>
                    <div className="p-8 flex-grow w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sortedQualStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis dataKey="qualification" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={50} />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={30}>
                            {sortedQualStats?.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={qualColors[entry.qualification] || '#3b82f6'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

            {/* District Stats Section */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden flex flex-col h-[500px]"
              >
                <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                  <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                  <h3 className="text-base font-bold text-white tracking-wide">แนวโน้มวุฒิลูกเสือแยกตามอำเภอ</h3>
                </div>
                <div className="p-8 flex-grow w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.districtQualStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="district" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12}} 
                        padding={{ left: 30, right: 30 }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      {qualOrder.map((q) => (
                        <Line 
                          key={q}
                          type="monotone" 
                          dataKey={q} 
                          stroke={qualColors[q]} 
                          strokeWidth={3}
                          dot={{ r: 4, fill: qualColors[q], strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          name={q}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden flex flex-col"
              >
                <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                  <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                  <h3 className="text-base font-bold text-white tracking-wide">สรุปข้อมูลวุฒิลูกเสือแยกตามรายอำเภอ</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {stats?.districtStats.map((d, i) => (
                      <div key={d.district} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <p className="font-bold text-slate-800">อ.{d.district}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <span className="text-slate-500 text-xs font-medium">จำนวนโรงเรียน</span>
                            <p className="text-lg font-bold text-slate-800">{d.school_count} <span className="text-[10px] font-normal text-slate-400">แห่ง</span></p>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-slate-500 text-xs font-medium">จำนวนครูทั้งหมด</span>
                            <p className="text-lg font-bold text-emerald-600">{d.teacher_count} <span className="text-[10px] font-normal text-slate-400">คน</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Related Documents Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden flex flex-col"
              >
                <div className="bg-emerald-900 px-6 py-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                    <h3 className="text-base font-bold text-white tracking-wide">เอกสารที่เกี่ยวข้อง</h3>
                  </div>
                  {isLoggedIn && (
                    <button 
                      onClick={() => setShowAddDocModal(true)}
                      className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-emerald-700/50"
                    >
                      <Plus className="w-3.5 h-3.5" /> เพิ่มเอกสาร
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex gap-1">
                              <a 
                                href={doc.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                title="ดูเอกสาร"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <a 
                                href={doc.file_url} 
                                download
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                title="ดาวน์โหลด"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              {isLoggedIn && (
                                <button 
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                  title="ลบ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">{doc.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(doc.upload_date).toLocaleDateString('th-TH')}</span>
                              {doc.file_size && <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {doc.file_size}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                      <FileText className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-medium">ยังไม่มีเอกสารที่เกี่ยวข้อง</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
              </div>
            )}

            {activeTab === 'schools' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">ข้อมูลโรงเรียนในสังกัด</h2>
                    <p className="text-slate-500 text-sm mt-1">แสดงข้อมูลสถานะการตั้งกองลูกเสือของโรงเรียนทั้งหมด</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="ค้นหาโรงเรียนหรืออำเภอ..." 
                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {isLoggedIn && (
                      <button className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                        <Plus className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>

                {/* School Dashboard */}
                {stats && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                      {/* Total Schools Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                              <School className="w-6 h-6" />
                            </div>
                          </div>
                          <h3 className="text-slate-500 font-medium text-sm mb-1">โรงเรียนทั้งหมด</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-800">{schools.length}</span>
                            <span className="text-slate-500 text-sm font-medium">แห่ง</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Established Schools Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                          </div>
                          <h3 className="text-slate-500 font-medium text-sm mb-1">ตั้งกองลูกเสือแล้ว</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-800">
                              {stats.schoolStats.find(s => s.scout_status === 'ตั้งกองลูกเสือแล้ว')?.count || 0}
                            </span>
                            <span className="text-slate-500 text-sm font-medium">แห่ง</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Waiting Evaluation Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
                              <Clock className="w-6 h-6" />
                            </div>
                          </div>
                          <h3 className="text-slate-500 font-medium text-sm mb-1">รอประเมิน</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-800">
                              {stats.schoolStats.find(s => s.scout_status === 'รอประเมิน')?.count || 0}
                            </span>
                            <span className="text-slate-500 text-sm font-medium">แห่ง</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Not Evaluated Card */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-inner">
                              <AlertCircle className="w-6 h-6" />
                            </div>
                          </div>
                          <h3 className="text-slate-500 font-medium text-sm mb-1">ยังไม่ได้ประเมิน</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-slate-800">
                              {stats.schoolStats.find(s => s.scout_status === 'ยังไม่ได้ประเมิน')?.count || 0}
                            </span>
                            <span className="text-slate-500 text-sm font-medium">แห่ง</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {/* Status Pie Chart */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card overflow-hidden flex flex-col h-[400px]"
                      >
                        <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                          <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                          <h3 className="text-base font-bold text-white tracking-wide">สัดส่วนสถานะการตั้งกองลูกเสือ</h3>
                        </div>
                        <div className="p-6 flex-grow flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.schoolStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="scout_status"
                              >
                                {stats.schoolStats.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                      entry.scout_status === 'ตั้งกองลูกเสือแล้ว' ? '#10b981' : 
                                      entry.scout_status === 'รอประเมิน' ? '#f59e0b' : 
                                      '#f43f5e'
                                    } 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>

                      {/* District Bar Chart */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card overflow-hidden flex flex-col h-[400px]"
                      >
                        <div className="bg-emerald-900 px-6 py-4 flex items-center gap-3 shrink-0">
                          <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                          <h3 className="text-base font-bold text-white tracking-wide">จำนวนโรงเรียนแยกตามอำเภอ</h3>
                        </div>
                        <div className="p-6 flex-grow">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.districtStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="district" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                              <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Bar dataKey="school_count" name="จำนวนโรงเรียน" radius={[6, 6, 0, 0]} barSize={30} fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}

                {/* Filters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-700">กรองตามอำเภอ (เลือกได้หลายอำเภอ)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allDistricts.map(district => (
                        <label 
                          key={district}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer select-none",
                            selectedDistricts.includes(district) 
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100" 
                              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
                          )}
                        >
                          <input 
                            type="checkbox"
                            className="hidden"
                            checked={selectedDistricts.includes(district)}
                            onChange={() => {
                              setSelectedDistricts(prev => 
                                prev.includes(district) 
                                  ? prev.filter(d => d !== district) 
                                  : [...prev, district]
                              );
                            }}
                          />
                          <span className="text-xs font-bold">อ.{district}</span>
                        </label>
                      ))}
                      {selectedDistricts.length > 0 && (
                        <button 
                          onClick={() => setSelectedDistricts([])}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-2"
                        >
                          ล้างการเลือก
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-4 glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Menu className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-slate-700">แสดงจำนวนแถว</span>
                    </div>
                    <div className="flex gap-2">
                      {[5, 10, 25, 50, 100, 'all'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setPageSize(size as any)}
                          className={cn(
                            "flex-1 py-2 rounded-xl border text-xs font-bold transition-all",
                            pageSize === size 
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                              : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                          )}
                        >
                          {size === 'all' ? 'ทั้งหมด' : size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-200">
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider w-16">ที่</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">ชื่อโรงเรียน</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">อำเภอ</th>
                          <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">สถานะการตั้งกอง</th>
                          {isLoggedIn && <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">จัดการ</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displaySchools.map((school, index) => (
                          <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-bold text-slate-400">
                              {(currentPage - 1) * (pageSize === 'all' ? 0 : pageSize) + index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                  <School className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-slate-700">{school.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <MapPin className="w-4 h-4" />
                                <span>{school.district}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5",
                                school.scout_status === 'ตั้งกองลูกเสือแล้ว' ? "bg-emerald-100 text-emerald-700" :
                                school.scout_status === 'รอประเมิน' ? "bg-amber-100 text-amber-700" :
                                "bg-rose-100 text-rose-700"
                              )}>
                                {school.scout_status === 'ตั้งกองลูกเสือแล้ว' && <ShieldCheck className="w-3.5 h-3.5" />}
                                {school.scout_status === 'รอประเมิน' && <Clock className="w-3.5 h-3.5" />}
                                {school.scout_status === 'ยังไม่ได้ประเมิน' && <AlertCircle className="w-3.5 h-3.5" />}
                                {school.scout_status}
                              </span>
                            </td>
                            {isLoggedIn && (
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                                  <ChevronRight className="w-6 h-6" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredSchools.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-slate-400 font-medium">ไม่พบข้อมูลโรงเรียนที่ค้นหา</p>
                    </div>
                  )}
                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-slate-500 order-2 sm:order-1">
                      แสดง {(currentPage - 1) * (pageSize === 'all' ? 0 : pageSize) + 1} - {Math.min(currentPage * (pageSize === 'all' ? filteredSchools.length : pageSize), filteredSchools.length)} จากทั้งหมด {filteredSchools.length} โรงเรียน
                    </p>
                    
                    {pageSize !== 'all' && totalPages > 1 && (
                      <div className="flex items-center gap-1 order-1 sm:order-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                        
                        <div className="flex items-center gap-1 mx-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Only show first, last, and pages around current
                            if (
                              page === 1 || 
                              page === totalPages || 
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={cn(
                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                    currentPage === page 
                                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" 
                                      : "text-slate-600 hover:bg-white border border-transparent hover:border-slate-200"
                                  )}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 || 
                              page === currentPage + 2
                            ) {
                              return <span key={page} className="text-slate-400 text-xs">...</span>;
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-3xl font-bold text-slate-900">ข้อมูลวุฒิลูกเสือบุคลากร</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="ค้นหาชื่อครู โรงเรียน หรือวุฒิ..." 
                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-80 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {isLoggedIn && (
                      <button className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all">
                        <Plus className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeachers.map((teacher) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={teacher.id} 
                      className="glass-card p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                          <Users className="w-6 h-6" />
                        </div>
                        <span 
                          className="text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md"
                          style={{ 
                            backgroundColor: qualColors[teacher.qualification] || '#3b82f6',
                            boxShadow: `0 4px 6px -1px ${qualColors[teacher.qualification]}40` 
                          }}
                        >
                          {teacher.qualification}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{teacher.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <School className="w-4 h-4" />
                          <span>{teacher.school_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>อ.{teacher.district}</span>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                          <Award className="w-4 h-4" />
                          <span>ตรวจสอบแล้ว</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {settings.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <TigerIcon className="text-white w-6 h-6" />
                  )}
                </div>
                <h3 className="text-white text-xl font-bold">{settings.org_name || 'Scout Info Center'}</h3>
              </div>
              <p className="leading-relaxed">
                ระบบสารสนเทศเพื่อการบริหารจัดการข้อมูลลูกเสือ 
                {settings.org_affiliation || 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสุพรรณบุรี เขต 3'} 
                มุ่งเน้นความถูกต้อง รวดเร็ว และเป็นมืออาชีพ
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">เมนูหลัก</h4>
              <ul className="space-y-4">
                <li><button onClick={() => { setActiveTab('dashboard'); setShowAdminPanel(false); }} className="hover:text-emerald-400 transition-colors">หน้าแรก / แดชบอร์ด</button></li>
                <li><button onClick={() => { setActiveTab('schools'); setShowAdminPanel(false); }} className="hover:text-emerald-400 transition-colors">ข้อมูลโรงเรียน</button></li>
                <li><button onClick={() => { setActiveTab('teachers'); setShowAdminPanel(false); }} className="hover:text-emerald-400 transition-colors">ข้อมูลวุฒิลูกเสือ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">ติดต่อเรา</h4>
              <p className="mb-4">{settings.org_affiliation || 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาสุพรรณบุรี เขต 3'}</p>
              <p className="mb-2">📍 อ.เดิมบางนางบวช จ.สุพรรณบุรี</p>
              <p>📞 โทรศัพท์: 035-XXXXXX</p>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-800 text-center text-sm">
            <p>© {new Date().getFullYear()} {settings.org_name || 'Scout Information Center'}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {cropperModal.isOpen && (
          <ImageCropperModal
            imageSrc={cropperModal.imageSrc}
            aspectRatio={cropperModal.aspectRatio}
            onCropComplete={handleCropComplete}
            onClose={() => setCropperModal(prev => ({ ...prev, isOpen: false }))}
          />
        )}

        {showAddDocModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="bg-emerald-900 px-8 py-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">เพิ่มเอกสารใหม่</h3>
                <button onClick={() => setShowAddDocModal(false)} className="text-white/70 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddDocument} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">ชื่อเอกสาร</label>
                  <input 
                    required
                    type="text" 
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                    placeholder="เช่น คู่มือการตั้งกองลูกเสือ"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">URL ไฟล์เอกสาร</label>
                  <input 
                    required
                    type="url" 
                    value={newDoc.file_url}
                    onChange={(e) => setNewDoc({...newDoc, file_url: e.target.value})}
                    placeholder="https://example.com/file.pdf"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">ขนาดไฟล์ (ระบุหรือไม่ก็ได้)</label>
                  <input 
                    type="text" 
                    value={newDoc.file_size}
                    onChange={(e) => setNewDoc({...newDoc, file_size: e.target.value})}
                    placeholder="เช่น 2.5 MB"
                    className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all mt-4"
                >
                  บันทึกข้อมูล
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-emerald-600 p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <LogIn className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">เข้าสู่ระบบจัดการข้อมูล</h3>
                <p className="text-emerald-100 mt-2">สำหรับเจ้าหน้าที่และผู้ดูแลระบบ</p>
              </div>
              <form onSubmit={handleLogin} className="p-8 space-y-6">
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm font-bold"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                  </motion.div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ชื่อผู้ใช้</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">รหัสผ่าน</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all pr-12"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {rememberMe ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                    <span className="text-xs font-bold">จดจำรหัสผ่าน</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setUsername('');
                      setPassword('');
                      setRememberMe(false);
                      localStorage.removeItem('remembered_user');
                      localStorage.removeItem('remembered_pass');
                      addToast('รีเซ็ตข้อมูลการกรอกแล้ว');
                    }}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    รีเซตข้อมูล
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  ยืนยันการเข้าสู่ระบบ
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                  }}
                  className="w-full text-slate-400 font-medium hover:text-slate-600 transition-colors"
                >
                  ยกเลิก
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Executives Modal */}
      <AnimatePresence>
        {showAllExecutives && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setShowAllExecutives(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">ทำเนียบผู้บังคับบัญชา</h2>
                </div>
                <button 
                  onClick={() => setShowAllExecutives(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {/* Director Row */}
                <div className="flex justify-center mb-8">
                  {executives.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200 flex flex-col items-center text-center gap-4 w-full max-w-sm relative overflow-hidden">
                      <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-300 to-amber-500"></div>
                      <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner mt-2 overflow-hidden">
                        {executives[0].image_url ? (
                          <img src={executives[0].image_url} alt={executives[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-12 h-12" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-lg">{executives[0].name}</p>
                        <p className="text-sm text-slate-600 mt-1 font-medium">{executives[0].position}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold whitespace-nowrap border border-amber-200 shadow-sm">
                        วุฒิทางลูกเสือ: {executives[0].qualification}
                      </span>
                    </div>
                  )}
                </div>

                {/* Other Executives Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {executives.slice(1).map((exec, idx) => (
                    <div key={`modal-${exec.id}-${idx}`} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow hover:border-emerald-200">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 overflow-hidden">
                        {exec.image_url ? (
                          <img src={exec.image_url} alt={exec.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-8 h-8" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{exec.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{exec.position}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold whitespace-nowrap border border-emerald-100 mt-auto shadow-sm">
                        วุฒิทางลูกเสือ: {exec.qualification}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showTeacherModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="bg-emerald-900 px-8 py-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingTeacher.id ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}</h3>
                <button onClick={() => setShowTeacherModal(false)} className="text-white/70 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" 
                      value={editingTeacher.name || ''} 
                      onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">โรงเรียน</label>
                    <select 
                      value={editingTeacher.school_id || ''} 
                      onChange={(e) => setEditingTeacher({...editingTeacher, school_id: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">เลือกโรงเรียน</option>
                      {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">วุฒิลูกเสือ</label>
                    <select 
                      value={editingTeacher.qualification || ''} 
                      onChange={(e) => setEditingTeacher({...editingTeacher, qualification: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">เลือกวุฒิ</option>
                      {['BTC', 'ATC', 'WB', 'ALTC', 'ALT', 'LT'].map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ประเภท</label>
                    <select 
                      value={editingTeacher.scout_type || ''} 
                      onChange={(e) => setEditingTeacher({...editingTeacher, scout_type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">เลือกประเภท</option>
                      {['สำรอง', 'สามัญ', 'สามัญรุ่นใหญ่', 'วิสามัญ'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">URL วุฒิบัตร (ถ้ามี)</label>
                    <input 
                      type="text" 
                      value={editingTeacher.certificate_url || ''} 
                      onChange={(e) => setEditingTeacher({...editingTeacher, certificate_url: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setShowTeacherModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    onClick={() => handleTeacherSave(editingTeacher)}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showExecutiveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
            >
              <div className="bg-emerald-900 px-8 py-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{editingExecutive.id ? 'แก้ไขทำเนียบ' : 'เพิ่มทำเนียบใหม่'}</h3>
                <button onClick={() => setShowExecutiveModal(false)} className="text-white/70 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" 
                      value={editingExecutive.name || ''} 
                      onChange={(e) => setEditingExecutive({...editingExecutive, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700">ตำแหน่ง</label>
                    <input 
                      type="text" 
                      value={editingExecutive.position || ''} 
                      onChange={(e) => setEditingExecutive({...editingExecutive, position: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">วุฒิลูกเสือ</label>
                    <input 
                      type="text" 
                      value={editingExecutive.qualification || ''} 
                      onChange={(e) => setEditingExecutive({...editingExecutive, qualification: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ลำดับการแสดงผล</label>
                    <input 
                      type="number" 
                      value={editingExecutive.order_index || 0} 
                      onChange={(e) => setEditingExecutive({...editingExecutive, order_index: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-bold text-slate-700">URL รูปภาพ</label>
                    <input 
                      type="text" 
                      value={editingExecutive.image_url || ''} 
                      onChange={(e) => setEditingExecutive({...editingExecutive, image_url: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setShowExecutiveModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    onClick={() => handleExecutiveSave(editingExecutive)}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {successModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSuccessModal({ isOpen: false, message: '' })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-emerald-500 p-6 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-center">สำเร็จ!</h3>
              </div>
              <div className="p-6 text-center">
                <p className="text-slate-600 font-medium mb-6">{successModal.message}</p>
                <button 
                  onClick={() => setSuccessModal({ isOpen: false, message: '' })}
                  className="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  ตกลง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
