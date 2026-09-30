import { Eye } from "lucide-react";

const ApplicationTable = ({
  applications,
  onView,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 text-left">
              Application No.
            </th>

            <th className="p-3 text-left">
              Applicant
            </th>

            <th className="p-3 text-left">
              First Choice
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {applications.map((application) => (

            <tr
              key={application._id}
              className="border-t"
            >

              <td className="p-3">
                {application.applicationNumber}
              </td>

              <td className="p-3">
                {application.userId.firstName}{" "}
                {application.userId.lastName}
              </td>

              <td className="p-3">
                {application.programChoice.firstChoice?.name}
              </td>

              <td className="p-3">
                {application.status}
              </td>

              <td className="p-3 text-center">

                <button
                  onClick={() => onView(application)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye size={18} />
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ApplicationTable;