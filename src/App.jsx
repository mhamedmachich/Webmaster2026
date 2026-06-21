import { useEffect, useRef, useState } from "react";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Toast from "./components/layout/Toast";
import ActionPlan from "./components/features/ActionPlan";
import { C } from "./data/colors";
import { RESOURCES } from "./data/resources";
import AIPage from "./pages/AIPage";
import AuthPage from "./pages/AuthPage";
import ClubsPage from "./pages/ClubsPage";
import CommunityPage from "./pages/CommunityPage";
import EventsPage from "./pages/EventsPage";
import FundingPage from "./pages/FundingPage";
import HomePage from "./pages/HomePage";
import ResourcesPage from "./pages/ResourcesPage";
import StudentsPage from "./pages/StudentsPage";
import TSAPage from "./pages/TSAPage";
import VolunteeringPage from "./pages/VolunteeringPage";
import { logoutApi } from "./utils/authApi";
import { getSessionUser, logoutLocalAccount } from "./utils/accountStore";

export default function App() {
  const [page, setPage] = useState("home");
  const [filters, setFilters] = useState({ cat:"All categories", audience:"Everyone", cost:"Any cost", urgency:"Any timing", format:"Any format", language:"Any language", openNow:false, accessibility:false, transit:false, savedOnly:false });
  const [savedIds, setSavedIds] = useState(new Set());
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [appliedRoles, setAppliedRoles] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [resourceSearch, setResourceSearch] = useState("");
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getSessionUser());
  const topRef = useRef(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials:"include" })
      .then(response => response.ok ? response.json() : null)
      .then(body => {
        if (body?.user) setCurrentUser(body.user);
      })
      .catch(() => null);
  }, []);

  const nav = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior:"smooth" });
  };

  const quickHelp = ({ category, urgency }) => {
    setFilters(prev => ({
      ...prev,
      cat: category || "All categories",
      urgency: urgency || "Any timing",
      audience: "Everyone",
      cost: "Any cost",
      format: "Any format",
      language: "Any language",
      savedOnly: false,
    }));
    setResourceSearch("");
    nav("resources");
  };

  const toast_ = (msg, color=C.teal) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      toast_(n.has(id) ? "Resource saved!" : "Resource removed", n.has(id) ? C.teal : C.g500);
      return n;
    });
  };

  const logout = async () => {
    await logoutApi();
    logoutLocalAccount();
    setCurrentUser(null);
    toast_("Signed out.", C.g500);
    nav("home");
  };

  const filteredResources = RESOURCES.filter(r => {
    if (filters.cat !== "All categories" && r.category !== filters.cat) return false;
    if (filters.audience !== "Everyone" && !r.audience.includes(filters.audience)) return false;
    if (filters.cost !== "Any cost" && r.cost !== filters.cost) return false;
    if (filters.urgency !== "Any timing" && r.urgency !== filters.urgency) return false;
    if (filters.format !== "Any format" && !r.format.includes(filters.format.split("/")[0])) return false;
    if (filters.language !== "Any language" && !r.language.includes(filters.language)) return false;
    if (filters.openNow && !r.hoursVerified) return false;
    if (filters.accessibility && !(r.transit || r.format.includes("Phone") || r.format.includes("Online"))) return false;
    if (filters.transit && !r.transit) return false;
    if (filters.savedOnly && !savedIds.has(r.id)) return false;
    if (resourceSearch && !r.title.toLowerCase().includes(resourceSearch.toLowerCase()) && !r.desc.toLowerCase().includes(resourceSearch.toLowerCase()) && !r.category.toLowerCase().includes(resourceSearch.toLowerCase())) return false;
    return true;
  });

  const savedResources = RESOURCES.filter(resource => savedIds.has(resource.id));
  const actionCount = savedIds.size + registeredEvents.size + appliedRoles.size;

  const activePage = () => {
    if (page === "resources") {
      return (
        <ResourcesPage
          filters={filters}
          setFilters={setFilters}
          filteredResources={filteredResources}
          savedIds={savedIds}
          toggleSave={toggleSave}
          resourceSearch={resourceSearch}
          setResourceSearch={setResourceSearch}
          quickHelp={quickHelp}
        />
      );
    }
    if (page === "students") return <StudentsPage nav={nav} />;
    if (page === "clubs") return <ClubsPage toast_={toast_} />;
    if (page === "volunteering") return <VolunteeringPage appliedRoles={appliedRoles} setAppliedRoles={setAppliedRoles} toast_={toast_} />;
    if (page === "funding") return <FundingPage nav={nav} toast_={toast_} />;
    if (page === "events") return <EventsPage registeredEvents={registeredEvents} setRegisteredEvents={setRegisteredEvents} toast_={toast_} currentUser={currentUser} />;
    if (page === "community") return <CommunityPage currentUser={currentUser} setCurrentUser={setCurrentUser} nav={nav} toast_={toast_} />;
    if (page === "auth") return <AuthPage nav={nav} toast_={toast_} onAuth={(user) => { setCurrentUser(user); nav("community"); }} />;
    if (page === "tsa") return <TSAPage />;
    if (page === "ai") return <AIPage />;
    return <HomePage nav={nav} quickHelp={quickHelp} toggleSave={toggleSave} savedIds={savedIds} actionCount={actionCount} setResourceSearch={setResourceSearch} />;
  };

  return (
    <div ref={topRef} className={accessibilityMode ? "access-mode" : ""} style={{ fontFamily:"'Inter',-apple-system,sans-serif", minHeight:"100vh", background:C.g50 }}>
      <Navbar
        page={page}
        nav={nav}
        accessibilityMode={accessibilityMode}
        onToggleAccessibility={() => {
          setAccessibilityMode(v => !v);
          toast_(!accessibilityMode ? "Readability mode enabled" : "Readability mode disabled", !accessibilityMode ? C.teal : C.g500);
        }}
        currentUser={currentUser}
        onLogout={logout}
      />
      {activePage()}
      <ActionPlan savedResources={savedResources} registeredEvents={registeredEvents} appliedRoles={appliedRoles} nav={nav} />
      <Footer nav={nav} />
      <Toast toast={toast} />
    </div>
  );
}
