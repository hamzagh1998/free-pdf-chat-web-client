import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub, FaGoogle, FaFacebook } from "react-icons/fa";

import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ErrorAlert } from "@/components/error-alert";

import { AUTH_PATHES } from "@/routes/auth.routes";

import { signinSchemaType, signinSchema } from "@/schemas/auth";
import { deleteFirebaseCurrentUser } from "@/lib/firebase/auth/auth-with-email";
import { UserCredential } from "firebase/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function SigninForm() {
  const {
    isPending,
    error,
    onFirebaseEmailSignin,
    onFirebaseGoogleSignin,
    onFirebaseFacebookSignin,
    onFirebaseGithubSignin,
  } = useFirebaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinSchemaType>({
    resolver: zodResolver(signinSchema),
  });

  const onEmailSignin: SubmitHandler<signinSchemaType> = async ({
    email,
    password,
  }) => {
    try {
      const data = await onFirebaseEmailSignin(email, password);
      console.log(data);

      if (data?.error) return;
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const onOAuthSignup = async (provider: "google" | "facebook" | "github") => {
    try {
      const data = await (provider === "google"
        ? onFirebaseGoogleSignin()
        : provider === "github"
        ? onFirebaseGithubSignin()
        : onFirebaseFacebookSignin());
      if (data?.error) return;
      const { displayName, email, photoURL } =
        data.detail as UserCredential["user"];
      const [firstName, lastName] = displayName?.split(" ") || ["", ""];
      //* Register user to db
      // signupUserMutation.mutate({
      //   firstName: firstName.trim().toLowerCase(),
      //   lastName: lastName.trim().toLowerCase(),
      //   email: email?.trim().toLowerCase() || "",
      //   photoURL: photoURL || "",
      // });
    } catch (err) {
      deleteFirebaseCurrentUser(); // Remove the current user from Firebase in case registration fails in the database
      console.error(`${provider} signup failed`, err);
    }
  };

  return (
    <Card>
      <CardHeader className="grid gap-2">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-balance text-muted-foreground">Welcome back</p>
      </CardHeader>
      {error && <ErrorAlert title="Sign In failed" description={error} />}

      <CardContent>
        <div className="flex justify-between items-center gap-2 mt-4">
          <Button
            variant="outline"
            className="w-full p-4"
            onClick={() => onOAuthSignup("google")}
            disabled={isPending}
          >
            <FaGoogle size={20} />
          </Button>
          <Button
            variant="outline"
            className="w-full p-4"
            onClick={() => onOAuthSignup("facebook")}
            disabled={isPending}
          >
            <FaFacebook size={20} />
          </Button>
          <Button
            variant="outline"
            className="w-full p-4"
            onClick={() => onOAuthSignup("github")}
            disabled={isPending}
          >
            <FaGithub size={20} />
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Separator orientation="horizontal" className="flex-1" />
          <p className="text-xs text-muted-foreground">OR CONTINUE WITH</p>
          <Separator orientation="horizontal" className="flex-1" />
        </div>
        <div className="grid gap-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              className={
                errors.password && "border-destructive focus:border-accent"
              }
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <form onSubmit={handleSubmit(onEmailSignin)}>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password*</Label>
              </div>
              <Input
                className={
                  errors.password && "border-destructive focus:border-accent"
                }
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
              />
              <Link
                to={AUTH_PATHES.FORGET_PASSWORD}
                className="text-xs underline text-right"
              >
                Forgot your password?
              </Link>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-bold mt-4"
              disabled={isPending}
            >
              Sign In
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="text-sm">
        Don&apos;t have an account?&ensp;
        <Link to={AUTH_PATHES.SIGNUP} className="underline">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
