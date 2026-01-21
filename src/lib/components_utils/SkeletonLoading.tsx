import { Skeleton } from "@/components/ui/skeleton";
import { ToyBackground } from "@/components/ui/toy-background";

export default function SkeletonLoading() {
    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">
                {/* Header Skeleton */}
                <div className="px-6 pt-6 pb-4 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg bg-white/40" />
                    <div className="flex-1">
                        <Skeleton className="h-6 w-32 mb-2 bg-white/40" />
                        <Skeleton className="h-4 w-24 bg-white/30" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto space-y-6">
                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-24 rounded-2xl bg-white/60" />
                                <Skeleton className="h-24 rounded-2xl bg-white/60" />
                            </div>

                            {/* Cards Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-32 rounded-3xl bg-white/70" />
                                <Skeleton className="h-32 rounded-3xl bg-white/70" />
                                <Skeleton className="h-32 rounded-3xl bg-white/70" />
                                <Skeleton className="h-32 rounded-3xl bg-white/70" />
                            </div>

                            {/* Button Skeleton */}
                            <Skeleton className="h-14 w-full rounded-2xl bg-white/50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}