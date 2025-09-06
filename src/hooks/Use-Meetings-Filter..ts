import { DEFAULT_PAGE } from "@/constants"
import { meetingStatus } from "@/db/schema"
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs"


export const useMeetingsFilter = () =>{
    return useQueryStates(
        {
            search : parseAsString.withDefault("").withOptions({clearOnDefault:true}),
            page : parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
            status : parseAsStringEnum(Object.values(meetingStatus)),
            agentId  : parseAsString.withDefault("").withOptions({ clearOnDefault:true})
        }
    )
}