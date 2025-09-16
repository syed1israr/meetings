import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface CallActiveProps {
    onLeave: () => void;
    meetingName: string;
}

export const Call_Active = ({ onLeave, meetingName }: CallActiveProps) => (
    <div className="flex flex-col h-full bg-educational-gradient-dark text-white p-6 gap-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center p-3 bg-primary-gradient rounded-xl shadow-educational hover-lift"
                >
                    <Image src="/logo.svg" width={24} height={24} alt="logo" className="filter brightness-0 invert" />
                </Link>
                <div>
                    <h4 className="text-lg font-bold text-white">{meetingName}</h4>
                    <p className="text-sm text-muted-foreground">AI-Powered Learning Session</p>
                </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-sidebar-accent/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live</span>
            </div>
        </div>

        {/* Video Layout */}
        <div className="flex-grow rounded-2xl overflow-hidden shadow-educational-lg border border-sidebar-border/20">
            <SpeakerLayout />
        </div>

        {/* Controls at Bottom */}
        <div className="flex justify-center">
            <div className="glass-effect-dark rounded-2xl p-4">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    </div>
);
