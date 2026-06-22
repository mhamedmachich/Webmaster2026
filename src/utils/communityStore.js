const POSTS_KEY = "community-compass-posts-v1";
const ACTIVITY_KEY = "community-compass-activity-index-v1";

const COMMUNITY_MEMBERS = [
  {
    id: "maya-resources",
    name: "Maya R.",
    handle: "mayaresources",
    role: "Youth Program Organizer",
    avatarImage: "/avatars/avatar-2.svg",
    avatarGradient: "linear-gradient(135deg, #534AB7, #378ADD)",
    accentColor: "#378ADD",
    verified: true,
  },
  {
    id: "jordan-shares",
    name: "Jordan K.",
    handle: "jordanshares",
    role: "Volunteer Lead",
    avatarImage: "/avatars/avatar-3.svg",
    avatarGradient: "linear-gradient(135deg, #EF9F27, #D85A30)",
    accentColor: "#EF9F27",
    verified: true,
  },
  {
    id: "elena-care",
    name: "Elena M.",
    handle: "elenacares",
    role: "Family Resource Navigator",
    avatarImage: "/avatars/avatar-1.svg",
    avatarGradient: "linear-gradient(135deg, #0B1F3A, #1D9E75)",
    accentColor: "#1D9E75",
    verified: true,
  },
  {
    id: "sam-students",
    name: "Sam T.",
    handle: "samstudents",
    role: "Student Volunteer",
    avatarImage: "/avatars/avatar-default.svg",
    avatarGradient: "linear-gradient(135deg, #3B6D11, #5DCAA5)",
    accentColor: "#5DCAA5",
    verified: false,
  },
];

const ACTIVITY_COMMENTS = [
  "This is helpful. I shared it with our student service group.",
  "Thanks for posting this. The official link makes it easier to verify.",
  "Adding this to our resource list for families this week.",
  "I can help with outreach if more volunteers are needed.",
  "Good reminder to check hours before sending people over.",
  "This would pair well with the next community resource night.",
];

const SEED_POSTS = [
  {
    id: "seed-food-drive",
    authorId: "maya-resources",
    authorName: "Maya R.",
    authorHandle: "mayaresources",
    authorRole: "Youth Program Organizer",
    avatarImage: "/avatars/avatar-2.svg",
    avatarGradient: "linear-gradient(135deg, #534AB7, #378ADD)",
    accentColor: "#378ADD",
    verified: true,
    category: "Resource update",
    text: "Updated the food support list with SNAP, WIC, 211, and the food bank locator so families have national and local starting points in one place.",
    attachments: [],
    likedBy: ["elena-care", "sam-students", "jordan-shares"],
    comments: [
      {
        id: "comment-food-1",
        authorName: "Elena M.",
        verified: true,
        text: "This gives families a clear path without guessing which office to call first.",
        createdAt: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 49).toISOString(),
  },
  {
    id: "seed-volunteer",
    authorId: "jordan-shares",
    authorName: "Jordan K.",
    authorHandle: "jordanshares",
    authorRole: "Volunteer Lead",
    avatarImage: "/avatars/avatar-3.svg",
    avatarGradient: "linear-gradient(135deg, #EF9F27, #D85A30)",
    accentColor: "#EF9F27",
    verified: true,
    category: "Volunteer win",
    text: "Three new volunteers signed up for sorting and delivery support. Next step is matching roles by availability and transportation.",
    attachments: [],
    likedBy: ["maya-resources", "sam-students"],
    comments: [
      {
        id: "comment-volunteer-1",
        authorName: "Sam T.",
        verified: false,
        text: "I can cover Saturday morning if that helps.",
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 63).toISOString(),
  },
  {
    id: "seed-students",
    authorId: "elena-care",
    authorName: "Elena M.",
    authorHandle: "elenacares",
    authorRole: "Family Resource Navigator",
    avatarImage: "/avatars/avatar-1.svg",
    avatarGradient: "linear-gradient(135deg, #0B1F3A, #1D9E75)",
    accentColor: "#1D9E75",
    verified: true,
    category: "Student support",
    text: "For college planning questions, I recommend starting with FAFSA, College Scorecard, and verified school counselor resources before looking at private scholarship lists.",
    attachments: [],
    likedBy: ["maya-resources", "jordan-shares", "sam-students"],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 86).toISOString(),
  },
];

function readPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) {
      const posts = JSON.parse(raw);
      const hasOldSeed = posts.some(post => post.id === "seed-1" || String(post.text || "").toLowerCase().includes("demo"));
      return hasOldSeed ? SEED_POSTS : posts;
    }
  } catch {
    return [];
  }

  return SEED_POSTS;
}

function writePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getCommunityPosts() {
  const posts = readPosts();
  writePosts(posts);
  return posts;
}

export function cacheCommunityPosts(posts) {
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

export function advanceCommunityActivity() {
  const posts = getCommunityPosts();
  if (!posts.length) return { posts, activity: null };

  const index = Number(localStorage.getItem(ACTIVITY_KEY) || "0");
  const postIndex = index % posts.length;
  const member = COMMUNITY_MEMBERS[index % COMMUNITY_MEMBERS.length];
  const commentText = ACTIVITY_COMMENTS[index % ACTIVITY_COMMENTS.length];
  const shouldComment = index % 3 === 1;

  const nextPosts = posts.map((post, currentIndex) => {
    if (currentIndex !== postIndex) return post;

    if (shouldComment) {
      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: `activity-comment-${Date.now()}-${index}`,
            authorName: member.name,
            verified: member.verified,
            text: commentText,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (post.likedBy.includes(member.id)) return post;
    return {
      ...post,
      likedBy: [...post.likedBy, member.id],
    };
  });

  localStorage.setItem(ACTIVITY_KEY, String(index + 1));
  writePosts(nextPosts);

  return {
    posts: nextPosts,
    activity: {
      id: `activity-${Date.now()}-${index}`,
      name: member.name,
      action: shouldComment ? "commented on" : "liked",
      title: posts[postIndex].category,
    },
  };
}

export function resetCommunityFeed() {
  localStorage.removeItem(POSTS_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
  return getCommunityPosts();
}

export async function filesToAttachments(files) {
  const selectedFiles = Array.from(files).slice(0, 4);
  return Promise.all(selectedFiles.map(file => new Promise((resolve, reject) => {
    if (file.size > 2.5 * 1024 * 1024) {
      reject(new Error(`${file.name} is larger than the 2.5 MB upload limit.`));
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
