
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import { AddStudentForm } from "@/components/AddStudentForm";
import { SearchStudents } from "@/components/SearchStudents";
import { AddTeacherForm } from "@/components/AddTeacherForm";
import { GroupsManagement } from "@/components/GroupsManagement";
import { AddGroupForm } from "@/components/AddGroupForm";
import { SessionsManagement } from "@/components/SessionsManagement";
import { AttendanceSystem } from "@/components/AttendanceSystem";
import NotFound from "./pages/NotFound";
import { PaymentManagement } from "@/components/PaymentManagement";
import { TeacherCompensation } from "@/components/TeacherCompensation";
import { AssociationIncome } from "@/components/AssociationIncome";
import { StudentGroupRegistration } from "@/components/StudentGroupRegistration";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-900" dir="rtl">
              <AppSidebar />
              <main className="flex-1">
                <div className="p-2">
                  <SidebarTrigger className="mb-4 text-white hover:bg-gray-800 border-gray-700" />
                </div>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/add-student" element={<AddStudentForm />} />
                  <Route path="/search-students" element={<SearchStudents />} />
                  <Route path="/add-teacher" element={<AddTeacherForm />} />
                  <Route path="/groups" element={<GroupsManagement />} />
                  <Route path="/add-group" element={<AddGroupForm />} />
                  <Route path="/sessions" element={<SessionsManagement />} />
                  <Route path="/attendance" element={<AttendanceSystem />} />
                  <Route path="/payments" element={<PaymentManagement />} />
                  <Route path="/teacher-compensation" element={<TeacherCompensation />} />
                  <Route path="/association-income" element={<AssociationIncome />} />
                  <Route path="/student-groups" element={<StudentGroupRegistration />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
