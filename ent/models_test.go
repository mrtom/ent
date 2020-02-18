package ent_test

import (
	"database/sql"

	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"

	"github.com/lolopinto/ent/ent"
	"github.com/lolopinto/ent/ent/cast"
	"github.com/lolopinto/ent/ent/viewer"
	"github.com/lolopinto/ent/ent/viewertesting"
	"github.com/lolopinto/ent/internal/test_schema/models"
	"github.com/lolopinto/ent/internal/test_schema/models/configs"
	"github.com/lolopinto/ent/internal/testingutils"
)

type modelsTestSuite struct {
	testingutils.Suite
}

func (suite *modelsTestSuite) SetupSuite() {
	// TODO make this automatic based on db
	suite.Tables = []string{
		"addresses",
		"users",
		"events",
		"user_events_edges",
	}
	suite.Suite.SetupSuite()
}

func (suite *modelsTestSuite) TestLoadNodeFromParts() {
	user := testingutils.CreateTestUser(suite.T())

	var testCases = []struct {
		parts       []interface{}
		foundResult bool
	}{
		{
			[]interface{}{
				"first_name",
				"Ola",
			},
			true,
		},
		{
			[]interface{}{
				"first_name",
				"Ola",
				"last_name",
				"Okelola",
			},
			true,
		},
		{
			[]interface{}{
				"email_address",
				user.EmailAddress,
				"last_name",
				"Okelola",
			},
			true,
		},
		{
			[]interface{}{
				"email_address",
				"Okelola",
			},
			false,
		},
	}

	for _, tt := range testCases {
		var existingUser models.User
		err := ent.LoadNodeFromParts(&existingUser, &configs.UserConfig{}, tt.parts...)
		if tt.foundResult {
			assert.Nil(suite.T(), err)
			assert.NotZero(suite.T(), existingUser)
		} else {
			assert.NotNil(suite.T(), err)
			assert.Equal(suite.T(), err, sql.ErrNoRows)
			// TODO ugh... it's finally time to change this to return nil...
			// can't do assert.Zero because (user.Bio returns (*string) instead of "")
			assert.Equal(suite.T(), existingUser.ID, "")
		}
	}
}

func (suite *modelsTestSuite) TestLoadNodeFromID() {
	user := testingutils.CreateTestUser(suite.T())

	var testCases = []struct {
		id          string
		foundResult bool
	}{
		{
			user.ID,
			true,
		},
		{
			uuid.New().String(),
			false,
		},
	}

	for _, tt := range testCases {
		var existingUser models.User
		err := ent.LoadNodeRawData(tt.id, &existingUser, &configs.UserConfig{})
		if tt.foundResult {
			assert.Nil(suite.T(), err)
			assert.NotZero(suite.T(), existingUser)
		} else {
			assert.NotNil(suite.T(), err)
			assert.Equal(suite.T(), err, sql.ErrNoRows)
			assert.Zero(suite.T(), existingUser)
		}
	}
}

func (suite *modelsTestSuite) TestGetEdgeInfo() {
	var testCases = []struct {
		edgeType    ent.EdgeType
		foundResult bool
	}{
		{
			models.UserToEventsEdge,
			true,
		},
		{
			ent.EdgeType(uuid.New().String()),
			false,
		},
	}

	for _, tt := range testCases {
		edgeData, err := ent.GetEdgeInfo(tt.edgeType, nil)
		if tt.foundResult {
			assert.Nil(suite.T(), err)
			assert.NotZero(suite.T(), edgeData)
		} else {
			assert.NotNil(suite.T(), err)
			assert.Equal(suite.T(), err, sql.ErrNoRows)
			assert.Zero(suite.T(), *edgeData)
		}
	}
}

func (suite *modelsTestSuite) TestLoadEdgesByType() {
	testLoadEdgesByType(suite, func(id string) ([]*ent.AssocEdge, error) {
		return ent.LoadEdgesByType(id, models.UserToEventsEdge)
	})
}

func (suite *modelsTestSuite) TestGenLoadEdgesByType() {
	testLoadEdgesByType(suite, func(id string) ([]*ent.AssocEdge, error) {
		chanResult := ent.GenLoadEdgesByType(id, models.UserToEventsEdge)
		result := <-chanResult
		return result.Edges, result.Err
	})
}

func (suite *modelsTestSuite) TestGeneratedLoadEdgesByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)
	event2 := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdges(
		suite,
		func() ([]*ent.AssocEdge, error) {
			v := viewertesting.LoggedinViewerContext{ViewerID: user.ID}

			user, err := models.LoadUser(v, user.ID)
			require.NoError(suite.T(), err)
			return user.LoadEventsEdges()
		},
		[]string{
			event.ID,
			event2.ID,
		},
		true,
	)
}

