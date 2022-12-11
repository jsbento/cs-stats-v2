import React, { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { UserProfile } from "../../types/user";
import TextInput from "../common/TextInput";

const ProfileCard: React.FC = () => {
    const [ profile, setProfile ] = useState<UserProfile | null>( null );
    const { data } = trpc.users.getUserProfile.useQuery();
    const upsertProfile = trpc.users.upsertUserProfile.useMutation();

    useEffect(() => {
        if( data ) {
            setProfile( data.profile );
        }
    }, [ data ])

    const onChangeUsername = ( type: string, value: string ) => {
        if( profile ) {
            setProfile({ ...profile, [type]: value });
        } else {
            setProfile({ steamUsername: value });
        }
    }

    return (
        <div className="w-96 min-h-min border rounded-md p-3 flex flex-col">
            <h2 className="w-full font-semibold text-center text-3xl text-gray-300">
                Profile
            </h2>
            <TextInput
                name="steamUsername"
                label="Steam Username"
                value={ profile?.steamUsername ?? "" }
                onChange={ value => onChangeUsername( "steamUsername", value ) }
                className="mb-2"
            />
            <button
                className="p-2 mt-4 border rounded-md w-6/12 mx-auto"
                onClick={ () => upsertProfile.mutate({ profile: { ...profile! } }) }
            >
                Save Changes
            </button>
        </div>
    );
}

export default ProfileCard;