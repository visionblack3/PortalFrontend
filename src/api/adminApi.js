import client from "./client";

export function getAllJobs() {
  return client.get("/admin/jobs").then((res) => res.data);
}

export function getAllApplications() {
  return client.get("/admin/applications").then((res) => res.data);
}

export function updateJob(jobId, jobRequest) {
  return client.put(`/admin/jobs/${jobId}`, jobRequest).then((res) => res.data);
}

export function deleteJob(jobId) {
  return client.delete(`/admin/jobs/${jobId}`).then((res) => res.data);
}
