"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    const { error } =
      await supabase.auth.signInWithOtp({
        email,
      });

    if (error) {
      alert(error.message);
    } else {
      alert("Magic link sent to email!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 40,
          borderRadius: 12,
          width: 400,
        }}
      >
        <h1>Login</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 12,
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 8,
          }}
        >
          Send Magic Link
        </button>
      </div>
    </div>
  );
}