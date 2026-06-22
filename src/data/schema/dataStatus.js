export const DATA_STATUS = {
  VERIFIED: "verified",
  SOURCE_LINKED: "source-linked",
  NEEDS_REVIEW: "needs-review",
  SAMPLE: "sample",
  PLACEHOLDER: "placeholder",
};

export const DATA_STATUS_LABELS = {
  [DATA_STATUS.VERIFIED]: "Verified date",
  [DATA_STATUS.SOURCE_LINKED]: "Source linked",
  [DATA_STATUS.NEEDS_REVIEW]: "Needs review",
  [DATA_STATUS.SAMPLE]: "Sample",
  [DATA_STATUS.PLACEHOLDER]: "Placeholder",
};

export function isReviewNeeded(status) {
  return [DATA_STATUS.NEEDS_REVIEW, DATA_STATUS.SAMPLE, DATA_STATUS.PLACEHOLDER].includes(status);
}
