// Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

package models

import (
	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/privacy"
	"github.com/lolopinto/ent/ent/viewer"
)

// ContactPrivacyPolicy is the privacy policy for the Contact ent which helps decides if it's
// visible to the viewer
type ContactPrivacyPolicy struct {
	Contact *Contact
}

// Rules is the list of rules that decides the visibility of the Contact ent to the viewer
func (policy ContactPrivacyPolicy) Rules() []ent.PrivacyPolicyRule {
	return []ent.PrivacyPolicyRule{
		privacy.AllowIfOmniscientRule{},
		// BEGIN MANUAL SECTION: Add custom privacy rules below
		privacy.AllowIfViewerIsOwnerRule{OwnerID: policy.Contact.UserID},
		privacy.AllowIfViewerOutboundEdgeExistsRule{
			Policy: policy,
			// stuff like this is why this current model of manual rules doesn't work and why I have to change it
			// this is models.ContactToAllowListEdge
			EdgeType: ent.EdgeType(
				"f6ecacb9-1d4f-47bb-8f18-f7d544450ea2",
			),
		},
		// END MANUAL SECTION of privacy rules
		privacy.AlwaysDenyRule{},
	}
}

// Ent returns the underlying ent whose privacy policy this is.
func (policy ContactPrivacyPolicy) Ent() ent.Entity {
	return policy.Contact
}

// AllowIfViewerCanSeeContactRule is a reusable rule that can be called by different ents to see if the contact can be visible
type AllowIfViewerCanSeeContactRule struct {
	ContactID string
}

// Eval evaluates that the ent is visible to the user
func (rule AllowIfViewerCanSeeContactRule) Eval(viewer viewer.ViewerContext, entity ent.Entity) ent.PrivacyResult {
	_, err := LoadContact(viewer, rule.ContactID)
	if err != nil {
		return ent.Skip()
	}
	return ent.Allow()
}