import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

import { ErrorAlert } from "@/components/error-alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPwdSchema, resetPwdSchemaType } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AUTH_PATHES } from "@/routes/auth.routes";

export function ForgetPwdForm() {
  const { isPending, error } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPwdSchemaType>({
    resolver: zodResolver(resetPwdSchema),
  });

  const onSendResetEmail = async () => {
    return;
  };

  return (
    <Card>
      <CardHeader className="grid gap-2">
        <Link to={AUTH_PATHES.SIGNIN}>
          <p className="flex justify-start items-center gap-2 text-sm font-bold cursor-pointer text-muted-foreground max-sm:underline hover:underline hover:text-foreground">
            <FaArrowLeft />
            Sign In
          </p>
        </Link>
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">Enter your email</p>
      </CardHeader>
      {error && <ErrorAlert title="Sign In failed" description={error} />}
      <CardContent className="grid gap-2">
        <form onSubmit={handleSubmit(onSendResetEmail)}>
          <Label htmlFor="email*">Email*</Label>
          <Input
            className={errors.email && "border-destructive focus:border-accent"}
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <Button
            type="submit"
            className="w-full font-bold mt-4"
            disabled={isPending}
          >
            Send Reset Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
