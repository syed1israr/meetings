import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface CallActiveProps {
    onLeave: () => void;
    meetingName: string;
}

export const Call_Active = ({ onLeave, meetingName }: CallActiveProps) => (
    <div className="flex flex-col h-full bg-[#0e0f10] text-white p-4 gap-4">
        {/* Top Bar */}
        <div className="flex items-center gap-4">
            <Link
                href="/"
                className="flex items-center justify-center p-1 bg-white/10 rounded-full"
            >
                <Image src="/logo.svg" width={22} height={22} alt="logo" />
            </Link>
            <h4 className="text-base font-medium">{meetingName}</h4>
        </div>

        {/* Video Layout */}
        <div className="flex-grow rounded-lg overflow-hidden">
            <SpeakerLayout />
        </div>

        {/* Controls at Bottom */}
        <div className="flex justify-center">
            <CallControls onLeave={onLeave} />
        </div>
    </div>
);
