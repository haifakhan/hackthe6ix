// This is a client-side placeholder for authentication.
// In a real application, you would integrate with Auth0 here.

let isAuthenticated = false

export const login = () => {
  isAuthenticated = true
  if (typeof window !== "undefined") {
    localStorage.setItem("isAuthenticated", "true")
  }
}



export const logout = () => {
  isAuthenticated = false
  if (typeof window !== "undefined") {
    localStorage.removeItem("isAuthenticated")
  }
}

export const checkAuth = () => {
  if (typeof window !== "undefined") {
    isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  }
  return isAuthenticated
}
