import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getUserById } from "../../services/userService";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserById(id);
        setUser(data.user);
      } catch (error) {
        console.error("Error loading user:", error);
        setError(
          error.response?.data?.message || "Failed to load user details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRole = (role) => {
    if (!role) return "—";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">Loading user details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mt-4 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Back to Users
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mb-4 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to Users
          </button>

          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="mt-1 text-sm text-gray-600">
            View account information for this system user.
          </p>
        </div>

        {/* USER HEADER */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-700">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* USER INFORMATION */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              User Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <InfoItem label="First Name" value={user.firstName} />
            <InfoItem label="Last Name" value={user.lastName} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Role" value={formatRole(user.role)} />
            <InfoItem
              label="Status"
              value={user.isActive ? "Active" : "Inactive"}
            />
            <InfoItem
              label="Account Created"
              value={formatDate(user.createdAt)}
            />
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <InfoItem
              label="Account Activated"
              value={user.isActivated ? "Yes" : "No"}
            />
            <InfoItem
              label="Last Updated"
              value={formatDate(user.updatedAt)}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value || "—"}</p>
  </div>
);

export default UserDetails;