import { useEffect, useState } from "react";
import apiClient from "@/lib/axios";
import { Skeleton } from "./skeleton";

interface MinioImageProps {
    imageId: number | null | undefined;
    className?: string;
}

export function MinioImage({ imageId, className }: MinioImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!imageId) {
            setLoading(false);
            setError(true);
            return;
        }

        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                const response = await apiClient.get(`/api/images/${imageId}/content/`, {
                    responseType: 'blob'
                });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                objectUrl = URL.createObjectURL(blob);
                setImageUrl(objectUrl);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageId]);

    if (loading) {
        return <Skeleton className={className} />;
    }

    if (error || !imageUrl) {
        return <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-400 text-xs`}>Sem imagem</div>;
    }

    return <img src={imageUrl} alt={`Image ${imageId}`} className={className} />;
}
