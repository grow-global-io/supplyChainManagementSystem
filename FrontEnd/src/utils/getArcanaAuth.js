import { AuthProvider } from "@arcana/auth";

let auth = null;

export const getAuthProvider = () => {
  if (!auth) {
    auth = new AuthProvider(
      "xar_test_d35a90a217bb4ec99710d7eff0447ffd492e5ca0"
    );
  }
  return auth;
};
