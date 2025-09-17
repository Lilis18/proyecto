import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState({
    token: null,
    nombre: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombre");
    const role = localStorage.getItem("role");

    if (token && nombre && role) {
      setUser({ token, nombre, role });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("nombre", data.nombre);
    localStorage.setItem("role", data.role);

    setUser({
      token: data.token,
      nombre: data.nombre,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("role");

    setUser({ token: null, nombre: null, role: null });
  };

  return { user, login, logout };
}