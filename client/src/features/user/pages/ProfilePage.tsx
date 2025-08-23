import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, ShieldCheck, BadgeCheck, Calendar, Info } from "lucide-react";
import SpinLoader from "@/components/shared/SpinLoader";

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full bg-background/20 backdrop-blur-md shadow-lg rounded-xl border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={`${user.avatarUrl}`} alt={user.fullname} />
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
              {user.fullname.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              {user.fullname}
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="mt-2 flex items-center gap-2">
              {user.isEmailVerified && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-green-500 border-green-500"
                >
                  <BadgeCheck size={14} /> Verified
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="text-primary" size={18} />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" size={18} />
            <span>{user.role}</span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="text-primary" size={18} />
            <span>
              {user.isEmailVerified ? "Email Verified" : "Not Verified"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-primary" size={18} />
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="sm:col-span-2 flex items-start gap-3">
            <Info className="text-primary shrink-0" size={18} />
            <span>
              {user.bio || (
                <span className="italic text-muted-foreground">
                  No bio provided
                </span>
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
