// Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

package models

import (
	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/privacy"
	"github.com/lolopinto/ent/ent/viewer"
)

// EventPrivacyPolicy is the privacy policy for the Event ent which helps decides if it's
// visible to the viewer
type EventPrivacyPolicy struct {
	Event *Event
}

// Rules is the list of rules that decides the visibility of the Event ent to the viewer
func (policy EventPrivacyPolicy) Rules() []ent.PrivacyPolicyRule {
	return []ent.PrivacyPolicyRule{
		privacy.AllowIfOmniscientRule{},
		// BEGIN MANUAL SECTION: Add custom privacy rules below
		privacy.AllowIfViewerIsOwnerRule{
			OwnerID: policy.Event.UserID,
		},
		privacy.AllowIfViewerOutboundEdgeExistsRule{
			Policy: policy,
			EdgeType: ent.EdgeType(
				// EventToInvitedEdge
				"12a5ac62-1f9a-4fd7-b38f-a6d229ace12c",
			),
		},
		// END MANUAL SECTION of privacy rules
		privacy.AlwaysDenyRule{},
	}
}

// Ent returns the underlying ent whose privacy policy this is.
func (policy EventPrivacyPolicy) Ent() ent.Entity {
	return policy.Event
}

// AllowIfViewerCanSeeEventRule is a reusable rule that can be called by different ents to see if the contact can be visible
type AllowIfViewerCanSeeEventRule struct {
	EventID string
}

// Eval evaluates that the ent is visible to the user
func (rule AllowIfViewerCanSeeEventRule) Eval(viewer viewer.ViewerContext, entity ent.Entity) ent.PrivacyResult {
	_, err := LoadEvent(viewer, rule.EventID)
	if err != nil {
		return ent.Skip()
	}
	return ent.Allow()
}