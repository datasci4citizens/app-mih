import { ToyBackground } from "@/components/ui/toy-background";
import { PatientSelectModal } from "@/components/ui/patient-select-modal";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useSWRConfig } from "swr";
import apiClient from "@/lib/axios";
import { COLORS } from "@/lib/constants";

import {
  Camera,
  User,
  ChevronLeft,
  Star,
  Bell,
  Users,
  Plus,
  Image as ImageIcon,
  Info,
  HeartPulse,
  Hospital,
  HeartHandshake,
  BookPlusIcon,
  FileQuestion,
  ChevronRight,
  LogOut
} from 'lucide-react';



const carouselItems = [
  { icon: <Info />, title: "O que é HMI?", content: "Hipomineralização Molar-Incisivo (HMI) é uma condição que afeta o esmalte dos dentes, principalmente os primeiros molares permanentes e, às vezes, os incisivos. O esmalte não se desenvolve corretamente enquanto os dentes estão se formando." },
  { icon: <HeartPulse />, title: "Sintomas", content: "Os dentes com HMI podem ter manchas brancas, amareladas ou marrons, ser mais sensíveis ao frio, calor ou doces, e podem se desgastar ou quebrar mais facilmente." },
  { icon: <Hospital />, title: "Tratamentos", content: "O tratamento varia com a severidade. Casos leves podem incluir cuidados preventivos. Casos moderados, restaurações. Casos graves podem necessitar de coroas ou extrações." },
  { icon: <HeartHandshake />, title: "Cuidados", content: "Visitas regulares ao dentista, cuidado com a sensibilidade e evitar alimentos ácidos são fundamentais para o manejo da HMI." },
  { icon: <BookPlusIcon />, title: "Dicas", content: "Use creme dental com flúor, escove suavemente, visite o dentista regularmente, evite alimentos duros ou pegajosos e mantenha a boca hidratada." },
  { icon: <FileQuestion />, title: "Perguntas Frequentes", content: "A causa exata não é conhecida. A HMI pode causar cáries e o diagnóstico é feito pelo dentista. A HMI não tem cura, mas é possível controlar os sintomas." }
];

