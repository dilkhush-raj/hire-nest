import axios from "axios";

const deleteUser = async (id: string): Promise<boolean> => {
  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/deleteUser/${id}`;
  try {
    const response = await axios.delete(apiUrl, { withCredentials: true });
    return response.data.success;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export const handleDeleteUser = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this user?")) {
    return;
  }
  const success = await deleteUser(id);
  if (success) {
    window.location.reload();
  } else {
    alert("Failed to delete user");
  }
};
