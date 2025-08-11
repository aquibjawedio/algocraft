import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resendEmailSchema } from "../schemas/authSchema";
import type { ResendEmailFormDTO } from "../schemas/authSchema";
import { useAuthStore } from "@/stores/authStore";
import SpinLoader from "@/components/shared/SpinLoader";
import { Send } from "lucide-react";
import { useEffect } from "react";

const ResendEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resendEmailSchema) });

  const { resendVerificationEmail, isLoading, error, clearError, clearSuccess } = useAuthStore();

  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  const onSubmit = async (data: ResendEmailFormDTO) => {
    await resendVerificationEmail(data.email);
  };

  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex flex-col items-center justify-center h-screen">
        <SpinLoader />
        <div className="flex  items-center mt-4 gap-2">
          Resending verification email...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground flex flex-col items-center justify-center h-screen px-6 text-center">
        <Send className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">
          Error Resending Email
        </h1>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md overflow-hidden p-0 shadow-lg ">
      <CardContent className="grid p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold">Resend Verification Email</h2>
              <p className="text-muted-foreground text-balance">
                Please enter your email to resend the verification link.
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-2">
              Resend Verification Email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResendEmailForm;
