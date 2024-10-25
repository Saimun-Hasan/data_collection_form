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
import { useRegisterMutation } from "../../slices/usersApiSlice";

// --------------------------Schema Definition---------------------------- //

const formSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required',
  }).nonempty('First name cannot be empty'),
  lastName: z.string({
    required_error: 'Last name is required',
  }).nonempty('Last name cannot be empty'),
  userName: z.string({
    required_error: 'Username is required',
  }).nonempty('Username cannot be empty'),
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

const RegisterView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [loginUser] = useRegisterMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  const registerSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await loginUser({
        firstName: values?.firstName,
        lastName: values?.lastName,
        userName: values?.userName,
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
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(registerSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your firstname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your lastname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            <small>
              {"Don't have an account?"}
              <Link to="/login" style={{ marginLeft: 3 }}>
                Login Now
              </Link>
            </small>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterView;
