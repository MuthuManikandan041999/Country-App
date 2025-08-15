"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Globe } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout } from "@/lib/features/auth/authSlice"
import { useRouter } from "next/navigation"

export function Header() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Countries Explorer</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.email}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
