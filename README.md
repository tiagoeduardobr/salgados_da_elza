# 🥟 Salgados da Elza

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Fase%202-brightgreen?style=for-the-badge)](https://github.com/tiagoeduardobr/salgados_da_elza)
[![Made with ❤️](https://img.shields.io/badge/Feito%20com-❤️-red?style=for-the-badge)](https://github.com/tiagoeduardobr)

**Cardápio digital dos Salgados da Elza — salgados assados artesanais feitos com carinho em Blumenau, SC.**

[🌐 Acessar o Site](https://tiagoeduardobr.github.io/salgados_da_elza/) · [📱 Fazer Pedido via WhatsApp](https://wa.me/5547992203893?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20pedido%20dos%20Salgados%20da%20Elza!)

---

## 📋 Sobre o Projeto

Landing page responsiva criada para exibir o cardápio dos **Salgados da Elza**, um empreendimento de salgados assados artesanais. O site apresenta os produtos de forma elegante, com fotos, descrições, preços e um botão de contato direto via WhatsApp para facilitar os pedidos.

## ✨ Funcionalidades

- 🎨 **Design Elegante** — Layout moderno com paleta de cores acolhedora e tipografia refinada
- 📱 **Totalmente Responsivo** — Adaptado para celulares, tablets e desktops
- 💬 **Integração com WhatsApp e Pix** — Botão de pedido integrado e card de pagamento instantâneo via Pix
- ⚡ **Rápido e Leve** — Página única sem dependências externas, carregamento instantâneo
- 🔍 **SEO Otimizado** — Meta tags e estrutura semântica em português

## 🍽️ Cardápio

| Produto                | Preço    | Sabores                                                  |
| ---------------------- | -------- | -------------------------------------------------------- |
| 🍕 Pizza Gourmet       | R$ 12,00 | Queijo, presunto, tomate seco e orégano                  |
| 🍗 Assado de Frango    | R$ 10,00 | Frango desfiado temperado                                |
| 🔥 Assado de Calabresa | R$ 10,00 | Calabresa moída com tempero especial                     |
| 🌭 Dogão Assado        | R$ 10,00 | Salsicha, queijo e molho especial                        |
| 🥟 Pastel Assado       | R$ 8,00  | 4 Queijos, Calabresa, Carne, Carne c/ Ovo, Frango, Pizza |
| 🥐 Croissants          | R$ 10,00 | Chocolate, Coco, Frango                                  |

> Todos os salgados vêm **embalados individualmente**, prontos para aquecer no micro-ondas ou na Airfryer.

## 🛠️ Tecnologias Utilizadas

|                                                    Tecnologia                                                     | Uso                                                    |
| :---------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------- |
|         ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)          | Estrutura e conteúdo semântico                         |
|           ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)           | Estilização, responsividade e animações                |
|  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)  | Interatividade, Carrinho de Compras e lógica DOM       |
|     ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)     | Banco de dados NoSQL e Storage (Fase 2)                |
| ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white) | Hospedagem estática                                    |

## 📂 Estrutura do Projeto

```text
salgados_da_elza/
├── assets/                 # Arquivos estáticos
│   ├── images/             # Imagens otimizadas dos produtos
│   └── js/                 # Scripts auxiliares (Animations)
├── docs/                   # Documentação detalhada
│   ├── BACKLOG_MVP.md      # Histórico de entregas do MVP (Landing Page)
│   ├── BACKLOG.md          # Planejamento da evolução para E-commerce
│   └── PROJECT_OVERVIEW.md # Visão geral detalhada
├── styles/                 # Folhas de estilo (Mobile-first, Premium UI)
│   └── main.css
├── index.html              # Página principal (cardápio)
├── manifest.json           # Web App Manifest (PWA)
├── robots.txt              # Diretivas para crawlers
├── sitemap.xml             # Sitemap para indexação SEO
├── AGENTS.md               # Diretrizes de contribuição IA
└── README.md               # Este arquivo de documentação
```

## 🚀 Próximos Passos (Fase 2)

Este repositório atual contém a versão **MVP (Landing Page Estática)** concluída com sucesso. O projeto está evoluindo agora para a **Fase 2 (E-commerce Leve & Admin)**, que incluirá:

- Catálogo de Salgados renderizado dinamicamente.
- Carrinho de Compras integrado e salvamento de pedidos (Local Storage).
- Painel Administrativo Autônomo para a dona (Autenticação, CRUD).
- Backend-as-a-service utilizando **Firebase** (Firestore e Storage).

🔗 Veja mais detalhes técnicos no arquivo [PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) e o planejamento das tarefas no [BACKLOG_PHASE2.md](docs/BACKLOG_PHASE2.md).

## 🚀 Como Executar Localmente

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/tiagoeduardobr/salgados_da_elza.git
   ```

2. **Acesse a pasta do projeto:**

   ```bash
   cd salgados_da_elza
   ```

3. **Abra o arquivo `index.html`** no seu navegador preferido — e pronto! 🎉

> 💡 **Dica:** Você também pode usar a extensão **Live Server** no VS Code para recarregamento automático durante o desenvolvimento.

## 📱 Preview

|            Desktop            |             Mobile              |
| :---------------------------: | :-----------------------------: |
| Layout com seções lado a lado | Seções empilhadas verticalmente |
|    Imagens 350px de altura    |     Imagens 280px de altura     |
| Alternância esquerda/direita  |         Fluxo contínuo          |

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. Faça **commit** das suas alterações (`git commit -m 'feat: adiciona nova feature'`)
4. Faça **push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5547992203893?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20pedido%20dos%20Salgados%20da%20Elza!)

**Salgados da Elza** · Blumenau, SC
📞 (47) 9 9220-3893

---

Feito com ❤️ por [Tiago Eduardo](https://github.com/tiagoeduardobr)
