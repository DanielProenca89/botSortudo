import { getNextTIme, TrainAndPredict3 } from "./functions/tensorFlow.js";
import { getData } from './functions/getApiData.js';




const arr = await getData()

const res = await TrainAndPredict3(arr, 10)

console.log(res)


