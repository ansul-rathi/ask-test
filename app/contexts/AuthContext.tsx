'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  stripeCustomerId?: string;
  credits?: string;
  emailVerified: boolean;
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add this flag

  useEffect(() => {
    const validateSession = async () => {
      // Don't validate session if we're in the middle of logging out
      if (isLoggingOut) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/validate-session');
        const data = await response.json();
        
        if (data.isAuthenticated && !isLoggingOut) {
          setUser(data.user);
          sessionStorage.setItem('auth', JSON.stringify(data.user));
        } else {
          // Clear session storage and state if server session is invalid
          sessionStorage.removeItem('auth');
          setUser(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        setUser(null);
        sessionStorage.removeItem('auth');
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [isLoggingOut]); // Add isLoggingOut as dependency

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      setIsLoggingOut(false); // Reset logout flag on login
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      setUser(data.user as User);
      sessionStorage.setItem('auth', JSON.stringify(data.user));
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
const handleLogout = async () => {
  try {
    console.log("🔴 Starting logout process...");
    setLoading(true);
    setIsLoggingOut(true);
    
    // Clear client state immediately
    console.log("🔴 Clearing client state...");
    setUser(null);
    sessionStorage.removeItem('auth');
    localStorage.removeItem('auth');
    
    // Call your logout service
    if (user?.accessToken) {
      console.log("🔴 Calling logout service with token...");
      await logout(user.accessToken);
      console.log("🔴 Logout service completed");
    }
    
    // Call server logout endpoint
    console.log("🔴 Calling server logout endpoint...");
    const logoutResponse = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    console.log("🔴 Server logout response:", logoutResponse.status);
    
    // Test session validation
    console.log("🔴 Testing session validation after logout...");
    const validateResponse = await fetch('/api/auth/validate-session');
    const validateData = await validateResponse.json();
    console.log("🔴 Session validation after logout:", validateData);
    
  } catch (err: any) {
    console.error('🔴 Logout error:', err);
    setError(err.message || 'An error occurred during logout');
  } finally {
    setLoading(false);
    console.log("🔴 Logout process completed");
  }
};
  // const handleLogout = async () => {
  //   try {
  //     setLoading(true);
  //     setIsLoggingOut(true); // Set logout flag
      
  //     // Clear client state immediately
  //     setUser(null);
  //     sessionStorage.removeItem('auth');
  //     localStorage.removeItem('auth'); // Clear localStorage too, just in case
      
  //     // Call server logout to invalidate session
  //     if (user?.accessToken) {
  //       await logout(user.accessToken);
  //     }
      
  //     // Also call server logout endpoint to clear server session
  //     await fetch('/api/auth/logout', {
  //       method: 'POST',
  //       credentials: 'include', // Include cookies
  //     });
      
  //   } catch (err: any) {
  //     console.error('Logout error:', err);
  //     setError(err.message || 'An error occurred during logout');
  //     // Still clear client state even if server logout fails
  //     setUser(null);
  //     sessionStorage.removeItem('auth');
  //     localStorage.removeItem('auth');
  //   } finally {
  //     setLoading(false);
  //     // Keep isLoggingOut true until page navigation completes
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout: handleLogout,
        isAuthenticated: !!user && !isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 'use client'
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { logout } from '../services/auth';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   stripeCustomerId?: string;
//   credits?: string;
//   emailVerified: boolean;
//   accessToken: string;
//   idToken: string;
//   refreshToken: string;
// }



// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   console.log({user})
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const validateSession = async () => {
//       try {
//         const response = await fetch('/api/auth/validate-session');
//         const data = await response.json();
        
//         if (data.isAuthenticated) {
//           setUser(data.user);
//           sessionStorage.setItem('auth', JSON.stringify(data.user));
//         } else {
//           // Clear session storage and state if server session is invalid
//           sessionStorage.removeItem('auth');
//           setUser(null);
//         }
//       } catch (error) {
//         console.error('Session validation error:', error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     validateSession();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//      const response = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });
//      const data = await response.json();
    
//     if (!data.success) {
//       throw new Error(data.message || 'Authentication failed');
//     }
    
//     setUser(data.user as User);
//     sessionStorage.setItem('auth', JSON.stringify(data.user));
//       // if (response) {
//       //   setUser(response as User);
//       //   sessionStorage.setItem('auth', JSON.stringify(response));
//       // } else {
//       //   throw new Error('Login failed');
//       // }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred during login');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       setLoading(true);
//       if (user?.accessToken) {
//         await logout(user.accessToken);
//       }
//       setUser(null);
//       sessionStorage.removeItem('auth');
//     } catch (err: any) {
//       setError(err.message || 'An error occurred during logout');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         login,
//         logout: handleLogout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }