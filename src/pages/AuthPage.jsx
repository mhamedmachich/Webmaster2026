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
        if (apiError.status) throw apiError;
        usedLocalFallback = true;
        user = mode === "signup"
          ? await signupLocalAccount(form)
          : await loginLocalAccount(form);
      }

      onAuth(user);
      toast_(
        usedLocalFallback
          ? "Signed in with local demo storage. Start the API for secured server auth."
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
    <div className="auth-page" style={{ animation:"fadeIn 0.3s ease" }}>
      <section className="auth-hero">
        <div className="auth-card">
          <div className="auth-card__visual">
            <div className="premium-eyebrow">
              <VisualIcon name="users" size={15} />
              Secure Member Access
            </div>
            <h1>Sign in to build your community profile.</h1>
            <p>
              The frontend account system works locally for the TSA demo. The included backend
              scaffold is designed for hardened API auth, protected cookies, validation, and email.
            </p>
            <div className="auth-proof-grid">
              {[
                ["Protected API Ready", "Server validates requests with Zod, rate limits, and secure headers."],
                ["Private Demo Mode", "No third-party keys are exposed in the browser."],
                ["Community Tools", "Profiles, posts, likes, comments, and media previews are available now."],
              ].map(([title, text]) => (
                <div key={title}>
                  <VisualIcon name="check" size={18} />
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="auth-form" onSubmit={submit}>
            <div className="auth-switch" role="tablist" aria-label="Account mode">
              <button type="button" className={mode === "signup" ? "is-active" : ""} onClick={() => setMode("signup")}>Create account</button>
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
              <input value={form.password} onChange={event => update("password", event.target.value)} type="password" placeholder="At least 8 characters recommended" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
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

            <button className="premium-button premium-button--teal" disabled={busy} style={{ width:"100%" }}>
              {busy ? "Working..." : mode === "signup" ? "Create profile" : "Log in"}
            </button>

            <button type="button" className="auth-secondary-action" onClick={() => nav("community")}>
              Continue to community page
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
