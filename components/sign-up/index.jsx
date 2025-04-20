import authApi from "@/api/auth";
import {
  Button,
  Field,
  Input,
  Stack,
  Box,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

const SignUp = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await authApi.post("/signup", data);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (err) {
      console.log(err);
      const errorCode = err.response?.status;
      const errorMessage =
        err.response?.data?.error || "Signup failed, please try again";
      toaster.create({
        title: `Error: ${errorCode} ${errorMessage}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      width="400px"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Heading as="h1" size="lg" textAlign="center" mb="6">
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="4">
          <Field.Root invalid={!!errors.firstName}>
            <Field.Label>First Name</Field.Label>
            <Input
              {...register("firstName", { required: "First name is required" })}
            />
            <Text color="red.500" fontSize="sm">
              {errors.firstName?.message}
            </Text>
          </Field.Root>

          <Field.Root invalid={!!errors.lastName}>
            <Field.Label>Last Name</Field.Label>
            <Input
              {...register("lastName", { required: "Last name is required" })}
            />
            <Text color="red.500" fontSize="sm">
              {errors.lastName?.message}
            </Text>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email Address</Field.Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            <Text color="red.500" fontSize="sm">
              {errors.email?.message}
            </Text>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <Text color="red.500" fontSize="sm">
              {errors.password?.message}
            </Text>
          </Field.Root>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            loading={isSubmitting}
          >
            Sign Up
          </Button>
        </Stack>
      </form>
      <Text mt="4" textAlign="center">
        Have an account?{" "}
        <Link color="blue.800" fontWeight="bold" href="/login">
          Login
        </Link>
      </Text>
      <Text mt="4" textAlign="center">
        <Link color="blue.800" fontWeight="bold" href="/">
          Go to Home
        </Link>
      </Text>
    </Box>
  );
};

export default SignUp;
