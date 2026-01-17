import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, ArrowRight, Lock, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";

interface Student {
  id: string;
  student_name: string;
  pin_code: string;
}

interface ParentLoginProps {
  grade: string;
  gradeName: string;
  onBack: () => void;
  onSuccess: (studentName: string) => void;
}

const ParentLogin = ({ grade, gradeName, onBack, onSuccess }: ParentLoginProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("id, student_name, pin_code")
        .eq("grade", grade)
        .order("student_name");

      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data || []);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [grade]);

  const handlePinComplete = (value: string) => {
    setPin(value);
    if (value.length === 4 && selectedStudent) {
      if (value === selectedStudent.pin_code) {
        setError("");
        onSuccess(selectedStudent.student_name);
      } else {
        setError("الرمز غير صحيح - أدخل آخر 4 أرقام من جوال ولي الأمر");
        setPin("");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // اختيار الطالب
  if (!selectedStudent) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-secondary/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">دخول ولي الأمر</h2>
          <p className="text-muted-foreground">{gradeName} - اختر اسم الطالب</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            رجوع
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer card-hover border-2 border-border hover:border-secondary bg-card"
                onClick={() => setSelectedStudent(student)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{student.student_name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // إدخال رمز PIN
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="bg-secondary/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Lock className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">أدخل رمز ولي الأمر</h2>
        <p className="text-muted-foreground">الطالب: {selectedStudent.student_name}</p>
      </div>

      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedStudent(null);
            setPin("");
            setError("");
          }}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          اختر طالب آخر
        </Button>

        <Card className="border-2 border-border bg-card">
          <CardContent className="p-8 flex flex-col items-center">
            <p className="text-muted-foreground mb-6">أدخل آخر 4 أرقام من جوال ولي الأمر</p>
            
            <div dir="ltr">
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={handlePinComplete}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-destructive mt-4 text-sm">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentLogin;
