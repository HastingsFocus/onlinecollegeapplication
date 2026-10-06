import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import Button from "../../../components/ui/Button";
import {
  getIntakeById,
  publishIntake,
  closeIntake,
  archiveIntake,
  getIntakeStatistics,
} from "../../../services/admissionService";

const IntakeDetails = () => {
  const { intakeId } = useParams();
  const navigate = useNavigate();

  const [intake, setIntake] = useState(null);
  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    status: {
      Draft: 0,
      Submitted: 0,
      "Under Review": 0,
      Accepted: 0,
      Rejected: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadIntake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intakeId]);

  const loadIntake = async () => {
    try {
      setLoading(true);
      setError("");

      const [intakeResponse, statisticsResponse] = await Promise.all([
        getIntakeById(intakeId),
        getIntakeStatistics(intakeId),
      ]);

      setIntake(intakeResponse.intake);
      setApplicationStats(
        statisticsResponse.statistics || {
          totalApplications: 0,
          status: {
            Draft: 0,
            Submitted: 0,
            "Under Review": 0,
            Accepted: 0,
            Rejected: 0,
          },
        }
      );
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to load intake details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert backend status values such as "Draft", "draft",
  // or "DRAFT" into "DRAFT".
  const normalizeStatus = (status) => status?.toUpperCase();

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (normalizeStatus(status)) {
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

  const handlePublish = async () => {
    if (!window.confirm("Are you sure you want to publish this intake?")) return;
    try {
      setActionLoading(true);
      setError("");
      await publishIntake(intakeId);
      await loadIntake();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to publish intake.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Are you sure you want to close this intake?")) return;
    try {
      setActionLoading(true);
      setError("");
      await closeIntake(intakeId);
      await loadIntake();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to close intake.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm("Are you sure you want to archive this intake?")) return;
    try {
      setActionLoading(true);
      setError("");
      await archiveIntake(intakeId);
      await loadIntake();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to archive intake.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-gray-500">Loading intake details...</p>
          </div>
        )}

        {/* Load error — no intake data to show */}
        {!loading && error && !intake && (
          <div className="space-y-5">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/lecturer/admissions/intakes")}
            >
              Back to Intakes
            </Button>
          </div>
        )}

        {/* Loaded */}
        {!loading && intake && (
          <>
            {/* Page Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => navigate("/lecturer/admissions/intakes")}
                  className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  ← Back to Intakes
                </button>
                <h1 className="text-3xl font-bold">{intake.name}</h1>
                <p className="mt-1 text-gray-500">
                  Academic Year: {intake.academicYear}
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                  intake.status
                )}`}
              >
                {intake.status || "DRAFT"}
              </span>
            </div>

            {/* Action error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Intake Overview */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Basic Information */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Intake Information</h2>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Intake Name
                    </p>
                    <p className="mt-1 text-gray-900">{intake.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Academic Year
                    </p>
                    <p className="mt-1 text-gray-900">{intake.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Description
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-gray-700">
                      {intake.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Period */}
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Application Period</h2>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Application Opens
                    </p>
                    <p className="mt-1 text-gray-900">
                      {formatDate(intake.applicationStartDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Application Closes
                    </p>
                    <p className="mt-1 text-gray-900">
                      {formatDate(intake.applicationEndDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="mt-1 text-gray-900">
                      {formatDate(intake.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Created By */}
            {intake.createdBy && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Created By</h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-gray-900">
                      {intake.createdBy.firstName} {intake.createdBy.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">
                      {intake.createdBy.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Available Programs */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Available Programs</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Programs students can apply for in this intake.
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {intake.availablePrograms?.length || 0} program
                  {intake.availablePrograms?.length === 1 ? "" : "s"}
                </span>
              </div>

              {intake.availablePrograms?.length > 0 ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {intake.availablePrograms.map((program) => (
                    <div
                      key={program._id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <h3 className="font-medium text-gray-900">
                        {program.name}
                      </h3>
                      {program.code && (
                        <p className="mt-1 text-sm text-gray-500">
                          Code: {program.code}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                  No programs have been assigned to this intake.
                </div>
              )}
            </div>

            {/* Applications Overview */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold">Applications</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage applications submitted for this intake.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {applicationStats.totalApplications}
                  </p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {applicationStats.status?.Submitted || 0}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-600">Under Review</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {applicationStats.status?.["Under Review"] || 0}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {applicationStats.status?.Accepted || 0}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <Button
                  onClick={() =>
                    navigate(
                      `/lecturer/admissions/intakes/${intake._id}/applications`
                    )
                  }
                >
                  View Applications
                </Button>
              </div>
            </div>

            {/* Management Actions */}
            {normalizeStatus(intake.status) !== "ARCHIVED" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Intake Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage the current status of this admission intake.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`/lecturer/admissions/intakes/${intake._id}/edit`)
                    }
                    disabled={actionLoading}
                  >
                    Edit Intake
                  </Button>

                  {/* Draft actions */}
                  {normalizeStatus(intake.status) === "DRAFT" && (
                    <>
                      <Button onClick={handlePublish} disabled={actionLoading}>
                        {actionLoading ? "Processing..." : "Publish Intake"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleArchive}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Processing..." : "Archive Intake"}
                      </Button>
                    </>
                  )}

                  {/* Published actions */}
                  {normalizeStatus(intake.status) === "PUBLISHED" && (
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Close Intake"}
                    </Button>
                  )}

                  {/* Closed actions */}
                  {normalizeStatus(intake.status) === "CLOSED" && (
                    <Button
                      variant="secondary"
                      onClick={handleArchive}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Processing..." : "Archive Intake"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IntakeDetails;