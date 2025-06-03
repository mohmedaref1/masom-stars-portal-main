
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Book, Users, GraduationCap, Calendar, CreditCard, DollarSign, TrendingUp, UserPlus } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: "إضافة طالب جديد",
      description: "تسجيل طالب جديد في النظام",
      icon: Plus,
      color: "from-blue-500 to-purple-600",
      link: "/add-student"
    },
    {
      title: "البحث عن الطلاب",
      description: "البحث في قاعدة بيانات الطلاب",
      icon: Search,
      color: "from-green-500 to-teal-600",
      link: "/search-students"
    },
    {
      title: "إضافة معلم جديد",
      description: "تسجيل معلم جديد في النظام",
      icon: Book,
      color: "from-orange-500 to-red-600",
      link: "/add-teacher"
    },
    {
      title: "إدارة المجموعات",
      description: "إنشاء وإدارة المجموعات الدراسية",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      link: "/groups"
    },
    {
      title: "إدارة الحصص",
      description: "تنظيم جدول الحصص والمواعيد",
      icon: Calendar,
      color: "from-indigo-500 to-blue-600",
      link: "/sessions"
    },
    {
      title: "تسجيل الحضور",
      description: "متابعة حضور وغياب الطلاب",
      icon: GraduationCap,
      color: "from-cyan-500 to-blue-600",
      link: "/attendance"
    },
    {
      title: "إدارة المدفوعات",
      description: "متابعة مدفوعات الطلاب",
      icon: CreditCard,
      color: "from-emerald-500 to-green-600",
      link: "/payments"
    },
    {
      title: "تعويضات المعلمين",
      description: "حساب وإدارة تعويضات المعلمين",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-600",
      link: "/teacher-compensation"
    },
    {
      title: "مداخيل الجمعية",
      description: "تقارير مالية وأرباح الجمعية",
      icon: TrendingUp,
      color: "from-rose-500 to-pink-600",
      link: "/association-income"
    },
    {
      title: "تسجيل في المجموعات",
      description: "ربط الطلاب بالمجموعات",
      icon: UserPlus,
      color: "from-violet-500 to-purple-600",
      link: "/student-groups"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* الترحيب */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">
            نظام إدارة مدرسة معصم
          </h1>
          <p className="text-xl text-gray-300 mb-2">جمعية النجوم الثقافية</p>
          <p className="text-gray-400">نظام شامل لإدارة الطلاب والمعلمين والمدفوعات</p>
        </div>

        {/* بطاقات الميزات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="card-modern hover:scale-105 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 mb-4 text-sm">{feature.description}</p>
                <Button asChild className="btn-primary w-full">
                  <a href={feature.link}>ابدأ الآن</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* معلومات النظام */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">نظام إدارة شامل ومتكامل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">إدارة الطلاب</h3>
                <p className="text-gray-300 text-sm">تسجيل ومتابعة بيانات الطلاب بشكل شامل</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">النظام المالي</h3>
                <p className="text-gray-300 text-sm">إدارة المدفوعات والتعويضات والتقارير المالية</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">إدارة الحصص</h3>
                <p className="text-gray-300 text-sm">تنظيم الجداول ومتابعة الحضور والغياب</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
