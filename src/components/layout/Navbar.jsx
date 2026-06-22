import { useState } from "react";
import { C } from "../../data/colors";
import VisualIcon from "../ui/VisualIcon";

const NAV_GROUPS = [
  {
    label: "Find Help",
    icon: "search",
    items: [
      { id: "resources", label: "Resources", description: "Search verified services" },
      { id: "students", label: "Students", description: "Student programs and support" },
      { id: "clubs", label: "Clubs", description: "School clubs and organizations" },
    ],
  },
  {
    label: "Get Involved",
    icon: "hands",
    items: [
      { id: "community", label: "Community", description: "Profiles, posts, and updates" },
      { id: "volunteering", label: "Volunteering", description: "Open service roles" },
      { id: "funding", label: "Funding", description: "Grants and scholarships" },
      { id: "events", label: "Events", description: "Community workshops" },
    ],
  },
  {
    label: "Tools",
    icon: "guide",
    items: [
      { id: "ai", label: "Guide", description: "National and local guidance" },
    ],
  },
];

export default function Navbar({ page, nav, accessibilityMode, onToggleAccessibility, currentUser, onLogout }) {
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id) => {
    nav(id);
    setOpenGroup(null);
    setMobileOpen(false);
  };

  const isGroupActive = (group) => group.items.some(item => item.id === page);

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <button onClick={() => go("home")} className="site-nav__brand" aria-label="Go to home page">
          <span className="site-nav__brand-mark">
            <img src="/brand/community-compass-logo.png" alt="" />
          </span>
          <span className="site-nav__brand-copy">
            <span className="site-nav__brand-title">Community Compass</span>
            <span className="site-nav__brand-subtitle">Learning & Support Hub</span>
          </span>
        </button>

        <div className="site-nav__desktop" aria-label="Primary navigation">
          <button
            className={`site-nav__pill ${page === "home" ? "is-active" : ""}`}
            onClick={() => go("home")}
          >
            Home
          </button>
          {NAV_GROUPS.map(group => (
            <div
              key={group.label}
              className="site-nav__group"
              onMouseEnter={() => setOpenGroup(group.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button
                className={`site-nav__pill ${isGroupActive(group) ? "is-active" : ""}`}
                onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                aria-expanded={openGroup === group.label}
              >
                <VisualIcon name={group.icon} size={15} color="currentColor" />
                {group.label}
                <span className="site-nav__chevron">v</span>
              </button>
              <div className={`site-nav__dropdown ${openGroup === group.label ? "is-open" : ""}`}>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={`site-nav__dropdown-item ${page === item.id ? "is-active" : ""}`}
                  >
                    <span>{item.label}</span>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="site-nav__actions">
          {currentUser ? (
            <>
              <button
                onClick={() => go("community")}
                className={`site-nav__account ${page === "community" ? "is-active" : ""}`}
                title={`Signed in as ${currentUser.name}`}
              >
                {currentUser.name.slice(0, 1)}
              </button>
              <button onClick={onLogout} className="site-nav__login site-nav__login--quiet">Sign out</button>
            </>
          ) : (
            <button
              onClick={() => go("auth")}
              className={`site-nav__login ${page === "auth" ? "is-active" : ""}`}
            >
              Login
            </button>
          )}
          <button
            onClick={onToggleAccessibility}
            aria-pressed={accessibilityMode}
            title="Toggle readability mode"
            className={`site-nav__utility ${accessibilityMode ? "is-active" : ""}`}
          >
            AA
          </button>
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="site-nav__menu-button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`site-nav__mobile ${mobileOpen ? "is-open" : ""}`}>
        <button className={`site-nav__mobile-link ${page === "home" ? "is-active" : ""}`} onClick={() => go("home")}>Home</button>
        <button className={`site-nav__mobile-link ${page === "auth" ? "is-active" : ""}`} onClick={() => go("auth")}>{currentUser ? "Account" : "Login"}</button>
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="site-nav__mobile-group">
            <div className="site-nav__mobile-heading">
              <VisualIcon name={group.icon} size={16} color="currentColor" />
              {group.label}
            </div>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`site-nav__mobile-link ${page === item.id ? "is-active" : ""}`}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
        {currentUser && <button className="site-nav__mobile-link" onClick={onLogout}>Sign out</button>}
      </div>
    </nav>
  );
}
