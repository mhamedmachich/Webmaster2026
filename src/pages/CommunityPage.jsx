import { useEffect, useMemo, useState } from "react";
import { C } from "../data/colors";
import VisualIcon from "../components/ui/VisualIcon";
import {
  addCommunityComment,
  advanceCommunityActivity,
  cacheCommunityPosts,
  createCommunityPost,
  filesToAttachments,
  getCommunityPosts,
  resetCommunityFeed,
  toggleCommunityLike,
} from "../utils/communityStore";
import { updateLocalProfile } from "../utils/accountStore";
import { verifyLocalAccount } from "../utils/accountStore";
import { commentApiPost, createApiPost, getApiPosts, likeApiPost, updateApiProfile, verifyApiEmail } from "../utils/communityApi";
import { isApiUnavailable } from "../utils/apiClient";

const POST_TYPES = ["Resource update", "Volunteer win", "Event recap", "Question", "Student support"];
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #0B1F3A, #1D9E75)",
  "linear-gradient(135deg, #534AB7, #378ADD)",
  "linear-gradient(135deg, #EF9F27, #D85A30)",
  "linear-gradient(135deg, #3B6D11, #5DCAA5)",
  "linear-gradient(135deg, #993556, #EF9F27)",
];
const BANNER_GRADIENTS = [
  "linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
  "linear-gradient(135deg, #071A31, #378ADD 60%, #5DCAA5)",
  "linear-gradient(135deg, #122840, #534AB7 55%, #EF9F27)",
  "linear-gradient(135deg, #073B31, #1D9E75 55%, #E1F5EE)",
];
const ACCENTS = ["#1D9E75", "#378ADD", "#534AB7", "#EF9F27", "#D85A30"];
const AVATAR_PRESETS = ["/avatars/avatar-1.svg", "/avatars/avatar-2.svg", "/avatars/avatar-3.svg", "/avatars/avatar-default.svg"];
const MEMBER_BASELINE = 326;

