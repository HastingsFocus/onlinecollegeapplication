
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../../layouts/DashboardLayout";
import Button from "../../../components/ui/Button";
import { createIntake } from "../../../services/admissionService";
import { getPrograms } from "../../../services/programService";

const CreateIntake = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    academicYear: "",
    description: "",
    applicationStartDate: "",
    applicationEndDate: "",
    availablePrograms: [],
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
  try {
    setLoadingPrograms(true);
    setError("");

    const data = await getPrograms();

    

   setPrograms(data || []);
  } catch (error) {
    

    setError(
      error.response?.data?.message ||
        "Failed to load programs. Please try again."
    );
  } finally {
    setLoadingPrograms(false);
  }
};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleProgramChange = (programId) => {
    setFormData((previous) => {
      const alreadySelected = previous.availablePrograms.includes(programId);

      if (alreadySelected) {
        return {
          ...previous,
          availablePrograms: previous.availablePrograms.filter(
            (id) => id !== programId
          ),
        };
      }

      return {
        ...previous,
        availablePrograms: [...previous.availablePrograms, programId],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.academicYear ||
      !formData.applicationStartDate ||
      !formData.applicationEndDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (new Date(formData.applicationStartDate) >= new Date(formData.applicationEndDate)) {
      setError("Application end date must be after the start date.");
      return;
    }

    try {
      setSubmitting(true);
      await createIntake(formData);
      setSuccess("Intake created successfully.");

      setTimeout(() => {
        navigate("/lecturer/admissions/intakes");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to create intake. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Create Intake</h1>
          <p className="mt-1 text-gray-500">
            Create a new admission intake and select the programs available for
            application.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
        >
          {/* Intake Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Intake Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. September 2026 Intake"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Academic Year */}
          <div>
            <label
              htmlFor="academicYear"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Academic Year
            </label>

            <input
              id="academicYear"
              name="academicYear"
              type="text"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g. 2026/2027"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this admission intake..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Application Dates */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="applicationStartDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Application Start Date
              </label>

              <input
                id="applicationStartDate"
                name="applicationStartDate"
                type="date"
                value={formData.applicationStartDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label
                htmlFor="applicationEndDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Application End Date
              </label>

              <input
                id="applicationEndDate"
                name="applicationEndDate"
                type="date"
                value={formData.applicationEndDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Available Programs */}
          <div>
            <div className="mb-3">
              <h2 className="text-sm font-medium text-gray-700">
                Available Programs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the programs students can apply for in this intake.
              </p>
            </div>

            {loadingPrograms ? (
              <p className="text-sm text-gray-500">Loading programs...</p>
            ) : programs.length === 0 ? (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                No programs are available. Please create a program before
                creating an intake.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {programs.map((program) => {
                  const selected = formData.availablePrograms.includes(program._id);

                  return (
                    <label
                      key={program._id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleProgramChange(program._id)}
                        className="mt-1 h-4 w-4"
                      />

                      <div>
                        <p className="font-medium text-gray-900">{program.name}</p>

                        {program.code && (
                          <p className="mt-1 text-sm text-gray-500">
                            Code: {program.code}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Programs Count */}
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span className="font-medium">
              {formData.availablePrograms.length}
            </span>{" "}
            program
            {formData.availablePrograms.length === 1 ? "" : "s"} selected
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/lecturer/admissions/intakes")}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={submitting || loadingPrograms}>
              {submitting ? "Creating..." : "Create Intake"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateIntake;