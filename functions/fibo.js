import * as tf from '@tensorflow/tfjs'
import { toJsonFile } from './getApiData.js';
import input from '../collected/inputs.json' assert { type: "json" };

let i = 0
const tdata = input.map(e=> {
   let res =  input.filter(e=>new Date(e.created_at).getHours() == i).map(e=>[new Date(e.created_at).getTime(),e.crash_point])
   i += 1
   return res
}).map(e=>e.slice(0,100))

//tdata.forEach((e,i)=>e.length>0?console.log(`${i}:${e.length}`):"")


const trainingData = tdata

// Convert the training data to tensors
const xs = tf.tensor(trainingData.slice(0, 50)).reshape([50,200]);
const ys = tf.tensor(trainingData.slice(50)).reshape([50,200]);
console.log(xs)
console.log(ys)

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: xs.shape[1], units: 100, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 }));

// Compile the model

model.compile({loss: 'meanSquaredError', optimizer: tf.train.adamax(0.0031441251)}); 

// Define the training data

// Train the model
await model.fit(xs, ys, {
  epochs: 75,
  callbacks: {
    onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}`),
  },
});

// Test the model
const testSequence = trainingData[trainingData.length - 1].slice(0,50);



const predictedValue = await model.predict(tf.tensor(testSequence)).dataSync()[0];
console.log(`Predicted value for sequence ${testSequence}: ${predictedValue}`);