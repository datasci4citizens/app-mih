import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingInfos() {

    return (

        <div className="min-h-screen relative flex justify-center items-center">
            <div className="z-10 h-[100px] w-[50%] bg-primary text-white border-4 rounded-xl overflow-visible flex items-center justify-center"> <Skeleton className="font-bold text-xl bg-white/0">Carregando</Skeleton>

            </div>
        </div>

    )

}