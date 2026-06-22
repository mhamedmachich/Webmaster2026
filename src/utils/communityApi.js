import { requestJson } from "./apiClient";

export async function getApiPosts() {
  const body = await requestJson("/api/community/posts", {}, "Could not load community posts.");
  if (!Array.isArray(body.posts)) {
    const error = new Error("Could not load community posts.");
    error.status = 0;
    error.recoverable = true;
    throw error;
  }
  return body.posts;
}

export async function createApiPost({ text, category, attachments }) {
  const body = await requestJson("/api/community/posts", {
    method:"POST",
    body:JSON.stringify({ text, category, attachments }),
  }, "Could not publish post.");
  return body.post;
}

export async function likeApiPost(postId) {
  return requestJson(`/api/community/posts/${postId}/like`, {
    method:"POST",
  }, "Could not update like.");
}

export async function commentApiPost(postId, text) {
  return requestJson(`/api/community/posts/${postId}/comments`, {
    method:"POST",
    body:JSON.stringify({ text }),
  }, "Could not add comment.");
}

export async function updateApiProfile(profile) {
  const body = await requestJson("/api/users/me/profile", {
    method:"PATCH",
    body:JSON.stringify(profile),
  }, "Could not update profile.");
  return body.user;
}

export async function verifyApiEmail() {
  const body = await requestJson("/api/auth/verify-email", {
    method:"POST",
  }, "Could not verify email.");
  return body.user;
}
