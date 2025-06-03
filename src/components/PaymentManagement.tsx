
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, User, Users, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { BackToHomeButton } from "./BackToHomeButton";

interface Payment {
  id: string;
  studentName: string;
  groupName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
}

// Mock data for payment methods
const paymentMethods = [
  { value: 'cash', label: 'نقدي' },
  { value: 'card', label: 'بطاقة ائتمانية' },
  { value: 'transfer', label: 'تحويل بنكي' },
];

// Mock data for student groups
const studentGroups = [
  { value: 'group1', label: 'المجموعة الأولى' },
  { value: 'group2', label: 'المجموعة الثانية' },
  { value: 'group3', label: 'المجموعة الثالثة' },
];

export const PaymentManagement = () => {
  const [studentName, setStudentName] = useState('');
  const [group, setGroup] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const { toast } = useToast();

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // e.g., send the data to an API.
    console.log({
      studentName,
      group,
      amount,
      paymentMethod,
      paymentDate,
      isPartialPayment,
    });

    // Show a success toast
    toast({
      title: "تم تسجيل الدفعة بنجاح!",
      description: `تم تسجيل دفعة للطالب ${studentName} بمبلغ ${amount} بنجاح.`,
    });

    // Clear the form
    setStudentName('');
    setGroup('');
    setAmount('');
    setPaymentMethod('');
    setPaymentDate('');
    setIsPartialPayment(false);
  };

  const handlePartialPaymentChange = (checked: boolean | "indeterminate") => {
    setIsPartialPayment(checked === true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <BackToHomeButton />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إدارة المدفوعات</h1>
          <p className="text-gray-400">إدارة مدفوعات الطلاب ورسوم الحصص</p>
        </div>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-xl">تسجيل دفعة جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePaymentSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">اسم الطالب</Label>
                  <Input
                    type="text"
                    id="studentName"
                    className="input-modern"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="أدخل اسم الطالب"
                  />
                </div>
                <div>
                  <Label htmlFor="group">المجموعة</Label>
                  <Select onValueChange={setGroup}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="اختر المجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    type="number"
                    id="amount"
                    className="input-modern"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="أدخل المبلغ"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                  <Select onValueChange={setPaymentMethod}>
                    <SelectTrigger className="input-modern">
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentDate">تاريخ الدفع</Label>
                <Input
                  type="date"
                  id="paymentDate"
                  className="input-modern"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="partialPayment"
                  checked={isPartialPayment}
                  onCheckedChange={handlePartialPaymentChange}
                />
                <Label htmlFor="partialPayment">دفعة جزئية</Label>
              </div>

              <Button type="submit" className="btn-primary">
                تسجيل الدفعة
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
