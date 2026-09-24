import client from "./client";

export function getAllActiveJobs() {
  return client.get("/seeker/jobs").then((res) => res.data);
}

export function searchJobs({ keyword = "", location = "" }) {
  return client
    .get("/seeker/jobs/search", { params: { keyword, location } })
    .then((res) => res.data);
}

export function applyForJob(jobId, { resumeUrl, coverLetter }) {
  return client
    .post(`/seeker/jobs/${jobId}/apply`, { resumeUrl, coverLetter })
    .then((res) => res.data);
}

export function getMyApplications() {
  return client.get("/seeker/applications").then((res) => res.data);
}
