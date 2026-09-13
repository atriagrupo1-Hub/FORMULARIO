// Telas de apresentação da ATRIA. Conteúdo fixo, reproduzido do formulário
// original. Só a tela de nome é nova (o formulário passou a servir para
// qualquer candidata, e o nome preenche os textos personalizados).

export const TELA_NOME = `
<div class="bloco">
  <div class="rotulo">Etapa de seleção — Suporte ao Cliente e Recuperação de Vendas</div>
  <h1 class="titulo-grande">Antes de começar, como podemos te chamar?</h1>
  <div class="regua"></div>
  <div class="texto">
    <p>Usaremos seu nome ao longo das próximas telas.</p>
    <p>Leva de 25 a 35 minutos. Suas respostas ficam salvas automaticamente, então você pode fechar e voltar depois de onde parou.</p>
  </div>
  <div class="campo">
    <div class="campo-rotulo">Seu nome completo</div>
    <input id="campo-nome" type="text" autocomplete="name" placeholder="Escreva seu nome...">
  </div>
  <button class="btn-ouro inicio" data-acao="comecar">Continuar</button>
</div>`;

export const INTRO_1 = `
<div class="bloco">
  <div class="rotulo">Etapa de seleção — Suporte ao Cliente e Recuperação de Vendas</div>
  <h1 class="titulo-grande">Antes de falarmos sobre a vaga, queremos que você conheça quem estamos construindo.</h1>
  <div class="regua"></div>
  <div class="texto">
    <p>A ATRIA é uma empresa do mercado digital que atua principalmente no nicho de espiritualidade.</p>
    <p>Temos aproximadamente dois anos de operação e já construímos uma base de mais de 10 mil alunos.</p>
    <p class="destaque">Mas não pensamos a ATRIA simplesmente como uma empresa que vende produtos digitais.</p>
    <p>Estamos construindo um ecossistema de longo prazo.</p>
    <p>Uma pessoa pode conhecer a ATRIA através de uma primeira solução, tornar-se cliente ou aluna e continuar sua jornada conosco através de novas experiências, produtos e oportunidades.</p>
    <p>Por isso, pensamos muito além de uma única venda. Pensamos em:</p>
  </div>
  <div class="etiquetas">
    <span>relacionamento</span><span>aquisição</span><span>experiência do cliente</span>
    <span>crescimento da base</span><span>novas ofertas</span><span>recorrência</span>
    <span>ascensão</span><span>resultados de longo prazo</span>
  </div>
  <div class="texto">
    <p>A ATRIA também está vivendo uma fase importante de transformação.</p>
    <p>A empresa nasceu com grande parte da operação concentrada no fundador. Hoje estamos construindo progressivamente uma organização com processos, responsáveis, especialistas, setores, gestão, dados e futuras lideranças.</p>
    <p>Nosso objetivo não é contratar pessoas apenas para receber tarefas e executá-las.</p>
    <p class="dourado">Queremos pessoas que consigam crescer em competência, responsabilidade e importância conforme a própria empresa cresce.</p>
  </div>
  <button class="btn-ouro inicio" data-acao="proximo">Continuar</button>
</div>`;

export const INTRO_2 = `
<div class="bloco">
  <div class="rotulo">Cultura</div>
  <h2 class="titulo-medio">Como pensamos sobre pessoas</h2>
  <div class="pilares">
    <div class="pilar">
      <div class="pilar-titulo">Unidade</div>
      <div class="pilar-texto">
        <p>Uma empresa funciona como um sistema. O trabalho de uma pessoa afeta outras pessoas e áreas.</p>
        <p>Isso não significa fazer o trabalho de todo mundo. Significa não ignorar problemas importantes simplesmente porque &ldquo;não estavam na minha descrição de cargo&rdquo;.</p>
      </div>
    </div>
    <div class="pilar">
      <div class="pilar-titulo">Linguagem</div>
      <div class="pilar-texto">
        <p>Problemas precisam ser comunicados. Erros precisam ser reconhecidos. Dificuldades não devem ser escondidas.</p>
        <p>Mas nossa comunicação deve caminhar em direção à solução.</p>
      </div>
    </div>
    <div class="pilar">
      <div class="pilar-titulo">Propósito</div>
      <div class="pilar-texto">
        <p>A empresa possui objetivos. Mas as pessoas também possuem.</p>
        <p>Queremos construir um ambiente em que pessoas competentes possam crescer profissionalmente, financeiramente e em responsabilidade conforme demonstram capacidade e produzem resultados.</p>
        <p class="apagado">Isso não é uma promessa automática de cargo ou salário. É uma possibilidade construída através de competência, confiança, responsabilidade e resultado.</p>
      </div>
    </div>
  </div>
  <div class="acoes solta">
    <button class="btn-ouro" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

export const INTRO_3 = `
<div class="bloco medio">
  <div class="rotulo">Um ponto importante sobre nossa forma de trabalhar</div>
  <h2 class="titulo-medio">Como esta função funciona</h2>
  <div class="texto">
    <p>Esta não é uma função pensada principalmente em torno de &ldquo;cumpri minhas horas, então terminei minha parte&rdquo;.</p>
    <p class="destaque">A lógica é diferente.</p>
    <p>O trabalho é remoto e existe liberdade para organizar sua rotina. Em contrapartida, esperamos responsabilidade sobre:</p>
  </div>
  <div class="etiquetas">
    <span>produção</span><span>atendimentos</span><span>oportunidades</span><span>pendências</span>
    <span>clientes</span><span>recuperações</span><span>resultados</span>
  </div>
  <div class="texto">
    <p>Nem todos os clientes aparecem em horário comercial. Algumas oportunidades podem surgir à noite. Em determinados momentos, uma situação importante pode aparecer em um sábado, domingo ou feriado.</p>
    <p class="destaque">Isso não significa trabalhar o tempo inteiro. Também não acreditamos que quantidade de horas seja sinônimo de produtividade.</p>
    <p>Queremos alguém capaz de administrar a própria rotina com maturidade e entender quando determinada situação realmente merece atenção.</p>
  </div>
  <div class="cartao largo">
    <div class="cartao-rotulo">Remuneração</div>
    <p class="forte">Remuneração fixa + comissão ligada à recuperação de vendas.</p>
    <p class="fraco">Portanto, existe também uma relação direta entre capacidade de gerar resultado e possibilidade de crescimento financeiro.</p>
  </div>
  <div class="texto">
    <p>Nesta etapa, queremos entender se essa forma de trabalhar combina com você.</p>
  </div>
  <div class="acoes solta">
    <button class="btn-ouro" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

export const INTRO_4 = `
<div class="bloco">
  <div class="rotulo">Instruções</div>
  <h2 class="titulo-medio">Queremos conhecer como você realmente pensa</h2>
  <div class="regua"></div>
  <div class="texto estreito">
    <p>Algumas perguntas não possuem uma resposta perfeita.</p>
    <p>Não tente descobrir &ldquo;o que a empresa quer ouvir&rdquo;. Responda da maneira mais próxima possível de como você realmente agiria.</p>
    <p>Em algumas situações haverá informações faltando propositalmente. Faz parte da avaliação.</p>
    <p class="dourado">Queremos conhecer você, não uma versão ensaiada de você.</p>
  </div>
  <div class="acoes larga">
    <button class="btn-ouro comecar" data-acao="proximo">Começar</button>
    <span class="aviso-tempo">Tempo estimado: 25 a 35 minutos</span>
  </div>
</div>`;

export const INTROS = [INTRO_1, INTRO_2, INTRO_3, INTRO_4];
