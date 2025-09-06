import { DEFAULT_PAGE } from "@/constants";
import { meetingStatus } from "@/db/schema";
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";




export const FilterSearchparamsPage  = {
search : parseAsString.withDefault("").withOptions({clearOnDefault:true}),
page : parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
status : parseAsStringEnum(Object.values(meetingStatus)),
agentId  : parseAsString.withDefault("").withOptions({ clearOnDefault:true})
       
}



export const LoadSearchParams = createLoader(FilterSearchparamsPage)