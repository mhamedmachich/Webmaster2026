export async function getApiPosts() {
  const response = await fetch("/api/community/posts", { credentials:"include" });
  if (!response.ok) throw new Error("Community API unavailable.");
  const body = await response.json();
  return body.posts;
}

export async function createApiPost({ text, category, attachments }) {
  const response = await fetch("/api/community/posts", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    credentials:"include",
    body:JSON.stringify({ text, category, attachments }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Could not publish post.");
  }
  const body = await response.json();
  return body.post;
}

export async function likeApiPost(postId) {
  const response = await fetch(`/api/community/posts/${postId}/like`, {
    method:"POST",
    credentials:"include",
  });
  if (!response.ok) throw new Error("Could not update like.");
  return response.json();
}

export async function commentApiPost(postId, text) {
  const response = await fetch(`/api/community/posts/${postId}/comments`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    credentials:"include",
    body:JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Could not add comment.");
  return response.json();
}

export async function updateApiProfile(profile) {
  const response = await fetch("/api/users/me/profile", {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    credentials:"include",
    body:JSON.stringify(profile),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Could not update profile.");
  }
  const body = await response.json();
  return body.user;
}

export async function verifyApiEmail() {
  const response = await fetch("/api/auth/verify-email", {
    method:"POST",
    credentials:"include",
  });
  if (!response.ok) throw new Error("Could not verify email.");
  const body = await response.json();
  return body.user;
}
