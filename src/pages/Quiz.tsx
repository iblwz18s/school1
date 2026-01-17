import { useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStandardById, getSubIndicatorById } from "@/data/standards";
import { getQuestionsByStandard, getQuestionsBySubIndicator, Question, passages } from "@/data/questions";
import { ArrowRight, CheckCircle2, XCircle, Check, X, Lightbulb, Printer, FileText, SkipForward, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import SuccessResult from "@/components/ui/success-result";

// دالة لتوليد شرح تفصيلي للإجابة
const generateDetailedExplanation = (question: Question, userAnswer: number): string => {
  const correctOption = question.options[question.correctAnswer];
  const userOption = question.options[userAnswer];
  const arabicLetters = ["أ", "ب", "ج", "د"];
  const isCorrect = userAnswer === question.correctAnswer;
  
  // تحليل نوع السؤال وتقديم شرح مفصل
  
  // أسئلة المرادفات والأضداد
  if (question.text.includes("مرادف")) {
    const word = question.text.match(/كلمة\s*"([^"]+)"/)?.[1] || "";
    if (isCorrect) {
      return `أحسنت! "${correctOption}" هي المرادف الصحيح لكلمة "${word}". كلتا الكلمتين تحملان نفس المعنى ويمكن استخدامهما في نفس السياق.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}" وليس "${userOption}". المرادف يعني الكلمة التي تحمل نفس المعنى. فكلمة "${word}" تعني "${correctOption}"، بينما "${userOption}" لها معنى مختلف.`;
  }
  
  if (question.text.includes("ضد")) {
    const word = question.text.match(/كلمة\s*"([^"]+)"/)?.[1] || "";
    if (isCorrect) {
      return `ممتاز! "${correctOption}" هي الكلمة المضادة لـ "${word}". الضد يعني الكلمة التي تحمل معنى عكسي تماماً.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}". ضد الكلمة يعني عكسها في المعنى. فضد "${word}" هو "${correctOption}" لأنهما يحملان معنيين متعاكسين تماماً.`;
  }

  // أسئلة الجمع والمفرد
  if (question.text.includes("الجمع") || question.text.includes("جمع")) {
    if (isCorrect) {
      return `صحيح! "${correctOption}" هي صيغة الجمع لأنها تدل على أكثر من اثنين. علامات الجمع: ـون، ـين للمذكر السالم، ـات للمؤنث السالم، أو تغيير في بنية الكلمة لجمع التكسير.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}". الجمع يدل على أكثر من اثنين. "${userOption}" ليست جمعاً لأنها تدل على مفرد أو مثنى.`;
  }

  // أسئلة القيمة المنزلية
  if (question.text.includes("القيمة المنزلية")) {
    const number = question.text.match(/العدد\s*(\d+)/)?.[1] || "";
    const digit = question.text.match(/الرقم\s*(\d)/)?.[1] || "";
    if (isCorrect) {
      return `ممتاز! في العدد ${number}، الرقم ${digit} يقع في منزلة ${correctOption}. المنازل من اليمين: آحاد، عشرات، مئات، ألوف، عشرات الألوف.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. لتحديد القيمة المنزلية، عد المنازل من اليمين: المنزلة الأولى آحاد، الثانية عشرات، الثالثة مئات، الرابعة ألوف. في العدد ${number}، الرقم ${digit} يقع في منزلة ${correctOption}.`;
  }

  // أسئلة العمليات الحسابية
  if (question.text.includes("ناتج") || question.text.includes("=")) {
    if (question.text.includes("+")) {
      if (isCorrect) {
        return `أحسنت! الناتج ${correctOption} صحيح. للتحقق: اجمع الأرقام من اليمين (الآحاد) أولاً، ثم العشرات، ثم المئات مع مراعاة الحمل إذا تجاوز الناتج 9.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. عند الجمع، ابدأ من الآحاد وانتقل يساراً. إذا تجاوز الناتج 9، احمل 1 للمنزلة التالية.`;
    }
    if (question.text.includes("-")) {
      if (isCorrect) {
        return `ممتاز! الناتج ${correctOption} صحيح. للتحقق: اطرح الأرقام من اليمين مع الاستلاف من المنزلة الأعلى عند الحاجة.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. عند الطرح، ابدأ من الآحاد. إذا كان الرقم العلوي أصغر، استلف 1 من المنزلة التالية (تصبح 10).`;
    }
    if (question.text.includes("×") || question.text.includes("*")) {
      if (isCorrect) {
        return `رائع! ${correctOption} هو الناتج الصحيح. الضرب هو جمع متكرر، مثلاً 4 × 5 يعني جمع 5 أربع مرات.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. تذكر جدول الضرب، أو استخدم الجمع المتكرر للتحقق.`;
    }
    if (question.text.includes("÷")) {
      if (isCorrect) {
        return `أحسنت! الناتج ${correctOption} صحيح. القسمة هي عكس الضرب، أي توزيع العدد بالتساوي.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. القسمة تعني التوزيع المتساوي. للتحقق: اضرب الناتج في المقسوم عليه، يجب أن يساوي المقسوم.`;
    }
  }

  // أسئلة الكسور
  if (question.text.includes("كسر") || question.text.includes("كسور")) {
    if (question.text.includes("يكافئ") || question.text.includes("متكافئ")) {
      if (isCorrect) {
        return `صحيح! الكسران متكافئان لأن لهما نفس القيمة. للتحقق: اضرب أو اقسم البسط والمقام بنفس العدد.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. الكسور المتكافئة لها نفس القيمة. مثلاً 1/2 = 2/4 لأننا ضربنا البسط والمقام في 2.`;
    }
    if (question.text.includes("أكبر") || question.text.includes("أصغر")) {
      if (isCorrect) {
        return `ممتاز! عند مقارنة الكسور بنفس المقام، الكسر ذو البسط الأكبر هو الأكبر. وعند تساوي البسط، الكسر ذو المقام الأصغر هو الأكبر.`;
      }
      return `الإجابة الصحيحة هي ${correctOption}. لمقارنة الكسور: إذا تساوت المقامات، قارن البسط. إذا تساوت البسوط، الكسر ذو المقام الأصغر أكبر (1/2 > 1/3).`;
    }
  }

  // أسئلة المحيط والمساحة
  if (question.text.includes("محيط")) {
    if (isCorrect) {
      return `أحسنت! المحيط = مجموع أطوال جميع الأضلاع. للمربع: المحيط = 4 × طول الضلع. للمستطيل: المحيط = 2 × (الطول + العرض).`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. المحيط هو مجموع أطوال جميع الأضلاع. راجع الأبعاد المعطاة واجمعها.`;
  }

  if (question.text.includes("مساحة")) {
    if (isCorrect) {
      return `ممتاز! مساحة المربع = الضلع × الضلع. مساحة المستطيل = الطول × العرض. المساحة تقاس بالوحدات المربعة.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. لحساب المساحة: المربع = الضلع²، المستطيل = الطول × العرض. راجع الأبعاد المعطاة.`;
  }

  // أسئلة الوقت
  if (question.text.includes("ساعة") || question.text.includes("دقيقة") || question.text.includes("الوقت")) {
    if (isCorrect) {
      return `صحيح! تذكر: الساعة = 60 دقيقة، نصف ساعة = 30 دقيقة، ربع ساعة = 15 دقيقة. اليوم = 24 ساعة.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. الساعة = 60 دقيقة. لحساب الوقت، حول جميع القيم لنفس الوحدة (دقائق) ثم أجرِ العملية.`;
  }

  // أسئلة القياس
  if (question.text.includes("لتر") || question.text.includes("مليلتر")) {
    if (isCorrect) {
      return `أحسنت! 1 لتر = 1000 مليلتر. للتحويل من لتر إلى مليلتر اضرب في 1000، والعكس اقسم على 1000.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. تذكر: 1 لتر = 1000 مليلتر. استخدم هذه العلاقة في التحويل.`;
  }

  if (question.text.includes("كيلو") || question.text.includes("جرام")) {
    if (isCorrect) {
      return `ممتاز! 1 كيلوجرام = 1000 جرام. للتحويل من كيلو إلى جرام اضرب في 1000.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. تذكر: 1 كيلوجرام = 1000 جرام. استخدم هذه العلاقة في الحل.`;
  }

  if (question.text.includes("سنتمتر") || question.text.includes("متر")) {
    if (isCorrect) {
      return `صحيح! 1 متر = 100 سنتمتر. للتحويل من متر إلى سنتمتر اضرب في 100.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. تذكر: 1 متر = 100 سنتمتر. استخدم هذه العلاقة في التحويل.`;
  }

  // أسئلة النقود
  if (question.text.includes("ريال") || question.text.includes("نقود") || question.text.includes("مبلغ")) {
    if (isCorrect) {
      return `أحسنت! في المسائل المالية، استخدم الجمع لحساب المجموع والطرح لحساب الباقي أو الفرق.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. اقرأ المسألة بتمعن: هل المطلوب المجموع (جمع) أم الباقي (طرح) أم الفرق؟`;
  }

  // أسئلة الزوايا
  if (question.text.includes("زاوية") || question.text.includes("زوايا")) {
    if (isCorrect) {
      return `ممتاز! الزاوية القائمة = 90°، الزاوية الحادة < 90°، الزاوية المنفرجة > 90° و < 180°، الزاوية المستقيمة = 180°.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. أنواع الزوايا: القائمة = 90°، الحادة أقل من 90°، المنفرجة بين 90° و 180°.`;
  }

  // أسئلة النسبة المئوية
  if (question.text.includes("نسبة") || question.text.includes("%")) {
    if (isCorrect) {
      return `أحسنت! النسبة المئوية = (الجزء ÷ الكل) × 100. مثلاً: 25% تعني 25 من كل 100، أي ربع الكمية.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. لحساب النسبة المئوية: اقسم الجزء على الكل واضرب في 100.`;
  }

  // أسئلة الأنماط
  if (question.text.includes("نمط") || question.text.includes("النمط") || question.text.includes("التسلسل")) {
    if (isCorrect) {
      return `ممتاز! لإيجاد النمط، ابحث عن العلاقة بين الأعداد المتتالية (جمع، طرح، ضرب، أو قسمة بقيمة ثابتة).`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. لإيجاد النمط: احسب الفرق أو النسبة بين كل عددين متتاليين لاكتشاف القاعدة.`;
  }

  // أسئلة الترتيب
  if (question.text.includes("رتب") || question.text.includes("تصاعدي") || question.text.includes("تنازلي")) {
    if (isCorrect) {
      return `صحيح! الترتيب التصاعدي من الأصغر للأكبر، والتنازلي من الأكبر للأصغر. قارن الأرقام منزلة بمنزلة من اليسار.`;
    }
    return `الإجابة الصحيحة هي ${correctOption}. للترتيب: قارن عدد المنازل أولاً، ثم قارن الأرقام من اليسار.`;
  }

  // أسئلة الأفكار الصريحة
  if (question.text.includes("متى") || question.text.includes("أين") || question.text.includes("من") || question.text.includes("ماذا") || question.text.includes("كم")) {
    if (isCorrect) {
      return `أحسنت! لقد استخرجت المعلومة الصحيحة من النص. دائماً ابحث عن الكلمات المفتاحية التي تجيب على السؤال مباشرة.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}". اقرأ النص بعناية وابحث عن الكلمة أو العبارة التي تجيب مباشرة على السؤال المطروح.`;
  }

  // أسئلة التعبير الجمالي والحقيقة والرأي
  if (question.text.includes("تعبير جمالي") || question.text.includes("تشبيه") || question.text.includes("مجاز")) {
    if (isCorrect) {
      return `ممتاز! التعبير الجمالي يستخدم الصور والتشبيهات لتجميل المعنى، مثل: "القمر مصباح الليل" يشبه القمر بالمصباح.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}". التعبير الجمالي يتضمن تشبيهات واستعارات تُجمّل المعنى وتثري اللغة.`;
  }

  if (question.text.includes("حقيقة") || question.text.includes("رأي")) {
    if (isCorrect) {
      return `صحيح! الحقيقة يمكن إثباتها ولا تختلف من شخص لآخر، أما الرأي فهو وجهة نظر شخصية قد تختلف.`;
    }
    return `الإجابة الصحيحة هي "${correctOption}". الحقيقة ثابتة ويمكن التحقق منها، أما الرأي فيبدأ غالباً بـ "أعتقد" أو "في رأيي" ويختلف من شخص لآخر.`;
  }

  // شرح عام محسّن
  if (isCorrect) {
    return `إجابة صحيحة! "${correctOption}" هي الإجابة الصحيحة. استمر في التركيز وقراءة الأسئلة بعناية.`;
  }
  return `الإجابة الصحيحة هي (${arabicLetters[question.correctAnswer]}) "${correctOption}" وليس "${userOption}". راجع المفهوم المتعلق بهذا السؤال وحاول فهم الفرق بين الخيارات.`;
};

interface QuestionResult {
  question: Question;
  userAnswer: number;
  isCorrect: boolean;
}

type NavigationState = {
  selectedGrade: string | null;
  selectedSubject: string | null;
  selectedTeacher: boolean;
  selectedStudent: string | null;
  userType: "teacher" | "parent" | null;
};

const Quiz = () => {
  const { standardId } = useParams<{ standardId: string }>();
  const [searchParams] = useSearchParams();
  const subIndicatorId = searchParams.get('subIndicator');
  const navigate = useNavigate();
  const location = useLocation();
  const returnState = (location.state ?? null) as NavigationState | null;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showPassage, setShowPassage] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  // الحصول على اسم الطالب من sessionStorage
  const studentName = sessionStorage.getItem('selectedStudent') || '';

  const standard = standardId ? getStandardById(standardId) : null;
  const subIndicatorInfo = subIndicatorId ? getSubIndicatorById(subIndicatorId) : null;
  
  // الحصول على الأسئلة حسب المؤشر الفرعي إذا كان موجوداً
  const questions = useMemo(() => {
    if (!standardId) return [];
    if (subIndicatorId) {
      return getQuestionsBySubIndicator(standardId, subIndicatorId);
    }
    return getQuestionsByStandard(standardId);
  }, [standardId, subIndicatorId]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // تحديد القطعة النصية للسؤال الحالي
  const getCurrentPassage = () => {
    if (!currentQuestion) return null;
    
    // التحقق من وجود passage في السؤال واستخدامه مباشرة
    if (currentQuestion.passage && passages[currentQuestion.passage]) {
      return passages[currentQuestion.passage];
    }
    
    // للصف الثالث - الأسئلة القديمة التي لا تحتوي على passage
    if (standardId?.startsWith('std-r3')) {
      const questionId = currentQuestion.id;
      if (questionId.includes('r3-1-') || questionId.includes('r3-2-') || questionId.includes('r3-3-')) {
        const qNum = parseInt(questionId.split('-').pop() || '0');
        if (qNum >= 1 && qNum <= 10) return passages.satellites;
        if (qNum >= 11 && qNum <= 20) return passages.altruism;
        if (qNum >= 21 && qNum <= 30) return passages.blueWhale;
      }
    }
    
    return null;
  };

  const currentPassage = getCurrentPassage();

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    setShowFeedback(true);
  };

  const handleSkipQuestion = () => {
    const newAnswers = [...answers, null]; // null يعني تم تخطي السؤال
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAnswerSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer!];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsAnswerSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer !== null && answer === questions[index]?.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getQuestionResults = (): QuestionResult[] => {
    return questions.map((question, index) => ({
      question,
      userAnswer: answers[index] ?? -1, // -1 يعني تم تخطي السؤال
      isCorrect: answers[index] !== null && answers[index] === question.correctAnswer
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const arabicLetters = ["أ", "ب", "ج", "د"];

  if (!standard || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground">لا توجد أسئلة لهذا المعيار</p>
          <Button onClick={() => navigate("/")} className="mt-4">العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const results = getQuestionResults();
    
    const getMasteryLevel = (percent: number) => {
      if (percent >= 90) return { text: "متقن", color: "text-green-600 dark:text-green-400" };
      if (percent >= 75) return { text: "جيد جداً", color: "text-blue-600 dark:text-blue-400" };
      if (percent >= 60) return { text: "جيد", color: "text-yellow-600 dark:text-yellow-400" };
      if (percent >= 50) return { text: "مقبول", color: "text-orange-600 dark:text-orange-400" };
      return { text: "يحتاج تحسين", color: "text-red-600 dark:text-red-400" };
    };

    const mastery = getMasteryLevel(percentage);
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* تقرير الطباعة */}
          <div ref={reportRef} className="print:block">
            {/* ملخص النتيجة */}
            <Card className="max-w-4xl mx-auto shadow-medium animate-scale-in mb-8 print:shadow-none print:mb-4">
              <CardContent className="p-8 print:p-4">
                {/* رسالة النجاح */}
                <SuccessResult />
                
                {/* رأس التقرير للطباعة */}
                <div className="hidden print:block text-center mb-4 border-b pb-4">
                  <h1 className="text-xl font-bold">ابتدائية سعد بن أبي وقاص</h1>
                  <p className="text-sm text-muted-foreground">تقرير اختبار محاكي لاختبارات نافس</p>
                </div>

                {/* اسم الطالب */}
                {studentName && (
                  <div className="text-center mb-6 p-4 bg-primary/10 rounded-lg print:bg-transparent print:border print:border-primary print:p-2 print:mb-2">
                    <p className="text-sm text-muted-foreground">اسم الطالب</p>
                    <p className="text-2xl font-bold text-primary print:text-lg">{studentName}</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-8 print:gap-4 print:flex-row">
                  <div className={`w-32 h-32 print:w-16 print:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${percentage >= 60 ? 'bg-primary' : 'bg-destructive'}`}>
                    {percentage >= 60 ? (
                      <CheckCircle2 className="w-16 h-16 print:w-8 print:h-8 text-primary-foreground" />
                    ) : (
                      <XCircle className="w-16 h-16 print:w-8 print:h-8 text-destructive-foreground" />
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h2 className="text-3xl print:text-lg font-bold text-foreground mb-2">تقرير نتيجة الاختبار</h2>
                    <p className="text-lg print:text-sm text-muted-foreground mb-4 print:mb-2">
                      {subIndicatorInfo ? subIndicatorInfo.subIndicator.name : standard.name}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2 mt-6 print:mt-2">
                      <div className="bg-muted/50 rounded-lg p-4 print:p-2">
                        <p className="text-sm print:text-xs text-muted-foreground">النسبة المئوية</p>
                        <p className="text-3xl print:text-lg font-bold text-foreground">{percentage}%</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 print:p-2">
                        <p className="text-sm print:text-xs text-muted-foreground">الإجابات الصحيحة</p>
                        <p className="text-3xl print:text-lg font-bold text-green-600">{score}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 print:p-2">
                        <p className="text-sm print:text-xs text-muted-foreground">الإجابات الخاطئة</p>
                        <p className="text-3xl print:text-lg font-bold text-red-600">{questions.length - score}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4 print:p-2">
                        <p className="text-sm print:text-xs text-muted-foreground">مستوى الإتقان</p>
                        <p className={`text-xl print:text-sm font-bold ${mastery.color}`}>{mastery.text}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* أزرار التحكم */}
                <div className="flex flex-wrap gap-4 justify-center mt-8 print:hidden">
                  <Button onClick={() => navigate("/")} variant="outline">
                    <ArrowRight className="w-4 h-4 ml-2" />
                    العودة للرئيسية
                  </Button>
                  <Button onClick={() => {
                    setCurrentQuestionIndex(0);
                    setAnswers([]);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    setShowFeedback(false);
                    setIsAnswerSubmitted(false);
                  }} className="btn-primary-gradient">
                    إعادة الاختبار
                  </Button>
                  <Button onClick={handlePrint} variant="outline" className="gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* التقرير التفصيلي */}
            <Card className="max-w-4xl mx-auto shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">التقرير التفصيلي للأسئلة</h3>
                </div>

                <div className="space-y-6">
                  {results.map((result, index) => (
                    <div 
                      key={result.question.id} 
                      className={`p-4 rounded-lg border-2 ${
                        result.isCorrect 
                          ? 'bg-green-500/5 border-green-500/30' 
                          : 'bg-red-500/5 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {result.isCorrect ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <X className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">السؤال {index + 1}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              result.isCorrect 
                                ? 'bg-green-500/20 text-green-700 dark:text-green-400' 
                                : 'bg-red-500/20 text-red-700 dark:text-red-400'
                            }`}>
                              {result.isCorrect ? 'صحيح' : 'خاطئ'}
                            </span>
                          </div>
                          <p className="font-medium text-foreground mb-3">{result.question.text}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            {result.question.options.map((option, optIndex) => {
                              const isUserChoice = optIndex === result.userAnswer;
                              const isCorrectOption = optIndex === result.question.correctAnswer;
                              
                              let optionClass = "text-muted-foreground";
                              if (isCorrectOption) optionClass = "text-green-700 dark:text-green-400 font-medium";
                              if (isUserChoice && !result.isCorrect) optionClass = "text-red-700 dark:text-red-400 line-through";
                              
                              return (
                                <div key={optIndex} className={`flex items-center gap-2 text-sm ${optionClass}`}>
                                  <span>{arabicLetters[optIndex]}.</span>
                                  <span>{option}</span>
                                  {isCorrectOption && <Check className="w-4 h-4 text-green-600" />}
                                  {isUserChoice && !result.isCorrect && <X className="w-4 h-4 text-red-600" />}
                                </div>
                              );
                            })}
                          </div>

                          <div className={`p-3 rounded-lg ${
                            result.isCorrect 
                              ? 'bg-green-500/10' 
                              : 'bg-amber-500/10'
                          }`}>
                            <div className="flex items-start gap-2">
                              <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                result.isCorrect ? 'text-green-600' : 'text-amber-600'
                              }`} />
                              <p className="text-sm text-foreground">
                                {generateDetailedExplanation(result.question, result.userAnswer)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ملخص نهائي للطباعة */}
                <div className="mt-4 p-2 bg-muted/50 rounded-lg print:block hidden border-t">
                  <p className="text-center text-muted-foreground text-xs">
                    تاريخ الاختبار: {new Date().toLocaleDateString('ar-SA')} | 
                    {studentName && ` الطالب: ${studentName} |`}
                    المعيار: {standard.name} | 
                    النتيجة: {score}/{questions.length} ({percentage}%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* أنماط الطباعة */}
        <style>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body * {
              visibility: visible;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
            @page {
              margin: 0.5cm;
              size: A4;
            }
            .space-y-6 > * {
              page-break-inside: avoid;
              margin-bottom: 8px !important;
            }
            .space-y-6 {
              gap: 8px !important;
            }
            p, h3, h4 {
              font-size: 10px !important;
              line-height: 1.3 !important;
            }
            .text-xl {
              font-size: 12px !important;
            }
            .text-2xl, .text-3xl {
              font-size: 14px !important;
            }
            .p-4 {
              padding: 6px !important;
            }
            .p-3 {
              padding: 4px !important;
            }
            .mb-3, .mb-4, .mb-6 {
              margin-bottom: 4px !important;
            }
            .gap-4, .gap-6 {
              gap: 4px !important;
            }
            .rounded-lg {
              border-radius: 4px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => {
            if (returnState) {
              navigate("/", { state: returnState });
              return;
            }
            navigate("/");
          }} 
          className="mb-4 text-muted-foreground"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          العودة للمعايير
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              {subIndicatorInfo ? (
                <span>
                  {standard.name} - <span className="text-primary font-medium">{subIndicatorInfo.subIndicator.name}</span>
                </span>
              ) : standard.name}
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground font-medium">السؤال {currentQuestionIndex + 1} من {questions.length}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              {/* عرض القطعة النصية */}
              {currentPassage && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <button
                    onClick={() => setShowPassage(!showPassage)}
                    className="w-full flex items-center justify-between text-right mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="font-bold text-foreground">القطعة النصية: {currentPassage.title}</span>
                    </div>
                    {showPassage ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {showPassage && (
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto pr-2">
                      {currentPassage.text}
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-6">{currentQuestion.text}</h3>
              
              {/* عرض صورة السؤال إن وجدت */}
              {currentQuestion.image && (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={currentQuestion.image} 
                    alt="صورة توضيحية للسؤال" 
                    className="max-w-xs rounded-lg border border-border shadow-sm"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = index === currentQuestion.correctAnswer;
                  
                  let buttonStyle = "border-border bg-card hover:border-muted-foreground text-foreground";
                  
                  if (showFeedback) {
                    if (isCorrectOption) {
                      buttonStyle = "border-green-500 bg-green-500/20 text-foreground";
                    } else if (isSelected && !isCorrectOption) {
                      buttonStyle = "border-red-500 bg-red-500/20 text-foreground";
                    } else {
                      buttonStyle = "border-border bg-card text-muted-foreground opacity-50";
                    }
                  } else if (isSelected) {
                    buttonStyle = "border-primary bg-primary/10 text-foreground";
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-right p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${buttonStyle} ${isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center">
                        <span className="font-medium ml-3">{arabicLetters[index]}.</span>
                        {option}
                      </div>
                      {showFeedback && isCorrectOption && (
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                      {showFeedback && isSelected && !isCorrectOption && (
                        <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* صندوق التغذية الراجعة */}
              {showFeedback && selectedAnswer !== null && (
                <div className={`mt-6 p-4 rounded-lg border-2 animate-fade-in ${isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-amber-500/10 border-amber-500'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-amber-500'}`}>
                      {isCorrect ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {isCorrect ? "إجابة صحيحة! أحسنت" : "إجابة خاطئة"}
                      </h4>
                      <p className="text-foreground text-sm leading-relaxed">
                        {generateDetailedExplanation(currentQuestion, selectedAnswer)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!showFeedback ? (
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1 btn-primary-gradient disabled:opacity-50"
                  >
                    تأكيد الإجابة
                  </Button>
                  <Button
                    onClick={handleSkipQuestion}
                    variant="outline"
                    className="gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    تخطي
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full mt-6 btn-primary-gradient"
                >
                  {currentQuestionIndex < questions.length - 1 ? "السؤال التالي" : "إنهاء الاختبار"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
