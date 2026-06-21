import { useMemo, useState } from "react";
import { C } from "../data/colors";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";
import {
  addCommunityComment,
  createCommunityPost,
  filesToAttachments,
  getCommunityPosts,
  resetCommunityDemo,
  toggleCommunityLike,
} from "../utils/communityStore";
import { updateLocalProfile } from "../utils/accountStore";

const PROMPTS = [
  { icon:"message", title:"Ask a local question", text:"Need a resource, volunteer partner, or event idea? Post it to the board." },
  { icon:"calendar", title:"Share an update", text:"Promote a workshop, service drive, club project, or school opportunity." },
  { icon:"check", title:"Verify a resource", text:"Add context, dates, photos, or notes that help others trust what they find." },
];

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Avatar({ user, size = 46 }) {
  return (
    <div
      className="community-avatar"
      style={{
        width:size,
        height:size,
        background:user.avatarGradient || "linear-gradient(135deg, #0B1F3A, #1D9E75)",
      }}
      aria-hidden="true"
    >
      {user.name?.slice(0, 1) || "C"}
    </div>
  );
}

function AttachmentPreview({ attachment }) {
  if (attachment.type === "image") {
    return <img src={attachment.url} alt={attachment.name} className="community-attachment community-attachment--image" />;
  }

  if (attachment.type === "video") {
    return <video src={attachment.url} controls className="community-attachment community-attachment--video" />;
  }

  return (
    <a href={attachment.url} download={attachment.name} className="community-attachment-file">
      <VisualIcon name="grant" size={18} />
      {attachment.name}
    </a>
  );
}

