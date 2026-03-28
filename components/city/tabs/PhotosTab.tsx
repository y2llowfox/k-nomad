import Image from "next/image";

interface PhotosTabProps {
  photos: string[];
  cityName: string;
}

export default function PhotosTab({ photos, cityName }: PhotosTabProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <p className="text-4xl mb-4">📷</p>
        <p className="text-lg font-medium text-muted-foreground">
          {cityName}의 사진이 아직 없습니다
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          사진을 업로드해 주세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((url, idx) => (
        <div
          key={idx}
          className="relative aspect-square rounded-lg overflow-hidden bg-muted"
        >
          <Image
            src={url}
            alt={`${cityName} 사진 ${idx + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      ))}
    </div>
  );
}
