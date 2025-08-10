import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/authStore";

const App = () => {
  const { fetchUserProfile } = useAuthStore();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  return <AppRouter />;
};

export default App;
