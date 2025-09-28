"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { z } from "zod";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password Required"),
});

export const SignInView = () => {

  const router = useRouter();
  const [ error, setError ] = useState<string | null>(null);
  const [ pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit =  (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
     authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL:"/"
    },{
      onSuccess: () => {
        setPending(false);
        router.push("/");
      },
      onError: (error) => {
        setError(error.error.message);
        setPending(false);
      },
    })
    
  }

 const onSocial = (provider : "github" | "google") => {
    setError(null);
    setPending(true);
    authClient.signIn.social(
      {
        provider : provider,
        callbackURL:"/"
      },
      {
        onSuccess: () => {
          setPending(false);
      
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  }

  return (
      <div className="flex flex-col gap-6"> 
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">

            <Form { ... form}>
            <form
            className="p-6 md:-p8"
            onSubmit={form.handleSubmit(onSubmit)}
            > 
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center ">
                <h1 className="text-2xl font-bold"> Welcome back</h1>
                <p className="text-muted-foreground text-balance"> Login to your account</p>
                </div>
                <div className="grid gap-3">
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="input input-bordered w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  ></FormField>
                </div>
                <div className="grid gap-3">
                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*********"
                          className="input input-bordered w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                  ></FormField>
                </div>
                { !!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                    <AlertTitle className="text-sm">{error}</AlertTitle>
                  </Alert>
                ) }
                <Button
                disabled={pending}
                type="submit"
                className="w-full bg-sidebar-accent">
                  Sign In
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-10 after:flex after:items-center after:border-t after:border-border">
                  <span className="bg-card text-muted-foreground relative z-20 px-2">
                    or continue with
                  </span>
                </div>
               
                <div className="grid grid-cols-2 gap-4">
                  <Button
                  variant={"outline"}
                  type="button"
                  disabled={pending}
                  className="w-full"
                 onClick={() =>onSocial("google")}
                  >  <FaGoogle/> </Button>
                  <Button
                  variant={"outline"}
                  type="button"
                  className="w-full"
                  disabled={pending}
               onClick={() =>onSocial("github")}
                  > <FaGithub/> </Button>
                </div>
               <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
              </form>
            </Form>
            
            <div className="bg-sidebar-accent relative
            hidden md:flex flex-col gap-y-4 items-center justify-center
            ">
              <Image src={"/logo.svg"} alt="image" height={92} width={92}/>
                <p className="text-2xl font-semibold text-white">Tandemly</p>
            </div>
          </CardContent>
        </Card>
          <div className="text-muted-foreground text-center text-xs text-balance *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you are agreeing to our{' '}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </div>
      </div>
  );
}