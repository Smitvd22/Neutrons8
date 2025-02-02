"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login({ onToggle }) {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    })

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/b")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <button onClick={onToggle} className="text-blue-500 hover:underline">
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  )
}

