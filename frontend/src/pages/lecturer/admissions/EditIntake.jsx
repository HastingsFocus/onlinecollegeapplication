import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button";
import {
  getIntakes,
  updateIntake,
} from "../../../services/admissionService";
import { getPrograms } from "../../../services/programService";

const EditIntake = () => {
  const navigate = useNavigate();
  const { intakeId } = useParams();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadData();
  }, [intakeId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [intakesData, programsData] = await Promise.all([
        getIntakes(),
        getPrograms(),
      ]);

      const intake = intakesData.intakes?.find(
        (item) => item._id === intakeId
      );

      if (!intake) {
        setError("Intake not found.");
        return;
      }

      setPrograms(programsData.programs || []);

      setFormData({
        name: intake.name || "",
        academicYear: intake.academicYear || "",
        description: intake.description || "",
        applicationStartDate: intake.applicationStartDate
          ? intake.applicationStartDate.split("T")[0]
          : "",
        applicationEndDate: intake.applicationEndDate
          ? intake.applicationEndDate.split("T")[0]
          : "",
        availablePrograms:
          intake.availablePrograms?.map((program) =>
            typeof program === "object"
              ? program._id
              : program
          ) || [],
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load intake."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProgramChange = (programId) => {
    setFormData((previous) => {
      const alreadySelected =
        previous.availablePrograms.includes(programId);

      if (alreadySelected) {
        return {
          ...previous,
          availablePrograms:
            previous.availablePrograms.filter(
              (id) => id !== programId
            ),
        };
      }

      return {
        ...previous,
        availablePrograms: [
          ...previous.availablePrograms,
          programId,
        ],
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

    if (
      new Date(formData.applicationStartDate) >=
      new Date(formData.applicationEndDate)
    ) {
      setError(
        "Application end date must be after the start date."
      );
      return;
    }

    try {
      setSubmitting(true);

      await updateIntake(intakeId, formData);

      setSuccess("Intake updated successfully.");

      setTimeout(() => {
        navigate("/lecturer/admissions/intakes");
      }, 1000);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update intake."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">
          Loading intake...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Edit Intake
        </h1>

        <p className="mt-1 text-gray-500">
          Update the details and programs available for this
          admission intake.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {!error && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
        >

          {/* Name */}
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Dates */}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

          </div>

          {/* Programs */}
          <div>
            <div className="mb-3">
              <h2 className="text-sm font-medium text-gray-700">
                Available Programs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the programs available for this intake.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {programs.map((program) => {
                const selected =
                  formData.availablePrograms.includes(
                    program._id
                  );

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
                      onChange={() =>
                        handleProgramChange(program._id)
                      }
                      className="mt-1 h-4 w-4"
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {program.name}
                      </p>

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
          </div>

          {/* Selected Count */}
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span className="font-medium">
              {formData.availablePrograms.length}
            </span>{" "}
            program
            {formData.availablePrograms.length === 1
              ? ""
              : "s"} selected
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate("/lecturer/admissions/intakes")
              }
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>

          </div>
        </form>
      )}
    </div>
  );
};

export default EditIntake;

