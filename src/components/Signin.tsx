import { authClient } from "@/lib/auth-client";
import { SITE_KEY } from "astro:env/client";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const recaptcha = useRef<ReCAPTCHA>(null);

  const handleSignin = async () => {
    const { data, error } = await authClient.signIn.email(
      {
        email: email,
        password: password,
      },
      {
        onRequest: () => {
          // @ts-ignore
          if (!recaptcha.current.getValue()) {
            setError("Recaptcha verification failed");
            throw new Error("Recaptcha verification failed");
          }
        },
      }
    );
    if (error) {
      setError(error.message || "An error occurred");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-8 z-30 bg-white">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ReCAPTCHA sitekey={SITE_KEY} className="z-[999]" ref={recaptcha} />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSignin}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign In
      </button>
    </div>
  );
};
