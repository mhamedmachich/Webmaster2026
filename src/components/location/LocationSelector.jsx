import { LOCAL_PROFILES, STATE_OPTIONS } from "../../data";
import { getStateFromZip } from "../../data/location/locationLookup";
import { ZIP_LOOKUP_DISCLAIMER } from "../../data/location/zipToState";

export default function LocationSelector({ value, onChange, resultCount = 0, resultLabel = "matching resources" }) {
  const update = (patch) => onChange({ ...value, ...patch });

  const updateZip = (zip) => {
    const resolvedState = getStateFromZip(zip);
    update({
      zip,
      stateAbbr: resolvedState || value.stateAbbr,
      localProfileId: "",
    });
  };

  const updateLocalProfile = (profileId) => {
    const profile = LOCAL_PROFILES.find(item => item.id === profileId);
    update({
      localProfileId: profileId,
      stateAbbr: profile?.stateAbbr || value.stateAbbr,
      zip: profileId ? "" : value.zip,
    });
  };

  const coverage = value.localProfileId
    ? "National + state + local"
    : value.stateAbbr
      ? "National + state"
      : value.includeNational
        ? "National"
        : "Choose a state or local profile";

  return (
    <section className="location-selector" aria-label="Choose resource coverage">
      <div>
        <span className="section-kicker">Location Coverage</span>
        <h2>Choose national, state, or local results.</h2>
        <p>National resources work across the U.S. State profiles are scaffolded for expansion. Local profiles appear only where verified or sample local data exists.</p>
      </div>

      <div className="location-selector__controls">
        <label>
          ZIP code
          <input
            value={value.zip}
            onChange={event => updateZip(event.target.value)}
            inputMode="numeric"
            placeholder="Example: 19709"
          />
        </label>

        <label>
          State
          <select value={value.stateAbbr} onChange={event => update({ stateAbbr:event.target.value, zip:"", localProfileId:"" })}>
            <option value="">National only</option>
            {STATE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <label>
          Local profile
          <select value={value.localProfileId} onChange={event => updateLocalProfile(event.target.value)}>
            <option value="">No local profile</option>
            {LOCAL_PROFILES.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
          </select>
        </label>

        <label className="location-selector__check">
          <input
            type="checkbox"
            checked={value.includeNational}
            onChange={event => update({ includeNational:event.target.checked })}
          />
          Include national resources
        </label>
      </div>

      <div className="location-selector__meta">
        <strong>{coverage}</strong>
        <span>{resultCount} {resultLabel}</span>
        <small>{ZIP_LOOKUP_DISCLAIMER}</small>
      </div>
    </section>
  );
}