func (suite *modelsTestSuite) TestGeneratedGenLoadEdgesByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)
	event2 := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdges(
		suite,
		func() ([]*ent.AssocEdge, error) {
			v := viewertesting.LoggedinViewerContext{ViewerID: user.ID}
			user, err := models.LoadUser(v, user.ID)
			require.NoError(suite.T(), err)

			result := <-user.GenEventsEdges()
			return result.Edges, result.Err
		},
		[]string{
			event.ID,
			event2.ID,
		},
		true,
	)
}

func testLoadEdgesByType(suite *modelsTestSuite, f func(id string) ([]*ent.AssocEdge, error)) {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)
	event2 := testingutils.CreateTestEvent(suite.T(), user)

	var testCases = []struct {
		id1         string
		foundResult bool
	}{
		{
			user.ID,
			true,
		},
		{
			event.ID,
			false,
		},
		{
			"",
			false,
		},
	}

	for _, tt := range testCases {
		verifyEdges(
			suite,
			func() ([]*ent.AssocEdge, error) {
				return f(tt.id1)
			},
			[]string{event.ID, event2.ID},
			tt.foundResult,
		)
	}
}

func verifyEdges(
	suite *modelsTestSuite,
	f func() ([]*ent.AssocEdge, error),
	expectedIds []string,
	foundResult bool,
) {
	edges, err := f()
	assert.Nil(suite.T(), err)
	if foundResult {
		assert.NotEmpty(suite.T(), edges)

		assert.Len(suite.T(), edges, len(expectedIds))
		for _, edge := range edges {
			assert.NotZero(suite.T(), edge)
			assert.Contains(suite.T(), expectedIds, edge.ID2)
		}
	} else {
		assert.Len(suite.T(), edges, 0)
		assert.Empty(suite.T(), edges)
	}
}

func (suite *modelsTestSuite) TestLoadEdgeByType() {
	testLoadEdgeByType(suite, func(id1, id2 string) (*ent.AssocEdge, error) {
		return ent.LoadEdgeByType(id1, id2, models.UserToEventsEdge)
	})
}

func (suite *modelsTestSuite) TestGenLoadEdgeByType() {
	testLoadEdgeByType(suite, func(id1, id2 string) (*ent.AssocEdge, error) {
		result := <-ent.GenLoadEdgeByType(id1, id2, models.UserToEventsEdge)
		return result.Edge, result.Err
	})
}

func (suite *modelsTestSuite) TestGeneratedLoadEdgeByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdgeByType(
		suite,
		func() (*ent.AssocEdge, error) {
			v := viewertesting.LoggedinViewerContext{ViewerID: user.ID}

			user, err := models.LoadUser(v, user.ID)
			require.NoError(suite.T(), err)
			return user.LoadEventEdgeFor(event.ID)
		},
		user.ID,
		event.ID,
	)
}

func (suite *modelsTestSuite) TestUniqueLoadEdgeByType() {
	testUniqueLoadEdgeByType(suite, func(id1 string) (*ent.AssocEdge, error) {
		return ent.LoadUniqueEdgeByType(id1, models.EventToCreatorEdge)
	})
}

func (suite *modelsTestSuite) TestGenUniqueLoadEdgeByType() {
	testUniqueLoadEdgeByType(suite, func(id1 string) (*ent.AssocEdge, error) {
		result := <-ent.GenLoadUniqueEdgeByType(id1, models.EventToCreatorEdge)
		return result.Edge, result.Err
	})
}

func (suite *modelsTestSuite) TestGeneratedUniqueLoadEdgeByType() {
	testUniqueLoadEdgeByType(suite, func(id1 string) (*ent.AssocEdge, error) {
		v := viewertesting.OmniViewerContext{}
		event, err := models.LoadEvent(v, id1)
		require.NoError(suite.T(), err)
		return event.LoadCreatorEdge()
	})
}

func (suite *modelsTestSuite) TestGeneratedGenUniqueLoadEdgeByType() {
	testUniqueLoadEdgeByType(suite, func(id1 string) (*ent.AssocEdge, error) {
		v := viewertesting.OmniViewerContext{}
		event, err := models.LoadEvent(v, id1)
		require.NoError(suite.T(), err)
		result := <-event.GenCreatorEdge()
		return result.Edge, result.Err
	})
}

