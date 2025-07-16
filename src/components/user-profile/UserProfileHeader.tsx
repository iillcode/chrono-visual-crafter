import React from "react";

interface UserProfileHeaderProps {
  user: {
    imageUrl: string;
    fullName?: string | null;
    primaryEmailAddress?: {
      emailAddress: string;
    } | null;
  };
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#101010]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
          <img
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h3 className="text-sm font-medium text-white truncate">
            {user.fullName || "User"}
          </h3>
          <p className="text-xs text-white/50 truncate">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </div>
  );
};
