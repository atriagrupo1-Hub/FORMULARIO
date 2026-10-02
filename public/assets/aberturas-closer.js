// Telas de apresentação da vaga de Closer. Conteúdo reproduzido do documento
// original, na mesma ordem: capa, empresa, produto, público, posição e as
// instruções (onde o candidato deixa os dados antes de começar).

export const CAPA = `
<div class="bloco">
  <div class="rotulo">Processo seletivo</div>
  <h1 class="titulo-grande">Closer</h1>
  <div class="regua"></div>
  <div class="texto">
    <p class="destaque">ATRIA | Mentoria Caminho do Desbloqueio para Bênçãos Ilimitadas</p>
    <p>Antes de responder às perguntas, queremos que você entenda rapidamente a empresa, o produto que irá vender, o público com quem irá conversar e o objetivo desta posição.</p>
  </div>
  <div class="acoes larga">
    <button class="btn-ouro inicio" data-acao="proximo">Conhecer a oportunidade</button>
    <span class="aviso-tempo">17 perguntas · 6 seções</span>
  </div>
</div>`;

export const SOBRE = `
<div class="bloco">
  <div class="rotulo">Contexto da oportunidade</div>
  <h2 class="titulo-medio">Sobre a ATRIA</h2>
  <div class="regua"></div>
  <div class="pilares">
    <div class="pilar">
      <div class="pilar-titulo">No mercado digital</div>
      <div class="pilar-texto"><p>≈ 2 anos</p></div>
    </div>
    <div class="pilar">
      <div class="pilar-titulo">Base de alunos</div>
      <div class="pilar-texto"><p>+ 10 mil</p></div>
    </div>
    <div class="pilar">
      <div class="pilar-titulo">Nicho</div>
      <div class="pilar-texto"><p>Espiritualidade e desenvolvimento pessoal com fundamento cristão</p></div>
    </div>
  </div>
  <div class="texto">
    <p>A ATRIA atua há aproximadamente 2 anos no mercado digital, principalmente no nicho de espiritualidade e desenvolvimento pessoal com fundamento cristão.</p>
    <p>Ao longo desse período, construímos uma base de mais de 10 mil alunos, através de produtos digitais, ofertas e lançamentos.</p>
    <p>Estamos em uma nova fase de crescimento e estruturação da empresa.</p>
    <p>Uma das áreas que estamos desenvolvendo é o nosso setor comercial, especialmente para produtos de maior valor.</p>
    <p class="dourado">É nesse contexto que estamos contratando um Closer.</p>
  </div>
  <div class="acoes">
    <button class="btn-ouro secao" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

export const PRODUTO = `
<div class="bloco">
  <div class="rotulo">O que você vai vender</div>
  <h2 class="titulo-medio">Mentoria Caminho do Desbloqueio para Bênçãos Ilimitadas</h2>
  <div class="regua"></div>
  <div class="texto">
    <p>É uma mentoria de transformação pessoal com fundamento cristão.</p>
  </div>
  <div class="pilares">
    <div class="pilar">
      <div class="pilar-titulo">Aulas</div>
      <div class="pilar-texto"><p>57</p></div>
    </div>
    <div class="pilar">
      <div class="pilar-titulo">Módulos</div>
      <div class="pilar-texto"><p>11</p></div>
    </div>
  </div>
  <div class="texto">
    <p>Além da estrutura e acompanhamento da Mentoria.</p>
  </div>
  <div class="cartao">
    <div class="cartao-rotulo">Entre os assuntos trabalhados</div>
  </div>
  <div class="etiquetas">
    <span>prosperidade</span><span>vida financeira</span>
    <span>realização de projetos e desejos</span><span>relacionamentos</span>
    <span>fé</span><span>oração</span><span>crenças e padrões</span>
    <span>identidade</span><span>hábitos</span><span>ambiente</span>
    <span>linguagem</span><span>responsabilidade</span><span>ação</span>
    <span>construção de uma nova trajetória de vida</span>
  </div>
  <div class="texto">
    <p>A Mentoria não deve ser apresentada como promessa de controle absoluto sobre acontecimentos externos ou sobre outras pessoas.</p>
    <p>Também não substitui acompanhamento médico, psicológico, jurídico ou financeiro quando necessário.</p>
  </div>
  <div class="cartao">
    <div class="cartao-rotulo">Valor da mentoria</div>
    <p class="forte">R$ 7.500 a R$ 13.000</p>
    <p class="fraco">Este será o principal ticket comercial trabalhado pelo closer nesta operação.</p>
  </div>
  <div class="acoes">
    <button class="btn-ouro secao" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

