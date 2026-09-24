export const ROLE_LABELS = {
  JOB_SEEKER: "Job seeker",
  EMPLOYER: "Employer",
  ADMIN: "Admin",
};

export const ROLE_HOME = {
  JOB_SEEKER: "/jobs",
  EMPLOYER: "/employer/jobs",
  ADMIN: "/admin/jobs",
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

export function roleHome(role) {
  return ROLE_HOME[role] || "/";
}
