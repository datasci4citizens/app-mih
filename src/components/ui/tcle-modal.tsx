import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface TcleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TcleModal({ open, onOpenChange }: TcleModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Termo de Consentimento Livre e Esclarecido (TCLE)
                    </DialogTitle>
                    <DialogDescription>
                        Pesquisa Científica - FOP Unicamp
                    </DialogDescription>
                </DialogHeader>
                <div className="h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-4 text-sm text-gray-700">
                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                1. Apresentação da Pesquisa
                            </h3>
                            <p>
                                Você está sendo convidado(a) a participar de uma pesquisa científica
                                desenvolvida por dentistas da Faculdade de Odontologia de Piracicaba
                                (FOP-Unicamp) que visa melhorar o tratamento e diagnóstico da
                                Hipomineralização Molar-Incisivo (HMI).
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                2. Objetivo da Pesquisa
                            </h3>
                            <p>
                                O objetivo desta pesquisa é desenvolver e aprimorar ferramentas
                                digitais para auxiliar no diagnóstico e acompanhamento de casos de HMI,
                                contribuindo para tratamentos mais eficazes e melhoria da qualidade
                                de vida dos pacientes.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                3. Participação Voluntária
                            </h3>
                            <p>
                                Sua participação é totalmente voluntária. Você pode recusar-se a
                                participar ou retirar seu consentimento a qualquer momento, sem
                                qualquer penalidade ou prejuízo ao uso da plataforma.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                4. Coleta e Uso de Dados
                            </h3>
                            <p>
                                Caso você concorde em participar, coletaremos dados de forma
                                <strong> anônima</strong> sobre o uso da plataforma, incluindo:
                            </p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Padrões de uso do aplicativo</li>
                                <li>Dados de registros de diagnóstico (anonimizados)</li>
                                <li>Interações com funcionalidades da plataforma</li>
                            </ul>
                            <p className="mt-2">
                                <strong>Importante:</strong> Seus dados pessoais identificáveis
                                (nome, e-mail, telefone, endereço) <strong>NÃO</strong> serão
                                armazenados, compartilhados ou utilizados para fins de pesquisa.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                5. Confidencialidade e Privacidade
                            </h3>
                            <p>
                                Todos os dados coletados serão tratados com total confidencialidade
                                e utilizados exclusivamente para fins de pesquisa científica. Os
                                resultados da pesquisa poderão ser publicados em artigos científicos
                                e apresentações, mas sempre de forma agregada e anônima, sem
                                possibilidade de identificação individual.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                6. Riscos e Benefícios
                            </h3>
                            <p>
                                <strong>Riscos:</strong> A participação nesta pesquisa apresenta
                                riscos mínimos, relacionados principalmente à privacidade dos dados.
                                Todas as medidas de segurança serão adotadas para proteger suas
                                informações.
                            </p>
                            <p className="mt-2">
                                <strong>Benefícios:</strong> Ao participar, você estará contribuindo
                                para o avanço científico e desenvolvimento de melhores ferramentas
                                para diagnóstico e tratamento de HMI, beneficiando futuras gerações.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                7. Contato dos Responsáveis
                            </h3>
                            <p>
                                Em caso de dúvidas sobre a pesquisa, você pode entrar em contato com:
                            </p>
                            <ul className="list-none ml-4 mt-2 space-y-1">
                                <li><strong>Instituição:</strong> Faculdade de Odontologia de Piracicaba (UNICAMP)</li>
                                <li><strong>Departamento:</strong> Ciências da Saúde e Odontologia Infantil, Área de Saúde Coletiva</li>
                                <li><strong>E-mail:</strong> c223510@dac.unicamp.br / meneghim@unicamp.br</li>
                                <li><strong>Telefone:</strong> (68) 98110-1711 / (19) 2106-5220</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                8. Direitos do Participante
                            </h3>
                            <p>Você tem o direito de:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Receber esclarecimentos sobre a pesquisa a qualquer momento</li>
                                <li>Recusar ou retirar seu consentimento sem penalidades</li>
                                <li>Ter acesso aos resultados da pesquisa</li>
                                <li>Solicitar a exclusão dos seus dados a qualquer momento</li>
                            </ul>
                        </section>

                        <section className="bg-cyan-50 p-4 rounded-lg mt-6">
                            <h3 className="font-bold text-base text-gray-800 mb-2">
                                Agradecimento
                            </h3>
                            <p>
                                Agradecemos seu interesse em participar desta pesquisa. Sua colaboração
                                é fundamental para criarmos uma plataforma cada vez melhor e
                                contribuirmos para o avanço do tratamento de HMI no Brasil.
                            </p>
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
