import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User2Icon } from "lucide-react";

export default function SkeletonLoading() {

    return (
        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <ArrowLeft color="black" />
                    </Button>

                    <h1 className="text-3xl font-bold">Crianças</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full rounded-xl" />

                <Button className="text-center mt-[20px]" type="submit">
                    Adicionar criança
                </Button>

            </div>
        </div>
    )

}