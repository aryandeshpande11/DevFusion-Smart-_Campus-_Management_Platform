import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { logInWithEmail, logOutCurrentUser, signUpWithEmail } from "../api/authApi.js";

// thin convenience wrapper so components call `logIn(...)` instead of
// juggling the store + api calls + redirect every time
export const useAuth = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const startSession = useAuthStore((state) => state.startSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const logIn = async (credentials) => {
    const { user, accessToken } = await logInWithEmail(credentials);
    startSession(user, accessToken);
    navigate(`/app/${user.role}`);
    return user;
  };

  const signUp = async (formValues) => {
    await signUpWithEmail(formValues);
    navigate("/verify-email", { state: { email: formValues.email } });
  };

  const logOut = async () => {
    try {
      await logOutCurrentUser();
    } finally {
      clearSession();
      navigate("/login");
    }
  };

  return { currentUser, isLoggedIn: Boolean(currentUser), logIn, signUp, logOut };
};
