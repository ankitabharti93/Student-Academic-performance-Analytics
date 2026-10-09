import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  BarChart2,
  LogOut,
} from 'lucide-react'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/subjects', label: 'Subjects', icon: BarChart2 },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
]

const teacherLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck },
]

const studentLinks = [
  { to: '/my-profile', label: 'My Profile', icon: LayoutDashboard },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'teacher'
      ? teacherLinks
      : studentLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white leading-tight">Student Analytics</h1>
        <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-700 pt-4">
          <p className="font-medium text-gray-300">{user?.name}</p>
          <p className="truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
