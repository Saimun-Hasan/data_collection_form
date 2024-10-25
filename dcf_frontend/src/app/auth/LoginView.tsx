import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Redux
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/AuthSlice";
import { useLoginMutation } from "../../slices/usersApiSlice";

// --------------------------Schema Definition---------------------------- //

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email("Enter a valid email"),
  password: z
    .string({ required_error: 'Enter your password' })
    .min(8, "Password should be minimum 8 characters")
    .max(50, "Password is too long")
    .regex(
      /^(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

const LoginView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [loginUser] = useLoginMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await loginUser({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log("Register response:", res);
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      interface ApiError {
        message?: string;
        data?: {
          message?: string;
        };
      }

      const error = err as ApiError;

      if (error.data?.message) {
        console.log("Error message:", error.data.message);
      } else if (error.message) {
        console.log("Error message:", error.message);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };


  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div className="container mx-auto px-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(loginSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            <small>
              {"Don't have an account?"}
              <Link to="/register" style={{ marginLeft: 3 }}>
                Register Now
              </Link>
            </small>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginView;
