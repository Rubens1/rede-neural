const synaptic = require('synaptic');



// Criar as camadas
let inputLayer = new synaptic.Layer(2);
let hiddenLayer = new synaptic.Layer(3);
let outputLayer = new synaptic.Layer(1);

// Projetar as camadas
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

// Criar a rede
let myNetwork = new synaptic.Network({
  input: inputLayer,
  hidden: [hiddenLayer],
  output: outputLayer
});

// Definir a taxa de aprendizado
let learningRate = 0.3;

// Treinar a rede
for (let i = 0; i < 20000; i++) {

  // 0 xor 0 => 0
  myNetwork.activate([0, 0]);
  myNetwork.propagate(learningRate, [0]);

  // 0 xor 1 => 1
  myNetwork.activate([0, 1]);
  myNetwork.propagate(learningRate, [1]);

  // 1 xor 0 => 1
  myNetwork.activate([1, 0]);
  myNetwork.propagate(learningRate, [1]);

  // 1 xor 1 => 0
  myNetwork.activate([1, 1]);
  myNetwork.propagate(learningRate, [0]);
  
}

console.log("============================= Início =============================");
console.log(myNetwork.activate([0, 0])); // ~0
console.log(myNetwork.activate([0, 1])); // ~1
console.log(myNetwork.activate([1, 0])); // ~1
console.log(myNetwork.activate([1, 1])); // ~0
console.log("============================= Fim =============================");
