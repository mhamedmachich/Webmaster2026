const POSTS_KEY = "community-compass-posts-v1";

function readPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return [];
  }

  return [
    {
      id: "seed-1",
      authorId: "community-team",
      authorName: "Community Compass Team",
      authorRole: "Verified Organizer",
      avatarGradient: "linear-gradient(135deg, #0B1F3A, #1D9E75)",
      category: "Resource Tip",
      text: "Welcome to the community board. Share resource updates, service projects, events, questions, and local wins so the site feels active and people-centered.",
      attachments: [],
      likedBy: [],
      comments: [
        {
          id: "comment-seed-1",
          authorName: "TSA Demo Member",
          text: "This is a strong place to show judges how the community side would work with verified moderation.",
          createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
  ];
}

function writePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getCommunityPosts() {
  const posts = readPosts();
  writePosts(posts);
  return posts;
}

export function createCommunityPost({ user, text, category, attachments }) {
  const posts = getCommunityPosts();
  const post = {
    id: `post-${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    authorHandle: user.handle,
    authorRole: user.role,
    avatarGradient: user.avatarGradient,
    avatarImage: user.avatarImage || "",
    accentColor: user.accentColor || "#1D9E75",
    category,
    text: text.trim(),
    attachments,
    likedBy: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  writePosts([post, ...posts]);
  return post;
}

export function toggleCommunityLike(postId, userId) {
  const posts = getCommunityPosts().map(post => {
    if (post.id !== postId) return post;
    const liked = post.likedBy.includes(userId);
    return {
      ...post,
      likedBy: liked ? post.likedBy.filter(id => id !== userId) : [...post.likedBy, userId],
    };
  });
  writePosts(posts);
  return posts;
}

export function addCommunityComment(postId, user, text) {
  const posts = getCommunityPosts().map(post => {
    if (post.id !== postId) return post;
    return {
      ...post,
      comments: [
        ...post.comments,
        {
          id: `comment-${Date.now()}`,
          authorName: user.name,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    };
  });
  writePosts(posts);
  return posts;
}

export function resetCommunityDemo() {
  localStorage.removeItem(POSTS_KEY);
  return getCommunityPosts();
}

export async function filesToAttachments(files) {
  const selectedFiles = Array.from(files).slice(0, 4);
  return Promise.all(selectedFiles.map(file => new Promise((resolve, reject) => {
    if (file.size > 2.5 * 1024 * 1024) {
      reject(new Error(`${file.name} is larger than the 2.5 MB demo upload limit.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "file";

      resolve({
        id: `attachment-${Date.now()}-${file.name}`,
        name: file.name,
        type,
        mime: file.type || "application/octet-stream",
        url: reader.result,
      });
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  })));
}
