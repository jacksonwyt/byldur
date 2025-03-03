/**
 * Empty analytics hook - No longer used
 * This is a temporary placeholder while all analytics references are being removed
 */
export const useAnalytics = () => {
  // Return empty mock functions to prevent errors
  return {
    trackPageView: () => {},
    trackEvent: () => {},
    trackCustomEvent: () => {},
    trackFeatureUsage: () => {},
    trackEditorEvent: () => {},
    trackComponentAdded: () => {},
    trackStyleChanged: () => {},
    trackEditorOpened: () => {},
    trackProjectPublished: () => {},
    trackProjectUnpublished: () => {},
    trackProjectDeleted: () => {},
    trackProjectDuplicated: () => {},
    trackProjectDeployed: () => {},
    trackContentSaved: () => {},
    trackTiming: () => {},
    trackError: () => {}
  };
};

export default useAnalytics; 