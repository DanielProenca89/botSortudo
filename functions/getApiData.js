import fetch from "node-fetch"
import fs from 'fs'
import { dirname } from "path"

export const getApiData= async (startDate, endDate, page=1)=>{
    try{
    const res = await fetch(`https://blaze.com/api/crash_games/history?startDate=${startDate}T00:00:00.000Z&endDate=${endDate}T23:59:59.999Z&page=${page}`,{credentials: "include"})
    const json = await res.json()
    return json
    }catch{
        return []
    }
}



export const toJsonFile=(data, name)=>{
    fs.writeFile(`./collected/${name}.json`, JSON.stringify(data), err => {
        if (err) throw err 
        console.log("Done writing JSON")
    })
}

export const getData=async ()=>{

    const res  = fs.readFileSync(`./collected/inputs.json` , "utf8")
    return JSON.parse(res)
}

export const toCSV=(data, name)=>{

try{
    let header = Object.keys(data[0]).join(";")
    let content = header + "\n" + data.map(e=>Object.values(e)).reduce((acc, cur)=>acc + cur.join(';')+"\n","")
    fs.writeFile(`${name}.csv`, content, err => {
        if (err) throw err 
        console.log("Done writing CSV")
    })

}catch(error){
    console.log(error)
}
}   








export const test=async (inicio,fim)=>{
    const res = await getApiData(inicio,fim, 1)
    
    let records = res.records
    let pages = parseFloat(res.total_pages)
    console.log("resultados: "+records.length)
    console.log("paginas: "+pages)

    let i = 1
    while(pages > 0){

        i = i + 1
        console.log("Pagina: "+i)
        const newRes = await getApiData(inicio,fim, i)
        
        records = [...records, ...newRes.records]

        pages = pages - 1
    }
    return records

    
 }


 export function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      const chunk = arr.slice(i, i + size);
      chunks.push(chunk);
    }
    return chunks;
  }
//test('2023-01-01', '2023-02-28')*/