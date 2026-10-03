// Gerado a partir do formulário ATRIA — Seleção de Closer.
// Questionário inicial (versão 1): 6 seções, 17 perguntas, todas obrigatórias.
// A pergunta q17 é o teste prático: o candidato grava e envia um áudio ou vídeo.
// O painel grava novas versões no banco; este arquivo é só a semente usada
// enquanto nenhuma versão foi salva ainda.

export const CLOSER_PADRAO = {
  "versao": 1,
  "secoes": [
    {
      "id": "s1",
      "titulo": "Experiência e resultados",
      "nota": []
    },
    {
      "id": "s2",
      "titulo": "Condução de vendas",
      "nota": []
    },
    {
      "id": "s3",
      "titulo": "Objeções",
      "nota": []
    },
    {
      "id": "s4",
      "titulo": "Julgamento comercial",
      "nota": []
    },
    {
      "id": "s5",
      "titulo": "Follow-up e evolução",
      "nota": []
    },
    {
      "id": "s6",
      "titulo": "Teste prático",
      "nota": []
    }
  ],
  "perguntas": [
    {
      "id": "q1",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Conte brevemente sua experiência com vendas e fechamento.",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "Inclua",
      "lista": [
        "há quanto tempo trabalha com vendas",
        "quais produtos ou serviços já vendeu",
        "ticket médio das ofertas",
        "se vendia por ligação, videochamada, WhatsApp ou outro canal",
        "se atuava como closer, SDR + closer ou em outra função"
      ],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q2",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Escolha a operação de vendas mais relevante em que você já trabalhou e nos passe os principais números.",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Deixe claro quais números eram seus e quais eram resultados gerais da equipe ou empresa."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "Informe, aproximadamente",
      "lista": [
        "produto ou serviço vendido",
        "ticket",
        "origem dos leads",
        "média de calls realizadas por mês",
        "taxa de fechamento",
        "média de vendas mensais",
        "faturamento vendido por você, quando souber",
        "por quanto tempo trabalhou nessa operação"
      ],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q3",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Quando você fala que possuía determinada taxa de fechamento, como exatamente essa taxa era calculada?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Explique quais números entravam no cálculo e dê um exemplo utilizando uma operação real em que trabalhou."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q4",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Conte uma venda difícil que você conseguiu fechar.",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "Explique",
      "lista": [
        "como o lead chegou",
        "o que ele buscava",
        "qual foi a principal dificuldade da venda",
        "o que você descobriu durante a conversa",
        "qual objeção apareceu",
        "como você conduziu",
        "qual foi o resultado"
      ],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q5",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Agora conte uma venda que você acredita que poderia ter fechado, mas perdeu.",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "O que aconteceu?",
        "Olhando hoje para essa call, onde você acredita que errou ou poderia ter conduzido melhor?",
        "O que faria diferente?"
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q6",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Antes de apresentar a oferta, o que você precisa descobrir?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Explique como conduziria aproximadamente os primeiros 10 a 15 minutos da conversa."
      ],
      "cenario": [
        "Você entra em uma call com um lead que demonstrou interesse, mas possui poucas informações sobre ele."
      ],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q7",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Quais seriam as primeiras perguntas que faria?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Escreva como se estivesse realmente conversando com essa pessoa."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "Uma lead diz",
      "citacao": "Já comprei vários cursos. Eu começo animada, mas nunca termino.",
      "depois": [
        "Você ainda não apresentou nossa Mentoria."
      ],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q8",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Qual seria sua próxima resposta?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Explique também o que estaria tentando descobrir antes de oferecer qualquer condição diferente de pagamento."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "Após conhecer a oferta, a pessoa responde",
      "citacao": "Gostei, mas achei muito caro.",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q9",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Como você conduziria a conversa a partir daí?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Escreva o que provavelmente falaria e quais perguntas faria."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "A pessoa diz",
      "citacao": "Eu gostei bastante, mas preciso pensar.",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q10",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Como você investigaria essa situação sem pressionar artificialmente a pessoa?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "A lead diz",
      "citacao": "Preciso conversar com meu marido antes de tomar essa decisão.",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q11",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Como você responderia e como continuaria a conversa?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "Uma mulher de aproximadamente 65 anos diz",
      "citacao": "Eu já tentei mudar tantas vezes. Acho que estou velha demais para conseguir.",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q12",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Existe alguma situação em que você decidiria NÃO vender, mesmo tendo possibilidade de fechar?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Dê um exemplo concreto e explique sua lógica."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q13",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "O que você faz?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Como utiliza um speech sem ficar preso a ele?"
      ],
      "cenario": [
        "Você recebe um speech completo da empresa.",
        "Durante uma call, porém, o lead responde algo importante que não estava previsto naquele momento do roteiro."
      ],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q14",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Antes de concluir que “os leads pioraram”, o que você analisaria?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Explique seu raciocínio e a ordem das coisas que verificaria."
      ],
      "cenario": [
        "Sua conversão vinha estável e, durante duas semanas, cai significativamente."
      ],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q15",
      "secao": "s5",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Como funciona seu processo de follow-up?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [],
      "cenario": [
        "Um lead qualificado não compra na primeira call, mas também não diz não."
      ],
      "cenarioLabel": "",
      "listaLabel": "Explique",
      "lista": [
        "como organiza essas oportunidades",
        "como decide quando entrar em contato novamente",
        "o que registra sobre cada lead",
        "como evita simplesmente mandar várias vezes “e aí, conseguiu pensar?”"
      ],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q16",
      "secao": "s5",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 7,
      "titulo": "Como você melhora sua própria performance como closer?",
      "tituloNoTopo": false,
      "destaque": false,
      "ajuda": [
        "Conte um exemplo real de algo que percebeu analisando suas próprias calls ou seus resultados, o que mudou na sua abordagem e o que aconteceu depois."
      ],
      "cenario": [],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "",
      "citacao": "",
      "depois": [],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q17",
      "secao": "s6",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 9,
      "titulo": "O que você faria?",
      "tituloNoTopo": false,
      "destaque": true,
      "ajuda": [
        "Escreva como se estivesse respondendo a ela na hora."
      ],
      "cenario": [
        "Você está conversando com uma potencial cliente da Mentoria.",
        "Ela possui 62 anos, demonstrou bastante interesse durante a conversa e afirma que gostaria de realizar mudanças importantes na própria vida."
      ],
      "cenarioLabel": "",
      "listaLabel": "",
      "lista": [],
      "citacaoQuem": "Na hora da decisão ela diz",
      "citacao": "Eu gostei muito, mas já gastei dinheiro com outras coisas que prometiam mudança e não aconteceu nada. Tenho medo de gastar novamente e me arrepender.",
      "depois": [
        "Continue a conversa como se você fosse o closer responsável por essa oportunidade."
      ],
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    }
  ]
};
