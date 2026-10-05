import { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  getAcceptedStudents,
  registerStudent
} from "../../../services/studentRegistryService";

const AcceptedStudents = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAcceptedStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAcceptedStudents();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error loading accepted students:", error);
      setError(
        error.response?.data?.message || "Failed to load accepted students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcceptedStudents();
  }, []);

  const handleRegisterStudent = async (applicationId) => {
    try {
      setRegisteringId(applicationId);
      setError("");
      setSuccess("");
      const data = await registerStudent(applicationId);
      setSuccess(
        data.message || "Student added to the Student Registry successfully."
      );
      await loadAcceptedStudents();
    } catch (error) {
      console.error("Error registering student:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add student to the Student Registry."
      );
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Accepted Students</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review accepted applicants and add them to the Student Registry.
          </p>
        </div>

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Accepted Applications</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Added to Registry</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {applications.filter((application) => application.registry).length}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pending Registration</p>
              <p className="mt-2 text-2xl font-bold text-orange-600">
                {applications.filter((application) => !application.registry).length}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-600">Loading accepted students...</p>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No accepted students
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              There are currently no accepted applications ready for registration.
            </p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Application No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Programme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Intake
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Registry Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {applications.map((application) => {
                    const firstName =
                      application.personalInfo?.firstName ||
                      application.userId?.firstName ||
                      "";
                    const lastName =
                      application.personalInfo?.lastName ||
                      application.userId?.lastName ||
                      "";
                    const acceptedProgram = application.programChoice?.acceptedProgram;
                    const registry = application.registry;

                    return (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {firstName} {lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.userId?.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {application.applicationNumber || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {acceptedProgram?.name || "—"}
                          </div>
                          {acceptedProgram?.code && (
                            <div className="text-xs text-gray-500">
                              {acceptedProgram.code}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {application.intake?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {application.intake?.academicYear || ""}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {registry ? (
                            <div>
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                Added to Registry
                              </span>
                              <div className="mt-1 text-xs text-gray-500">
                                {registry.registrationNumber ||
                                  "Pending Registration Number"}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              Not Registered
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {registry ? (
                            <span className="text-sm text-gray-500">
                              Already Added
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRegisterStudent(application._id)}
                              disabled={registeringId === application._id}
                              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {registeringId === application._id
                                ? "Adding..."
                                : "Add to Registry"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AcceptedStudents;