# ATRIA — Formulário de seleção + painel

Formulário público para a candidata responder (link que você manda por WhatsApp)
e um painel interno para você editar as perguntas e ler as respostas.

O visual, os textos e o comportamento do formulário original foram preservados.
As únicas mudanças são: uma tela inicial pedindo o nome (o mesmo link serve para
qualquer candidata) e a gravação das respostas num banco em vez do navegador.

---

## Como está organizado

```
public/            o site em si (é isto que o Cloudflare publica)
  index.html         formulário da candidata
  painel.html        painel interno
  assets/            estilos, scripts e as fontes Archivo + Instrument Serif
functions/api/     código que roda no servidor do Cloudflare
  questionario.js    entrega as perguntas para a candidata (público)
  enviar.js          recebe as respostas (público)
  admin/             painel: editar perguntas e ler respostas (exige a chave)
src/               código compartilhado + o questionário original de 35 perguntas
schema.sql         as duas tabelas do banco
```

Não existe etapa de build: é HTML, CSS e JavaScript direto.

---

## Passo a passo da publicação

### 1. Supabase (o banco)

1. Crie o projeto na organização gratuita. Região: **South America (São Paulo)**.
2. Com o projeto pronto, abra **SQL Editor → New query**, cole todo o conteúdo de
   `schema.sql` e clique em **Run**. Isso cria as duas tabelas já trancadas.
3. Vá em **Project Settings → API** e anote:
   - **Project URL** → vira a variável `SUPABASE_URL`
   - **service_role** (em "Project API keys", precisa clicar para revelar)
     → vira a variável `SUPABASE_SERVICE_ROLE_KEY`

> A `service_role` dá acesso total ao banco. Ela só pode ser colada no painel do
> Cloudflare, como variável de ambiente. Nunca no código, nunca numa conversa.
> A chave `anon` não é usada por este projeto.

### 2. Cloudflare Pages (a hospedagem)

1. Entre em [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
   → **Create** → aba **Pages** → **Connect to Git**.
2. Autorize o GitHub e escolha o repositório **atriagrupo1-Hub/FORMULARIO**.
3. Na tela de configuração:
   - **Production branch**: a branch onde este código está
   - **Framework preset**: `None`
   - **Build command**: deixe **vazio**
   - **Build output directory**: `public`
4. Ainda antes de salvar, abra **Environment variables (advanced)** e adicione as três:

   | Nome | Valor |
   |---|---|
   | `SUPABASE_URL` | a Project URL do Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | a chave service_role |
   | `ADMIN_KEY` | a chave do painel (a que foi gerada para você) |

5. **Save and Deploy**. Em ~1 minuto o site está no ar.

> Se você criou as variáveis depois do primeiro deploy, force um novo deploy em
> **Deployments → Retry deployment**. Variáveis só entram em vigor no build seguinte.

### 3. Os dois links

- **Para a candidata:** `https://SEU-PROJETO.pages.dev/`
- **Para você:** `https://SEU-PROJETO.pages.dev/painel?k=SUA_ADMIN_KEY`

O link do painel é o que separa você da candidata. Quem tiver esse link entra.
Não mande no mesmo lugar em que você manda o link dela.

---

## Usando o painel

**Aba Perguntas.** A lista está exatamente na ordem que a candidata vê.
Em cada pergunta você tem:

- **↑ ↓** move dentro da seção
- **Editar** abre os campos (texto, ajuda, cenário, tipo, alternativas, itens…)
- **Prever** abre a pergunta com a aparência real do formulário
- **Excluir** remove

Em **Seções** você renomeia, reordena e adiciona seções. Nada é aplicado até
clicar em **Salvar alterações**, na barra que aparece no rodapé.

Escreva `{nome}` em qualquer texto para inserir o primeiro nome da candidata.

Cada vez que você salva, nasce uma **versão nova**. As respostas já enviadas
guardam uma cópia do questionário como estava no momento do envio, então editar
uma pergunta hoje não bagunça o que alguém respondeu ontem.

**Aba Respostas.** Lista de candidatas à esquerda; clique num nome e veja
pergunta por pergunta, com a resposta, a alternativa, a nota, a ordenação e
**quanto tempo ela levou em cada pergunta**. No topo: tempo total, quando começou,
quando enviou e quantas perguntas respondeu.

Exportação: **Baixar TXT**, **Baixar CSV** (uma linha por pergunta) e
**CSV de todas** (todas as candidatas no mesmo arquivo, para comparar).

---

## Como o tempo é medido

- **Início**: quando ela confirma o nome na primeira tela.
- **Por pergunta**: soma do tempo com aquela pergunta na tela, incluindo as vezes
  em que ela volta para editar. O relógio pausa se ela troca de aba.
- **Total**: do início até o envio.

---

## Detalhes de segurança

- As tabelas têm RLS ligado e nenhuma política de liberação: ninguém acessa o banco
  pelo navegador. Só as funções do servidor, com a `service_role` guardada no Cloudflare.
- O formulário nunca recebe chave nenhuma. Ele só sabe chamar `/api/questionario`
  e `/api/enviar`.
- O painel é protegido pela `ADMIN_KEY`, comparada em tempo constante no servidor.
- `robots.txt` e a meta tag `noindex` pedem que buscadores não indexem as páginas.
- O endereço de envio é público por natureza (tem que ser, para a candidata usar
  sem login). Se algum dia aparecer envio indevido, o caminho é trocar o link ou
  colocar uma regra de rate limit no Cloudflare.

---

## Mexendo no código depois

Qualquer alteração enviada para a branch conectada publica sozinha.
Para testar na sua máquina antes, use `npx wrangler pages dev public` com um
arquivo `.dev.vars` contendo as três variáveis (ele já está no `.gitignore`).
