
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { studentService, type StudentSearchResult, type Student } from '@/services/studentService';
import { ArrowRight, Search, User, Eye, Calendar, Phone, CreditCard, BookOpen } from 'lucide-react'; // Added BookOpen

export function SearchStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الطالب أو رقم الهوية",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSelectedStudent(null);
    
    try {
      const results = await studentService.searchStudents(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "لا توجد نتائج",
          description: "لم يتم العثور على طلاب يطابقون البحث",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء البحث",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewDetails = async (studentId: string) => {
    setIsLoadingDetails(true);
    
    try {
      const student = await studentService.getStudentDetails(studentId);
      setSelectedStudent(student);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب تفاصيل الطالب",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8"> {/* Existing Back to Home link container */}
          <a href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </a>
        </div>

        {/* Page Header */}
        <div className="mb-8"> {/* Consistent with other mb-8, or mb-6 from GroupsManagement */}
          <h1 className="text-3xl font-bold text-white mb-2">قائمة الطلاب</h1>
          <p className="text-gray-300">عرض وبحث تفاصيل الطلاب المسجلين</p>
        </div>

        {/* نموذج البحث */}
        <Card className="card-modern animate-fade-in mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <Search className="w-6 h-6 text-blue-400" />
              البحث عن الطلاب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="searchQuery" className="text-white font-medium mb-2 block">
                  الاسم الكامل أو رقم الهوية
                </Label>
                <Input
                  id="searchQuery"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن طالب..."
                  className="input-modern"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSearching}
                >
                  {isSearching ? 'جاري البحث...' : 'بحث'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* نتائج البحث */}
        {searchResults.length > 0 && (
          <Card className="card-modern animate-fade-in mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-white">نتائج البحث ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">الاسم الكامل</TableHead>
                    <TableHead className="text-gray-300">المستوى الدراسي</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((student) => (
                    <TableRow key={student.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="text-white font-medium">{student.fullName}</TableCell>
                      <TableCell className="text-gray-300">{student.level}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewDetails(student.id)}
                          variant="outline"
                          size="sm"
                          className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                          disabled={isLoadingDetails}
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* تفاصيل الطالب */}
        {selectedStudent && (
          <Card className="card-modern animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <User className="w-6 h-6 text-green-400" />
                تفاصيل الطالب: {selectedStudent.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* البيانات الشخصية */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">البيانات الشخصية</h3>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">الاسم الكامل</p>
                      <p className="text-white font-medium">{selectedStudent.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">رقم الهاتف</p>
                      <p className="text-white font-medium">{selectedStudent.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-400">رقم هاتف الولي</p>
                      <p className="text-white font-medium">{selectedStudent.parentPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">تاريخ الميلاد</p>
                      <p className="text-white font-medium">
                        {selectedStudent.birthDate.day}/{selectedStudent.birthDate.month}/{selectedStudent.birthDate.year}
                      </p>
                    </div>
                  </div>
                </div>

                {/* البيانات الأكاديمية والمالية */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">البيانات الأكاديمية والمالية</h3> {/* Title updated */}
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"> {/* Standardized layout */}
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">المستوى الدراسي</p>
                      <p className="text-white font-medium">{selectedStudent.level}</p> {/* Removed text-lg to be consistent with other values */}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <CreditCard className={`w-5 h-5 ${selectedStudent.hasPaidRegistration ? 'text-green-400' : 'text-red-400'}`} />
                    <div>
                      <p className="text-sm text-gray-400">حالة دفع رسوم التسجيل</p>
                      <p className={`font-medium ${selectedStudent.hasPaidRegistration ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedStudent.hasPaidRegistration ? 'مدفوعة' : 'غير مدفوعة'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"> {/* Standardized layout */}
                    <Calendar className="w-5 h-5 text-purple-400" /> {/* Re-used Calendar icon */}
                    <div>
                      <p className="text-sm text-gray-400">تاريخ التسجيل</p>
                      <p className="text-white font-medium">{new Date(selectedStudent.registrationDate).toLocaleDateString('ar-DZ')}</p> {/* Date formatting */}
                    </div>
                  </div>
                </div>
              </div>

              {/* أقسام قيد التطوير */}
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg">
                  <h4 className="text-white font-medium mb-2">المجموعات المسجل بها الطالب</h4>
                  <p className="text-gray-400 text-sm">سيتم إضافة هذا القسم في المراحل القادمة</p>
                </div>

                <div className="p-4 bg-gray-800/50 border border-dashed border-gray-600 rounded-lg">
                  <h4 className="text-white font-medium mb-2">حالة الدفع لكل مجموعة</h4>
                  <p className="text-gray-400 text-sm">سيتم إضافة هذا القسم في المراحل القادمة</p>
                </div>

                <Button 
                  className="btn-secondary w-full"
                  disabled
                >
                  طباعة تأكيد الدفع الفردي
                  <span className="text-xs mr-2">(قريباً)</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
