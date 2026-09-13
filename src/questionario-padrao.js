// Gerado a partir do formulário original ATRIA. Questionário inicial (versão 1).
// O painel grava novas versões no banco; este arquivo é só a semente usada
// enquanto nenhuma versão foi salva ainda.

export const QUESTIONARIO_PADRAO = {
  "versao": 1,
  "secoes": [
    {
      "id": "s1",
      "titulo": "O que você quer construir",
      "nota": []
    },
    {
      "id": "s2",
      "titulo": "Liberdade com responsabilidade",
      "nota": []
    },
    {
      "id": "s3",
      "titulo": "Quando não existe um manual",
      "nota": [
        "As situações a seguir não possuem necessariamente uma única solução correta."
      ]
    },
    {
      "id": "s4",
      "titulo": "Quando você enxerga algo que poderia ser melhor",
      "nota": []
    },
    {
      "id": "s5",
      "titulo": "Resultado e prioridade",
      "nota": []
    },
    {
      "id": "s6",
      "titulo": "Quando o resultado não vem",
      "nota": []
    },
    {
      "id": "s7",
      "titulo": "Fixo + comissão",
      "nota": []
    },
    {
      "id": "s8",
      "titulo": "Aprendizado",
      "nota": []
    },
    {
      "id": "s9",
      "titulo": "Feedback e maturidade",
      "nota": []
    },
    {
      "id": "s10",
      "titulo": "Uma empresa ainda sendo construída",
      "nota": [
        "Queremos ser transparentes sobre o momento da ATRIA.",
        "Hoje temos muito mais estrutura, processos e organização do que no início. Entretanto, continuamos crescendo.",
        "Isso significa que nem tudo estará perfeito. Alguns processos ainda poderão ser melhorados. Algumas situações novas ainda não terão documentação.",
        "Em determinados momentos, pessoas boas também ajudarão a construir soluções que futuramente serão utilizadas pela equipe."
      ]
    },
    {
      "id": "s11",
      "titulo": "Você + ATRIA",
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
      "titulo": "O que mudou?",
      "ajuda": "Fale sobre aquilo que for importante para você: renda, conhecimento, responsabilidade, carreira, liberdade, posição, projetos, estilo de vida ou qualquer outra conquista.",
      "cenario": [
        "Imagine que estamos conversando novamente daqui a 3 anos e você sente que sua vida profissional evoluiu muito."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q2",
      "secao": "s1",
      "tipo": "texto",
      "obrigatoria": false,
      "linhas": 5,
      "titulo": "Existe algum objetivo importante da sua vida pessoal que o crescimento profissional e financeiro ajudaria você a realizar?",
      "ajuda": "Pode ser algo relacionado a família, casa, liberdade, viagens, independência, projetos próprios ou qualquer outro objetivo. Compartilhe somente aquilo com que se sentir confortável.",
      "cenario": [],
      "cenarioLabel": "",
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
      "titulo": "O que você acredita que precisaria entregar, aprender ou assumir para uma empresa olhar para você daqui a um ano e pensar: “faz sentido essa profissional ganhar R$ 6.000”?",
      "ajuda": "",
      "cenario": [
        "Você mencionou uma pretensão atual próxima de R$ 2.500 e uma expectativa de chegar aproximadamente a R$ 5.000–R$ 6.000."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q4",
      "secao": "s1",
      "tipo": "escolha",
      "obrigatoria": true,
      "linhas": 4,
      "titulo": "Dinheiro é um motivador profissional importante para você?",
      "ajuda": "Escolha a opção mais próxima da realidade. Não existe alternativa considerada correta.",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [
        {
          "chave": "A",
          "texto": "Sim, é um dos meus principais motivadores."
        },
        {
          "chave": "B",
          "texto": "É importante, mas crescimento e aprendizado pesam tanto quanto."
        },
        {
          "chave": "C",
          "texto": "É importante, mas estabilidade é mais importante."
        },
        {
          "chave": "D",
          "texto": "Não é um motivador tão importante para mim."
        },
        {
          "chave": "E",
          "texto": "Minha relação com dinheiro no trabalho é diferente dessas alternativas."
        }
      ],
      "itens": [],
      "campoLabel": "Explique sua resposta"
    },
    {
      "id": "q5",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Como você normalmente organiza seu trabalho quando possui liberdade para decidir sua própria rotina?",
      "ajuda": "",
      "cenario": [
        "Nesta função você não terá alguém controlando constantemente que horas começou, quanto tempo ficou online ou em que momento realizou cada atividade.",
        "Existirão entregas, clientes, resultados e responsabilidades."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q6",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Como você enxerga essa diferença?",
      "ajuda": "",
      "cenario": [
        "Profissional A: trabalha muitas horas, está sempre online, mas frequentemente deixa pendências e produz pouco resultado.",
        "Profissional B: organiza bem o próprio tempo, às vezes trabalha menos horas, mas entrega tudo, acompanha os clientes e produz resultado consistente."
      ],
      "cenarioLabel": "Dois profissionais",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q7",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você provavelmente faria?",
      "ajuda": "Explique também por quê.",
      "cenario": [
        "São 21h15 de uma quarta-feira.",
        "Você já encerrou aquilo que havia planejado para o dia.",
        "Ao olhar rapidamente o WhatsApp, percebe uma conversa com uma pessoa muito próxima de concluir uma compra. Existe uma dúvida simples impedindo a decisão.",
        "Ninguém pediu para você olhar o celular."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q8",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 4,
      "titulo": "O que você faria?",
      "ajuda": "",
      "cenario": [
        "Agora mude o cenário.",
        "É domingo à tarde.",
        "Existem mensagens, mas nenhuma parece urgente. A maior parte pode ser respondida normalmente na segunda-feira sem prejuízo relevante."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q9",
      "secao": "s2",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você pensa desta frase?",
      "ajuda": "Explique como isso funcionaria na prática para você.",
      "cenario": [
        "“Ter flexibilidade não significa estar disponível o tempo inteiro. Significa saber administrar a própria liberdade sem deixar o resultado cair.”"
      ],
      "cenarioLabel": "Uma frase",
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
      "titulo": "Descreva exatamente o que faria, em ordem.",
      "ajuda": "",
      "cenario": [
        "Você está há 10 dias na ATRIA.",
        "Um cliente apresenta um problema que você nunca encontrou antes. Existe uma venda relevante em risco.",
        "Você procura o procedimento interno e percebe que aquele caso ainda não foi documentado.",
        "Seu responsável ficará indisponível pelas próximas três horas."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q11",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você faz nos primeiros 30 minutos?",
      "ajuda": "Seja específica.",
      "cenario": [
        "Você recebeu uma responsabilidade importante e percebeu que não sabe fazer uma das etapas.",
        "Ninguém está disponível naquele momento.",
        "Você possui internet, vídeos, documentação, ferramentas e acesso aos sistemas."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q12",
      "secao": "s3",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você faria?",
      "ajuda": "Explique seu raciocínio.",
      "cenario": [
        "Depois de pesquisar, você chegou a uma solução que acredita ter 80% de chance de estar correta.",
        "Esperar três horas pode custar a venda.",
        "Executar possui algum risco, mas o impacto de um eventual erro parece pequeno e reversível."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q13",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você faria?",
      "ajuda": "",
      "cenario": [
        "Toda semana você percebe clientes enfrentando exatamente o mesmo problema.",
        "Você consegue resolver cada atendimento. Entretanto, percebe que a equipe está perdendo várias horas repetindo a mesma solução.",
        "Corrigir a causa original não faz parte formalmente da sua função."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q14",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 4,
      "titulo": "O que faria?",
      "ajuda": "",
      "cenario": [
        "Você concluiu todas as suas responsabilidades previstas naquele momento.",
        "Percebe que uma colega está sobrecarregada e que algumas oportunidades comerciais podem ser perdidas.",
        "Ninguém pediu sua ajuda."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q15",
      "secao": "s4",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Explique exatamente o que você faria a partir desse momento.",
      "ajuda": "",
      "cenario": [
        "Você comete um erro. Ninguém percebeu ainda.",
        "O erro pode causar uma experiência ruim para alguns clientes ou um pequeno prejuízo.",
        "Existe uma boa chance de ninguém descobrir."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q16",
      "secao": "s5",
      "tipo": "ordem",
      "obrigatoria": true,
      "linhas": 4,
      "titulo": "Em qual ordem você lidaria com essas situações?",
      "ajuda": "",
      "cenario": [
        "Você abre o sistema e encontra simultaneamente as cinco situações abaixo."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [
        "Um cliente muito irritado solicitando reembolso",
        "Quatro pessoas aguardando uma resposta simples para concluir uma compra",
        "Um aluno que não consegue acessar o produto",
        "Oito leads antigos aguardando follow-up",
        "Uma solicitação interna que precisa ser entregue dentro de 30 minutos"
      ],
      "campoLabel": "Explique seu raciocínio"
    },
    {
      "id": "q17",
      "secao": "s5",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Escreva exatamente a mensagem que você mandaria.",
      "ajuda": "",
      "cenario": [
        "Uma pessoa demonstrou bastante interesse no produto.",
        "Você fez follow-up e ela respondeu:",
        "“Gostei, mas vou pensar. Agora não é um bom momento.”"
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q18",
      "secao": "s5",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Escreva sua próxima resposta.",
      "ajuda": "Não queremos que você pressione alguém a comprar algo que não pode pagar. Queremos observar como você conduz uma conversa comercial real.",
      "cenario": [
        "Ela responde:",
        "“O problema é que realmente não tenho dinheiro agora.”"
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q19",
      "secao": "s6",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Qual seria sua reação? O que faria na semana seguinte?",
      "ajuda": "",
      "cenario": [
        "Você trabalhou durante uma semana. Fez os atendimentos, realizou follow-ups, respondeu as pessoas.",
        "Mesmo assim, a recuperação ficou muito abaixo da meta."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q20",
      "secao": "s6",
      "tipo": "escolha",
      "obrigatoria": true,
      "linhas": 4,
      "titulo": "Qual frase mais se aproxima da sua forma de pensar?",
      "ajuda": "",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [
        {
          "chave": "A",
          "texto": "Se executei corretamente aquilo que me pediram, considero que fiz minha parte mesmo que o resultado tenha ficado ruim."
        },
        {
          "chave": "B",
          "texto": "Se executei corretamente e o resultado não veio, começo a investigar o que está acontecendo."
        },
        {
          "chave": "C",
          "texto": "Resultado ruim me incomoda e normalmente começo a testar alternativas até entender como melhorar."
        },
        {
          "chave": "D",
          "texto": "Depende muito da situação."
        }
      ],
      "itens": [],
      "campoLabel": "Por que escolheu essa opção?"
    },
    {
      "id": "q21",
      "secao": "s6",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Conte sobre alguma situação profissional na qual ninguém teria reclamado se você tivesse feito apenas o mínimo, mas mesmo assim você decidiu ir além.",
      "ajuda": "O que fez você continuar?",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q22",
      "secao": "s7",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Como você se sente trabalhando em um modelo no qual uma parte do seu ganho depende diretamente do resultado que consegue gerar?",
      "ajuda": "",
      "cenario": [
        "Esta função possui uma remuneração fixa e uma parte variável ligada aos resultados de recuperação.",
        "Mês A: você recebe apenas o fixo ou pouca comissão.",
        "Mês B: sua performance melhora bastante e sua remuneração aumenta.",
        "Mês C: o resultado volta a cair."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q23",
      "secao": "s7",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Você tenderia a manter aquilo que já funciona ou tentaria encontrar formas de melhorar?",
      "ajuda": "Explique.",
      "cenario": [
        "Imagine que você esteja alcançando o resultado necessário para manter a função.",
        "Entretanto, percebe que, aprendendo e melhorando sua abordagem, poderia aumentar bastante sua comissão."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q24",
      "secao": "s8",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Conte sobre algo profissional que você realmente precisou aprender praticamente sozinha.",
      "ajuda": "Explique o que era, por que precisou aprender, como procurou informação, o que testou e como percebeu que já sabia o suficiente para executar.",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q25",
      "secao": "s8",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Qual seria seu plano para conseguir operar sozinha o mais rápido possível?",
      "ajuda": "",
      "cenario": [
        "Imagine que amanhã você precise usar uma ferramenta que nunca abriu na vida.",
        "Não haverá treinamento formal naquele dia.",
        "Você possui acesso à ferramenta, internet, documentação e colegas que podem ajudar quando estiverem disponíveis."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q26",
      "secao": "s9",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Como você responderia?",
      "ajuda": "",
      "cenario": [
        "Seu responsável diz:",
        "“{nome}, seu resultado desta semana ficou abaixo do que esperávamos. Acho que você poderia ter tomado mais iniciativa.”",
        "Você acredita que ele não possui todo o contexto e discorda parcialmente."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q27",
      "secao": "s9",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Como você age depois disso?",
      "ajuda": "",
      "cenario": [
        "Você acredita fortemente que determinada decisão do seu responsável é errada.",
        "Você explica sua visão e apresenta seus argumentos.",
        "Mesmo assim, ele decide seguir pelo outro caminho."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q28",
      "secao": "s10",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 6,
      "titulo": "Como você se sente trabalhando em uma empresa que possui estrutura, mas ainda está melhorando processos enquanto cresce?",
      "ajuda": "Onde está, para você, a diferença entre “empresa em construção” e “empresa desorganizada”?",
      "cenario": [
        "Você comentou que procura uma empresa organizada e com processos claros."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q29",
      "secao": "s10",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que você faria?",
      "ajuda": "",
      "cenario": [
        "Depois de dois meses na ATRIA, você percebe que existe um processo ruim na sua área.",
        "Ele funciona, mas gera retrabalho e poderia ser muito melhor."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q30",
      "secao": "s11",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "O que precisaria ter acontecido durante esses dois anos para chegarmos a essa conclusão?",
      "ajuda": "",
      "cenario": [
        "Imagine que você entre para a ATRIA.",
        "Dois anos depois alguém diga: “contratar a {nome} foi uma das melhores decisões que tomamos”."
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q31",
      "secao": "s11",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 3,
      "titulo": "Qual característica sua você acredita que poderá ajudar muito a ATRIA?",
      "ajuda": "",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q32",
      "secao": "s11",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 3,
      "titulo": "Qual característica sua pode exigir mais desenvolvimento, atenção ou adaptação caso trabalhemos juntos?",
      "ajuda": "Não estamos procurando uma resposta perfeita.",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q33",
      "secao": "s11",
      "tipo": "escala",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "De 0 a 10, quanto essa oportunidade combina com aquilo que você procura hoje?",
      "ajuda": "",
      "cenario": [
        "Depois de conhecer melhor a ATRIA, nosso momento, nossa cultura, a liberdade de organização, a cobrança por produção, o modelo fixo + comissão e a possibilidade eventual de situações importantes surgirem à noite, finais de semana ou feriados:"
      ],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": "Por que você deu essa nota?"
    },
    {
      "id": "q34",
      "secao": "s11",
      "tipo": "texto",
      "obrigatoria": true,
      "linhas": 5,
      "titulo": "Existe alguma coisa nesta forma de trabalhar que poderia fazer você concluir depois de alguns meses que esta vaga não era para você?",
      "ajuda": "Seja totalmente sincera.",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    },
    {
      "id": "q35",
      "secao": "s11",
      "tipo": "texto",
      "obrigatoria": false,
      "linhas": 5,
      "titulo": "Existe algo sobre você, seus objetivos ou sua forma de trabalhar que não perguntamos e que você acredita que deveríamos saber antes de tomar nossa decisão?",
      "ajuda": "",
      "cenario": [],
      "cenarioLabel": "",
      "opcoes": [],
      "itens": [],
      "campoLabel": ""
    }
  ]
};
