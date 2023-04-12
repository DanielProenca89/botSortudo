import * as tf from '@tensorflow/tfjs'
//import  inputs from './test.json' assert { type: "json" };
import { toJsonFile, chunkArray, getData } from './getApiData.js';

import _ from 'lodash';
import { parse } from 'dotenv';

export async function getNextTIme(arr){

  let timestamps= arr.map(e=> new Date(e.created_at).getTime())
  let lbl = arr.map(e=>e.created_at).sort((a,b)=>a-b)
  const min = _.min(timestamps);
  const max = _.max(timestamps);
  const timestampsNorm = timestamps.sort((a,b)=>a-b).map(t => (t - min) / (max - min));
  const n = 10;
  const X = [];
  const y = [];
  for (let i = 0; i < timestampsNorm.length - n; i++) {
  X.push(timestampsNorm.slice(i, i + n));
  y.push(timestampsNorm[i + n]);
  }
 
  const XTensor = tf.tensor(X);
  const yTensor = tf.tensor(y);
  
  const splitIdx = Math.floor(X.length * 0.8);
  const XTrain = XTensor.slice([0, 0], [splitIdx, n]);
  const XTest = XTensor.slice([splitIdx, 0], [X.length - splitIdx, n]);
  const yTrain = yTensor.slice([0], [splitIdx]);
  const yTest = yTensor.slice([splitIdx], [X.length - splitIdx]);
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [n], units: 32, activation: 'relu' }),
      tf.layers.dense({ units: 1}),
    ]
  });
  
  model.compile({ optimizer: tf.train.adam(0.0031441251), loss: 'meanSquaredError' });

  const epochs = 20;
  const batchSize = 32;
  const history = await model.fit(XTrain, yTrain, { epochs, batchSize });
  console.log(`Final loss: ${history.history.loss[epochs - 1]}`);
  const evaluation = model.evaluate(XTest, yTest);
  const mse = evaluation[0];
  console.log(`Mean squared error: ${mse}`);
  const lastTimestamps = timestampsNorm.slice(-n);
//  console.log(lbl.slice(0,n))
  const prediction = await model.predict(tf.tensor([lastTimestamps]));

  const nextTimestamp = prediction.mul(max - min).add(min).dataSync()[0];
  console.log(`Next timestamp: ${nextTimestamp}`);
  return {response:new Date(nextTimestamp)}
}





export async function TrainAndPredict(arr, pred, ep=72){
  const minT = _.min(arr.map(e=>new Date(e.created_at)));
  const maxT = _.max(arr.map(e=>new Date(e.created_at)));
  const minV = _.min(arr.map(e=>parseFloat(e.crash_point)));
  const maxV = _.max(arr.map(e=>parseFloat(e.crash_point)));
  const media = _.mean(arr.map(e=>parseFloat(e.crash_point)));
  console.log(minV)
  console.log(maxV)
  const training = arr.slice(1)
  let x= training.map(e=> [ (new Date(e.created_at).getTime() - minT)/(maxT - minT),(parseFloat(e.crash_point)-minV)/(maxV-minV)])


  let y = training.map(e=>[(parseFloat(e.crash_point)-minV)/(maxV - minV)])

  const xTrain = tf.tensor(x);

  const yTrain = tf.tensor(y)

  let loss = 0

  const lossCallback = (epoch, logs)=>{
    loss = logs.loss
    console.log(`Epoch ${epoch}: loss = ${logs.loss} acc=${JSON.stringify(logs)}`)
  }



  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [2], units: 2, activation: 'relu' }),
      tf.layers.dense({ units: 1  })
     
    ]
  });
  //model.add(tf.layers.dense({ units: 1, inputShape: [2], activation:"relu" }));
  //tf.layers.dense({ units: 1, activation: 'sigmoid' }),
  model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(0.0031441251)}); 


  await model.fit(xTrain, yTrain, {
    epochs: ep,
    callbacks: {
      onEpochEnd: (epoch, logs) => lossCallback(epoch, logs),
    },
  });
 const modeljson = model.toJSON()

 toJsonFile(modeljson, "model")
  

    // fazer uma previsão com o modelo
    console.log(pred.map(e=> [ (new Date(e[0]).getTime()-minT)/(maxT - minT),(parseFloat(e[1])-minV)/(maxV-minV)]))

    const yPredict = model.predict(tf.tensor(pred.map(e=> [ (new Date(e[0]).getTime()-minT)/(maxT - minT),(parseFloat(e[1])-minV)/(maxV - minV)])));
    //const score = model.evaluate(xPredict, yPredict)
   
    const res =  await yPredict.mul(maxV - minV).add(minV).dataSync()[0];

    return {response:res, loss:loss, media:media}

}


export async function TrainAndPredict2(arr){
  const media = _.mean(arr.map(e=>parseFloat(e.crash_point)));
  const lbl = []
  const arrData = chunkArray(arr.sort((a,b)=>new Date(a.created_at).getTime() - new Date(a.created_at).getTime()).map(e=>parseFloat(e.crash_point)),6).map(e=>{
    let result = e.pop()
    lbl.push(result)
    return e    
  })
  console.log(lbl.length)
  console.log(arrData.length)

  const data = tf.tensor2d(arrData.slice(0, -1))
  const labels = tf.tensor1d(lbl.slice(0, -1));
  
  // Agrupe os dados e rótulos em lotes de tamanho 6.
  
  // Defina o modelo com uma camada densa.
  //const model = tf.sequential();
  //model.add(tf.layers.dense({units: 1, inputShape: [5]}));
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [5], units: 32, activation: 'relu' }),
      tf.layers.dense({ units: 1}),
    ]
  });
  model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(0.0031441251)});
  
  // Treine o modelo com cada lote.
  await model.fit(data, labels, {epochs: 100});
 
  // Use o modelo para fazer previsões.
  const testData = tf.tensor2d([arr.slice(0,5).map(e => parseFloat(e.crash_point))]);
  const predictions = model.predict(testData);
  return {response:predictions.dataSync()[0], media:media}
}