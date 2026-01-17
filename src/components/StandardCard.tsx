import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Standard } from "@/data/standards";
import { PlayCircle } from "lucide-react";

interface StandardCardProps {
  standard: Standard;
  index: number;
  onClick: () => void;
}

const StandardCard = ({ standard, index, onClick }: StandardCardProps) => {
  return (
    <Card className="border border-border bg-card hover:shadow-medium transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
            {index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground mb-2">{standard.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{standard.description}</p>
            <Button 
              onClick={onClick}
              className="mt-4 btn-primary-gradient"
              size="sm"
            >
              <PlayCircle className="w-4 h-4 ml-2" />
              ابدأ الاختبار
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardCard;
