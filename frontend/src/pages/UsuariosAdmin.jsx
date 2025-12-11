// UsuariosAdmin.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UsuariosAdmin.module.css";

const UsuariosAdmin = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem("token");

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error al cargar usuarios:", data);
        setUsuarios([]);
        return;
      }

      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRol = async (id, nuevoRol) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nuevoRol }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Rol actualizado a ${nuevoRol}`);
        cargarUsuarios();
      } else {
        alert(data.msg || "Error al actualizar rol");
      }
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      alert("Error al actualizar rol");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario eliminado");
        cargarUsuarios();
      } else {
        alert(data.msg || "Error al eliminar usuario");
      }
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Gestión de Usuarios</h2>

      <button className={styles.botonVolver} onClick={() => navigate("/dashboard")}>Volver</button>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td className={styles.acciones}>
                {u.role !== "SUPER_ADMIN" ? (
                  <>
                    {u.role === "USER" && (
                      <button className={styles.botonAccion} onClick={() => cambiarRol(u._id, "ADMIN")}>
                        Convertir en ADMIN
                      </button>
                    )}

                    {u.role === "ADMIN" && (
                      <button className={styles.botonAccion} onClick={() => cambiarRol(u._id, "USER")}>
                        Convertir en USER
                      </button>
                    )}

                    <button
                      className={styles.botonEliminar}
                      onClick={() => eliminarUsuario(u._id)}
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <strong>No editable</strong>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosAdmin;
