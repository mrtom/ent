// Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

package models

import (
	"context"
	"sync"

	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/cast"
	"github.com/lolopinto/ent/ent/viewer"

	"github.com/lolopinto/ent/ent/test_schema/models/configs"
)

const (
	// ContactType is the node type for the Contact object. Used to identify this node in edges and other places.
	ContactType ent.NodeType = "contact"

	// ContactToAllowListEdge is the edgeType for the contact to allowlist edge.
	ContactToAllowListEdge ent.EdgeType = "f6ecacb9-1d4f-47bb-8f18-f7d544450ea2"
)

// Contact represents the `Contact` model
type Contact struct {
	ent.Node
	EmailAddress string `db:"email_address"`
	FirstName    string `db:"first_name"`
	LastName     string `db:"last_name"`
	UserID       string `db:"user_id"`
	Viewer       viewer.ViewerContext
}

// ContactResult stores the result of loading a Contact. It's a tuple type which has 2 fields:
// a Contact and an error
type ContactResult struct {
	Contact *Contact
	Error   error
}

// ContactsResult stores the result of loading a slice of Contacts. It's a tuple type which has 2 fields:
// a []*Contact and an error
type ContactsResult struct {
	Contacts []*Contact
	Error    error
}

// IsNode is needed by gqlgen to indicate that this implements the Node interface in GraphQL
func (contact Contact) IsNode() {}

// GetType returns the NodeType of this entity. In this case: ContactType
func (contact *Contact) GetType() ent.NodeType {
	return ContactType
}

// GetViewer returns the viewer for this entity.
func (contact *Contact) GetViewer() viewer.ViewerContext {
	return contact.Viewer
}

// GetPrivacyPolicy returns the PrivacyPolicy of this entity.
func (contact *Contact) GetPrivacyPolicy() ent.PrivacyPolicy {
	return ContactPrivacyPolicy{
		Contact: contact,
	}
}

// LoadContactFromContext loads the given Contact given the context and id
func LoadContactFromContext(ctx context.Context, id string) (*Contact, error) {
	v, err := viewer.ForContext(ctx)
	if err != nil {
		return nil, err
	}
	return LoadContact(v, id)
}

// LoadContact loads the given Contact given the viewer and id
func LoadContact(viewer viewer.ViewerContext, id string) (*Contact, error) {
	var contact Contact
	err := ent.LoadNode(viewer, id, &contact, &configs.ContactConfig{})
	return &contact, err
}

// GenLoadContact loads the given Contact given the id
func GenLoadContact(viewer viewer.ViewerContext, id string, result *ContactResult, wg *sync.WaitGroup) {
	defer wg.Done()
	var contact Contact
	chanErr := make(chan error)
	go ent.GenLoadNode(viewer, id, &contact, &configs.ContactConfig{}, chanErr)
	err := <-chanErr
	result.Contact = &contact
	result.Error = err
}

// LoadAllowListEdges returns the User edges associated with the Contact instance
func (contact *Contact) LoadAllowListEdges() ([]*ent.Edge, error) {
	return ent.LoadEdgesByType(contact.ID, ContactToAllowListEdge)
}

// GenAllowListEdges returns the User edges associated with the Contact instance
func (contact *Contact) GenAllowListEdges(result *ent.EdgesResult, wg *sync.WaitGroup) {
	defer wg.Done()
	edgesResultChan := make(chan ent.EdgesResult)
	go ent.GenLoadEdgesByType(contact.ID, ContactToAllowListEdge, edgesResultChan)
	*result = <-edgesResultChan
}

// LoadAllowListEdgeFor loads the ent.Edge between the current node and the given id2 for the AllowList edge.
func (contact *Contact) LoadAllowListEdgeFor(id2 string) (*ent.Edge, error) {
	return ent.LoadEdgeByType(contact.ID, id2, ContactToAllowListEdge)
}

// GenAllowListEdgeFor provides a concurrent API to load the ent.Edge between the current node and the given id2 for the AllowList edge.
func (contact *Contact) GenLoadAllowListEdgeFor(id2 string, result *ent.EdgeResult, wg *sync.WaitGroup) {
	defer wg.Done()
	edgeResultChan := make(chan ent.EdgeResult)
	go ent.GenLoadEdgeByType(contact.ID, id2, ContactToAllowListEdge, edgeResultChan)
	*result = <-edgeResultChan
}

// GenAllowList returns the Users associated with the Contact instance
func (contact *Contact) GenAllowList(result *UsersResult, wg *sync.WaitGroup) {
	defer wg.Done()
	var users []*User
	chanErr := make(chan error)
	go ent.GenLoadNodesByType(contact.Viewer, contact.ID, ContactToAllowListEdge, &users, &configs.UserConfig{}, chanErr)
	err := <-chanErr
	result.Users = users
	result.Error = err
}

// LoadAllowList returns the Users associated with the Contact instance
func (contact *Contact) LoadAllowList() ([]*User, error) {
	var users []*User
	err := ent.LoadNodesByType(contact.Viewer, contact.ID, ContactToAllowListEdge, &users, &configs.UserConfig{})
	return users, err
}

// DBFields is used by the ent framework to load the ent from the underlying database
func (contact *Contact) DBFields() ent.DBFields {
	return ent.DBFields{
		"id": func(v interface{}) error {
			var err error
			contact.ID, err = cast.ToUUIDString(v)
			return err
		},
		"email_address": func(v interface{}) error {
			var err error
			contact.EmailAddress, err = cast.ToString(v)
			return err
		},
		"first_name": func(v interface{}) error {
			var err error
			contact.FirstName, err = cast.ToString(v)
			return err
		},
		"last_name": func(v interface{}) error {
			var err error
			contact.LastName, err = cast.ToString(v)
			return err
		},
		"user_id": func(v interface{}) error {
			var err error
			contact.UserID, err = cast.ToString(v)
			return err
		},
	}
}

var _ ent.Entity = &Contact{}
