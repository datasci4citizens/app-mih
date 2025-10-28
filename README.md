# Molar Check - Frontend

## 🦷 Sobre o Projeto

Este é o repositório do **front-end** para o **Molar Check**, um sistema dedicado à identificação da Hipomineralização Molar-Incisivo (HMI).

A aplicação foi construída para ser uma interface amigável e intuitiva, atendendo a dois públicos principais:
- **Pacientes/Responsáveis:** Permite o cadastro de crianças, o envio de registros fotográficos dos dentes e o acompanhamento dos diagnósticos.
- **Especialistas (Dentistas):** Oferece uma área restrita para avaliar os registros enviados, analisar as imagens e fornecer um diagnóstico.

---

## ✨ Features

- **Fluxo de Cadastro:** Processo distinto para responsáveis e especialistas.
- **Gerenciamento de Pacientes:** Responsáveis podem cadastrar e visualizar múltiplas crianças.
- **Criação de Registros:** Um passo a passo guiado para tirar e enviar 3 fotos dos dentes (frontal e molares).
- **Acompanhamento:** Pacientes podem ver o status e o resultado dos seus diagnósticos.
- **Área do Especialista:**
    - Fila de avaliações pendentes.
    - Visualizador de imagens e dados do paciente para auxiliar no diagnóstico.
    - Sistema de aprovação manual de novos especialistas para garantir a segurança.
- **Conteúdo Informativo:** Seção dedicada a explicar o que é HMI, seus sintomas e cuidados.

---

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/) para componentes
- [React Router](https://reactrouter.com/) para navegação
- [SWR](https://swr.vercel.app/) para data fetching

---

## 🏁 Começando

Siga estas instruções para rodar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/app-mih.git
    cd app-mih
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

### Rodando a Aplicação

1.  Crie uma cópia do arquivo de ambiente modelo:
    ```bash
    cp .env-model .env
    ```

2.  Abra o arquivo `.env` e configure a variável `VITE_SERVER_URL` para apontar para a URL do seu back-end (ex: `http://localhost:8000`).

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

## 📂 Estrutura do Projeto

```
app-mih/
├── src/
│   ├── assets/         # Imagens, vídeos e outros arquivos estáticos
│   ├── components/     # Componentes React reutilizáveis (UI)
│   ├── guards/         # Componentes de guarda para proteger rotas
│   ├── lib/            # Funções utilitárias, hooks e configurações
│   └── routes/         # Componentes de página para cada rota da aplicação
├── .env-model          # Modelo para o arquivo de variáveis de ambiente
├── index.html          # Ponto de entrada do HTML
├── package.json        # Dependências e scripts do projeto
└── vite.config.ts      # Configurações do Vite
```
