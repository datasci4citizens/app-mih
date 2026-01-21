export const COLORS = {
    primary: '#A0E7E5',    // Menta (Fundo Principal)
    secondary: '#FF8A65',  // Coral (Ação/CTA)
    highlight: '#F2CF59',  // Amarelo (Destaque/Estrelas)
    peach: '#F8CA9D',      // Pêssego (Cartões secundários)
    sage: '#C5D7C0',       // Verde Sálvia (Cartões terciários)
    white: '#FFFFFF',
    text: '#2D3748',       // Cinza escuro
    textLight: '#718096'
} as const;

export type ColorKey = keyof typeof COLORS;
