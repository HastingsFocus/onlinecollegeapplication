import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getUsers } from "../../services/userService";

const Users = () => {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    pageLimit: 20,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsers({
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 20,
      });
      setUsers(data.users || []);
      setPagination({
        totalUsers: data.totalUsers || 0,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        pageLimit: data.pageLimit || 20,
      });
    } catch (error) {
      console.error("Error loading users:", error);
      setError(error.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, statusFilter]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRole = (role) => {
    if (!role) return "—";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage all users registered in the Online College
            Application System.
          </p>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* SEARCH */}
            <div className="lg:col-span-2">
              <label
                htmlFor="user-search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Search Users
              </label>
              <input
                id="user-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* ROLE */}
            <div>
              <label
                htmlFor="role-filter"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={handleRoleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label
                htmlFor="status-filter"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-2 lg:col-span-4">
              <button
                type="submit"
                className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {users.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.totalUsers}
              </span>{" "}
              users
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-600">Loading users...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && users.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No users found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* USERS TABLE */}
        {!loading && !error && users.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user._id} className="transition hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                          {formatRole(user.role)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
  type="button"
  onClick={() => navigate(`/admin/users/${user._id}`)}
  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
>
  View
</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                <p className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold">
                    {pagination.currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {pagination.totalPages}
                  </span>
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;