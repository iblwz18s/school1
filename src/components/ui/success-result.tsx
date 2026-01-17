import { CheckCircle2 } from "lucide-react";

const SuccessResult = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 animate-scale-in">
      <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center animate-fade-in">
        <CheckCircle2 className="w-14 h-14 text-white" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">تم إنهاء الاختبار بنجاح</h2>
        <p className="text-muted-foreground">أحسنت! لقد أكملت جميع الأسئلة</p>
      </div>
    </div>
  );
};

export default SuccessResult;
