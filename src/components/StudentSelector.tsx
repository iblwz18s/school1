import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, Hand, User, RotateCcw } from "lucide-react";
import SpinWheel from "./SpinWheel";

interface StudentSelectorProps {
  students: string[];
  onSelect: (student: string) => void;
}

const StudentSelector = ({ students, onSelect }: StudentSelectorProps) => {
  const [mode, setMode] = useState<"choose" | "random" | "manual" | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRandomSelect = (student: string) => {
    setSelectedStudent(student);
    setIsSpinning(false);
  };

  const handleManualSelect = (student: string) => {
    setSelectedStudent(student);
  };

  const handleConfirm = () => {
    if (selectedStudent) {
      // حفظ اسم الطالب في sessionStorage للاستخدام في صفحة الاختبار
      sessionStorage.setItem('selectedStudent', selectedStudent);
      onSelect(selectedStudent);
    }
  };

  const handleReset = () => {
    setSelectedStudent(null);
    setIsSpinning(false);
  };

  if (mode === null) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-3">اختر طريقة تحديد الطالب</h2>
          <p className="text-muted-foreground">حدد كيفية اختيار الطالب للاختبار</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary"
            onClick={() => setMode("random")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shuffle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">اختيار عشوائي</h3>
              <p className="text-muted-foreground text-sm">عجلة دوارة لاختيار الطالب بشكل عشوائي</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary"
            onClick={() => setMode("manual")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Hand className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">اختيار يدوي</h3>
              <p className="text-muted-foreground text-sm">اختر الطالب من القائمة مباشرة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === "random") {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-3">عجلة الحظ</h2>
          <p className="text-muted-foreground">اضغط على العجلة للدوران</p>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <SpinWheel 
            students={students} 
            onSelect={handleRandomSelect}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
          
          {selectedStudent && (
            <div className="text-center animate-fade-in">
              <div className="bg-primary/10 rounded-xl p-6 mb-4">
                <p className="text-muted-foreground mb-2">الطالب المختار:</p>
                <h3 className="text-2xl font-bold text-primary">{selectedStudent}</h3>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleConfirm} size="lg">
                  متابعة للاختبار
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RotateCcw className="w-4 h-4 ml-2" />
                  إعادة الدوران
                </Button>
              </div>
            </div>
          )}
          
          <Button variant="ghost" onClick={() => setMode(null)} className="mt-4">
            رجوع لاختيار الطريقة
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "manual") {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-3">اختر الطالب</h2>
          <p className="text-muted-foreground">اضغط على اسم الطالب لاختياره</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {students.map((student, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:scale-102 ${
                  selectedStudent === student 
                    ? "border-2 border-primary bg-primary/5" 
                    : "border hover:border-primary/50"
                }`}
                onClick={() => handleManualSelect(student)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedStudent === student ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">{student}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedStudent && (
            <div className="text-center animate-fade-in">
              <Button onClick={handleConfirm} size="lg" className="mb-4">
                متابعة للاختبار مع {selectedStudent}
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <Button variant="ghost" onClick={() => setMode(null)}>
              رجوع لاختيار الطريقة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudentSelector;