function normalizeHandle(value, fallback = "member") {
  const handle = String(value || fallback).toLowerCase().replace(/[^a-z0-9_]+/g, "").slice(0, 20);
  return handle || fallback;
}

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function getProfile(user) {
  if (!user) return null;
  return {
    handle: user.handle || normalizeHandle(user.name || user.email),
    website: user.website || "",
    bannerGradient: user.bannerGradient || "linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
    bannerImage: user.bannerImage || "",
    avatarImage: user.avatarImage || "",
    avatarGradient: user.avatarGradient || "linear-gradient(135deg, #0B1F3A, #1D9E75)",
    accentColor: user.accentColor || C.teal,
    bio: user.bio || "Exploring local resources and community opportunities.",
    interests: user.interests || ["Resources", "Events", "Volunteering"],
    ...user,
  };
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!file.type.startsWith("image/")) return reject(new Error("Choose an image file."));
    if (file.size > 2.5 * 1024 * 1024) return reject(new Error("Profile images must be under 2.5 MB."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
}

function Avatar({ user, size = 48 }) {
  const profile = getProfile(user) || {};
  return (
    <div
      className="social-avatar"
      style={{
        width:size,
        height:size,
        background:profile.avatarImage ? `url(${profile.avatarImage}) center / cover` : profile.avatarGradient,
      }}
      aria-hidden="true"
    >
      {!profile.avatarImage && (profile.name?.slice(0, 1) || "C")}
    </div>
  );
}

function AttachmentPreview({ attachment }) {
  if (attachment.type === "image") return <img src={attachment.url} alt={attachment.name} className="social-attachment" />;
  if (attachment.type === "video") return <video src={attachment.url} controls className="social-attachment" />;
  return (
    <a href={attachment.url} download={attachment.name} className="social-file">
      <VisualIcon name="grant" size={18} />
      {attachment.name}
    </a>
  );
}

export default function CommunityPage({ currentUser, setCurrentUser, nav, toast_ }) {
  const currentProfile = getProfile(currentUser);
  const [posts, setPosts] = useState(() => getCommunityPosts());
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState("Resource update");
  const [attachments, setAttachments] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(() => currentProfile || {});
  const [apiLive, setApiLive] = useState(false);
  const [activityPulse, setActivityPulse] = useState(null);
  const [memberCount, setMemberCount] = useState(MEMBER_BASELINE);

  const members = useMemo(() => [
    currentProfile,
    {
      id:"sample-organizer",
      name:"Maya R.",
      handle:"mayaresources",
      role:"Youth Program Organizer",
      location:"New Castle County",
      bio:"Youth workshops, tutoring partnerships, and resource referrals.",
      interests:["Youth Programs", "Events"],
      avatarImage:"/avatars/avatar-2.svg",
      avatarGradient:"linear-gradient(135deg, #534AB7, #378ADD)",
      bannerGradient:"linear-gradient(135deg, #534AB7, #378ADD)",
      accentColor:"#378ADD",
    },
    {
      id:"sample-volunteer",
      name:"Jordan K.",
      handle:"jordanshares",
      role:"Volunteer Lead",
      location:"Middletown",
      bio:"Organizing service roles and community support drives.",
      interests:["Volunteering", "Food Assistance"],
      avatarImage:"/avatars/avatar-3.svg",
      avatarGradient:"linear-gradient(135deg, #EF9F27, #D85A30)",
      bannerGradient:"linear-gradient(135deg, #EF9F27, #D85A30)",
      accentColor:"#EF9F27",
    },
    {
      id:"sample-navigator",
      name:"Elena M.",
      handle:"elenacares",
      role:"Family Resource Navigator",
      location:"Delaware",
      bio:"Helping families compare official resources, benefit portals, and local referrals.",
      interests:["Food Assistance", "Housing", "Student Support"],
      avatarImage:"/avatars/avatar-1.svg",
      avatarGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)",
      bannerGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)",
      accentColor:"#1D9E75",
    },
    {
      id:"sample-student",
      name:"Sam T.",
      handle:"samstudents",
      role:"Student Volunteer",
      location:"Middletown",
      bio:"Sharing service hours, school support, and volunteer updates.",
      interests:["Students", "Volunteering"],
      avatarImage:"/avatars/avatar-default.svg",
      avatarGradient:"linear-gradient(135deg, #3B6D11, #5DCAA5)",
      bannerGradient:"linear-gradient(135deg, #3B6D11, #5DCAA5)",
      accentColor:"#5DCAA5",
    },
  ].filter(Boolean), [currentProfile]);

  useEffect(() => {
    let active = true;
    const loadPosts = async () => {
      try {
        const apiPosts = await getApiPosts();
        if (!active) return;
        setApiLive(true);
        setPosts(cacheCommunityPosts(apiPosts));
      } catch (error) {
        if (!active) return;
        setApiLive(false);
        if (isApiUnavailable(error)) setPosts(getCommunityPosts());
      }
    };
    loadPosts();
    const timer = setInterval(loadPosts, 7000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (apiLive) return undefined;
    const timer = setInterval(() => {
      const next = advanceCommunityActivity();
      setPosts(next.posts);
      if (next.activity) setActivityPulse(next.activity);
      setMemberCount(count => {
        const nextCount = count + (Math.random() > 0.45 ? 1 : -1);
        return Math.min(349, Math.max(318, nextCount));
      });
    }, 5200);
    return () => clearInterval(timer);
  }, [apiLive]);

  const openEditor = () => {
    if (!currentProfile) return nav("auth");
    setProfileDraft(currentProfile);
    setEditingProfile(true);
  };

  const handleFiles = async (event) => {
    try {
      const nextAttachments = await filesToAttachments(event.target.files);
      setAttachments(nextAttachments);
      if (nextAttachments.length) toast_(`${nextAttachments.length} media item${nextAttachments.length > 1 ? "s" : ""} ready.`, C.teal);
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const submitPost = async (event) => {
    event.preventDefault();
    if (!currentProfile) return nav("auth");
    if (!postText.trim() && attachments.length === 0) return toast_("Add text or media before posting.", C.coral);
    const payload = { text:postText || "Shared a community update.", category, attachments };
    try {
      if (apiLive) {
        try {
          await createApiPost(payload);
          setPosts(cacheCommunityPosts(await getApiPosts()));
        } catch (apiError) {
          if (!isApiUnavailable(apiError)) throw apiError;
          setApiLive(false);
          createCommunityPost({ user:currentProfile, ...payload });
          setPosts(getCommunityPosts());
        }
      } else {
        createCommunityPost({ user:currentProfile, ...payload });
        setPosts(getCommunityPosts());
      }
      setPostText("");
      setAttachments([]);
      toast_("Post published to the community feed.", C.teal);
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const like = async (postId) => {
    if (!currentProfile) return nav("auth");
    try {
      if (apiLive) {
        try {
          await likeApiPost(postId);
          setPosts(cacheCommunityPosts(await getApiPosts()));
        } catch (apiError) {
          if (!isApiUnavailable(apiError)) throw apiError;
          setApiLive(false);
          setPosts(toggleCommunityLike(postId, currentProfile.id));
        }
      } else {
        setPosts(toggleCommunityLike(postId, currentProfile.id));
      }
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const comment = async (postId) => {
    const text = commentText[postId];
    if (!currentProfile) return nav("auth");
    if (!text?.trim()) return;
    try {
      if (apiLive) {
        try {
          await commentApiPost(postId, text);
          setPosts(cacheCommunityPosts(await getApiPosts()));
        } catch (apiError) {
          if (!isApiUnavailable(apiError)) throw apiError;
          setApiLive(false);
          setPosts(addCommunityComment(postId, currentProfile, text));
        }
      } else {
        setPosts(addCommunityComment(postId, currentProfile, text));
      }
      setCommentText(prev => ({ ...prev, [postId]:"" }));
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const updateProfileImage = async (field, file) => {
    try {
      const image = await readImage(file);
      setProfileDraft(prev => ({ ...prev, [field]:image }));
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const saveProfile = async () => {
    const nextProfile = {
      ...currentProfile,
      ...profileDraft,
      handle: normalizeHandle(profileDraft.handle, normalizeHandle(profileDraft.name || currentProfile.email)),
      interests: String(profileDraft.interests || "")
        .split(",")
        .map(interest => interest.trim())
        .filter(Boolean),
    };
    try {
      let updated;
      if (apiLive) {
        try {
          updated = await updateApiProfile(nextProfile);
        } catch (apiError) {
          if (!isApiUnavailable(apiError)) throw apiError;
          setApiLive(false);
          updated = updateLocalProfile(nextProfile);
        }
      } else {
        updated = updateLocalProfile(nextProfile);
      }
      setCurrentUser(updated);
      setProfileDraft(getProfile(updated));
      setEditingProfile(false);
      toast_("Profile customization saved.", C.teal);
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const verifyEmail = async () => {
    if (!currentProfile) return nav("auth");
    try {
      let updated;
      if (apiLive) {
        try {
          updated = await verifyApiEmail();
        } catch (apiError) {
          if (!isApiUnavailable(apiError)) throw apiError;
          setApiLive(false);
          updated = verifyLocalAccount(currentProfile.id) || updateLocalProfile({ ...currentProfile, emailVerified:true, verified:true });
        }
      } else {
        updated = verifyLocalAccount(currentProfile.id) || updateLocalProfile({ ...currentProfile, emailVerified:true, verified:true });
      }
      setCurrentUser(updated);
      toast_("Email verified. Badge unlocked.", C.blue);
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  return (
    <div className="social-page" style={{ "--social-accent":currentProfile?.accentColor || C.teal }}>
      <section className="social-shell">
        <aside className="social-left-rail">
          <button className="social-brand-pill" onClick={() => nav("home")}>
            <img src="/brand/community-compass-logo.png" alt="" />
            <span>Community</span>
          </button>

          {[
            ["Home", "home", "compass"],
            ["Resources", "resources", "search"],
            ["Community", "community", "message"],
            ["Events", "events", "calendar"],
            ["Guide", "ai", "guide"],
          ].map(([label, page, icon]) => (
            <button key={page} className={`social-nav-pill ${page === "community" ? "is-active" : ""}`} onClick={() => nav(page)}>
              <VisualIcon name={icon} size={22} />
              <span>{label}</span>
            </button>
          ))}

          <button className="social-post-button" onClick={() => currentProfile ? document.getElementById("social-composer")?.focus() : nav("auth")}>Post</button>

          {currentProfile ? (
            <button className="social-mini-profile" onClick={openEditor}>
              <Avatar user={currentProfile} size={42} />
              <span>
                <strong>{currentProfile.name}</strong>
                <small>@{currentProfile.handle}</small>
              </span>
            </button>
          ) : (
            <button className="social-post-button social-post-button--ghost" onClick={() => nav("auth")}>Create account</button>
          )}
        </aside>

        <main className="social-feed-column">
          <header className="social-feed-header">
            <div>
              <strong>Community</strong>
              <span>{memberCount} active members / {posts.length} community updates</span>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span className={`social-live-pill ${apiLive ? "is-live" : ""}`}>{apiLive ? "API connected" : "Ready"}</span>
              <button onClick={openEditor}>{currentProfile ? "Customize profile" : "Sign up"}</button>
            </div>
          </header>

          {activityPulse && (
            <div className="social-activity-pulse" key={activityPulse.id}>
              <span />
              <strong>{activityPulse.name}</strong>
              <small>{activityPulse.action} a {activityPulse.title.toLowerCase()} post</small>
            </div>
          )}

          <nav className="social-feed-tabs" aria-label="Community feed filters">
            <button className="is-active">For you</button>
            <button>Following</button>
            <button>Local updates</button>
          </nav>

          <div className="social-story-strip" aria-label="Community quick topics">
            {[
              ["Resources", "search"],
              ["Events", "calendar"],
              ["Volunteers", "hands"],
              ["Students", "education"],
              ["Questions", "message"],
            ].map(([label, icon]) => (
              <button key={label} onClick={() => setPostText(`${label}: `)}>
                <span><VisualIcon name={icon} size={20} /></span>
                {label}
              </button>
            ))}
          </div>

          <form className="social-composer" onSubmit={submitPost}>
            {currentProfile ? <Avatar user={currentProfile} /> : <Avatar user={{ name:"C", avatarGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)" }} />}
            <div>
              <textarea
                id="social-composer"
                value={postText}
                onChange={event => setPostText(event.target.value)}
                placeholder={currentProfile ? "What is happening in your community?" : "Sign in to post, comment, and customize your profile."}
                rows={3}
              />
              {attachments.length > 0 && (
                <div className="social-attachment-grid">
                  {attachments.map(attachment => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                </div>
              )}
              <div className="social-composer__tools">
                <select value={category} onChange={event => setCategory(event.target.value)}>
                  {POST_TYPES.map(prompt => <option key={prompt}>{prompt}</option>)}
                </select>
                <label>
                  <VisualIcon name="grant" size={17} />
                  Media
                  <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleFiles} />
                </label>
                <button type="submit">{currentProfile ? "Post" : "Sign in"}</button>
              </div>
            </div>
          </form>

          {editingProfile && currentProfile && (
            <section className="social-editor">
              <div className="social-editor__top">
                <h2>Customize profile</h2>
                <button onClick={() => setEditingProfile(false)}>Close</button>
              </div>
              <div className="social-editor-preview">
                <div className="social-editor-preview__banner" style={{ background:profileDraft.bannerImage ? `url(${profileDraft.bannerImage}) center / cover` : profileDraft.bannerGradient }} />
                <Avatar user={profileDraft} size={76} />
              </div>
              <div className="social-editor__grid">
                <label>Name<input value={profileDraft.name || ""} onChange={event => setProfileDraft(prev => ({ ...prev, name:event.target.value }))} /></label>
                <label>Handle<input value={profileDraft.handle || ""} onChange={event => setProfileDraft(prev => ({ ...prev, handle:event.target.value }))} /></label>
                <label>Role<input value={profileDraft.role || ""} onChange={event => setProfileDraft(prev => ({ ...prev, role:event.target.value }))} /></label>
                <label>Location<input value={profileDraft.location || ""} onChange={event => setProfileDraft(prev => ({ ...prev, location:event.target.value }))} /></label>
                <label>Website<input value={profileDraft.website || ""} onChange={event => setProfileDraft(prev => ({ ...prev, website:event.target.value }))} placeholder="https://..." /></label>
                <label>Interests<input value={Array.isArray(profileDraft.interests) ? profileDraft.interests.join(", ") : profileDraft.interests || ""} onChange={event => setProfileDraft(prev => ({ ...prev, interests:event.target.value }))} /></label>
              </div>
              <label>Bio<textarea value={profileDraft.bio || ""} onChange={event => setProfileDraft(prev => ({ ...prev, bio:event.target.value }))} rows={3} maxLength={180} /></label>
              <div className="social-customizer-row">
                <div>
                  <strong>Avatar style</strong>
                  <div className="social-avatar-preset-row">
                    {AVATAR_PRESETS.map(avatar => (
                      <button key={avatar} onClick={() => setProfileDraft(prev => ({ ...prev, avatarImage:avatar }))} aria-label="Choose avatar preset">
                        <img src={avatar} alt="" />
                      </button>
                    ))}
                  </div>
                  <div className="social-swatch-row">
                    {AVATAR_GRADIENTS.map(gradient => <button key={gradient} style={{ background:gradient }} onClick={() => setProfileDraft(prev => ({ ...prev, avatarGradient:gradient, avatarImage:"" }))} aria-label="Choose avatar gradient" />)}
                  </div>
                  <label className="social-upload-chip">Upload avatar<input type="file" accept="image/*" onChange={event => updateProfileImage("avatarImage", event.target.files?.[0])} /></label>
                </div>
                <div>
                  <strong>Banner style</strong>
                  <div className="social-banner-swatch-row">
                    {BANNER_GRADIENTS.map(gradient => <button key={gradient} style={{ background:gradient }} onClick={() => setProfileDraft(prev => ({ ...prev, bannerGradient:gradient, bannerImage:"" }))} aria-label="Choose banner gradient" />)}
                  </div>
                  <label className="social-upload-chip">Upload banner<input type="file" accept="image/*" onChange={event => updateProfileImage("bannerImage", event.target.files?.[0])} /></label>
                </div>
                <div>
                  <strong>Accent</strong>
                  <div className="social-swatch-row">
                    {ACCENTS.map(color => <button key={color} style={{ background:color }} onClick={() => setProfileDraft(prev => ({ ...prev, accentColor:color }))} aria-label="Choose accent color" />)}
                  </div>
                </div>
              </div>
              <button className="social-save-profile" onClick={saveProfile}>Save profile</button>
              {currentProfile && !currentProfile.emailVerified && <button className="social-verify-button" onClick={verifyEmail}>Verify email for badge</button>}
            </section>
          )}

          <div className="social-posts">
            {posts.map(post => {
              const liked = currentProfile && post.likedBy.includes(currentProfile.id);
              const profile = {
                name:post.authorName,
                handle:post.authorHandle || normalizeHandle(post.authorName),
                role:post.authorRole,
                avatarGradient:post.avatarGradient,
                avatarImage:post.avatarImage,
                accentColor:post.accentColor,
                verified:post.verified,
              };
              return (
                <article className="social-post" key={post.id} style={{ "--post-accent":post.accentColor || C.teal }}>
                  <Avatar user={profile} />
                  <div className="social-post__body">
                    <div className="social-post__meta">
                      <strong>{post.authorName}</strong>
                      {post.verified && <img src="/avatars/verified-badge.svg" alt="Verified" className="verified-badge" />}
                      <span>@{profile.handle}</span>
                      <span>/</span>
                      <span>{timeAgo(post.createdAt)}</span>
                      <small>{post.category}</small>
                    </div>
                    <p>{post.text}</p>
                    {post.attachments.length > 0 && (
                      <div className="social-attachment-grid">
                        {post.attachments.map(attachment => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                      </div>
                    )}
                    <div className="social-post__actions">
                      <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}><VisualIcon name="message" size={17} />{post.comments.length}</button>
                      <button onClick={() => like(post.id)} className={liked ? "is-active" : ""}><VisualIcon name="hands" size={17} />{post.likedBy.length}</button>
                      <button onClick={() => setPostText(`Re: ${post.authorName} - `)}><VisualIcon name="link" size={17} />Share</button>
                    </div>
                    {post.comments.length > 0 && (
                      <div className="social-comments">
                        {post.comments.map(commentItem => (
                          <div key={commentItem.id}>
                            <strong>{commentItem.authorName}{commentItem.verified ? " verified" : ""}</strong>
                            <span>{commentItem.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="social-comment-box">
                      <input id={`comment-${post.id}`} value={commentText[post.id] || ""} onChange={event => setCommentText(prev => ({ ...prev, [post.id]:event.target.value }))} placeholder={currentProfile ? "Post your reply" : "Sign in to reply"} />
                      <button onClick={() => comment(post.id)}>Reply</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <aside className="social-right-rail">
          <div className="social-search-box">
            <VisualIcon name="search" size={18} />
            <span>Search Community Compass</span>
          </div>

          <section className="social-account-card">
            <div
              className="social-account-card__banner"
              style={{
                background:currentProfile?.bannerImage
                  ? `linear-gradient(180deg, transparent, rgba(4, 19, 38, 0.24)), url(${currentProfile.bannerImage}) center / cover`
                  : currentProfile?.bannerGradient || "linear-gradient(135deg, #0B1F3A, #1D9E75 58%, #EF9F27)",
              }}
            />
            <div className="social-account-card__body">
              {currentProfile ? <Avatar user={currentProfile} size={70} /> : <Avatar user={{ name:"C", avatarGradient:"linear-gradient(135deg, #0B1F3A, #1D9E75)" }} size={70} />}
              <h2>{currentProfile?.name || "Join Community Compass"}</h2>
              <span>@{currentProfile?.handle || "communitycompass"} {currentProfile?.emailVerified ? "verified" : ""}</span>
              <p>{currentProfile?.bio || "Create a profile to post updates, follow local topics, and customize your community presence."}</p>
              <div className="social-account-actions">
                <button onClick={openEditor}>{currentProfile ? "Edit profile" : "Create account"}</button>
                {currentProfile && !currentProfile.emailVerified && <button onClick={verifyEmail}>Verify</button>}
              </div>
            </div>
          </section>

          <section className="social-widget">
            <div className="social-presence-card">
              <div>
                <strong>{memberCount}</strong>
                <span>active members</span>
              </div>
              <div>
                <strong>{posts.reduce((total, post) => total + post.likedBy.length, 0)}</strong>
                <span>reactions</span>
              </div>
              <div>
                <strong>{posts.reduce((total, post) => total + post.comments.length, 0)}</strong>
                <span>comments</span>
              </div>
            </div>
          </section>

          <section className="social-widget">
            <h2>What's happening</h2>
            {[
              ["Volunteer Opportunity", "Food drive sorting roles opened this week"],
              ["Resource Update", "Library study rooms and youth programs added"],
              ["Event", "Resume workshop registration is nearly full"],
            ].map(([label, title]) => (
              <button key={title} onClick={() => setPostText(`${label}: ${title}`)}>
                <span>{label}</span>
                <strong>{title}</strong>
              </button>
            ))}
          </section>

          <section className="social-widget">
            <h2>Who to follow</h2>
            {members.map(member => (
              <div className="social-follow-row" key={member.id}>
                <Avatar user={member} size={40} />
                <div>
                  <strong>{member.name}</strong>
                  <span>@{member.handle}</span>
                </div>
                <button onClick={() => toast_("Follow saved.", C.teal)}>Follow</button>
              </div>
            ))}
          </section>

          <button className="social-reset-feed" onClick={() => { setPosts(resetCommunityFeed()); toast_("Feed reset.", C.g500); }}>
            Reset feed
          </button>
        </aside>
      </section>
    </div>
  );
}

