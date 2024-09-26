const synaptic = require('synaptic');
const readline = require('readline');

// Mapeamento de palavras-chave para vetores
const wordMap = {
  "olá": [1, 0, 0, 0],
  "como": [0, 1, 0, 0],
  "vai": [0, 0, 1, 0],
  "você": [0, 0, 0, 1]
};

// Conjunto de respostas possíveis, baseadas em combinações de palavras
const responseMap = {
  "greetings": [
    "Oi! Como posso ajudar?",
    "Olá! Tudo bem?",
    "Oi! Como você está hoje?"
  ],
  "status": [
    "Estou bem, obrigado por perguntar!",
    "Vou indo bem, e você?",
    "Tudo ótimo por aqui! E você?"
  ],
  "general": [
    "Estou aqui, pronto para ajudar!",
    "O que posso fazer por você?",
    "Vamos lá, como posso te ajudar?",
    "Em que posso ajudar?"
  ],
  "farewell": [
    "Até logo! Foi um prazer falar com você!",
    "Tchau! Volte sempre que precisar!",
    "Até mais! Tenha um ótimo dia!",
    "Tchau, obrigado pela conversa"
  ]
};

// Função para pegar uma resposta aleatória de um conjunto
function getRandomResponse(category) {
  const responses = responseMap[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Criar as camadas da rede neural
let inputLayer = new synaptic.Layer(4);  // 4 neurônios de entrada (um para cada palavra-chave)
let hiddenLayer = new synaptic.Layer(4); // Camada oculta
let outputLayer = new synaptic.Layer(4); // 4 neurônios de saída (um para cada categoria de resposta)

// Projetar a rede neural
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

// Criar a rede
let myNetwork = new synaptic.Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer
});

// Treinamento da rede neural com palavras-chave mapeadas para categorias de resposta
for (let i = 0; i < 20000; i++) {
  myNetwork.activate(wordMap["olá"]);
  myNetwork.propagate(0.3, [1, 0, 0, 0]);

  myNetwork.activate(wordMap["como"]);
  myNetwork.propagate(0.3, [0, 1, 0, 0]);

  myNetwork.activate(wordMap["vai"]);
  myNetwork.propagate(0.3, [0, 0, 1, 0]);

  myNetwork.activate(wordMap["você"]);
  myNetwork.propagate(0.3, [0, 0, 0, 1]);
}

// Função para processar a entrada do usuário
function processInput(input) {
  const words = input.toLowerCase().split(" ");
  let totalActivation = [0, 0, 0, 0]; // Para somar a ativação de várias palavras

  // Processa cada palavra e ativa a rede neural
  words.forEach(word => {
    if (wordMap[word]) {
      let activation = myNetwork.activate(wordMap[word]);

      // Soma as ativações para capturar o contexto das palavras combinadas
      for (let i = 0; i < activation.length; i++) {
        totalActivation[i] += activation[i];
      }
    }
  });

  // Pega o índice da resposta mais ativada
  let maxIndex = totalActivation.indexOf(Math.max(...totalActivation));

  // Gera uma resposta com base na ativação mais forte
  switch (maxIndex) {
    case 0:
      return getRandomResponse("greetings");
    case 1:
      return getRandomResponse("status");
    case 2:
      return getRandomResponse("general");
    case 3:
      return getRandomResponse("farewell");
    default:
      return "Desculpe, não entendi.";
  }
}

// Interface de leitura para interação
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar() {
  rl.question("Digite algo: ", (input) => {
    console.log(processInput(input));  // Resposta gerada com base na combinação de palavras
    perguntar();  // Pergunta novamente
  });
}

console.log("Bem-vindo! Tente dizer algo como 'olá', 'como vai', ou 'tchau'.");
perguntar();
