// Code generated by github.com/lolopinto/ent/ent, DO NOT edit.

package models

import (
	"context"
	"sync"
	"time"

	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/cast"
	"github.com/lolopinto/ent/ent/viewer"

	"github.com/lolopinto/ent/ent/test_schema/models/configs"
)

const (
	// EventType is the node type for the Event object. Used to identify this node in edges and other places.
	EventType ent.NodeType = "event"

	// EventToInvitedEdge is the edgeType for the event to invited edge.
	EventToInvitedEdge ent.EdgeType = "12a5ac62-1f9a-4fd7-b38f-a6d229ace12c"
)

// Event represents the `Event` model
type Event struct {
	ent.Node
	Name      string    `db:"name"`
	UserID    string    `db:"user_id"`
	StartTime time.Time `db:"start_time"`
	EndTime   time.Time `db:"end_time"`
	Location  string    `db:"location"`
	Viewer    viewer.ViewerContext
}

// EventResult stores the result of loading a Event. It's a tuple type which has 2 fields:
// a Event and an error
type EventResult struct {
	Event *Event
	Error error
}

// EventsResult stores the result of loading a slice of Events. It's a tuple type which has 2 fields:
// a []*Event and an error
type EventsResult struct {
	Events []*Event
	Error  error
}

// IsNode is needed by gqlgen to indicate that this implements the Node interface in GraphQL
func (event Event) IsNode() {}

// GetType returns the NodeType of this entity. In this case: ContactType
func (event *Event) GetType() ent.NodeType {
	return EventType
}

// GetViewer returns the viewer for this entity.
func (event *Event) GetViewer() viewer.ViewerContext {
	return event.Viewer
}

// GetPrivacyPolicy returns the PrivacyPolicy of this entity.
func (event *Event) GetPrivacyPolicy() ent.PrivacyPolicy {
	return EventPrivacyPolicy{
		Event: event,
	}
}

// LoadEventFromContext loads the given Event given the context and id
func LoadEventFromContext(ctx context.Context, id string) (*Event, error) {
	v, err := viewer.ForContext(ctx)
	if err != nil {
		return nil, err
	}
	return LoadEvent(v, id)
}

// LoadEvent loads the given Event given the viewer and id
func LoadEvent(viewer viewer.ViewerContext, id string) (*Event, error) {
	var event Event
	err := ent.LoadNode(viewer, id, &event, &configs.EventConfig{})
	return &event, err
}

// GenLoadEvent loads the given Event given the id
func GenLoadEvent(viewer viewer.ViewerContext, id string, result *EventResult, wg *sync.WaitGroup) {
	defer wg.Done()
	var event Event
	chanErr := make(chan error)
	go ent.GenLoadNode(viewer, id, &event, &configs.EventConfig{}, chanErr)
	err := <-chanErr
	result.Event = &event
	result.Error = err
}

// GenUser returns the User associated with the Event instance
func (event *Event) GenUser(result *UserResult, wg *sync.WaitGroup) {
	go GenLoadUser(event.Viewer, event.UserID, result, wg)
}

// LoadUser returns the User associated with the Event instance
func (event *Event) LoadUser() (*User, error) {
	return LoadUser(event.Viewer, event.UserID)
}

// LoadInvitedEdges returns the User edges associated with the Event instance
func (event *Event) LoadInvitedEdges() ([]*ent.Edge, error) {
	return ent.LoadEdgesByType(event.ID, EventToInvitedEdge)
}

// GenInvitedEdges returns the User edges associated with the Event instance
func (event *Event) GenInvitedEdges(result *ent.EdgesResult, wg *sync.WaitGroup) {
	defer wg.Done()
	edgesResultChan := make(chan ent.EdgesResult)
	go ent.GenLoadEdgesByType(event.ID, EventToInvitedEdge, edgesResultChan)
	*result = <-edgesResultChan
}

// LoadInvitedEdgeFor loads the ent.Edge between the current node and the given id2 for the Invited edge.
func (event *Event) LoadInvitedEdgeFor(id2 string) (*ent.Edge, error) {
	return ent.LoadEdgeByType(event.ID, id2, EventToInvitedEdge)
}

// GenInvitedEdgeFor provides a concurrent API to load the ent.Edge between the current node and the given id2 for the Invited edge.
func (event *Event) GenLoadInvitedEdgeFor(id2 string, result *ent.EdgeResult, wg *sync.WaitGroup) {
	defer wg.Done()
	edgeResultChan := make(chan ent.EdgeResult)
	go ent.GenLoadEdgeByType(event.ID, id2, EventToInvitedEdge, edgeResultChan)
	*result = <-edgeResultChan
}

// GenInvited returns the Users associated with the Event instance
func (event *Event) GenInvited(result *UsersResult, wg *sync.WaitGroup) {
	defer wg.Done()
	var users []*User
	chanErr := make(chan error)
	go ent.GenLoadNodesByType(event.Viewer, event.ID, EventToInvitedEdge, &users, &configs.UserConfig{}, chanErr)
	err := <-chanErr
	result.Users = users
	result.Error = err
}

// LoadInvited returns the Users associated with the Event instance
func (event *Event) LoadInvited() ([]*User, error) {
	var users []*User
	err := ent.LoadNodesByType(event.Viewer, event.ID, EventToInvitedEdge, &users, &configs.UserConfig{})
	return users, err
}

// DBFields is used by the ent framework to load the ent from the underlying database
func (event *Event) DBFields() ent.DBFields {
	return ent.DBFields{
		"id": func(v interface{}) error {
			var err error
			event.ID, err = cast.ToUUIDString(v)
			return err
		},
		"name": func(v interface{}) error {
			var err error
			event.Name, err = cast.ToString(v)
			return err
		},
		"user_id": func(v interface{}) error {
			var err error
			event.UserID, err = cast.ToString(v)
			return err
		},
		"start_time": func(v interface{}) error {
			var err error
			event.StartTime, err = cast.ToTime(v)
			return err
		},
		"end_time": func(v interface{}) error {
			var err error
			event.EndTime, err = cast.ToTime(v)
			return err
		},
		"location": func(v interface{}) error {
			var err error
			event.Location, err = cast.ToString(v)
			return err
		},
	}
}

var _ ent.Entity = &Event{}
