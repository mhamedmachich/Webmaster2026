function mentions(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function getLocalGuideResponse(message) {
  const text = message.toLowerCase();

  if (mentions(text, ["food", "snap", "hungry", "meal", "pantry"])) {
    return "For food help, start with the Food Bank of Delaware for local distributions, Delaware Health & Social Services for SNAP, and the Resource Finder's food category for nearby pantry-style options.";
  }

  if (mentions(text, ["mental health", "crisis", "therapy", "counselor"])) {
    return "For mental health support, Delaware Guidance Services can help children, teens, and families. Use the Resource Finder's mental health category to compare counseling, youth support, and verified organization links.";
  }

  if (mentions(text, ["housing", "rent", "eviction", "utilities"])) {
    return "For housing, rent, or eviction support, Housing Alliance Delaware is a strong starting resource. For utility bills, review LIHEAP eligibility through Delaware Health & Social Services.";
  }

  if (mentions(text, ["job", "career", "resume", "employment"])) {
    return "For job and career help, Delaware JobLink offers job search tools, employment listings, and career support. Check the Events page for resume workshops and local career sessions.";
  }

  if (mentions(text, ["legal", "lawyer", "attorney", "tenant rights", "eviction notice"])) {
    return "For legal help, start with Legal Aid Society of Delaware for civil legal issues such as housing, benefits, and family law. Use the Resources page to compare format, language, and verification details.";
  }

  if (mentions(text, ["student", "teen", "school", "tutoring"])) {
    return "For student support, visit the Student Hub for tutoring, school supplies, youth programs, and library resources. Appoquinimink Library and local youth programs are strong first places to check.";
  }

  if (mentions(text, ["volunteer"])) {
    return "The Volunteering page lists current roles, urgent openings, hours, and organizations. You can apply directly from each role card and track which roles you have already applied for.";
  }

  if (mentions(text, ["grant", "funding", "scholarship"])) {
    return "The Funding page lists grants, scholarships, deadlines, award amounts, and eligibility notes. Start there, then check the Events page for grant writing help.";
  }

  return "Try searching the Resources page by category, audience, urgency, format, language, or saved resources. If you are unsure where to start, use Need Help Fast or Compass Match to narrow the first step.";
}
