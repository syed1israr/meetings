import { StreamTheme, useCall } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import { CallLobby } from './CallLobby';
import { Call_Active } from './Call_Active';
import { Call_Ended } from './Call_Ended';


interface props{
    meetingName : string
}
const CallUI = ({meetingName} : props) => {
  const call = useCall();
  const [show, setshow] = useState<"lobby"|"call"|"ended">("lobby");
  const hadlejoin = async()=>{
    if( !call ) return;
    await call.join();
    setshow("call");
  }
  const handleleave = () =>{
    if( !call ) return;
    call.endCall();
    setshow("ended")
  }
  return(
    <StreamTheme className='h-full'>
        { show === "lobby" && <CallLobby onJoin={hadlejoin}/>}
        { show === "call" && <Call_Active onLeave={handleleave} meetingName={meetingName}/>}
        { show === "ended" && <Call_Ended/>}
    </StreamTheme>
  )
}

export default CallUI