export default function CommunityPage({ currentUser, setCurrentUser, nav, toast_ }) {
  const [posts, setPosts] = useState(() => getCommunityPosts());
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState("Resource Tip");
  const [attachments, setAttachments] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(currentUser || {});
  const profileInterestsValue = Array.isArray(profileDraft.interests)
    ? profileDraft.interests.join(", ")
    : profileDraft.interests || "";

  const members = useMemo(() => [
    currentUser,
    {
      id:"sample-organizer",
      name:"Maya R.",
      role:"Youth Program Organizer",
      location:"New Castle County",
      interests:["Youth Programs", "Events"],
      avatarGradient:"linear-gradient(135deg, #534AB7, #378ADD)",
    },
    {
      id:"sample-volunteer",
      name:"Jordan K.",
      role:"Volunteer Lead",
      location:"Middletown",
      interests:["Volunteering", "Food Assistance"],
      avatarGradient:"linear-gradient(135deg, #EF9F27, #D85A30)",
    },
  ].filter(Boolean), [currentUser]);

  const handleFiles = async (event) => {
    try {
      const nextAttachments = await filesToAttachments(event.target.files);
      setAttachments(nextAttachments);
      if (nextAttachments.length) toast_(`${nextAttachments.length} attachment${nextAttachments.length > 1 ? "s" : ""} ready.`, C.teal);
    } catch (error) {
      toast_(error.message, C.coral);
    }
  };

  const submitPost = (event) => {
    event.preventDefault();
    if (!currentUser) {
      nav("auth");
      return;
    }
    if (!postText.trim() && attachments.length === 0) {
      toast_("Add text or an attachment before posting.", C.coral);
      return;
    }

    createCommunityPost({ user:currentUser, text:postText || "Shared a community update.", category, attachments });
    setPosts(getCommunityPosts());
    setPostText("");
    setAttachments([]);
    toast_("Post shared with the community board.", C.teal);
  };

  const like = (postId) => {
    if (!currentUser) return nav("auth");
    setPosts(toggleCommunityLike(postId, currentUser.id));
  };

  const comment = (postId) => {
    const text = commentText[postId];
    if (!currentUser) return nav("auth");
    if (!text?.trim()) return;
    setPosts(addCommunityComment(postId, currentUser, text));
    setCommentText(prev => ({ ...prev, [postId]:"" }));
  };

  const saveProfile = () => {
    const updated = updateLocalProfile({
      ...currentUser,
      ...profileDraft,
      interests: String(profileDraft.interests || "")
        .split(",")
        .map(interest => interest.trim())
        .filter(Boolean),
    });
    setCurrentUser(updated);
    setProfileDraft(updated);
    setEditingProfile(false);
    toast_("Profile updated.", C.teal);
  };

  return (
    <div className="community-page" style={{ animation:"fadeIn 0.3s ease" }}>
      <section className="community-hero">
        <div className="community-hero__content">
          <div>
            <div className="premium-eyebrow">
              <VisualIcon name="users" size={15} />
              Community Network
            </div>
            <h1>Profiles, posts, and local knowledge in one civic feed.</h1>
            <p>
              A moderated community layer where members can share resource updates, event media,
              service wins, and questions that help others find a clearer next step.
            </p>
            <div className="premium-actions">
              <button className="premium-button premium-button--primary" onClick={() => currentUser ? document.getElementById("community-composer")?.focus() : nav("auth")}>
                {currentUser ? "Create a post" : "Create an account"}
              </button>
              <button className="premium-button premium-button--ghost" onClick={() => nav("resources")}>Explore resources</button>
            </div>
          </div>

          <div className="community-signal-panel">
            <span className="community-signal-panel__pulse" />
            <strong>Live community demo</strong>
            <p>{posts.length} post{posts.length === 1 ? "" : "s"} · {members.length} profile{members.length === 1 ? "" : "s"} · media-ready board</p>
            <div className="community-signal-panel__grid">
              {PROMPTS.map(prompt => (
                <div key={prompt.title}>
                  <VisualIcon name={prompt.icon} size={20} />
                  <span>{prompt.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell community-layout">
        <aside className="community-sidebar">
          <div className="community-profile-card">
            {currentUser ? (
              <>
                <Avatar user={currentUser} size={64} />
                <h2>{currentUser.name}</h2>
                <p>{currentUser.role} · {currentUser.location}</p>
                <div className="community-interest-list">
                  {currentUser.interests?.map(interest => <span key={interest}>{interest}</span>)}
                </div>
                <button className="premium-button premium-button--teal" onClick={() => setEditingProfile(true)} style={{ width:"100%", marginTop:16 }}>Edit profile</button>
              </>
            ) : (
              <>
                <IconTile name="users" color={C.teal} />
                <h2>Join the board</h2>
                <p>Create a profile to post, comment, like updates, and save your identity for the demo.</p>
                <button className="premium-button premium-button--teal" onClick={() => nav("auth")} style={{ width:"100%", marginTop:16 }}>Sign up or log in</button>
              </>
            )}
          </div>

          <div className="community-member-card">
            <div className="section-kicker">Profiles</div>
            {members.map(member => (
              <div className="community-member-row" key={member.id}>
                <Avatar user={member} size={38} />
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="community-reset"
            onClick={() => {
              setPosts(resetCommunityDemo());
              toast_("Community demo feed reset.", C.g500);
            }}
          >
            Reset demo feed
          </button>
        </aside>

        <main className="community-feed">
          {editingProfile && currentUser && (
            <div className="community-editor">
              <h2>Edit profile</h2>
              <div className="community-editor__grid">
                <label>Name<input value={profileDraft.name || ""} onChange={event => setProfileDraft(prev => ({ ...prev, name:event.target.value }))} /></label>
                <label>Role<input value={profileDraft.role || ""} onChange={event => setProfileDraft(prev => ({ ...prev, role:event.target.value }))} /></label>
                <label>Location<input value={profileDraft.location || ""} onChange={event => setProfileDraft(prev => ({ ...prev, location:event.target.value }))} /></label>
                <label>Interests<input value={profileInterestsValue} onChange={event => setProfileDraft(prev => ({ ...prev, interests:event.target.value }))} /></label>
              </div>
              <label>Bio<textarea value={profileDraft.bio || ""} onChange={event => setProfileDraft(prev => ({ ...prev, bio:event.target.value }))} rows={3} /></label>
              <div className="community-editor__actions">
                <button className="premium-button premium-button--teal" onClick={saveProfile}>Save profile</button>
                <button className="premium-button" onClick={() => setEditingProfile(false)} style={{ background:"#fff", border:"1px solid rgba(15,31,58,0.12)" }}>Cancel</button>
              </div>
            </div>
          )}

          <form className="community-composer" onSubmit={submitPost}>
            <div className="community-composer__top">
              {currentUser ? <Avatar user={currentUser} /> : <IconTile name="users" color={C.teal} tileSize={46} size={22} />}
              <div>
                <strong>{currentUser ? `Posting as ${currentUser.name}` : "Sign in to post"}</strong>
                <span>Share text, photos, videos, PDFs, flyers, and local updates.</span>
              </div>
            </div>
            <textarea
              id="community-composer"
              value={postText}
              onChange={event => setPostText(event.target.value)}
              placeholder="Share a resource update, service project recap, question, or opportunity..."
              rows={5}
            />
            <div className="community-composer__tools">
              <select value={category} onChange={event => setCategory(event.target.value)}>
                <option>Resource Tip</option>
                <option>Volunteer Opportunity</option>
                <option>Event Update</option>
                <option>Student Support</option>
                <option>Community Question</option>
              </select>
              <label className="community-upload">
                <VisualIcon name="grant" size={16} />
                Add media
                <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" onChange={handleFiles} />
              </label>
              <button className="premium-button premium-button--teal" type="submit">Post update</button>
            </div>
            {attachments.length > 0 && (
              <div className="community-attachment-preview">
                {attachments.map(attachment => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
              </div>
            )}
          </form>

          <div className="community-prompt-grid">
            {PROMPTS.map(prompt => (
              <button key={prompt.title} onClick={() => setPostText(`${prompt.title}: `)}>
                <VisualIcon name={prompt.icon} size={22} />
                <strong>{prompt.title}</strong>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          <div className="community-posts">
            {posts.map(post => {
              const liked = currentUser && post.likedBy.includes(currentUser.id);
              return (
                <article className="community-post" key={post.id}>
                  <div className="community-post__header">
                    <Avatar user={{ name:post.authorName, avatarGradient:post.avatarGradient }} />
                    <div>
                      <strong>{post.authorName}</strong>
                      <span>{post.authorRole} · {timeAgo(post.createdAt)}</span>
                    </div>
                    <span className="status-badge">{post.category}</span>
                  </div>
                  <p>{post.text}</p>
                  {post.attachments.length > 0 && (
                    <div className="community-post__attachments">
                      {post.attachments.map(attachment => <AttachmentPreview key={attachment.id} attachment={attachment} />)}
                    </div>
                  )}
                  <div className="community-post__actions">
                    <button onClick={() => like(post.id)} className={liked ? "is-active" : ""}>
                      <VisualIcon name="hands" size={17} />
                      {post.likedBy.length} helpful
                    </button>
                    <button onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}>
                      <VisualIcon name="message" size={17} />
                      {post.comments.length} comments
                    </button>
                  </div>
                  <div className="community-comments">
                    {post.comments.map(commentItem => (
                      <div key={commentItem.id}>
                        <strong>{commentItem.authorName}</strong>
                        <span>{commentItem.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="community-comment-box">
                    <input
                      id={`comment-${post.id}`}
                      value={commentText[post.id] || ""}
                      onChange={event => setCommentText(prev => ({ ...prev, [post.id]:event.target.value }))}
                      placeholder={currentUser ? "Add a helpful comment..." : "Sign in to comment"}
                    />
                    <button className="premium-button premium-button--teal" onClick={() => comment(post.id)}>Comment</button>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </section>
    </div>
  );
}
