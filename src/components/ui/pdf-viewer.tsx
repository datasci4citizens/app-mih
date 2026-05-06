import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { notifyApiError } from "@/lib/api-error";

import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

// ─── Constantes de zoom exportadas ──────────────────────────────────────────
export const PDF_ZOOM_CONSTANTS = {
    MIN: 0.2,
    MAX: 3.0,
    STEP: 0.2,
    RENDER_SCALE: 2.0,
} as const;

interface PdfViewerProps {
    url: string;
    zoom: number;
    /** Chamado após renderizar a primeira página com o zoom "fit-to-width" calculado */
    onReady?: (fitZoom: number) => void;
    onScrolledToEnd?: () => void;
    onProgress?: (progress: number) => void;
}

const RENDER_SCALE = PDF_ZOOM_CONSTANTS.RENDER_SCALE;

export function PdfViewer({ url, zoom, onReady, onScrolledToEnd, onProgress }: PdfViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const baseCssSizesRef = useRef<{ w: number; h: number }[]>([]);
    const zoomRef = useRef(zoom);

    const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    // Sincroniza zoom ref com prop — sempre tem o valor mais recente
    useEffect(() => {
        zoomRef.current = zoom;
    }, [zoom]);

    // Aplica zoom nos canvases já renderizados (sem re-renderizar o PDF)
    useEffect(() => {
        if (!containerRef.current) return;
        const canvases = containerRef.current.querySelectorAll("canvas");
        canvases.forEach((canvas, i) => {
            const base = baseCssSizesRef.current[i];
            if (!base) return;
            canvas.style.width = `${base.w * zoom}px`;
            canvas.style.height = `${base.h * zoom}px`;
        });
    }, [zoom]);

    // Carrega e renderiza o PDF
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";
        baseCssSizesRef.current = [];
        setStatus("loading");
        setErrorMsg("");

        let cancelled = false;
        let fitEmitted = false;

        (async () => {
            try {
                console.log("[PdfViewer] Carregando:", url);
                const dpr = window.devicePixelRatio || 1;
                const scale = RENDER_SCALE * dpr;

                const pdfDoc = await pdfjsLib.getDocument(url).promise;
                if (cancelled) return;
                console.log(`[PdfViewer] ${pdfDoc.numPages} páginas, scale=${scale}`);

                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                    if (cancelled) return;
                    const page = await pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale });

                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Tamanho CSS base (salvo para quando o user mudar o zoom depois)
                    const cssW = viewport.width / dpr;
                    const cssH = viewport.height / dpr;
                    baseCssSizesRef.current.push({ w: cssW, h: cssH });

                    // Estilo inicial com zoom atual (via ref)
                    canvas.style.width = `${cssW * zoomRef.current}px`;
                    canvas.style.height = `${cssH * zoomRef.current}px`;
                    canvas.style.display = "block";
                    canvas.style.margin = "0 auto 8px auto";
                    canvas.style.borderRadius = "4px";
                    canvas.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
                    canvas.style.maxWidth = "none";

                    const ctx = canvas.getContext("2d")!;
                    await page.render({ canvasContext: ctx, canvas, viewport }).promise;
                    if (cancelled) return;

                    container.appendChild(canvas);

                    // Depois da primeira página: computa fit-to-width e informa o pai
                    if (!fitEmitted && onReady) {
                        const scrollParent = container.closest("[data-scroll-container]") as HTMLDivElement | null;
                        const availableWidth = (scrollParent?.clientWidth || container.clientWidth || cssW) - 32;
                        const fitZoom = availableWidth / cssW;

                        // Respeita os limites de zoom
                        const clampedFitZoom = Math.max(PDF_ZOOM_CONSTANTS.MIN, Math.min(PDF_ZOOM_CONSTANTS.MAX, fitZoom));

                        console.log(`[PdfViewer] fitZoom=${clampedFitZoom.toFixed(2)} (raw=${fitZoom.toFixed(2)}), availableWidth=${availableWidth}, cssW=${cssW}`);
                        onReady(clampedFitZoom);
                        fitEmitted = true;
                    }
                }

                if (!cancelled) {
                    setStatus("done");
                    console.log("[PdfViewer] Renderização concluída");
                }
            } catch (e) {
                if (import.meta.env.VITE_DEV_MODE === 'true') {
                    console.error("[PdfViewer] Erro:", e);
                }
                notifyApiError(e, 'Falha ao carregar o documento. Tente novamente.');
                if (!cancelled) {
                    setErrorMsg(String(e));
                    setStatus("error");
                }
            }
        })();

        return () => { cancelled = true; };
    }, [url, onReady]);

    // Rastreia scroll do container pai
    useEffect(() => {
        if (status !== "done") return; // Só verificar final da página após o PDF ser renderizado
        const scrollParent = containerRef.current?.closest("[data-scroll-container]") as HTMLDivElement | null;
        if (!scrollParent) return;

        let intervalId: any;

        const checkScroll = () => {
            // Se as dimensões estão muito pequenas, o layout do Dialog/CSS provavelmente ainda não estabilizou
            if (scrollParent.clientHeight < 50 || scrollParent.scrollHeight < 50) return;

            const maxScrollY = scrollParent.scrollHeight - scrollParent.clientHeight;
            if (maxScrollY <= 0) {
                // Se o documento couber inteiro na tela, desbloqueia.
                onProgress?.(100);
                onScrolledToEnd?.();
                return;
            }

            // progress entre 0 e 100
            const progress = Math.max(0, Math.min((scrollParent.scrollTop / maxScrollY) * 100, 100));
            onProgress?.(progress);
            if (progress >= 95) onScrolledToEnd?.();
        };

        const handleScroll = () => checkScroll();

        scrollParent.addEventListener("scroll", handleScroll);
        
        // Em vez de checar 1 vez, checamos múltiplas vezes durante 1.5s após o load.
        // Isso previne que a barra "pule pro final" se o navegador restaurar scroll de cache/sessão falhando momentaneamente.
        intervalId = setInterval(checkScroll, 300);
        setTimeout(() => clearInterval(intervalId), 1500);

        // Força checagem imediata também.
        checkScroll();

        return () => {
            scrollParent.removeEventListener("scroll", handleScroll);
            clearInterval(intervalId);
        };
    }, [onScrolledToEnd, onProgress, status]);

    return (
        <div className="w-full flex justify-center">
            <div ref={containerRef} className="w-full" />
            {status === "loading" && (
                <div className="flex items-center justify-center py-8 text-gray-400 gap-2 text-sm">
                    <span className="animate-spin inline-block">⏳</span>
                    <span>Carregando PDF…</span>
                </div>
            )}
            {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <p className="font-semibold mb-1">Erro ao carregar o PDF</p>
                    <p className="text-xs font-mono break-all">{errorMsg}</p>
                </div>
            )}
        </div>
    );
}
