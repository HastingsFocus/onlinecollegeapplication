import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { getRegisteredStudents } from "../../../services/studentRegistryService";

const StudentRegistry = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRegisteredStudents();

      setStudents(data.students || []);
    } catch (error) {
      console.error("Error loading student registry:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load the Student Registry."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  /*
   * Group registered students by programme.
   */
  const studentsByProgram = useMemo(() => {
    const groups = {};

    students
      .filter((student) => student.status === "Registered")
      .forEach((student) => {
        const programId = student.program?._id || "unknown";

        if (!groups[programId]) {
          groups[programId] = {
            program: student.program,
            students: []
          };
        }

        groups[programId].students.push(student);
      });

    return Object.values(groups);
  }, [students]);

  const totalStudents = students.filter(
    (student) => student.status === "Registered"
  ).length;

  const totalPrograms = studentsByProgram.length;

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Registry
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            View registered students grouped by their accepted programme.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        {!loading && !error && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Registered Students
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalStudents}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Programmes
              </p>

              <p className="mt-2 text-3xl font-bold text-sky-600">
                {totalPrograms}
              </p>
            </div>

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading student registry...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && studentsByProgram.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No registered students
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Students will appear here after they are added to the
              Student Registry.
            </p>
          </div>
        )}

        {/* PROGRAMME GROUPS */}
        {!loading && !error && studentsByProgram.length > 0 && (
          <div className="space-y-8">

            {studentsByProgram.map((group) => (
              <div
                key={group.program?._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >

                {/* PROGRAMME HEADER */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">

                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {group.program?.name || "Unknown Programme"}
                      </h2>

                      {group.program?.code && (
                        <p className="mt-1 text-sm font-medium text-sky-600">
                          {group.program.code}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {group.students.length}{" "}
                      {group.students.length === 1
                        ? "student"
                        : "students"}
                    </div>

                  </div>

                </div>

                {/* STUDENTS TABLE */}
                <div className="overflow-x-auto">

                  <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-white">
                      <tr>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Registration Number
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Student
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Email
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Intake
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Academic Year
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">

                      {group.students.map((student) => {

                        const firstName =
                          student.userId?.firstName || "";

                        const lastName =
                          student.userId?.lastName || "";

                        return (
                          <tr
                            key={student._id}
                            className="hover:bg-gray-50"
                          >

                            {/* REGISTRATION NUMBER */}
                            <td className="whitespace-nowrap px-6 py-4">
                              <span className="font-mono text-sm font-bold text-sky-700">
                                {student.registrationNumber || "—"}
                              </span>
                            </td>

                            {/* STUDENT */}
                            <td className="whitespace-nowrap px-6 py-4">

                              <div className="text-sm font-medium text-gray-900">
                                {firstName} {lastName}
                              </div>

                            </td>

                            {/* EMAIL */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                              {student.userId?.email || "—"}
                            </td>

                            {/* INTAKE */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                              {student.intake?.name || "—"}
                            </td>

                            {/* ACADEMIC YEAR */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                              {student.academicYear || "—"}
                            </td>

                            {/* STATUS */}
                            <td className="whitespace-nowrap px-6 py-4">

                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                {student.status}
                              </span>

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default StudentRegistry;