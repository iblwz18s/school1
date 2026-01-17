import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Teacher {
    id: string;
    name: string;
    subject: string;
    grade: string;
}

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [newTeacher, setNewTeacher] = useState({
        name: "",
        subject: "",
        grade: ""
    });
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        const { data, error } = await supabase
            .from("teachers")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("خطأ في جلب المعلمين");
            console.error(error);
        } else {
            setTeachers(data || []);
        }
    };

    const addTeacher = async () => {
        if (!newTeacher.name || !newTeacher.subject || !newTeacher.grade) {
            toast.error("يرجى ملء جميع الحقول");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase
            .from("teachers")
            .insert([newTeacher]);

        if (error) {
            toast.error("خطأ في إضافة المعلم");
            console.error(error);
        } else {
            toast.success("تم إضافة المعلم بنجاح");
            setNewTeacher({ name: "", subject: "", grade: "" });
            setIsAdding(false);
            fetchTeachers();
        }
        setIsLoading(false);
    };

    const deleteTeacher = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) {
            return;
        }

        const { error } = await supabase
            .from("teachers")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("خطأ في حذف المعلم");
            console.error(error);
        } else {
            toast.success("تم حذف المعلم بنجاح");
            fetchTeachers();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">إدارة المعلمين</h2>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="ml-2 w-4 h-4" />
                    إضافة معلم
                </Button>
            </div>

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>إضافة معلم جديد</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">اسم المعلم</label>
                            <Input
                                placeholder="مثال: أستاذ محمد أحمد"
                                value={newTeacher.name}
                                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">المادة</label>
                            <Input
                                placeholder="مثال: الرياضيات"
                                value={newTeacher.subject}
                                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">الصف</label>
                            <Select
                                value={newTeacher.grade}
                                onValueChange={(value) => setNewTeacher({ ...newTeacher, grade: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر الصف" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="3">الصف الثالث</SelectItem>
                                    <SelectItem value="6">الصف السادس</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button onClick={addTeacher} disabled={isLoading}>
                                {isLoading ? "جاري الحفظ..." : "حفظ"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewTeacher({ name: "", subject: "", grade: "" });
                                }}
                            >
                                إلغاء
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {teachers.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            لا يوجد معلمون حالياً. قم بإضافة معلم جديد للبدء.
                        </CardContent>
                    </Card>
                ) : (
                    teachers.map((teacher) => (
                        <Card key={teacher.id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">{teacher.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {teacher.subject} - الصف {teacher.grade}
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteTeacher(teacher.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherManagement;
