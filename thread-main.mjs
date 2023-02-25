import { sleep, irand } from "./util.mjs"
import {clear, log} from "console"
import * as os from "os"
import { Worker } from "worker_threads"
import * as fs from "fs/promises"
import { HOW_MANY_NUMBERS } from './config.mjs';

export default async function mainThread(mainURL){
    let divisors = {},
        kDivisors = [],
        activeThreads = 0,
        nCPUs = os.cpus().length

    log(`\x1B[3J`)
    clear()

    for(let i = 0; i < nCPUs; i++){
        var worker = new Worker((new URL(mainURL)).pathname, { 
            workerData: {
                id: i + 1,
                startFrom: HOW_MANY_NUMBERS * i + 1
            }
        })
        activeThreads++

        worker.on("message", function(data){
            log(`[Main] Recebidos ${Object.keys(data).length} divisores do worker #${i+1}.`)
            for(let [n,f] of Object.entries(data)){
                n = +n
                divisors[n] = f
                kDivisors.push(n)
            }
        }).on("exit", function(ec){
            log(`[Main] Worker #${i+1} completou seu trabalho.`)
            activeThreads--
        })
    }

    // Espera pela conclusão
    await new Promise(async r => {
        while(1){
            if(activeThreads <= 0) break
            await sleep(100)
        }
        r()
    });

    // Concluído.
    log("[Main] Obteve todos os divisores. Reordenando...")
    log()
    await sleep(1000)
    
    
    
    divisors = sortDivisors(divisors, kDivisors)
    log("[Main] Escrevendo JSON...")
    await fs.writeFile("divisors.json", JSON.stringify(divisors, null, 4))
    log("[Main] Concluído")
}


function sortDivisors(divisors, kDivisors){
    let tmpDivisors = {}

    kDivisors = kDivisors.sort((a, b) => Math.sign(a - b))

    for(let n of kDivisors){
        tmpDivisors[n] = divisors[n]
    }

    return tmpDivisors
}