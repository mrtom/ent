// Code generated by github.com/lolopinto/ent/ent, DO NOT EDIT.

package action

import (
	"context"

	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/actions"
	"github.com/lolopinto/ent/ent/test_schema/models"
	"github.com/lolopinto/ent/ent/test_schema/models/configs"
	"github.com/lolopinto/ent/ent/viewer"
)

type AddFriendsAction struct {
	builder *actions.EntMutationBuilder
	user    models.User
}

// AddFriendsFromContext is the factory method to get an ...
func AddFriendsFromContext(ctx context.Context, user *models.User) *AddFriendsAction {
	v, err := viewer.ForContext(ctx)
	if err != nil {
		panic("tried to perform mutation without a viewer")
	}
	return AddFriends(v, user)
}

// AddFriends is the factory method to get an ...
func AddFriends(viewer viewer.ViewerContext, user *models.User) *AddFriendsAction {
	return &AddFriendsAction{
		builder: &actions.EntMutationBuilder{
			Viewer:         viewer,
			EntConfig:      &configs.UserConfig{},
			Operation:      ent.EditOperation,
			ExistingEntity: user,
		},
	}
}

func (action *AddFriendsAction) GetViewer() viewer.ViewerContext {
	return action.builder.GetViewer()
}

func (action *AddFriendsAction) GetChangeset() (ent.Changeset, error) {
	return action.builder.GetChangeset(action.Entity())
}

func (action *AddFriendsAction) Entity() ent.Entity {
	return &action.user
}

// AddUser adds an instance of User to the Friends edge while editing the User ent
func (action *AddFriendsAction) AddUser(user *models.User) *AddFriendsAction {
	action.builder.AddOutboundEdge(models.UserToFriendsEdge, user.ID, models.UserType)
	return action
}

// AddUser adds an instance of UserId to the Friends edge while editing the User ent
func (action *AddFriendsAction) AddUserID(userID string) *AddFriendsAction {
	action.builder.AddOutboundEdge(models.UserToFriendsEdge, userID, models.UserType)
	return action
}

// getFieldMap returns the fields that could be edited in this mutation
func (action *AddFriendsAction) getFieldMap() ent.ActionFieldMap {
	return ent.ActionFieldMap{}
}

func (action *AddFriendsAction) Validate() error {
	return action.builder.ValidateFieldMap(action.getFieldMap())
}

// Save is the method called to execute this action and save change
func (action *AddFriendsAction) Save() (*models.User, error) {
	err := actions.Save(action)
	return &action.user, err
}

var _ actions.Action = &AddFriendsAction{}
