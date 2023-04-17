import { toJsonFile, getApiData } from './getApiData.js';


let interval;

export const handleCreateInterval  = (time=30000)=>{
    interval = setInterval(async()=>{
        let after = new Date()
        after.setDate(after.getDate() -1)
        after = after.toISOString().split('T')[0]
        let now = new Date().toISOString().split('T')[0]
       const test=async (inicio,fim)=>{
            const res = await getApiData(inicio,fim, 1)
            
            let records = res.records
            let pages = parseFloat(res.total_pages)
           // console.log("resultados: "+records.length)
           // console.log("paginas: "+pages)
        
            let i = 1
            try{
            while(pages > 0){
        
                i = i + 1
                console.log("Pagina: "+i)
                const newRes = await getApiData(fim,fim, i)
                
                records = [...records, ...newRes.records]
        
                pages = pages - 1
            }
            return records
            }catch{
                return []
            }
            
         }

    const res = await test(after,now)
    if(res){
    toJsonFile(res, "inputs")
    }
    }, time)
}


export const handleClearInterval = ()=>{
    clearInterval(interval)
}

