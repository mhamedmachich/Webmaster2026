import { useState } from "react";
import { C } from "../data/colors";
import VisualIcon from "../components/ui/VisualIcon";
import { authenticateWithApi } from "../utils/authApi";
import { loginLocalAccount, signupLocalAccount } from "../utils/accountStore";

const INTERESTS = ["Resources", "Volunteering", "Events", "Student Support", "Funding", "Clubs"];

export default function AuthPage({ onAuth, nav, toast_ }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Community Member",
    location: "Middletown, Delaware",
    interests: ["Resources", "Events"],
  });
  const [busy, setBusy] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      if (!form.email || !form.password || (mode === "signup" && !form.name)) {
        throw new Error("Complete the required fields first.");
      }
      if (mode === "signup" && form.password.length < 8) {
        throw new Error("Use at least 8 characters for the password.");
      }

      let user;
      let usedLocalFallback = false;

      try {
        user = await authenticateWithApi(mode, form);
      } catch (apiError) {
        if (apiError.status && !apiError.recoverable) throw apiError;
        usedLocalFallback = true;
        user = mode === "signup"
          ? await signupLocalAccount(form)
          : await loginLocalAccount(form);
      }

      onAuth(user);
      toast_(
        usedLocalFallback
          ? "Signed in offline. Start the API for shared community accounts."
          : mode === "signup" ? "Account created through the secure API." : "Signed in through the secure API.",
        C.teal
      );
    } catch (error) {
      toast_(error.message || "Could not complete sign in.", C.coral);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-standalone">
      <div className="auth-standalone__bg" aria-hidden="true" />
      <div className="auth-standalone__grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className="auth-topbar">
        <button className="auth-brand-lockup" onClick={() => nav("home")} aria-label="Back to Community Compass home">
          <img src="/brand/community-compass-logo.png" alt="" />
          <span>
            <strong>Community Compass</strong>
            <small>Secure community workspace</small>
          </span>
        </button>
        <div className="auth-topbar__actions">
          <button onClick={() => nav("community")}>Community</button>
          <button onClick={() => nav("home")}>Back to site</button>
        </div>
      </header>

      <section className="auth-stage" aria-label="Community Compass login and signup">
        <div className="auth-story">
          <div className="premium-eyebrow auth-eyebrow">
            <VisualIcon name="users" size={15} />
            Member Access
          </div>
          <h1>Step into your community command center.</h1>
          <p>
            Create a profile, join the community board, share updates, save opportunities,
            and keep your local action plan connected across Community Compass.
          </p>

          <div className="auth-scene-card">
            <img src="/brand/community-login-scene.jpg" alt="Illustrated community neighborhood with people working together" />
            <div className="auth-scene-card__shine" />
            <div className="auth-floating-note auth-floating-note--one">
              <VisualIcon name="check" size={16} />
              <span>Verified community posts</span>
            </div>
            <div className="auth-floating-note auth-floating-note--two">
              <VisualIcon name="message" size={16} />
              <span>Profiles, comments, media</span>
            </div>
            <div className="auth-floating-note auth-floating-note--three">
              <VisualIcon name="wrench" size={16} />
              <span>API-ready security</span>
            </div>
          </div>

          <div className="auth-trust-strip">
            {[
              ["HTTP-only cookies", "Backend session option"],
              ["Rate-limited API", "Brute-force protection"],
              ["Local fallback", "TSA demo continuity"],
            ].map(([title, text]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <form className="auth-pro-panel" onSubmit={submit}>
          <div className="auth-panel-orbit" aria-hidden="true">
            <img src="/brand/community-compass-logo.png" alt="" />
          </div>

          <div className="auth-panel-heading">
            <span>{mode === "signup" ? "Create account" : "Welcome back"}</span>
            <h2>{mode === "signup" ? "Build your member profile." : "Log in to continue."}</h2>
            <p>{mode === "signup" ? "Use this professional account surface for the community feed demo." : "Access your profile, posts, and saved community activity."}</p>
          </div>

          <div className="auth-switch" role="tablist" aria-label="Account mode">
            <button type="button" className={mode === "signup" ? "is-active" : ""} onClick={() => setMode("signup")}>Sign up</button>
            <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => setMode("login")}>Log in</button>
          </div>

          {mode === "signup" && (
            <>
              <label>
                Display name
                <input value={form.name} onChange={event => update("name", event.target.value)} placeholder="Your name" autoComplete="name" />
              </label>
              <div className="auth-form__row">
                <label>
                  Role
                  <select value={form.role} onChange={event => update("role", event.target.value)}>
                    <option>Community Member</option>
                    <option>Student</option>
                    <option>Volunteer</option>
                    <option>Organizer</option>
                    <option>Parent / Guardian</option>
                  </select>
                </label>
                <label>
                  Location
                  <input value={form.location} onChange={event => update("location", event.target.value)} placeholder="City, State" />
                </label>
              </div>
            </>
          )}

          <label>
            Email
            <input value={form.email} onChange={event => update("email", event.target.value)} type="email" placeholder="you@example.com" autoComplete="email" />
          </label>
          <label>
            Password
            <input value={form.password} onChange={event => update("password", event.target.value)} type="password" placeholder="At least 8 characters" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </label>

          {mode === "signup" && (
            <div>
              <div className="auth-form__legend">Profile interests</div>
              <div className="auth-interest-grid">
                {INTERESTS.map(interest => (
                  <button
                    type="button"
                    key={interest}
                    className={form.interests.includes(interest) ? "is-active" : ""}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="premium-button premium-button--teal auth-submit" disabled={busy}>
            {busy ? "Securing session..." : mode === "signup" ? "Create secure profile" : "Log in securely"}
          </button>

          <button type="button" className="auth-secondary-action" onClick={() => nav("community")}>
            View community page instead
          </button>
        </form>
      </section>
    </main>
  );
}
