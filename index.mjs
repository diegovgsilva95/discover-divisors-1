import { isMainThread } from 'worker_threads'
import mainThread from "./thread-main.mjs"
import auxThread from "./thread-aux.mjs"

if(isMainThread)
    await mainThread(import.meta.url);
else 
    await auxThread();
