import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface TeacherSelectorProps {
  teacherName: string;
  teacherSubject: string;
  onSelect: () => void;
}

const TeacherSelector = ({ teacherName, teacherSubject, onSelect }: TeacherSelectorProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-3">اختر المعلم</h2>
        <p className="text-muted-foreground">حدد المعلم للمتابعة</p>
      </div>
      <div className="max-w-md mx-auto">
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary"
          onClick={onSelect}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="text-right flex-1">
              <h3 className="text-xl font-bold text-foreground">{teacherName}</h3>
              <p className="text-muted-foreground text-sm">{teacherSubject}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherSelector;
