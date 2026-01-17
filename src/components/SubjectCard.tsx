import { Card, CardContent } from "@/components/ui/card";
import { Subject } from "@/data/standards";
import scienceIcon from "@/assets/science-icon.png";
import bookIcon from "@/assets/book-icon.gif";
import mathIcon from "@/assets/math-icon.gif";

interface SubjectCardProps {
  subject: Subject;
  onClick: () => void;
}

const SubjectCard = ({ subject, onClick }: SubjectCardProps) => {
  const isScience6 = subject.id === "science-6";
  const isReading3 = subject.id === "reading-3";
  const isMath3 = subject.id === "math-3";
  return (
    <Card 
      className="cursor-pointer card-hover border-2 border-border hover:border-secondary bg-card"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        {isMath3 ? (
          <img src={mathIcon} alt="الرياضيات" className="w-16 h-16 mx-auto mb-4" />
        ) : isReading3 ? (
          <img src={bookIcon} alt="لغتي" className="w-16 h-16 mx-auto mb-4" />
        ) : isScience6 ? (
          <img src={scienceIcon} alt="العلوم الطبيعية" className="w-16 h-16 mx-auto mb-4" />
        ) : (
          <div className="text-5xl mb-4">{subject.icon}</div>
        )}
        <h3 className="text-lg font-bold text-foreground">{subject.name}</h3>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
