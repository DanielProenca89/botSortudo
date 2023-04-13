

import {bot} from './functions/bot.js'
import { handleCreateInterval } from './functions/updateData.js';
import {inlineKeyboard} from './functions/handle.js'
import {  TrainAndPredict2 } from './functions/tensorFlow.js';
import { getData } from './functions/getApiData.js';


handleCreateInterval()

bot.onText(/\/start/, function (msg)  {

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



bot.on('polling_error', (err) => console.log(err));