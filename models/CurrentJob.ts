import { JobData } from '@models/Job';
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export type CurrentJob = {
    job: JobData;
    result: boolean;
    timestamp: number;
    receivings?: Receiving[]
}

export type Receiving = {
    icon?: IconDefinition,
    value: string,
    color: string,
}