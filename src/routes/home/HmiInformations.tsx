import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User2Icon } from "lucide-react"
import { Link, useParams } from "react-router-dom"



export default function HmiInformations() {

    const { id } = useParams();

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col  items-center p-[30px] justify-start rounded-t-3xl -mt-16 bg-white">

                <div className="flex w-[100%] justify-between items-center mt-2 mb-20">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to={`/user/home/${id}`}>
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

                <Accordion type="single" collapsible className="flex flex-col w-full gap-[20px] ">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-semibold hover:no-underline">O que é HMI?</AccordionTrigger>
                        <AccordionContent>
                            Lorem ipsum dolor sit amet. Vel dicta corporis ut optio praesentium et doloremque atque rem obcaecati molestias. Ut veritatis eaque ut totam velit qui doloremque dolores est assumenda similique. Et saepe accusamus sit corrupti voluptatem et asperiores aliquid ut consequuntur illum At aperiam dolor aut nesciunt officiis aut ullam minima.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="font-semibold hover:no-underline" >Tratamentos</AccordionTrigger>
                        <AccordionContent>
                            Et incidunt harum est facilis illo ad molestiae quia. Non voluptatem dolorum ex quis rerum et quas commodi sit officiis voluptas et dolor aliquid. Ut dignissimos dolor ut dolor deserunt quo minima iusto et quia quisquam ad pariatur fugiat ab itaque dolorum.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="font-semibold hover:no-underline" >Cuidados</AccordionTrigger>
                        <AccordionContent>
                            At nemo corrupti nam dolorem quidem sed alias quia in accusantium ipsam non accusamus facilis. Hic mollitia voluptatem aut voluptas minus ea similique vitae qui pariatur nisi et sunt adipisci. Eum quibusdam ducimus qui nesciunt doloribus aut delectus iure eos iusto modi qui possimus expedita ut vitae nesciunt? Est deserunt quasi ex iure possimus est architecto sint aut deserunt debitis aut omnis perferendis ea molestias quidem.
                            <br />
                            <br />
                            Lorem ipsum dolor sit amet. Cum architecto omnis qui internos sunt et illo consequuntur sed Quis animi est autem repellendus. Ut recusandae doloremque ea voluptatem dolore ad dolores placeat quo consequatur sapiente et enim internos rem incidunt voluptatum ut sunt consectetur. Hic vero placeat et Quis laborum est ratione aliquid in voluptatem omnis nam officia nostrum!
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="font-semibold hover:no-underline" >Dicas</AccordionTrigger>
                        <AccordionContent>
                            Lorem ipsum dolor sit amet. Vel quasi quia et eligendi Quis ut itaque unde sit itaque ratione aut sapiente explicabo in labore officia id amet voluptas. Aut unde corrupti non voluptates tenetur et beatae tempora in dolorum voluptatibus qui sint beatae eum fuga magnam et laborum illo. Aut beatae dolorem qui obcaecati voluptates et deserunt voluptatibus non rerum soluta et minima quaerat qui reiciendis sapiente. Sed maxime architecto qui veniam autem ex voluptatibus nisi est placeat aspernatur ut iure accusantium At nobis odit.

                            Id impedit saepe ut nihil libero non alias nobis vel cumque modi. Ad impedit praesentium ut sunt voluptatem ut enim quasi est soluta eligendi aut placeat laboriosam ab sunt earum!
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="font-semibold hover:no-underline" >FAQ</AccordionTrigger>
                        <AccordionContent>
                            Et molestiae similique aut tempora ducimus ab asperiores culpa vel voluptas consequatur rem asperiores iusto est quos nostrum. Et sunt maxime At sapiente nulla et praesentium sint eos dignissimos natus sed consectetur cumque. Sit pariatur voluptatem At mollitia nihil et numquam ducimus qui distinctio temporibus eos mollitia cumque. Ut dolores sunt et incidunt tempore et explicabo vero est asperiores pariatur in corporis explicabo non earum obcaecati?
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>


    )

}