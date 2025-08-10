import { useAuthStore } from "@/stores/authStore";
import { BadgeCheck, Mail, ShieldCheck, Calendar, Info } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading user profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222831] flex items-center justify-center px-4 py-10">
      <div className="bg-[#393E46]/60 backdrop-blur-md border border-[#948979]/30 shadow-xl rounded-2xl p-8 w-full max-w-md relative">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#948979]/20 blur-3xl rounded-full pointer-events-none z-0" />

        {/* Avatar */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#948979]/20 flex items-center justify-center text-3xl text-[#DFD0B8] font-bold">
            {user.fullname.charAt(0)}
          </div>
          <h1 className="text-2xl font-semibold text-[#DFD0B8] mt-4">
            {user.fullname}
          </h1>
          <p className="text-[#DFD0B8]/70 text-sm">@{user.username}</p>

          <div className="mt-4 w-full space-y-3 text-[#DFD0B8]/90 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} /> <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Role: {user.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={16} />
              <span>Email Verified: {user.isEmailVerified ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>
                Bio:{" "}
                {user.bio || (
                  <span className="italic text-[#DFD0B8]/50">
                    No bio provided
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
