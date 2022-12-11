import type { NextPage } from "next";
import ProfileCard from "../components/profile/ProfileCard";
import { trpc } from "../utils/trpc";

const Profile: NextPage = () => {
    return (
        <div className="flex flex-col justify-center items-center">
            <ProfileCard />
        </div>
    );
}

export default Profile;