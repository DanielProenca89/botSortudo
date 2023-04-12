
let now = new Date().toISOString().split('T')[0]

import {bot} from './bot/bot.js'
import { handleCreateInterval, handleClearInterval } from './bot/updateData.js';
import {inlineKeyboard} from './bot/handle.js'
//import  inputs from './collected/inputs.json' assert { type: "json" };
import { TrainAndPredict, TrainAndPredict2 } from './bot/tensorFlow.js';
import { getData } from './bot/getApiData.js';
//const dba = require('./bot/db')

//dba.install()

handleCreateInterval()
 let ep = 32

bot.onText(/\/start/, function (msg, match)  {



  const userName = msg.chat.username
  const chatId = msg.chat.id

  let options = inlineKeyboard(["Novo Sinal"],1)
  bot.sendMessage(msg.chat.id, "Para usar o Bot, você deve esperar um crash para gerar um Novo sinal.\n Caso o Bot de uma previsão abaixo de 2  não jogue!", options);

});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  
 let text;


  if (action === '1') {
     
    let sec = new Date()
    
    sec.setSeconds(new Date().getSeconds()+8)

    const inputs = await getData()

    //const test = await TrainAndPredict(inputs,[[new Date(inputs[0].created_at).getSeconds(), parseFloat(inputs[1].crash_point)]])
    //const res = await TrainAndPredict(inputs,[[new Date(inputs[0].created_at).getTime(), parseFloat(inputs[0].crash_point)]],ep)
    const res = await TrainAndPredict2(inputs)

    

    const razao = parseFloat(res.response).toFixed(2)
  

 
    const risco =  ((razao/res.media)*100).toFixed(2)
    if(razao >= 1 && risco < 100 && risco >= 0 ){
    
     // >= 4 ? (razao / Math.sqrt(razao)).toFixed(2):razao
    text = `
    \nRisco: ${risco}%\n
      
    Previsão: ${razao}\n
  
    Fique abaixo de: ${(razao - razao * (razao/res.media)).toFixed(2)}\n
    
          \n${risco>50?'🔴🔴🔴🔴🔴🔴':risco<50 && risco>30?'🟡🟡🟡🟡🟡🟡':'🟢🟢🟢🟢🟢🟢'}
    \n
    `
    }else{
    
    text="Grandes chances de erro. Aguarde o próximo crash e gere outro sinal"
    }
    bot.editMessageText(text, opts);
    let options = inlineKeyboard(["Novo Sinal"],1)
    bot.sendMessage(opts.chat_id, "Clique para gerar um Sinal", options);
  }

  
});


bot.on('message', function (msg) {




});

bot.on('polling_error', (err) => console.log(err));