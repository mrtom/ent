package cast_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/lolopinto/ent/data"
	"github.com/lolopinto/ent/ent/cast"
	"github.com/lolopinto/ent/internal/testingutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type castSuite struct {
	testingutils.Suite
}

func (suite *castSuite) SetupSuite() {
	suite.Tables = []string{
		"users",
		"event_invited_edges",
		"events",
	}
	suite.Suite.SetupSuite()
}

func queryRow(t *testing.T, val interface{}, tableName string) map[string]interface{} {
	db := data.DBConn()

	row := db.QueryRowx(fmt.Sprintf("SELECT * FROM %s WHERE id = $1", tableName), val)
	dataMap := make(map[string]interface{})
	err := row.MapScan(dataMap)
	assert.Nil(t, err)
	return dataMap
}

func (suite *castSuite) TestUUIDStringIDField() {
	user := testingutils.CreateTestUser(suite.T())

	dataMap := queryRow(suite.T(), user.ID, "users")

	id, err := cast.ToUUIDString(dataMap["id"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), user.ID, id)

	_, err = uuid.Parse(id)
	assert.Nil(suite.T(), err)
}

func (suite *castSuite) TestUUIDStringDBString() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	dataMap := queryRow(suite.T(), event.ID, "events")

	userID, err := cast.ToUUIDString(dataMap["user_id"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), user.ID, userID)

	_, err = uuid.Parse(userID)
	assert.Nil(suite.T(), err)

	userIDStr, err := cast.ToString(dataMap["user_id"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), userIDStr, userID)
}

func (suite *castSuite) TestUUIDStringDBUUID() {
	user := testingutils.CreateTestUser(suite.T())
	contact := testingutils.CreateTestContact(suite.T(), user)

	dataMap := queryRow(suite.T(), contact.ID, "contacts")

	userID, err := cast.ToUUIDString(dataMap["user_id"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), user.ID, userID)

	_, err = uuid.Parse(userID)
	assert.Nil(suite.T(), err)

	// we need this to work because we don't type it as uuid in generated code
	userIDStr, err := cast.ToString(dataMap["user_id"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), userIDStr, userID)
}

func (suite *castSuite) TestToString() {
	user := testingutils.CreateTestUser(suite.T())

	dataMap := queryRow(suite.T(), user.ID, "users")
	firstName, err := cast.ToString(dataMap["first_name"])
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), firstName)
	assert.Equal(suite.T(), user.FirstName, firstName)
}

func (suite *castSuite) TestNullableToString() {
	user := testingutils.CreateTestUser(suite.T())

	dataMap := queryRow(suite.T(), user.ID, "users")
	bio, err := cast.ToNullableString(dataMap["bio"])
	assert.Nil(suite.T(), err)
	assert.Nil(suite.T(), bio)

	user = testingutils.EditUser(suite.T(),
		user,
		map[string]interface{}{
			"bio": "awesome person",
		})

	dataMap = queryRow(suite.T(), user.ID, "users")
	bio, err = cast.ToNullableString(dataMap["bio"])
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), bio)
	assert.Equal(suite.T(), *bio, "awesome person")
}

func (suite *castSuite) TestToTime() {
	user := testingutils.CreateTestUser(suite.T())
	event := testingutils.CreateTestEvent(suite.T(), user)

	dataMap := queryRow(suite.T(), event.ID, "events")
	t, err := cast.ToTime(dataMap["start_time"])
	assert.Nil(suite.T(), err)
	assert.False(suite.T(), t.IsZero())
	// confirm it's a valid time within the near recent time
	assert.True(suite.T(), t.Before(time.Now()))
	assert.False(suite.T(), t.After(time.Now().Add(-2*time.Second)))
}

func (suite *castSuite) TestToBool() {
	user := testingutils.CreateTestUser(suite.T())
	contact := testingutils.CreateTestContact(suite.T(), user)

	dataMap := queryRow(suite.T(), contact.ID, "contacts")
	fave, err := cast.ToBool(dataMap["favorite"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), fave, false)
}

func (suite *castSuite) TestToInt() {
	user := testingutils.CreateTestUser(suite.T())
	contact := testingutils.CreateTestContact(suite.T(), user)

	dataMap := queryRow(suite.T(), contact.ID, "contacts")
	numberOfCalls, err := cast.ToInt(dataMap["number_of_calls"])
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), numberOfCalls, 5)
}

func (suite *castSuite) TestToFloat() {
	user := testingutils.CreateTestUser(suite.T())
	contact := testingutils.CreateTestContact(suite.T(), user)

	dataMap := queryRow(suite.T(), contact.ID, "contacts")
	pi, err := cast.ToFloat(dataMap["pi"])
	assert.Nil(suite.T(), err)
	// float64 default.
	assert.Equal(suite.T(), pi, 3.14)
}

func TestGeneratedAction(t *testing.T) {
	suite.Run(t, new(castSuite))
}
