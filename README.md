# ToDo APP

Uma aplicação de gerenciamento de tarefas simples e eficaz, desenvolvida com Next.js 14 e Tailwind CSS.

## 📋 Funcionalidades

- ✅ Criação e gerenciamento de tarefas
- 📅 Visualização de tarefas em calendário
- 📊 Estatísticas de produtividade
- 🌓 Modo claro/escuro
- 🔒 Sistema de autenticação
- 📱 Design responsivo

## 🛠️ Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/docs/getting-started) - Framework React com renderização híbrida
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [NextAuth.js](https://next-auth.js.org/) - Autenticação para Next.js
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animações
- [next-themes](https://github.com/pacocoursey/next-themes) - Suporte a temas para Next.js

## 🚀 Começando

### Pré-requisitos

- Node.js 18.x ou superior
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/jeanmazurek/todo-app.git
cd todo-app
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

### Credenciais de Acesso

Para fazer login na aplicação, utilize as seguintes credenciais:

| Usuário | Senha |
|---------|-------|
| admin@todoapp.com | admin123 |


## 📚 Estrutura do Projeto

```
src/
├── app/                  # Diretórios de rota do Next.js
├── components/           # Componentes React reutilizáveis
├── config/               # Configurações da aplicação
├── hooks/                # React Hooks personalizados
├── services/             # Serviços e APIs
├── styles/               # Estilos globais e componentes
├── types/                # Definições de tipos TypeScript
└── utils/                # Funções utilitárias
```

## 🧪 Testes

```bash
npm run test
```

## 🛠️ Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting
- `npm run test` - Executa os testes

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

---

Desenvolvido com ❤️ por [Jean Mazurek](https://github.com/jeanmazurek)
