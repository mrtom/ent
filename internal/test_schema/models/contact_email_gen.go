// Code generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

package models

import (
	"context"
	"sync"

	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/cast"
	"github.com/lolopinto/ent/ent/privacy"
	"github.com/lolopinto/ent/ent/viewer"
	"github.com/lolopinto/ent/internal/test_schema/models/configs"
)

const (
	// ContactEmailType is the node type for the ContactEmail object. Used to identify this node in edges and other places.
	ContactEmailType ent.NodeType = "contactEmail"
)

// ContactEmail represents the `ContactEmail` model
type ContactEmail struct {
	ent.Node
	privacy.AlwaysDenyPrivacyPolicy
	EmailAddress string `db:"email_address"`
	Label        string `db:"label"`
	ContactID    string `db:"contact_id"`
	Viewer       viewer.ViewerContext
}

type ContactEmails map[string]*ContactEmail

// ContactEmailResult stores the result of loading a ContactEmail. It's a tuple type which has 2 fields:
// a ContactEmail and an error
type ContactEmailResult struct {
	ContactEmail *ContactEmail
	Err          error
}

func (res *ContactEmailResult) Error() string {
	return res.Err.Error()
}

// ContactEmailsResult stores the result of loading a slice of ContactEmails. It's a tuple type which has 2 fields:
// a []*ContactEmail and an error
type ContactEmailsResult struct {
	ContactEmails []*ContactEmail
	Err           error
}

func (res *ContactEmailsResult) Error() string {
	return res.Err.Error()
}

// TODO this is going to be used to load a new object
// Rename to UserLoader and NewUserLoader....
type contactEmailLoader struct {
	nodes   map[string]*ContactEmail
	errs    map[string]error
	results []*ContactEmail
	v       viewer.ViewerContext
	m       sync.Mutex
}

func (res *contactEmailLoader) GetNewInstance() ent.DBObject {
	var contactEmail ContactEmail
	contactEmail.Viewer = res.v
	return &contactEmail
}

func (res *contactEmailLoader) GetConfig() ent.Config {
	return &configs.ContactEmailConfig{}
}

func (res *contactEmailLoader) SetPrivacyResult(id string, obj ent.DBObject, err error) {
	res.m.Lock()
	defer res.m.Unlock()
	if err != nil {
		res.errs[id] = err
	} else if obj != nil {
		// TODO kill results?
		ent := obj.(*ContactEmail)
		res.nodes[id] = ent
		res.results = append(res.results, ent)
	}
}

func (res *contactEmailLoader) GetEntForID(id string) *ContactEmail {
	return res.nodes[id]
}

// TODO???
func (res *contactEmailLoader) List() []*ContactEmail {
	return res.results
}

func (res *contactEmailLoader) getFirstInstance() *ContactEmail {
	if len(res.results) == 0 {
		return nil
	}
	return res.results[0]
}

func NewContactEmailLoader(v viewer.ViewerContext) *contactEmailLoader {
	return &contactEmailLoader{
		nodes: make(map[string]*ContactEmail),
		errs:  make(map[string]error),
		v:     v,
	}
}

// IsNode is needed by gqlgen to indicate that this implements the Node interface in GraphQL
func (contactEmail ContactEmail) IsNode() {}

// GetType returns the NodeType of this entity. In this case: ContactType
func (contactEmail *ContactEmail) GetType() ent.NodeType {
	return ContactEmailType
}

// GetViewer returns the viewer for this entity.
func (contactEmail *ContactEmail) GetViewer() viewer.ViewerContext {
	return contactEmail.Viewer
}

// GetConfig returns the config for this entity.
func (contactEmail *ContactEmail) GetConfig() ent.Config {
	return &configs.ContactEmailConfig{}
}

// LoadContactEmailFromContext loads the given ContactEmail given the context and id
func LoadContactEmailFromContext(ctx context.Context, id string) (*ContactEmail, error) {
	v, err := viewer.ForContext(ctx)
	if err != nil {
		return nil, err
	}
	return LoadContactEmail(v, id)
}

// GenLoadContactEmailFromContext loads the given ContactEmail given the context and id
func GenLoadContactEmailFromContext(ctx context.Context, id string) <-chan *ContactEmailResult {
	res := make(chan *ContactEmailResult)
	go func() {
		v, err := viewer.ForContext(ctx)
		if err != nil {
			res <- &ContactEmailResult{
				Err: err,
			}
			return
		}
		res <- <-(GenLoadContactEmail(v, id))
	}()
	return res
}

// LoadContactEmail loads the given ContactEmail given the viewer and id
func LoadContactEmail(v viewer.ViewerContext, id string) (*ContactEmail, error) {
	loader := NewContactEmailLoader(v)
	err := ent.LoadNode(v, id, loader)
	return loader.nodes[id], err
}

// GenLoadContactEmail loads the given ContactEmail given the id
func GenLoadContactEmail(v viewer.ViewerContext, id string) <-chan *ContactEmailResult {
	res := make(chan *ContactEmailResult)
	go func() {
		var result ContactEmailResult
		loader := NewContactEmailLoader(v)
		result.Err = <-ent.GenLoadNode(v, id, loader)
		result.ContactEmail = loader.nodes[id]
		res <- &result
	}()
	return res
}

// LoadContactEmails loads multiple ContactEmails given the ids
func LoadContactEmails(v viewer.ViewerContext, ids ...string) ([]*ContactEmail, error) {
	loader := NewContactEmailLoader(v)
	err := ent.LoadNodes(v, ids, loader)
	return loader.results, err
}

// GenLoadContactEmails loads multiple ContactEmails given the ids
func GenLoadContactEmails(v viewer.ViewerContext, ids ...string) <-chan *ContactEmailsResult {
	res := make(chan *ContactEmailsResult)
	go func() {
		loader := NewContactEmailLoader(v)
		var result ContactEmailsResult
		result.Err = <-ent.GenLoadNodes(v, ids, loader)
		result.ContactEmails = loader.results
		res <- &result
	}()
	return res
}

// GenContact returns the Contact associated with the ContactEmail instance
func (contactEmail *ContactEmail) GenContact() <-chan *ContactResult {
	return GenLoadContact(contactEmail.Viewer, contactEmail.ContactID)
}

// LoadContact returns the Contact associated with the ContactEmail instance
func (contactEmail *ContactEmail) LoadContact() (*Contact, error) {
	return LoadContact(contactEmail.Viewer, contactEmail.ContactID)
}

// DBFields is used by the ent framework to load the ent from the underlying database
func (contactEmail *ContactEmail) DBFields() ent.DBFields {
	return ent.DBFields{
		"id": func(v interface{}) error {
			var err error
			contactEmail.ID, err = cast.ToUUIDString(v)
			return err
		},
		"email_address": func(v interface{}) error {
			var err error
			contactEmail.EmailAddress, err = cast.ToString(v)
			return err
		},
		"label": func(v interface{}) error {
			var err error
			contactEmail.Label, err = cast.ToString(v)
			return err
		},
		"contact_id": func(v interface{}) error {
			var err error
			contactEmail.ContactID, err = cast.ToString(v)
			return err
		},
	}
}

var _ ent.Entity = &ContactEmail{}
