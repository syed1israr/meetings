import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface props{
    seed : string,
    variant : "botttsNeutral" | "initials";
}


export const GenerateAvatarUri = ({seed,variant} : props) =>{
    let av;
    if( variant == "botttsNeutral" ){
        av = createAvatar(botttsNeutral,{seed});
    }else{
         av = createAvatar(initials,{seed,fontWeight:500,fontSize:42});
    }
    return av.toDataUri();
}