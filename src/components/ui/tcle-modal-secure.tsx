import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect, useCallback } from "react";
import { AlertCircle, Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { PdfViewer, PDF_ZOOM_CONSTANTS } from "@/components/ui/pdf-viewer";

interface TcleModalSecureProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept?: (accepted: boolean) => void;
    documentType?: "tcle" | "privacy";
    presignedUrl?: string;
    isAlreadyUnlocked?: boolean;
}

// ─── Fonte única de verdade dos documentos ────────────────────────────────────
// Para atualizar o TCLE: substitua public/docs/tcle.pdf
// Para atualizar a Política: edite public/docs/privacy-policy.html
const DOCUMENT_CONFIG = {
    tcle: {
        title: "Termo de Consentimento Livre e Esclarecido (TCLE)",
        subtitle: "Pesquisa Científica — FOP Unicamp",
        type: "pdf" as const,
        url: "/docs/tcle.pdf",
    },
    privacy: {
        title: "Política de Privacidade",
        subtitle: "Molar Check App",
        type: "html" as const,
        url: "/docs/privacy-policy.html",
    },
};

function extractBodyContent(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("script").forEach((el) => el.remove());
    return doc.body?.innerHTML ?? html;
}

export function TcleModalSecure({
    open,
    onOpenChange,
    onAccept,
    documentType = "tcle",
    presignedUrl,
    isAlreadyUnlocked = false,
}: TcleModalSecureProps) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(isAlreadyUnlocked);
    const [isAccepted, setIsAccepted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(isAlreadyUnlocked ? 100 : 0);
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(1.0);
    const fitZoomRef = useRef(1.0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Garante que o estado reflita prop que vem do pai
    useEffect(() => {
        if (isAlreadyUnlocked) {
            setHasScrolledToBottom(true);
            setScrollProgress(100);
        }
    }, [isAlreadyUnlocked]);

    const config = DOCUMENT_CONFIG[documentType];
    // Use presignedUrl se fornecido, senão use config padrão
    const documentUrl = presignedUrl || config.url;
    const isPdf = presignedUrl ? presignedUrl.includes('.pdf') : config.type === "pdf";

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            // Ao fechar, se já estava destrancado, continua destrancado
            setHasScrolledToBottom(isAlreadyUnlocked);
            setIsAccepted(false);
            setScrollProgress(isAlreadyUnlocked ? 100 : 0);
            setHtmlContent("");
            setZoom(1.0);
        }
        onOpenChange(value);
    };

    // Carrega HTML ao abrir
    useEffect(() => {
        if (!open || isPdf) return;
        
        const controller = new AbortController();
        setLoading(true);
        
        fetch(documentUrl, { signal: controller.signal })
            .then((r) => r.text())
            .then((html) => setHtmlContent(extractBodyContent(html)))
            .catch((e) => {
                if (e.name !== 'AbortError') {
                    setHtmlContent("<p>Erro ao carregar o documento.</p>");
                }
            })
            .finally(() => setLoading(false));
        
        return () => controller.abort();
    }, [open, isPdf, documentUrl]);

    // Scroll tracking para HTML
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isPdf) return;
        const el = e.currentTarget;
        const scrollableHeight = el.scrollHeight - el.clientHeight;
        if (scrollableHeight <= 0) { setHasScrolledToBottom(true); setScrollProgress(100); return; }
        const progress = (el.scrollTop / scrollableHeight) * 100;
        setScrollProgress(progress);
        if (progress >= 95) setHasScrolledToBottom(true);
    };

    const handleAccept = () => {
        if (hasScrolledToBottom) {
            onAccept?.(true);
            handleOpenChange(false);
        }
    };

    // Zoom controls
    const zoomIn = useCallback(() => setZoom(z => Math.min(+(z + PDF_ZOOM_CONSTANTS.STEP).toFixed(2), PDF_ZOOM_CONSTANTS.MAX)), []);
    const zoomOut = useCallback(() => setZoom(z => Math.max(+(z - PDF_ZOOM_CONSTANTS.STEP).toFixed(2), PDF_ZOOM_CONSTANTS.MIN)), []);
    const handlePdfReady = useCallback((fitZoom: number) => {
        fitZoomRef.current = fitZoom;
        setZoom(fitZoom);
    }, []);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {/* Fullscreen para todos os tipos de documento */}
            <DialogContent className="!fixed !inset-0 !w-screen !h-[100dvh] !max-w-none !translate-x-0 !translate-y-0 !rounded-none flex flex-col gap-0 p-0 overflow-hidden">

                {/* ── Topo fixo (fundo branco) ─────────────────────────────── */}
                <div className="flex-shrink-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-lg font-bold text-gray-800 leading-tight">
                            {config.title}
                        </DialogTitle>
                        <DialogDescription className="text-xs">{config.subtitle}</DialogDescription>
                    </DialogHeader>

                    {/* Barra de progresso */}
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#A0E7E5] to-[#2A9D8F] transition-all duration-300"
                            style={{ width: `${scrollProgress}%` }}
                        />
                    </div>

                    {/* Controles de zoom — só para PDF */}
                    {isPdf && (
                        <div className="flex items-center gap-2 mt-2 justify-center">
                            <button
                                onClick={zoomOut}
                                disabled={zoom <= PDF_ZOOM_CONSTANTS.MIN}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                                <ZoomOut size={15} className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => setZoom(1.0)}
                                className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-xs font-mono text-gray-600 min-w-[52px] text-center transition-colors"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                            <button
                                onClick={zoomIn}
                                disabled={zoom >= PDF_ZOOM_CONSTANTS.MAX}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                                <ZoomIn size={15} className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => setZoom(fitZoomRef.current)}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                title="Ajustar à largura"
                            >
                                <RotateCcw size={13} className="text-gray-500" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Área de scroll (fundo cinza claro) ───────────────────── */}
                <div
                    ref={scrollRef}
                    data-scroll-container
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto bg-gray-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                    <div className="p-4">
                        {isPdf ? (
                            <PdfViewer
                                url={documentUrl}
                                zoom={zoom}
                                onReady={handlePdfReady}
                                onScrolledToEnd={() => setHasScrolledToBottom(true)}
                                onProgress={(p) => setScrollProgress(p)}
                            />
                        ) : loading ? (
                            <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
                                <Loader2 size={20} className="animate-spin" />
                                <span className="text-sm">Carregando documento…</span>
                            </div>
                        ) : (
                            <div
                                className="text-sm text-gray-700 [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:text-base [&_h2]:mt-4 [&_h2]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p]:my-1 [&_strong]:text-gray-900 [&_a]:text-blue-600 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        )}
                    </div>
                </div>

                {/* ── Rodapé fixo (fundo branco, sombra topo) ──────────────── */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-5 py-3 space-y-2">

                    {/* Aviso: não chegou ao fim */}
                    {!hasScrolledToBottom && (
                        <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                            <AlertCircle size={15} className="flex-shrink-0" />
                            <span className="text-xs font-medium">
                                Leia até o final para aceitar — {Math.round(scrollProgress)}% lido
                            </span>
                        </div>
                    )}

                    {/* Checkbox de confirmação */}
                    <label className={`flex items-start gap-2 cursor-pointer ${!hasScrolledToBottom ? "opacity-40 pointer-events-none" : ""}`}>
                        <Checkbox
                            checked={isAccepted && hasScrolledToBottom}
                            onCheckedChange={(checked) => {
                                if (hasScrolledToBottom) setIsAccepted(checked as boolean);
                            }}
                            disabled={!hasScrolledToBottom}
                            className="mt-0.5 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-gray-800 leading-snug">
                            Confirmo que li e aceito os termos do documento acima
                        </span>
                    </label>

                    {/* Botões lado a lado */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleOpenChange(false)}
                            className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={!isAccepted || !hasScrolledToBottom}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all ${isAccepted && hasScrolledToBottom
                                ? "bg-gradient-to-r from-[#A0E7E5] to-[#2A9D8F] hover:shadow-md active:scale-[0.98]"
                                : "bg-gray-300 opacity-50 cursor-not-allowed"
                                }`}
                        >
                            Aceitar e Continuar
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
