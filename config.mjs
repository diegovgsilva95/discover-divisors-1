
import * as os from "os"

export const HOW_MANY_NUMBERS = Math.floor(1000000 / os.cpus().length),
    SEND_AFTER = 5000,
    REST_AFTER = 5000000,
    REST_TIME = 1000/5;
