import { useEffect, useState } from "react";
import Stack from "@/components/Stack";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// No fallback images - all images will be loaded from database

interface TrainingImage {
  id: string;
  file_path: string;
  file_name: string;
}

const TrainingGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("training_images")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const imageUrls = data.map((img: TrainingImage) => {
            const { data: urlData } = supabase.storage
              .from("training-images")
              .getPublicUrl(img.file_path);
            return urlData.publicUrl;
          });
          setImages(imageUrls);
        } else {
          // Use fallback images if no images in database
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages(fallbackImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">جاري تحميل الشواهد...</p>
      </div>
    );
  }

  const cards = images.map((src, i) => (
    <div key={i} className="w-full h-full">
      <img
        src={src}
        alt={`شاهد التدريب ${i + 1}`}
        className="w-full h-full object-cover"
      />
    </div>
  ));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">شواهد التدريب</h1>
      <p className="text-muted-foreground mb-8 text-center">اسحب الصورة أو انقر للتنقل بين الشواهد</p>
      {images.length > 0 ? (
        <Stack
          cards={cards}
          randomRotation={true}
          sensitivity={80}
          sendToBackOnClick={true}
          autoplay={true}
          autoplayDelay={4000}
          pauseOnHover={true}
        />
      ) : (
        <p className="text-muted-foreground">لا توجد شواهد متاحة حالياً</p>
      )}
    </div>
  );
};

export default TrainingGallery;