export const PUBLICO = `
<div class="bloco">
  <div class="rotulo">Nosso público</div>
  <h2 class="titulo-medio">Com quem você vai conversar</h2>
  <div class="regua"></div>
  <div class="texto">
    <p>Atualmente, nosso público predominante é composto por pessoas acima dos 50 anos, com forte presença de:</p>
    <p class="destaque">Mulheres cristãs entre aproximadamente 55 e 75 anos.</p>
  </div>
  <div class="cartao">
    <div class="cartao-rotulo">Podem chegar até nós trazendo questões relacionadas a</div>
  </div>
  <div class="etiquetas">
    <span>dinheiro</span><span>prosperidade</span><span>relacionamentos</span>
    <span>família</span><span>projetos ainda não realizados</span>
    <span>frustrações</span><span>fé</span><span>propósito</span>
    <span>segurança</span><span>mudanças que desejam realizar na própria vida</span>
  </div>
  <div class="texto">
    <p>Por isso, esta posição exige capacidade de conversar com esse público com:</p>
  </div>
  <div class="etiquetas">
    <span>maturidade</span><span>respeito</span><span>clareza</span>
    <span>segurança</span><span>escuta</span>
    <span>empatia sem infantilização</span><span>capacidade comercial</span>
  </div>
  <div class="acoes">
    <button class="btn-ouro secao" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

export const POSICAO = `
<div class="bloco">
  <div class="rotulo">A posição</div>
  <h2 class="titulo-medio">De onde vêm os leads</h2>
  <div class="regua"></div>
  <div class="texto">
    <p>Os leads poderão chegar através de diferentes canais, entre eles:</p>
  </div>
  <div class="etiquetas">
    <span>nossa própria base de clientes e alunos</span>
    <span>campanhas realizadas para nossa base</span>
    <span>tráfego pago</span><span>campanhas de aquisição</span>
    <span>outras ações comerciais e de marketing da ATRIA</span>
  </div>
  <div class="texto">
    <p>O closer receberá oportunidades geradas pela operação e será responsável por conduzi-las comercialmente.</p>
  </div>
  <h2 class="titulo-medio">Por que estamos contratando um Closer</h2>
  <div class="texto">
    <p>A ATRIA já possui uma base relevante de clientes e alunos e está ampliando sua atuação com produtos de maior valor. A Mentoria faz parte dessa nova etapa.</p>
    <p>Nosso objetivo é estruturar um processo comercial mais profissional, com pessoas responsáveis especificamente por:</p>
  </div>
  <div class="etiquetas">
    <span>receber oportunidades</span><span>conduzir conversas e calls comerciais</span>
    <span>diagnosticar o cenário do lead</span><span>apresentar a Mentoria</span>
    <span>trabalhar objeções</span><span>solicitar o fechamento</span>
    <span>realizar follow-up</span><span>acompanhar oportunidades</span>
    <span>registrar informações comerciais</span>
    <span>contribuir diretamente para o crescimento das vendas</span>
  </div>
  <div class="texto">
    <p>Esta não é uma posição de atendimento. É uma posição diretamente ligada a:</p>
    <p class="dourado">Vendas e resultado comercial.</p>
  </div>
  <div class="acoes">
    <button class="btn-ouro secao" data-acao="proximo">Continuar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

// Última tela antes das perguntas: instruções e os dados de contato.
export const DADOS = `
<div class="bloco">
  <div class="rotulo">Antes de responder</div>
  <h2 class="titulo-medio">Queremos conhecer sua experiência real</h2>
  <div class="regua"></div>
  <div class="texto">
    <p>Nas próximas perguntas queremos conhecer sua experiência real. Sempre que possível, utilize:</p>
  </div>
  <div class="etiquetas">
    <span>casos reais</span><span>números</span>
    <span>situações que você viveu</span><span>resultados</span>
    <span>exemplos concretos</span>
  </div>
  <div class="texto">
    <p>Não buscamos respostas decoradas ou linguagem sofisticada de vendas. Queremos compreender:</p>
    <p class="dourado">Como você vende.</p>
  </div>
  <div class="cartao">
    <div class="cartao-rotulo">Seus dados</div>
    <p class="fraco">Todas as perguntas são obrigatórias. Suas respostas ficam salvas automaticamente, então você pode fechar e voltar depois de onde parou.</p>
  </div>
  <div class="campo">
    <div class="campo-rotulo">Nome completo</div>
    <input id="campo-nome" type="text" autocomplete="name" placeholder="Escreva seu nome...">
  </div>
  <div class="campo">
    <div class="campo-rotulo">WhatsApp</div>
    <input id="campo-whatsapp" type="tel" autocomplete="tel" placeholder="(00) 00000-0000">
  </div>
  <div class="campo">
    <div class="campo-rotulo">E-mail</div>
    <input id="campo-email" type="email" autocomplete="email" placeholder="voce@exemplo.com">
  </div>
  <p class="envio-erro" id="erro-dados" hidden></p>
  <div class="acoes">
    <button class="btn-ouro comecar" data-acao="comecar">Começar</button>
    <button class="btn-voltar" data-acao="anterior">← Voltar</button>
  </div>
</div>`;

// A capa é o passo 0; estas são as telas de contexto que vêm depois.
export const INTROS = [SOBRE, PRODUTO, PUBLICO, POSICAO];
