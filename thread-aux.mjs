import { sleep, irand } from "./util.mjs"
import {clear, log} from "console"
import { workerData, parentPort } from "worker_threads"

import { HOW_MANY_NUMBERS, SEND_AFTER, REST_AFTER, REST_TIME } from './config.mjs'

export default async function auxThread(){
    let ID = workerData.id,
        startFrom = workerData.startFrom,
        divisors = {},
        nDivisors = 0,
        iteration = 0

    log(`[Aux ${ID}] Processar ${HOW_MANY_NUMBERS} iniciando de ${startFrom}`)

    for(let n = startFrom; n < startFrom+HOW_MANY_NUMBERS; n++){
        let currentDivisors = [1,n]

        for(let i = 2; i < n; i++){
            if(n % i == 0)
                currentDivisors.push(i)

            if(++iteration > REST_AFTER){
                iteration = 0
                log(`[Aux ${ID}] Descansando. Atualmente no número ${n}`)
                await sleep(REST_TIME)
            }
        }
        divisors[n] = [...new Set(currentDivisors)].sort((a, b) => Math.sign(a - b))
        nDivisors++

        if(nDivisors >= SEND_AFTER){
            parentPort.postMessage(divisors)
            divisors = {}
            nDivisors = 0
        }                
    }

    if(nDivisors > 0)
        parentPort.postMessage(divisors)
    log(`[Aux ${ID}] Concluído`)
}