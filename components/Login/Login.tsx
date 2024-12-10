// import { useState } from 'react';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { auth } from '../../lib/firebase';
// import styles from './Login.module.css';
// import GoogleIcons from '@mui/icons-material/Google';

// export function Login() {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGoogleLogin = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const provider = new GoogleAuthProvider();
//       await signInWithPopup(auth, provider);
//       console.log("Google login successful");
//     } catch (error) {
//       console.error("Google login error:", error);
//       setError('Failed to log in with Google. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={`${styles.container}`}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>Login</h1>
//         <button
//           onClick={handleGoogleLogin}
//           disabled={isLoading}
//           className={`
//             ${styles.googleButton} 
//             ${isLoading ? styles.disabledButton : ''}
//           `}
//         >
//           {isLoading ? (
//             <span>Logging in...</span>
//           ) : (
//             <span className={styles.googleContent}>
//               {/* <GoogleIcon /> */}
//              <GoogleIcons
             
//              />
//              <hr />
//               Sign in with Google
//             </span>
//           )}
//         </button>
//         {error && (
//           <div className={styles.error} role="alert">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function GoogleIcon() {
//   return (
//     <svg
//       className="w-1 h-1 mr-2"
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fill="#ffffff"
//         d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
//       />
//     </svg>
//   );
// }

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useDispatch } from 'react-redux';
import styles from './Login.module.css';
import GoogleIcons from '@mui/icons-material/Google';
import { login } from '../../redux/slices/userSlice';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Obtener información del usuario de Firebase
      const user = result.user;
      const role = determineUserRole(user.email); // Define el rol basado en la lógica de tu app

      // Actualizar Redux con la información del usuario
      dispatch(
        login({
          name: user.displayName || 'User',
          email: user.email || 'No email',
          role: role,
          additionalInfo: 'Logged in via Google',
        })
      );

      console.log('Google login successful');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to log in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const determineUserRole = (email: string | null): 'admin' | 'user' | 'guest' => {
    // Lógica para determinar roles basados en el correo electrónico
    if (!email) return 'guest';
    if (email.endsWith('@admin.com')) return 'admin';
    return 'user';
  };

  return (
    <div className={`${styles.container}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`
            ${styles.googleButton} 
            ${isLoading ? styles.disabledButton : ''}
          `}
        >
          {isLoading ? (
            <span>Logging in...</span>
          ) : (
            <span className={styles.googleContent}>
              <GoogleIcons />
              <hr />
              Sign in with Google
            </span>
          )}
        </button>
        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
