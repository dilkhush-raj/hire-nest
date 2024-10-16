import React, { useState, FormEvent, ChangeEvent } from "react";
import { Briefcase, FileText, Star, UserPlus, Calendar, X } from "lucide-react";
import axios from "axios";

interface FormData {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  candidates: string[];
  endDate: string;
}

interface Errors {
  [key: string]: string;
}

interface AlertProps {
  type: "success" | "error";
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type, children }) => (
  <div
    className={`p-4 mb-4 rounded-md ${
      type === "success"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {children}
  </div>
);

const JobPostingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    experienceLevel: "",
    candidates: [],
    endDate: "",
  });
  const [newCandidate, setNewCandidate] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: a, ...rest } = prev;
        console.log(a);
        return rest;
      });
    }
  };

  const handleAddCandidate = () => {
    if (newCandidate.trim()) {
      setFormData((prev) => ({
        ...prev,
        candidates: [...prev.candidates, newCandidate.trim()],
      }));
      setNewCandidate("");
    }
  };

  const handleRemoveCandidate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job Title is required";
    if (!formData.jobDescription.trim())
      newErrors.jobDescription = "Job Description is required";
    if (!formData.experienceLevel)
      newErrors.experienceLevel = "Experience Level is required";
    if (formData.candidates.length === 0)
      newErrors.candidates = "At least one candidate is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      // Make a POST request to the API to send the job posting and emails
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_HOST_URL
        }/api/v1/auth/send-emails-to-candidates`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(response);

      setSubmitFeedback({
        type: "success",
        message:
          "Job posting submitted successfully and emails sent to candidates!",
      });
      setFormData({
        jobTitle: "",
        jobDescription: "",
        experienceLevel: "",
        candidates: [],
        endDate: "",
      });
    } catch (error) {
      setSubmitFeedback({
        type: "error",
        message: "An error occurred while submitting the job posting." + error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="my-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Create Job Posting
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 max-w-sm">
              Fill in the details for your new job posting
            </p>
          </div>
          <hr className="my-4" />
          {submitFeedback && (
            <Alert type={submitFeedback.type}>{submitFeedback.message}</Alert>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Briefcase />
              <input
                id="jobTitle"
                name="jobTitle"
                type="text"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>
            {errors.jobTitle && (
              <p className="text-red-500 text-xs">{errors.jobTitle}</p>
            )}

            <div className="flex bg-gray-100 p-2 rounded-md gap-2">
              <FileText />
              <textarea
                id="jobDescription"
                name="jobDescription"
                required
                className="mt-1 outline-none bg-transparent w-full"
                placeholder="Job Description"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={4}
              />
            </div>
            {errors.jobDescription && (
              <p className="text-red-500 text-xs">{errors.jobDescription}</p>
            )}

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Star />
              <select
                id="experienceLevel"
                name="experienceLevel"
                required
                className="mt-1 outline-none bg-transparent w-full"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            {errors.experienceLevel && (
              <p className="text-red-500 text-xs">{errors.experienceLevel}</p>
            )}

            <div>
              <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2 mb-2">
                <UserPlus />
                <input
                  id="newCandidate"
                  name="newCandidate"
                  type="text"
                  className="mt-1 outline-none bg-transparent w-full"
                  placeholder="Add Candidate"
                  value={newCandidate}
                  onChange={(e) => setNewCandidate(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  className="bg-accent text-white px-2 py-1 rounded"
                >
                  Add
                </button>
              </div>
              {formData.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-1"
                >
                  <span>{candidate}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(index)}
                    className="text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {errors.candidates && (
              <p className="text-red-500 text-xs">{errors.candidates}</p>
            )}

            <div className="flex items-center bg-gray-100 p-2 rounded-md gap-2">
              <Calendar />
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="mt-1 outline-none bg-transparent w-full"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
            {errors.endDate && (
              <p className="text-red-500 text-xs">{errors.endDate}</p>
            )}

            <div>
              <button
                type="submit"
                className="rounded-md bg-accent w-full px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Job Posting"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostingForm;