const HmiInformationCarousel = () => {
  const [currentItem, setCurrentItem] = useState(0);

  const nextItem = () => setCurrentItem((prev) => (prev + 1) % carouselItems.length);
  const prevItem = () => setCurrentItem((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  useEffect(() => {
    const interval = setInterval(nextItem, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-sm p-3 md:p-6 rounded-3xl shadow-lg border border-white/30">
      <div className="text-center mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Informações sobre HMI</h2>
      </div>
      <div className="relative">
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-5 rounded-2xl mb-3 md:mb-4 h-[140px] md:h-[200px] transition-all duration-300 overflow-y-auto">
          {carouselItems[currentItem] && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-lg">{carouselItems[currentItem].title}</h3>
                <div className="text-cyan-500">{carouselItems[currentItem].icon}</div>
              </div>
              <p className="text-gray-600 text-sm animate-in fade-in duration-300 key={currentItem}">
                {carouselItems[currentItem].content}
              </p>
            </>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button onClick={prevItem} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-all active:scale-95">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentItem(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 active:scale-95 ${currentItem === index ? 'bg-cyan-500 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              ></button>
            ))}
          </div>
          <button onClick={nextItem} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-all active:scale-95">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};


export default function PatientHomePage() {

  const { data: user } = useSWR('/user/me')
  const { data: patientsData } = useSWR('/users/patients/')
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const [currentTip, setCurrentTip] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const tips = [
    "O uso de pasta com flúor é recomendado desde o primeiro dente.",
    "Evite compartilhar talheres com o bebê para prevenir a transmissão de bactérias.",
    "A escovação noturna é a mais importante do dia.",
    "Troque a escova de dentes a cada 3 meses ou após doenças.",
    "Visite o dentista assim que nascer o primeiro dentinho."
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const handleLogout = async () => {
    await apiClient.post("/auth/logout");
    mutate("/user/me", null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full bg-[#A0E7E5]">
      {<ToyBackground />}
      <div className="w-full h-screen relative">
        <div className="relative z-10 h-full overflow-y-auto" onClick={() => {
          if (showUserMenu) setShowUserMenu(false);
          if (showNotifications) setShowNotifications(false);
        }}>
          {/* Grid com 3 linhas: header, conteúdo, fantasma */}
          <div className="max-w-screen-lg mx-auto min-h-full grid grid-rows-[auto_1fr_auto]">
            {/* Header Funcional */}
            <div className="pb-6 md:pb-10 px-6 flex justify-between items-center" style={{ paddingTop: 'max(env(safe-area-inset-top), 2rem)' }}>
              <div className="relative">
                <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/60 transition-all active:scale-95 shadow-lg">
                    <User size={22} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <h2 className="text-xs md:text-sm opacity-90 font-medium">Bem-vindo(a),</h2>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{user?.name ?? '...'}!</h1>
                  </div>
                </div>

                {/* User Menu Popover */}
                {showUserMenu && (
                  <div className="absolute top-14 left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* <button className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 text-gray-700 transition-colors">
                      <Settings size={18} />
                      <span className="font-medium">Configurações</span>
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div> */}
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 text-red-500 transition-all active:scale-95">
                      <LogOut size={18} />
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/60 transition-all active:scale-95 shadow-lg"
                >
                  <Bell size={22} className="md:w-7 md:h-7" />
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div className="absolute top-14 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="font-bold text-gray-800 mb-3">Notificações</h3>
                    <div className="text-center text-gray-400 py-4 text-sm">
                      Nenhuma notificação nova
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo Principal - Centralizado na linha do meio */}
            <div className="flex flex-col justify-center px-6 pb-6">
              <HmiInformationCarousel />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-4 md:mt-8">


                {/* Coluna Esquerda (Novo Registro) */}
                <div className="lg:col-span-1">
                  <button
                    onClick={() => setShowPatientModal(true)}
                    className="w-full h-40 md:h-48 lg:h-full rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-start justify-between bg-gradient-to-br from-[#FF8A65] to-[#FFB394] group"
                  >
                    <div className="flex flex-col items-start gap-2 z-10">
                      <div className="bg-white/20 p-2 md:p-3 rounded-xl mb-1 md:mb-2 group-hover:bg-white/30 transition-colors">
                        <Plus size={24} className="md:w-7 md:h-7" color="white" strokeWidth={3} />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white text-left leading-tight">Novo Registro</h3>
                      <p className="text-white/80 text-sm md:text-md font-medium">Adicionar foto</p>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-30px] opacity-20 rotate-[-12deg] group-hover:scale-110 transition-transform duration-500">
                      <Camera size={140} className="md:w-40 md:h-40" color="white" />
                    </div>
                  </button>
                </div>

                {/* Coluna Direita (Cards) */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
                  <button onClick={() => navigate('/user/registers')} className="h-40 md:h-48 rounded-3xl p-4 md:p-6 relative overflow-hidden shadow-lg flex flex-col justify-between items-start text-left bg-white transition-transform hover:scale-[1.02] active:scale-95 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 mb-2 group-hover:bg-orange-200 transition-colors">
                      <ImageIcon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-700 leading-tight">Meus<br />Registros</h3>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">Histórico</p>
                    </div>
                  </button>

                  <button onClick={() => navigate('/user/patients')} className="h-40 md:h-48 rounded-3xl p-4 md:p-6 relative overflow-hidden shadow-lg flex flex-col justify-between items-start text-left bg-white transition-transform hover:scale-[1.02] active:scale-95 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 mb-2 group-hover:bg-blue-200 transition-colors">
                      <Users size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-700 leading-tight">Gerenciar<br />Crianças</h3>
                      <p className="text-xs md:text-sm text-gray-400 mt-1">Perfis</p>
                    </div>
                  </button>

                  <div
                    className="col-span-2 rounded-3xl p-4 md:p-6 flex items-center gap-4 md:gap-5 shadow-lg bg-white border-l-4 cursor-pointer transition-all hover:shadow-xl hover:bg-gray-50 active:scale-90"
                    style={{ borderLeftColor: COLORS.highlight }}
                    onClick={nextTip}
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center text-yellow-600 transition-transform hover:rotate-12">
                      <Star size={20} className="md:w-7 md:h-7 text-yellow-100" fill="currentColor" stroke="currentColor" />
                      <Star size={20} className="md:w-7 md:h-7 absolute text-yellow-500" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                        Dica do Dia
                        <span className="text-[10px] md:text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Toque para trocar</span>
                      </h3>
                      <p className="text-sm md:text-md text-gray-500 leading-snug mt-0.5 animate-in fade-in duration-300 key={currentTip}">
                        {tips[currentTip]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elemento Fantasma - Mesma altura do header para balancear o layout */}
            <div className="pb-6 md:pb-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 2rem)' }} aria-hidden="true"></div>
          </div>
        </div>

        {/* Patient Selection Modal */}
        <PatientSelectModal
          open={showPatientModal}
          onOpenChange={setShowPatientModal}
          onSelectPatient={(patientId) => {
            navigate(`/user/registers/create-register/${patientId}/confirm`);
          }}
          patients={patientsData}
        />
      </div>
    </div>
  );
}