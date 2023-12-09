import Header from "~/components/Header";
import MeetingRoom from "~/components/MeetingRoom";

function Meeting() {
    return (
        <div className='w-full h-full relative'>
            <Header />
            <MeetingRoom />
        </div>
    )
}

export default Meeting;