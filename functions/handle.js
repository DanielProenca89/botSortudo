

export const inlineKeyboard  = (btText=["Button 1"], columns=1)=>{

    
    let itens = btText.map((e,i)=>{ return {text: e, callback_data: i+1} })
    let col = [...Array(columns+1).keys()].map((e)=>{
        
        if(columns > 1){
        let x = itens.slice(0,columns) 
        itens = itens.slice(columns)
        return x
        }else{
        return [itens[e]]
        }
    }).filter(e=>e[0])
    
    return {reply_markup: JSON.stringify({
      inline_keyboard: col
    })}
  };