func (suite *modelsTestSuite) TestGeneratedLoadUniqueNode() {
	testUniqueLoadNodeByType(suite, func(id1 string) (*models.User, error) {
		v := viewertesting.OmniViewerContext{}
		event, err := models.LoadEvent(v, id1)
		require.NoError(suite.T(), err)
		return event.LoadCreator()
	})
}

func (suite *modelsTestSuite) TestGeneratedGenUniqueLoadNodeByType() {
	testUniqueLoadNodeByType(suite, func(id1 string) (*models.User, error) {
		v := viewertesting.OmniViewerContext{}
		event, err := models.LoadEvent(v, id1)
		require.NoError(suite.T(), err)
		result := <-event.GenCreator()
		return result.User, result.Err
	})
}

func (suite *modelsTestSuite) TestGeneratedGenLoadEdgeByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdgeByType(
		suite,
		func() (*ent.AssocEdge, error) {
			v := viewertesting.LoggedinViewerContext{ViewerID: user.ID}

			user, err := models.LoadUser(v, user.ID)
			require.NoError(suite.T(), err)

			result := <-user.GenLoadEventEdgeFor(event.ID)
			return result.Edge, result.Err
		},
		user.ID,
		event.ID,
	)
}

func (suite *modelsTestSuite) TestInvalidLoadEdgeByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	edge, err := ent.LoadEdgeByType(event.ID, user.ID, models.UserToEventsEdge)
	assert.Nil(suite.T(), err)
	assert.Zero(suite.T(), *edge)
}

func (suite *modelsTestSuite) TestLoadEdgeByTypeEmptyID1() {
	user := testingutils.CreateTestUser(suite.T())
	edge, err := ent.LoadEdgeByType("", user.ID, models.UserToEventsEdge)
	assert.Nil(suite.T(), err)
	assert.Zero(suite.T(), *edge)
}

func (suite *modelsTestSuite) TestLoadEdgeByTypeEmptyID2() {
	user := testingutils.CreateTestUser(suite.T())
	edge, err := ent.LoadEdgeByType(user.ID, "", models.UserToEventsEdge)
	assert.Nil(suite.T(), err)
	assert.Zero(suite.T(), *edge)
}

func testLoadEdgeByType(suite *modelsTestSuite, f func(id, id2 string) (*ent.AssocEdge, error)) {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdgeByType(
		suite,
		func() (*ent.AssocEdge, error) {
			return f(user.ID, event.ID)
		},
		user.ID,
		event.ID,
	)
}

func testUniqueLoadEdgeByType(suite *modelsTestSuite, f func(id string) (*ent.AssocEdge, error)) {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	verifyEdgeByType(
		suite,
		func() (*ent.AssocEdge, error) {
			return f(event.ID)
		},
		event.ID,
		user.ID,
	)
}

func testUniqueLoadNodeByType(suite *modelsTestSuite, f func(id string) (*models.User, error)) {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	node, err := f(event.ID)
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), node)
	assert.Equal(suite.T(), user.ID, node.ID)
}

func verifyEdgeByType(suite *modelsTestSuite, f func() (*ent.AssocEdge, error), id1, id2 string) {
	edge, err := f()
	assert.Nil(suite.T(), err)
	assert.NotZero(suite.T(), edge)
	assert.Equal(suite.T(), edge.ID1, id1)
	assert.Equal(suite.T(), edge.ID2, id2)
}

func (suite *modelsTestSuite) TestLoadAssocEdges() {
	// This is dependent on 2 things:
	// 1/ table already existing so first pass of chained loader works
	// 2/ table not being empty and full of valid data
	// we can't remove and re-add fresh data because of how dbcleaner works
	// we can't validate the number of edges here because that's subject to change
	result := <-ent.GenLoadAssocEdges()

	assert.NotEmpty(suite.T(), result.Edges)
	assert.Nil(suite.T(), result.Err)
}

func (suite *modelsTestSuite) TestLoadRawForeignKeyNodes() {
	user := testingutils.CreateTestUser(suite.T())
	contact := testingutils.CreateTestContact(suite.T(), user)
	contact2 := testingutils.CreateTestContact(suite.T(), user)

	var testCases = []struct {
		id          string
		foundResult bool
	}{
		{
			user.ID,
			true,
		},
		{
			contact.ID,
			false,
		},
	}

	for _, tt := range testCases {
		loader := models.NewContactLoader(viewer.LoggedOutViewer())
		contacts, err := ent.LoadRawForeignKeyNodes(tt.id, "user_id", loader)
		assert.Nil(suite.T(), err)
		if tt.foundResult {
			assert.NotEmpty(suite.T(), contacts)

			assert.Len(suite.T(), contacts, 2)
			for _, contactData := range contacts {
				assert.NotZero(suite.T(), contactData)
				id, err := cast.ToUUIDString(contactData["id"])
				assert.Nil(suite.T(), err)
				assert.Contains(suite.T(), []string{contact.ID, contact2.ID}, id)
			}
		} else {
			assert.Len(suite.T(), contacts, 0)
			assert.Empty(suite.T(), contacts)
		}
	}
}

