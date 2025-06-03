
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Home, Plus, Search, Book, Users, Calendar, Scan, CreditCard, DollarSign, TrendingUp, UserPlus } from "lucide-react"

const menuItems = [
  {
    title: "الصفحة الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "إضافة طالب جديد",
    url: "/add-student",
    icon: Plus,
  },
  {
    title: "البحث عن الطلاب",
    url: "/search-students",
    icon: Search,
  },
  {
    title: "إضافة معلم جديد",
    url: "/add-teacher",
    icon: Book,
  },
  {
    title: "إدارة المجموعات",
    url: "/groups",
    icon: Users,
  },
  {
    title: "إضافة مجموعة",
    url: "/add-group",
    icon: Plus,
  },
  {
    title: "إدارة الحصص",
    url: "/sessions",
    icon: Calendar,
  },
  {
    title: "تسجيل الحضور",
    url: "/attendance",
    icon: Scan,
  },
  {
    title: "إدارة المدفوعات",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "تعويضات المعلمين",
    url: "/teacher-compensation",
    icon: DollarSign,
  },
  {
    title: "مداخيل الجمعية",
    url: "/association-income",
    icon: TrendingUp,
  },
  {
    title: "تسجيل في المجموعات",
    url: "/student-groups",
    icon: UserPlus,
  },
]

export function AppSidebar() {
  return (
    <Sidebar side="right" className="sidebar-modern border-l-0 border-r border-gray-700/50">
      <SidebarHeader className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">نظام إدارة مدرسة معصم</h2>
          <p className="text-sm text-gray-300">جمعية النجوم الثقافية</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 text-sm font-medium mb-4">القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 mb-2 p-3 rounded-lg">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
