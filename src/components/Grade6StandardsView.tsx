import { useState, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Standard, SubIndicator } from "@/data/standards";
import { PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import AnimatedList from "./AnimatedList";

interface Grade6StandardsViewProps {
  standards: Standard[];
  onStartQuiz: (standardId: string, subIndicatorId?: string) => void;
}

const Grade6StandardsView = ({ standards, onStartQuiz }: Grade6StandardsViewProps) => {
  const [openStandards, setOpenStandards] = useState<Record<string, boolean>>({});

  const toggleStandard = (standardId: string) => {
    setOpenStandards(prev => ({
      ...prev,
      [standardId]: !prev[standardId]
    }));
  };

  // فلترة المعايير التي تحتوي على مؤشرات فرعية (الصف السادس: لغتي، رياضيات، علوم | الصف الثالث: رياضيات، لغتي)
  const filteredStandards = standards.filter(
    s => (s.id.startsWith('std-r6-') || s.id.startsWith('std-m6-') || s.id.startsWith('std-s6-') || s.id.startsWith('std-m3-') || s.id.startsWith('std-r3-')) && s.subIndicators && s.subIndicators.length > 0
  );

  if (filteredStandards.length === 0) {
    return null;
  }

  // تحويل المعايير إلى عناصر قابلة للعرض
  const standardItems: ReactNode[] = filteredStandards.map((standard, index) => (
    <Card 
      key={standard.id} 
      className="border border-border bg-card overflow-hidden"
    >
      <Collapsible 
        open={openStandards[standard.id]} 
        onOpenChange={() => toggleStandard(standard.id)}
      >
        <CollapsibleTrigger asChild>
          <CardContent className="p-5 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 text-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      الكود: {standard.code}
                    </p>
                    <h4 className="font-bold text-foreground text-lg">
                      {standard.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {standard.subIndicators?.length} مؤشرات
                    </span>
                    {openStandards[standard.id] ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {standard.description}
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="border-t border-border bg-muted/30">
            <div className="p-4 space-y-3">
              <p className="text-sm font-medium text-foreground mb-3">
                المؤشرات الفرعية:
              </p>
              {standard.subIndicators?.map((subIndicator: SubIndicator) => (
                <div 
                  key={subIndicator.id}
                  className="bg-card rounded-lg p-4 border border-border hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium shrink-0 text-sm">
                      {subIndicator.code}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed">
                        {subIndicator.name}
                      </p>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartQuiz(standard.id, subIndicator.id);
                        }}
                        className="mt-3 btn-primary-gradient"
                        size="sm"
                      >
                        <PlayCircle className="w-4 h-4 ml-2" />
                        ابدأ الاختبار
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  ));

  return (
    <AnimatedList
      items={standardItems}
      showGradients={true}
      enableArrowNavigation={false}
      displayScrollbar={true}
      className="w-full"
    />
  );
};

export default Grade6StandardsView;
