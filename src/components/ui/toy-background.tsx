import { COLORS } from '@/lib/constants';

export const ToyBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
      <pattern id="toy-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        {/* Coração */}
        <g transform="translate(10, 10) scale(0.8)">
          <path d="M15 15 C15 5 25 5 30 15 C35 5 45 5 45 15 C45 30 30 40 30 40 C30 40 15 30 15 15 Z" fill={COLORS.white} />
        </g>

        {/* Bloco quadrado */}
        <g transform="translate(60, 10)">
          <rect x="0" y="0" width="30" height="30" rx="4" fill={COLORS.white} />
        </g>

        {/* Estrela */}
        <g transform="translate(10, 58) scale(0.4)">
          <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill={COLORS.white} />
        </g>

        {/* Triângulo */}
        <g transform="translate(65, 60)">
          <polygon points="15,0 30,30 0,30" fill={COLORS.white} />
        </g>
      </pattern>
      <rect width="100%" height="100%" fill={COLORS.primary} />
      <rect width="100%" height="100%" fill="url(#toy-pattern)" />
    </svg>
  </div>
);
