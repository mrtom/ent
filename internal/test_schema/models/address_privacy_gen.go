// Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

package models

import (
	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/viewer"
)

// AllowIfViewerCanSeeAddressRule is a reusable rule that can be called by different ents to see if the contact can be visible
type AllowIfViewerCanSeeAddressRule struct {
	AddressID string
}

// Eval evaluates that the ent is visible to the user
func (rule AllowIfViewerCanSeeAddressRule) Eval(v viewer.ViewerContext, entity ent.Entity) ent.PrivacyResult {
	_, err := LoadAddress(v, rule.AddressID)
	if err != nil {
		return ent.Skip()
	}
	return ent.Allow()
}
