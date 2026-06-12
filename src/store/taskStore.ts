import { create } from 'zustand';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface TaskHistory {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // Gradient class
  borderColor: string;
  textColor: string;
  icon: string; // Lucide icon name
  progress: number;
  members: Member[];
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  favorite: boolean;
  archived: boolean;
  milestones: Milestone[];
  dueDate: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  label: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  attachments: Attachment[];
  comments: Comment[];
  history: TaskHistory[];
  bookmarked: boolean;
  archived: boolean;
  timeSpent?: number; // In minutes
  estimatedTime?: number; // In minutes
  checklist?: { id: string; text: string; completed: boolean }[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'reminder' | 'alert' | 'mention' | 'success';
  timestamp: string;
  read: boolean;
  taskId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  workspace: string;
  bio: string;
  timezone: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  desktopNotifications: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'task' | 'project' | 'comment' | 'system';
}

interface TaskState {
  // State
  currentUser: UserProfile;
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  activities: ActivityLog[];
  activeView: 'dashboard' | 'tasks' | 'projects' | 'calendar' | 'analytics' | 'team' | 'profile' | 'onboarding';
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  quickAddTaskOpen: boolean;
  searchQuery: string;
  statusFilter: 'all' | 'todo' | 'in-progress' | 'in-review' | 'done';
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  projectFilter: string; // 'all' or projectId
  sortBy: 'dueDate' | 'priority' | 'title';
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  isAuthenticated: boolean;
  mobileSidebarOpen: boolean;
  sidebarCollapsed: boolean;
  authOtpCode: string;

  // Actions
  login: (email: string) => void;
  logout: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  generateOtp: () => string;
  setView: (view: 'dashboard' | 'tasks' | 'projects' | 'calendar' | 'analytics' | 'team' | 'profile' | 'onboarding') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickAddTaskOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'history' | 'comments' | 'attachments' | 'archived' | 'bookmarked' | 'checklist'> & { checklist?: { text: string; completed: boolean }[] }) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  toggleBookmarkTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  addComment: (taskId: string, commentText: string) => void;
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id'>) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'progress' | 'archived'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  archiveProject: (projectId: string) => void;
  toggleFavoriteProject: (projectId: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;

  // Search & Filter Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | 'todo' | 'in-progress' | 'in-review' | 'done') => void;
  setPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  setProjectFilter: (filter: string) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'title') => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;

  // Profile Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// Pre-defined Members
const MOCK_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alex Rivera', role: 'Lead Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', email: 'alex@aether.design' },
  { id: 'm2', name: 'Marcus Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', email: 'marcus@aether.dev' },
  { id: 'm3', name: 'Elena Rostova', role: 'QA Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', email: 'elena@aether.qa' },
  { id: 'm4', name: 'David Kim', role: 'Growth Marketer', avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80', email: 'david@aether.marketing' },
  { id: 'm5', name: 'Sophia Martinez', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', email: 'sophia@aether.co' }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Aether Brand Redesign',
    description: 'Overhaul our company branding, design system, marketing website, and design assets for the 2026 launch.',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    borderColor: 'border-indigo-500/20',
    textColor: 'text-indigo-500',
    icon: 'Layers',
    progress: 68,
    members: [MOCK_MEMBERS[0], MOCK_MEMBERS[1], MOCK_MEMBERS[4]],
    status: 'active',
    favorite: true,
    archived: false,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days out
    milestones: [
      { id: 'ms1_1', title: 'Brand Strategy Sign-off', completed: true },
      { id: 'ms1_2', title: 'Figma Design System v1.0', completed: true },
      { id: 'ms1_3', title: 'Marketing Website Coding', completed: false },
      { id: 'ms1_4', title: 'Press Kit & Launch Collateral', completed: false },
    ]
  },
  {
    id: 'p2',
    name: 'Quantum Mobile App',
    description: 'Build the iOS & Android clients for the Quantum real-time analytics platform using React Native.',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-500',
    icon: 'Smartphone',
    progress: 35,
    members: [MOCK_MEMBERS[1], MOCK_MEMBERS[2], MOCK_MEMBERS[4]],
    status: 'active',
    favorite: true,
    archived: false,
    dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 35 days out
    milestones: [
      { id: 'ms2_1', title: 'Wireframes & User Flows', completed: true },
      { id: 'ms2_2', title: 'API Integration Specifications', completed: false },
      { id: 'ms2_3', title: 'Beta Release to TestFlight', completed: false },
    ]
  },
  {
    id: 'p3',
    name: 'SaaS Platform Launch',
    description: 'Preparation, compliance check, billing integration, security audits, and marketing for our global cloud product launch.',
    color: 'from-amber-500 to-rose-500',
    borderColor: 'border-amber-500/20',
    textColor: 'text-amber-500',
    icon: 'Rocket',
    progress: 85,
    members: [MOCK_MEMBERS[1], MOCK_MEMBERS[3], MOCK_MEMBERS[4]],
    status: 'planning',
    favorite: false,
    archived: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days out
    milestones: [
      { id: 'ms3_1', title: 'SOC2 Security Compliance', completed: true },
      { id: 'ms3_2', title: 'Stripe Billing Flow Sandbox Tests', completed: true },
      { id: 'ms3_3', title: 'Launch Press Release Draft', completed: true },
      { id: 'ms3_4', title: 'Production Environment Smoke Test', completed: false },
    ]
  },
  {
    id: 'p4',
    name: 'AI Analytics Engine',
    description: 'Develop and train LLM-driven intelligence reports to automatically generate summaries from user data streams.',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-500',
    icon: 'Brain',
    progress: 12,
    members: [MOCK_MEMBERS[0], MOCK_MEMBERS[1]],
    status: 'active',
    favorite: false,
    archived: false,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    milestones: [
      { id: 'ms4_1', title: 'Model Architecture Selection', completed: true },
      { id: 'ms4_2', title: 'Data Cleaning Pipeline', completed: false },
      { id: 'ms4_3', title: 'First Training Run & Benchmark', completed: false },
    ]
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Finalize brand color palette & typography hierarchy',
    description: 'Select the primary, secondary, and accent colors for the Aether brand redesign. Define exact Tailwind config values and export Figma variables.',
    status: 'done',
    priority: 'high',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    label: 'Design',
    recurrence: 'none',
    bookmarked: true,
    archived: false,
    timeSpent: 240,
    estimatedTime: 180,
    attachments: [
      { id: 'a1', name: 'Aether_Brand_Identity_v1.pdf', size: '4.8 MB', type: 'pdf', url: '#' }
    ],
    comments: [
      { id: 'c1', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'I completed the exports. The primary color is a gorgeous deep indigo-purple violet blend!', timestamp: '2 days ago' }
    ],
    history: [
      { id: 'h1', action: 'Task created', timestamp: '5 days ago', user: 'Sophia Martinez' },
      { id: 'h2', action: 'Moved to Done', timestamp: '2 days ago', user: 'Alex Rivera' }
    ]
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Design high-fidelity desktop mockups for marketing website',
    description: 'Create the landing page, product feature pages, pricing page, and contact page mockups in Figma. Ensure they follow the newly defined design system.',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    label: 'Design',
    recurrence: 'none',
    bookmarked: false,
    archived: false,
    timeSpent: 480,
    estimatedTime: 720,
    checklist: [
      { id: 'ck1_1', text: 'Hero section with premium glassmorphic cards', completed: true },
      { id: 'ck1_2', text: 'Interactive features demonstration grid', completed: true },
      { id: 'ck1_3', text: 'Three-tiered pricing calculator UI', completed: false },
      { id: 'ck1_4', text: 'Dark/light mode toggle preview assets', completed: false }
    ],
    attachments: [
      { id: 'a2', name: 'Figma_Marketing_v2.png', size: '12.5 MB', type: 'image', url: '#' },
      { id: 'a3', name: 'Feedback_Notes.txt', size: '12 KB', type: 'txt', url: '#' }
    ],
    comments: [
      { id: 'c2', author: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', text: 'Alex, make sure to add visual anchors. The Dribbble-style smooth borders look fabulous!', timestamp: 'Yesterday' },
      { id: 'c3', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'On it! Adding the pricing grid mockups today.', timestamp: '4 hours ago' }
    ],
    history: [
      { id: 'h3', action: 'Task created', timestamp: '4 days ago', user: 'Sophia Martinez' },
      { id: 'h4', action: 'Moved to In Progress', timestamp: '3 days ago', user: 'Alex Rivera' }
    ]
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Code responsive Tailwind CSS header & sidebar components',
    description: 'Implement the pixel-perfect layout header and sidebar with glassmorphic effects, collapsible states, and keyboard shortcut overlays.',
    status: 'in-review',
    priority: 'medium',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // tomorrow
    label: 'Frontend',
    recurrence: 'none',
    bookmarked: true,
    archived: false,
    timeSpent: 180,
    estimatedTime: 240,
    attachments: [],
    comments: [
      { id: 'c4', author: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', text: 'Pushed the branch `feature/navigation-glass`. Elena, can you check the mobile overlay bug?', timestamp: '6 hours ago' }
    ],
    history: [
      { id: 'h5', action: 'Task created', timestamp: '3 days ago', user: 'Marcus Chen' },
      { id: 'h6', action: 'Moved to In Review', timestamp: '6 hours ago', user: 'Marcus Chen' }
    ]
  },
  {
    id: 't4',
    projectId: 'p2',
    title: 'Integrate WebSockets for real-time collaboration',
    description: 'Set up socket connections to synchronize tasks across clients. Include reconnect logic, state reconciliation, and presence markers.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Backend',
    recurrence: 'none',
    bookmarked: false,
    archived: false,
    attachments: [],
    comments: [],
    history: [
      { id: 'h7', action: 'Task created', timestamp: 'Yesterday', user: 'Marcus Chen' }
    ]
  },
  {
    id: 't5',
    projectId: 'p2',
    title: 'Design mobile navigation flow & gestures',
    description: 'Prototype the bottom bar, swipe gestures to complete tasks, and drag-and-drop mechanics optimized for touch interfaces.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Design',
    recurrence: 'none',
    bookmarked: false,
    archived: false,
    attachments: [],
    comments: [],
    history: [
      { id: 'h8', action: 'Task created', timestamp: '3 days ago', user: 'Alex Rivera' }
    ]
  },
  {
    id: 't6',
    projectId: 'p3',
    title: 'Complete security audit & penetration testing',
    description: 'Perform full vulnerability scan on production endpoints, audit OAuth flows, check JWT secret strengths, and fix header security configs.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Security',
    recurrence: 'weekly',
    bookmarked: true,
    archived: false,
    attachments: [
      { id: 'a4', name: 'SOC2_Self_Audit_Precheck.xlsx', size: '1.2 MB', type: 'xlsx', url: '#' }
    ],
    comments: [
      { id: 'c5', author: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', text: 'I started the pre-scans. Database connections look secure. High-priority items will be documented.', timestamp: 'Yesterday' }
    ],
    history: [
      { id: 'h9', action: 'Task created', timestamp: '4 days ago', user: 'Sophia Martinez' }
    ]
  },
  {
    id: 't7',
    projectId: 'p3',
    title: 'Configure production billing integration in Stripe dashboard',
    description: 'Set up webhooks for subscription lifecycles, configure pricing tables, and customize client portal logos.',
    status: 'done',
    priority: 'medium',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Finances',
    recurrence: 'none',
    bookmarked: false,
    archived: false,
    attachments: [],
    timeSpent: 120,
    estimatedTime: 120,
    comments: [],
    history: [
      { id: 'h10', action: 'Task created', timestamp: '3 days ago', user: 'Marcus Chen' },
      { id: 'h11', action: 'Moved to Done', timestamp: 'Yesterday', user: 'Marcus Chen' }
    ]
  },
  {
    id: 't8',
    projectId: 'p4',
    title: 'Write prompt templates for summary generation',
    description: 'Draft and test prompts for GPT-4 to convert activity timelines into highly polished PDF executive updates.',
    status: 'todo',
    priority: 'low',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'AI Engineering',
    recurrence: 'none',
    bookmarked: false,
    archived: false,
    attachments: [],
    comments: [],
    history: [
      { id: 'h12', action: 'Task created', timestamp: '2 days ago', user: 'Marcus Chen' }
    ]
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Deadline Approaching',
    description: 'Task "Design high-fidelity desktop mockups" is due in 3 days.',
    type: 'reminder',
    timestamp: '10 minutes ago',
    read: false,
    taskId: 't2'
  },
  {
    id: 'n2',
    title: 'New Mention in Aether Redesign',
    description: 'Alex Rivera mentioned you in "Finalize brand color palette..."',
    type: 'mention',
    timestamp: '2 hours ago',
    read: false,
    taskId: 't1'
  },
  {
    id: 'n3',
    title: 'Security Precheck Complete',
    description: 'Elena Rostova updated "Complete security audit" status.',
    type: 'success',
    timestamp: 'Yesterday',
    read: true,
    taskId: 't6'
  }
];

const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act1',
    user: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    action: 'marked as completed',
    target: 'Finalize brand color palette & typography hierarchy',
    timestamp: '2 hours ago',
    type: 'task'
  },
  {
    id: 'act2',
    user: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    action: 'submitted for review',
    target: 'Code responsive Tailwind CSS header & sidebar components',
    timestamp: '6 hours ago',
    type: 'task'
  },
  {
    id: 'act3',
    user: 'Sophia Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    action: 'added a comment to',
    target: 'Design high-fidelity desktop mockups for marketing website',
    timestamp: 'Yesterday',
    type: 'comment'
  },
  {
    id: 'act4',
    user: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    action: 'launched new project',
    target: 'AI Analytics Engine',
    timestamp: '2 days ago',
    type: 'project'
  }
];

export const useTaskStore = create<TaskState>((set) => ({
  // Initial State
  currentUser: {
    name: 'Sarah Connor',
    email: 'sarah.connor@aether.co',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Product Director',
    workspace: 'Aether Lab Workspace',
    bio: 'Pioneering delightful user interfaces and leading high-impact product teams at Aether.',
    timezone: 'America/New_York (EST)',
    twoFactorEnabled: true,
    emailNotifications: true,
    desktopNotifications: true
  },
  projects: INITIAL_PROJECTS,
  tasks: INITIAL_TASKS,
  notifications: INITIAL_NOTIFICATIONS,
  activities: INITIAL_ACTIVITIES,
  activeView: 'onboarding', // Start with onboarding for premium intro, then dash
  theme: 'dark', // Premium default dark mode
  commandPaletteOpen: false,
  quickAddTaskOpen: false,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  projectFilter: 'all',
  sortBy: 'dueDate',
  selectedTaskId: null,
  selectedProjectId: null,
  isAuthenticated: false, // Set to false so the user starts at our beautiful Auth screen
  mobileSidebarOpen: false,
  sidebarCollapsed: false,
  authOtpCode: '',

  // Actions
  login: (email: string) => set({
    isAuthenticated: true,
    activeView: 'dashboard',
    currentUser: {
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Sarah Connor',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Product Director',
      workspace: 'Aether Lab Workspace',
      bio: 'Pioneering delightful user interfaces and leading high-impact product teams at Aether.',
      timezone: 'America/New_York (EST)',
      twoFactorEnabled: true,
      emailNotifications: true,
      desktopNotifications: true
    }
  }),
  logout: () => set({ isAuthenticated: false, activeView: 'onboarding' }),
  setView: (view) => set({ activeView: view, mobileSidebarOpen: false }), // Close mobile menu when switching views
  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: nextTheme };
  }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setQuickAddTaskOpen: (open) => set({ quickAddTaskOpen: open }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  generateOtp: () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code
    set({ authOtpCode: code });
    return code;
  },

  // Task Actions
  addTask: (taskData) => set((state) => {
    const newTask: Task = {
      ...taskData,
      id: `t_${Date.now()}`,
      archived: false,
      bookmarked: false,
      attachments: [],
      comments: [],
      history: [
        { id: `h_${Date.now()}`, action: 'Task created', timestamp: 'Just now', user: state.currentUser.name }
      ],
      checklist: taskData.checklist ? taskData.checklist.map((c, idx) => ({ id: `ck_${Date.now()}_${idx}`, text: c.text, completed: c.completed })) : []
    };

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      user: state.currentUser.name,
      avatar: state.currentUser.avatar,
      action: 'created task',
      target: newTask.title,
      timestamp: 'Just now',
      type: 'task'
    };

    // Update project progress
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === newTask.projectId) {
        const projTasks = [...state.tasks.filter(t => t.projectId === proj.id), newTask];
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((completed / projTasks.length) * 100) || 0;
        return { ...proj, progress };
      }
      return proj;
    });

    return {
      tasks: [newTask, ...state.tasks],
      activities: [newActivity, ...state.activities],
      projects: updatedProjects
    };
  }),

  updateTask: (taskId, updates) => set((state) => {
    let affectedProjectId = '';
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        affectedProjectId = task.projectId;
        const newHistory = [...task.history];
        if (updates.status && updates.status !== task.status) {
          newHistory.push({
            id: `h_${Date.now()}`,
            action: `Status changed to ${updates.status.toUpperCase()}`,
            timestamp: 'Just now',
            user: state.currentUser.name
          });
        }
        return { ...task, ...updates, history: newHistory };
      }
      return task;
    });

    const targetTask = state.tasks.find(t => t.id === taskId);
    const activityActions: ActivityLog[] = [];
    if (updates.status && targetTask && updates.status !== targetTask.status) {
      activityActions.push({
        id: `act_${Date.now()}`,
        user: state.currentUser.name,
        avatar: state.currentUser.avatar,
        action: `moved task to ${updates.status}`,
        target: targetTask.title,
        timestamp: 'Just now',
        type: 'task'
      });
    }

    // Update project progress
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === affectedProjectId || proj.id === updates.projectId) {
        const projTasks = updatedTasks.filter(t => t.projectId === proj.id);
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((completed / projTasks.length) * 100) || 0;
        return { ...proj, progress };
      }
      return proj;
    });

    return {
      tasks: updatedTasks,
      activities: activityActions.length ? [...activityActions, ...state.activities] : state.activities,
      projects: updatedProjects
    };
  }),

  deleteTask: (taskId) => set((state) => {
    const taskToDelete = state.tasks.find(t => t.id === taskId);
    if (!taskToDelete) return {};

    const remainingTasks = state.tasks.filter((task) => task.id !== taskId);

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      user: state.currentUser.name,
      avatar: state.currentUser.avatar,
      action: 'deleted task',
      target: taskToDelete.title,
      timestamp: 'Just now',
      type: 'task'
    };

    // Update project progress
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === taskToDelete.projectId) {
        const projTasks = remainingTasks.filter(t => t.projectId === proj.id);
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((completed / projTasks.length) * 100) || 0;
        return { ...proj, progress };
      }
      return proj;
    });

    return {
      tasks: remainingTasks,
      activities: [newActivity, ...state.activities],
      projects: updatedProjects,
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId
    };
  }),

  duplicateTask: (taskId) => set((state) => {
    const sourceTask = state.tasks.find(t => t.id === taskId);
    if (!sourceTask) return {};

    const duplicatedTask: Task = {
      ...sourceTask,
      id: `t_${Date.now()}`,
      title: `${sourceTask.title} (Copy)`,
      bookmarked: false,
      history: [
        { id: `h_${Date.now()}`, action: 'Task duplicated', timestamp: 'Just now', user: state.currentUser.name }
      ],
      comments: [],
      attachments: [...sourceTask.attachments]
    };

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      user: state.currentUser.name,
      avatar: state.currentUser.avatar,
      action: 'duplicated task',
      target: sourceTask.title,
      timestamp: 'Just now',
      type: 'task'
    };

    // Update project progress
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === duplicatedTask.projectId) {
        const projTasks = [...state.tasks.filter(t => t.projectId === proj.id), duplicatedTask];
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((completed / projTasks.length) * 100) || 0;
        return { ...proj, progress };
      }
      return proj;
    });

    return {
      tasks: [duplicatedTask, ...state.tasks],
      activities: [newActivity, ...state.activities],
      projects: updatedProjects
    };
  }),

  archiveTask: (taskId) => set((state) => {
    const updatedTasks = state.tasks.map((task) =>
      task.id === taskId ? { ...task, archived: true } : task
    );
    const targetTask = state.tasks.find(t => t.id === taskId);
    const activityName = targetTask ? targetTask.title : 'a task';

    return {
      tasks: updatedTasks,
      activities: [
        {
          id: `act_${Date.now()}`,
          user: state.currentUser.name,
          avatar: state.currentUser.avatar,
          action: 'archived task',
          target: activityName,
          timestamp: 'Just now',
          type: 'task'
        },
        ...state.activities
      ]
    };
  }),

  toggleBookmarkTask: (taskId) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, bookmarked: !task.bookmarked } : task
    )
  })),

  moveTask: (taskId, newStatus) => set((state) => {
    let affectedProjectId = '';
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        affectedProjectId = task.projectId;
        const newHistory = [...task.history];
        if (task.status !== newStatus) {
          newHistory.push({
            id: `h_${Date.now()}`,
            action: `Moved from ${task.status.toUpperCase()} to ${newStatus.toUpperCase()}`,
            timestamp: 'Just now',
            user: state.currentUser.name
          });
        }
        return { ...task, status: newStatus, history: newHistory };
      }
      return task;
    });

    const targetTask = state.tasks.find(t => t.id === taskId);
    const actionLog: ActivityLog[] = [];
    if (targetTask && targetTask.status !== newStatus) {
      actionLog.push({
        id: `act_${Date.now()}`,
        user: state.currentUser.name,
        avatar: state.currentUser.avatar,
        action: `moved task to ${newStatus}`,
        target: targetTask.title,
        timestamp: 'Just now',
        type: 'task'
      });
    }

    // Update projects
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === affectedProjectId) {
        const projTasks = updatedTasks.filter(t => t.projectId === proj.id);
        const completed = projTasks.filter(t => t.status === 'done').length;
        const progress = Math.round((completed / projTasks.length) * 100) || 0;
        return { ...proj, progress };
      }
      return proj;
    });

    return {
      tasks: updatedTasks,
      activities: actionLog.length ? [...actionLog, ...state.activities] : state.activities,
      projects: updatedProjects
    };
  }),

  addComment: (taskId, commentText) => set((state) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: state.currentUser.name,
      avatar: state.currentUser.avatar,
      text: commentText,
      timestamp: 'Just now'
    };

    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [...task.comments, newComment],
          history: [
            ...task.history,
            { id: `h_${Date.now()}`, action: 'Added a comment', timestamp: 'Just now', user: state.currentUser.name }
          ]
        };
      }
      return task;
    });

    const targetTask = state.tasks.find(t => t.id === taskId);
    const activityName = targetTask ? targetTask.title : 'a task';

    return {
      tasks: updatedTasks,
      activities: [
        {
          id: `act_${Date.now()}`,
          user: state.currentUser.name,
          avatar: state.currentUser.avatar,
          action: 'commented on',
          target: activityName,
          timestamp: 'Just now',
          type: 'comment'
        },
        ...state.activities
      ]
    };
  }),

  addAttachment: (taskId, attachmentData) => set((state) => {
    const newAttachment: Attachment = {
      ...attachmentData,
      id: `a_${Date.now()}`
    };

    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          attachments: [...task.attachments, newAttachment],
          history: [
            ...task.history,
            { id: `h_${Date.now()}`, action: `Attached file ${newAttachment.name}`, timestamp: 'Just now', user: state.currentUser.name }
          ]
        };
      }
      return task;
    });

    return {
      tasks: updatedTasks
    };
  }),

  toggleChecklistItem: (taskId, itemId) => set((state) => {
    const updatedTasks = state.tasks.map((task) => {
      if (task.id === taskId && task.checklist) {
        const updatedChecklist = task.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...task, checklist: updatedChecklist };
      }
      return task;
    });

    return {
      tasks: updatedTasks
    };
  }),

  // Project Actions
  addProject: (projectData) => set((state) => {
    const newProject: Project = {
      ...projectData,
      id: `p_${Date.now()}`,
      progress: 0,
      archived: false,
      milestones: projectData.milestones.map((ms, idx) => ({ id: `ms_${Date.now()}_${idx}`, title: ms.title, completed: false }))
    };

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      user: state.currentUser.name,
      avatar: state.currentUser.avatar,
      action: 'created project',
      target: newProject.name,
      timestamp: 'Just now',
      type: 'project'
    };

    return {
      projects: [...state.projects, newProject],
      activities: [newActivity, ...state.activities]
    };
  }),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map((proj) =>
      proj.id === projectId ? { ...proj, ...updates } : proj
    )
  })),

  archiveProject: (projectId) => set((state) => ({
    projects: state.projects.map((proj) =>
      proj.id === projectId ? { ...proj, archived: true } : proj
    )
  })),

  toggleFavoriteProject: (projectId) => set((state) => ({
    projects: state.projects.map((proj) =>
      proj.id === projectId ? { ...proj, favorite: !proj.favorite } : proj
    )
  })),

  toggleMilestone: (projectId, milestoneId) => set((state) => {
    const updatedProjects = state.projects.map((proj) => {
      if (proj.id === projectId) {
        const updatedMilestones = proj.milestones.map((ms) =>
          ms.id === milestoneId ? { ...ms, completed: !ms.completed } : ms
        );
        // Calculate milestones progress as part of project progress if wanted
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100) || proj.progress;
        return { ...proj, milestones: updatedMilestones, progress };
      }
      return proj;
    });
    return { projects: updatedProjects };
  }),

  // Search & Filters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),
  setProjectFilter: (filter) => set({ projectFilter: filter }),
  setSortBy: (sortBy) => set({ sortBy }),

  // Notifications
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  addNotification: (notifData) => set((state) => {
    const newNotif: Notification = {
      ...notifData,
      id: `n_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    return {
      notifications: [newNotif, ...state.notifications]
    };
  }),

  // Profile Actions
  updateProfile: (updates) => set((state) => ({
    currentUser: {
      ...state.currentUser,
      ...updates
    }
  }))
}));
