import { getNextTIme, TrainAndPredict2 } from "./bot/tensorFlow.js";
import { getData } from "./bot/getApiData.js";



//const res = await getNextTIme(inputs,500)

//console.log(res.response)



const data = await getData()
const res = await TrainAndPredict2(data)

console.log(res)


