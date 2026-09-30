
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import {
  getIntakes,
  publishIntake,
  closeIntake,
  archiveIntake,
} from "../../../services/admissionService";

const Intakes = () => {
  const navigate = useNavigate();

  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadIntakes();
  }, []);

  const loadIntakes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getIntakes();

      setIntakes(data.intakes || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load intakes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-red-100 text-red-700";

      case "ARCHIVED":
        return "bg-gray-100 text-gray-600";

      case "DRAFT":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const handlePublish = async (intakeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this intake?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(intakeId);
      setError("");

      await publishIntake(intakeId);

      await loadIntakes();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to publish intake."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (intakeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to close this intake?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(intakeId);
      setError("");

      await closeIntake(intakeId);

      await loadIntakes();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to close intake."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (intakeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this intake?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(intakeId);
      setError("");

      await archiveIntake(intakeId);

      await loadIntakes();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to archive intake."
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading intakes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Admissions
          </h1>

          <p className="text-gray-500">
            Create and manage admission intakes.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/lecturer/admissions/intakes/create")
          }
        >
          Create Intake
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && intakes.length === 0 && (
        <div className="rounded-lg border bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold">
            No intakes available
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your first admission intake to start
            managing applications.
          </p>

          <div className="mt-5">
            <Button
              onClick={() =>
                navigate("/lecturer/admissions/intakes/create")
              }
            >
              Create Intake
            </Button>
          </div>
        </div>
      )}

      {/* Intake List */}
      {intakes.length > 0 && (
        <div className="grid gap-5">
          {intakes.map((intake) => {
            const isActionLoading =
              actionLoading === intake._id;

            return (
              <div
                key={intake._id}
                className="rounded-lg border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                  {/* Intake Information */}
                  <div className="space-y-4">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {intake.name}
                      </h2>

                      <p className="text-gray-500">
                        Academic Year: {intake.academicYear}
                      </p>

                      <span
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                          intake.status
                        )}`}
                      >
                        {intake.status || "DRAFT"}
                      </span>
                    </div>

                    {/* Application Period */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Application Period
                      </p>

                      <p className="text-sm text-gray-500">
                        {formatDate(
                          intake.applicationStartDate
                        )}
                        {" — "}
                        {formatDate(
                          intake.applicationEndDate
                        )}
                      </p>
                    </div>

                    {/* Available Programs */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Available Programs
                      </p>

                      <p className="text-sm text-gray-500">
                        {intake.availablePrograms?.length || 0}{" "}
                        program
                        {intake.availablePrograms?.length === 1
                          ? ""
                          : "s"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">

                    {/* Open */}
                    <Button
                      onClick={() =>
                        navigate(
                          `/lecturer/admissions/intakes/${intake._id}`
                        )
                      }
                    >
                      Open
                    </Button>

                    {/* Edit */}
                    {intake.status !== "ARCHIVED" && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          navigate(
                            `/lecturer/admissions/intakes/${intake._id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>
                    )}

                    {/* Publish */}
                    {intake.status === "DRAFT" && (
                      <Button
                        onClick={() =>
                          handlePublish(intake._id)
                        }
                        disabled={isActionLoading}
                      >
                        {isActionLoading
                          ? "Processing..."
                          : "Publish"}
                      </Button>
                    )}

                    {/* Close */}
                    {intake.status === "PUBLISHED" && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleClose(intake._id)
                        }
                        disabled={isActionLoading}
                      >
                        {isActionLoading
                          ? "Processing..."
                          : "Close"}
                      </Button>
                    )}

                    {/* Archive */}
                    {(intake.status === "DRAFT" ||
                      intake.status === "CLOSED") && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleArchive(intake._id)
                        }
                        disabled={isActionLoading}
                      >
                        {isActionLoading
                          ? "Processing..."
                          : "Archive"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Intakes;
