import React from "react";

type UserAvatarProps = {
    name?: string | null;
    image?: string | null;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, image }) => {
    if (image && image !== "") {
        return (
            <img
                src={image}
                alt={name || "Avatar"}
                className="w-8 h-8 rounded-full object-cover border border-default-200 bg-white"
                referrerPolicy="no-referrer"
            />
        );
    }
    return (
        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold border border-default-200">
            {name?.[0]?.toUpperCase() || <span className="material-icons">?</span>}
        </span>
    );
};