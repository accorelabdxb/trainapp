import { useCallback, useEffect, useRef, useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadItem {
    id: string;
    uri: string;
    status: UploadStatus;
    progress: number;
    retryCount: number;
    error?: string;
}

interface UseBackgroundUploadOptions {
    uploadEndpoint: string;
    maxRetries?: number;
    baseDelay?: number;
}

export const useBackgroundUpload = ({
    uploadEndpoint,
    maxRetries = 3,
    baseDelay = 1000,
}: UseBackgroundUploadOptions) => {
    const [queue, setQueue] = useState<UploadItem[]>([]);
    const isUploadingRef = useRef(false);

    const addToQueue = useCallback((uri: string) => {
        const newItem: UploadItem = {
            id: Math.random().toString(36).substr(2, 9),
            uri,
            status: 'idle',
            progress: 0,
            retryCount: 0,
        };
        setQueue((prev) => [...prev, newItem]);
    }, []);

    const processQueue = useCallback(async () => {
        if (isUploadingRef.current) return;

        const itemToUpload = queue.find((item) => item.status === 'idle' || item.status === 'error');

        if (!itemToUpload) return;

        // Check if max retries exceeded for error items
        if (itemToUpload.status === 'error' && itemToUpload.retryCount >= maxRetries) {
            // Mark as failed permanently or move to a separate failed list
            // For now, we skip processing it loop
            return;
        }

        isUploadingRef.current = true;

        // Update status to uploading
        setQueue((prev) =>
            prev.map((i) => (i.id === itemToUpload.id ? { ...i, status: 'uploading' } : i))
        );

        try {
            // Simulate upload (Replace with actual fetch/xhr)
            // await uploadFile(itemToUpload.uri);
            // For demo, we just wait a bit
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate random failure for backoff testing
            if (Math.random() < 0.1) throw new Error("Random upload failure");

            // Success
            setQueue((prev) =>
                prev.map((i) => (i.id === itemToUpload.id ? { ...i, status: 'success', progress: 100 } : i))
            );
        } catch (err: any) {
            // Failure
            const retryCount = itemToUpload.retryCount + 1;
            const delay = baseDelay * Math.pow(2, retryCount);

            console.log(`Upload failed for ${itemToUpload.id}. Retrying in ${delay}ms. Attempt ${retryCount}`);

            setQueue((prev) =>
                prev.map((i) => (i.id === itemToUpload.id ? { ...i, status: 'error', retryCount, error: err.message } : i))
            );

            // Schedule retry if not max retries
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    // Reset status to idle to be picked up again
                    setQueue((prev) =>
                        prev.map((i) => (i.id === itemToUpload.id ? { ...i, status: 'idle' } : i))
                    );
                }, delay);
            }
        } finally {
            isUploadingRef.current = false;
            // Trigger next process attempt
            processQueue();
        }
    }, [queue, maxRetries, baseDelay]);

    // Watch for changes in queue to trigger processing
    useEffect(() => {
        const hasPending = queue.some((item) => item.status === 'idle');
        if (hasPending && !isUploadingRef.current) {
            processQueue();
        }
    }, [queue, processQueue]);

    return {
        queue,
        addToQueue,
    };
};
