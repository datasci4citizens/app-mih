## DEV ReadME - App MIH

Esse arquivo ReadME tem como objetivo explicar os processos e interação entre as páginas.

---

### Páginas

- `home` 
  - `HmiInformations.tsx`: Página com informações sobre HMI.
  - `SpecialistHomePage.tsx`: Página inicial para o especialista, com link para as avaliações pendentes.
  - `UserHomePage.tsx`: Página inicial para o usuário, com links para informações sobre HMI, "Minhas crianças" e "Adicionar Criança".

- `login` 
  - `Login.tsx`: Login com autenticação do google.

- `registers` 
  - `specialist`
    - `PendingRegisters.tsx`: Mostra a lista de registros pendentes de avaliação para o especialista.
    - `RegisterDiagnostic.tsx`: Página onde o especialista realiza o diagnóstico, visualizando as fotos e informações do paciente.
    - `SpecialsitRegistersControl.tsx`: Controla o fluxo de avaliação dos registros pelo especialista, gerenciando o estado entre a lista de registros e a tela de diagnóstico.
  - `user`
    - `create-register`
      - `CaptureOne.tsx`: Página para capturar a foto frontal dos dentes, com um vídeo tutorial.
      - `CaptureToothPhoto.tsx`: Componente para capturar a foto, mostrando uma prévia da imagem.
      - `CaptureTwo.tsx`: Página para capturar as fotos dos molares, com um vídeo tutorial.
      - `ConfirmPatient.tsx`: Página para o usuário confirmar se deseja criar um registro para a criança selecionada.
      - `CreateRegisterForm.tsx`: Componente que gerencia o formulário de criação de registro, com a lógica de múltiplos passos.
      - `FinishRegisterNew.tsx`: Última etapa do formulário de registro, com perguntas sobre dor, sensibilidade e manchas.
      - `RegisterSumary.tsx`: Página que mostra um resumo de todas as informações do registro antes de enviá-lo.
    - `PatientRegisters.tsx`: Mostra a lista de registros de um paciente específico.
    - `Patients.tsx`: Mostra a lista de crianças (pacientes) cadastradas por um responsável.
    - `Register.tsx`: Exibe as informações detalhadas de um registro específico, incluindo o diagnóstico (se houver).
    - `RegistersControl.tsx`: Controla o fluxo de visualização dos registros do usuário, gerenciando o estado entre a lista de pacientes, a lista de registros do paciente e a visualização de um registro específico.

- `user`
  - `create-specialist`
    - `CreateSpecialist.tsx`: Formulário para o especialista completar seu cadastro.
  - `create-user-patient`
    - `CreateUser.tsx`: Formulário para o responsável (usuário) se cadastrar.
    - `PatientForm.tsx`: Formulário para cadastrar uma nova criança, com perguntas sobre seu histórico de saúde.
    - `Tcle.tsx`: Página que exibe o Termo de Consentimento Livre e Esclarecido (TCLE) e direciona para o cadastro.
  - `SelectUserType.tsx`: Página inicial onde o usuário seleciona se é um paciente/responsável ou um dentista.