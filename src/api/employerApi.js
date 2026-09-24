import client from "./client";

export function postJob(jobRequest) {
  return client.post("/employer/jobs", jobRequest).then((res) => res.data);
}

export function getMyPostedJobs() {
  return client.get("/employer/jobs").then((res) => res.data);
}

export function updateJob(jobId, jobRequest) {
  return client.put(`/employer/jobs/${jobId}`, jobRequest).then((res) => res.data);
}

export function deleteJob(jobId) {
  return client.delete(`/employer/jobs/${jobId}`).then((res) => res.data);
}

export function getApplicationsForJob(jobId) {
  return client.get(`/employer/jobs/${jobId}/applications`).then((res) => res.data);
}

export function updateApplicantStatus(applicationId, status) {
  return client
    .put(`/employer/applications/${applicationId}/status`, { status })
    .then((res) => res.data);
}