func (suite *modelsTestSuite) TestLoadRawNodesByType() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)
	event2 := testingutils.CreateTestEvent(suite.T(), user)

	var testCases = []struct {
		id1         string
		foundResult bool
	}{
		{
			user.ID,
			true,
		},
		{
			event.ID,
			false,
		},
	}

	for _, tt := range testCases {
		loader := models.NewEventLoader(viewer.LoggedOutViewer())
		events, err := ent.LoadRawNodesByType(tt.id1, models.UserToEventsEdge, loader)
		assert.Nil(suite.T(), err)
		if tt.foundResult {
			assert.NotEmpty(suite.T(), events)

			assert.Len(suite.T(), events, 2)
			for _, eventData := range events {
				assert.NotZero(suite.T(), eventData)
				id, err := cast.ToUUIDString(eventData["id"])
				assert.Nil(suite.T(), err)
				assert.Contains(suite.T(), []string{event.ID, event2.ID}, id)
			}
		} else {
			assert.Len(suite.T(), events, 0)
			assert.Empty(suite.T(), events)
		}
	}
}

func (suite *modelsTestSuite) TestLoadNodeWithJSON() {
	// successfully
	residentNames := []string{"The Queen"}
	address := testingutils.CreateTestAddress(suite.T(), residentNames)

	var loadedAddress models.Address
	err := ent.LoadNodeRawData(address.ID, &loadedAddress, &configs.AddressConfig{})
	require.NoError(suite.T(), err)

	assert.Equal(suite.T(), residentNames, loadedAddress.ResidentNames)
}

func (suite *modelsTestSuite) TestLoadingMultiNodesWithJSON() {
	// This is to test that we can load multiple objects that have JSON where we can't StructScan
	// so we have to MapScan and then fill the nodes
	residentNames := []string{"The Queen", "Prince Phillip"}
	address := testingutils.CreateTestAddress(suite.T(), residentNames)
	address2 := testingutils.CreateTestAddress(suite.T(), residentNames)
	address3 := testingutils.CreateTestAddress(suite.T(), residentNames)

	ids := []string{
		address.ID,
		address2.ID,
		address3.ID,
	}
	loader := models.NewAddressLoader(viewer.LoggedOutViewer())
	addresses, err := ent.LoadNodesRawData(ids, loader)
	require.NoError(suite.T(), err)

	assert.Len(suite.T(), addresses, 3)

	for _, addressData := range addresses {
		var loadedResidentNames []string
		err := cast.UnmarshallJSON(addressData["resident_names"], &loadedResidentNames)
		assert.Nil(suite.T(), err)
		assert.Equal(suite.T(), residentNames, loadedResidentNames)
	}
}

func (suite *modelsTestSuite) TestLoadRawQueryWithJSON() {
	// This tests the raw_data mode
	// We still don't have a way to test StructScan that loader orchestrates on its own since we go through caching layer as expected
	residentNames := []string{"The Queen", "Prince Phillip"}
	address := testingutils.CreateTestAddress(suite.T(), residentNames)
	address2 := testingutils.CreateTestAddress(suite.T(), residentNames)
	address3 := testingutils.CreateTestAddress(suite.T(), residentNames)

	ids := map[string]bool{
		address.ID:  true,
		address2.ID: true,
		address3.ID: true,
	}
	loader := models.NewAddressLoader(viewer.LoggedOutViewer())
	addresses, err := ent.LoadRawQuery("SELECT * FROM addresses", loader)
	require.NoError(suite.T(), err)

	assert.Len(suite.T(), addresses, 3)

	for _, addressData := range addresses {
		id, err := cast.ToUUIDString(addressData["id"])
		assert.Nil(suite.T(), err)
		assert.NotNil(suite.T(), ids[id])
		var loadedResidentNames []string
		err = cast.UnmarshallJSON(addressData["resident_names"], &loadedResidentNames)
		assert.Nil(suite.T(), err)
		assert.Equal(suite.T(), residentNames, loadedResidentNames)
	}
}

func TestModelsSuite(t *testing.T) {
	suite.Run(t, new(modelsTestSuite))
}
