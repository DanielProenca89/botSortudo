

import {bot} from './functions/bot.js'
import { handleCreateInterval } from './functions/updateData.js';
import {inlineKeyboard} from './functions/handle.js'
import {  TrainAndPredict, TrainAndPredict2, TrainAndPredict3 } from './functions/tensorFlow.js';
import { getData, getApiData } from './functions/getApiData.js';


handleCreateInterval()

bot.onText(/\/start/, function (msg)  {

  let options = inlineKeyboard(["Novo Sinal"],1)
  bot.sendMessage(msg.chat.id, "Para usar o Bot, você deve esperar um crash para gerar um Novo sinal. Caso o bot dê uma previsão abaixo de 1 ou com rico alto, não jogue!", options);
 /* const keyboard = {
    inline_keyboard: [
      [
        {
          "text": "Test web_app",
          "web_app": {
              "url": "https://revenkroz.github.io/telegram-web-app-bot-example/index.html"
          }
      }
      ]
    ]
  };
  
  bot.sendMessage(msg.chat.id, 'Clique no botão abaixo para abrir o WebApp:', {
    reply_markup: JSON.stringify(keyboard)
  });*/

  

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
    const lastResults = await getApiData(new Date().toISOString().split('T')[0], new Date().toISOString().split('T')[0])

    //const res = await TrainAndPredict(inputs,[[new Date(inputs[0].created_at).getSeconds(), parseFloat(inputs[1].crash_point)]])
    const res = await TrainAndPredict(inputs,[[new Date(lastResults.records[0].created_at).getTime(), parseFloat(lastResults.records[0].crash_point)]],10)
    //const res = await TrainAndPredict3(inputs)

    

    const razao = parseFloat(res.response).toFixed(2)
  

 
    const risco =  ((razao/res.media)*100).toFixed(2)
    if(razao >= 1  ){
    
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