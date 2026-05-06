import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Páginas "raiz" onde o botão de voltar do Android encerra o app.
 */
const ROOT_PATHS = [
    '/user/home',
    '/specialist/home',
    '/login',
    '/select',
];

/**
 * Componente global que intercepta o botão físico de voltar do Android.
 * - Em páginas raiz: chama App.exitApp() para encerrar o app.
 * - Em todas as outras páginas: chama navigate(-1).
 *
 * O listener é registrado UMA única vez. O pathname atual é lido via ref,
 * evitando o ciclo de add/removeListener a cada mudança de rota.
 */
export function AndroidBackButtonHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    // Ref mantém sempre o pathname mais recente sem recriar o listener
    const pathnameRef = useRef(location.pathname);
    pathnameRef.current = location.pathname;

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        // Registrado UMA vez — usa pathnameRef para sempre ter o valor atual
        const listenerPromise = App.addListener('backButton', () => {
            if (ROOT_PATHS.includes(pathnameRef.current)) {
                App.exitApp();
            } else {
                navigate(-1);
            }
        });

        return () => {
            listenerPromise.then(handle => handle.remove());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // deps vazio: listener registrado uma única vez

    return null;
}
