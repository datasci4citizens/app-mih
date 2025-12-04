import { useEffect, useState } from "react";
import minioClient from "@/lib/minio";
import { Skeleton } from "./skeleton";

interface MinioImageProps {
    path: string;
    className?: string;
}

export function MinioImage({ path, className }: MinioImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await minioClient.get(path, {
                    responseType: 'blob'
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [path]);

    if (loading) {
        return <Skeleton className={className} />;
    }

    if (error) {
        return <div className={className}>Error loading image</div>;
    }

    return <img src={imageUrl || ''} alt={path} className={className} />;
}
