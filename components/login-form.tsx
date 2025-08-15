"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Form, Button } from "react-bootstrap"
import { useAppDispatch } from "@/lib/hooks"
import { login } from "@/lib/features/auth/authSlice"
import Image from "next/image";
import { SocialIcons } from "./social-icons"

interface FormErrors {
  email?: string
  password?: string
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" }
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    if (!hasUpperCase) {
      return { isValid: false, message: "Password must contain at least 1 uppercase letter" }
    }
    if (!hasNumber) {
      return { isValid: false, message: "Password must contain at least 1 number" }
    }
    if (!hasSymbol) {
      return { isValid: false, message: "Password must contain at least 1 symbol" }
    }

    return { isValid: true }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch(login({ email }))
      router.push("/home")
    }

    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">
          New user? <a href="#">Create an account</a>
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Username or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Keep me signed in"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
          </Form.Group>

          <Button type="submit" className="btn-signin" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>

        <p className="signin-divider">Or Sign In With</p>

        <SocialIcons />
      </div>
      <div className="login-logo">
        <Image src="/undraw_forgot-password_nttj.png" alt="" fill style={{ objectFit: "contain" }} />
      </div>
    </div>
  )
}
