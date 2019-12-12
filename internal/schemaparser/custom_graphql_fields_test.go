package schemaparser_test

import (
	"sync"
	"testing"

	"github.com/lolopinto/ent/internal/enttype"
	"github.com/lolopinto/ent/internal/schemaparser"
	testsync "github.com/lolopinto/ent/internal/testingutils/sync"
	"github.com/stretchr/testify/assert"
)

func validTypes() map[string]bool {
	return map[string]bool{
		"Contact": true,
		"User":    true,
	}
}

func TestCustomFields(t *testing.T) {
	result := getCustomGraphQLDefinitions(t)

	assert.Equal(t, 2, len(result))
	assert.NotNil(t, result["User"])
	assert.NotNil(t, result["Contact"])
	assert.Nil(t, result["Event"])
}

type testParsedItem struct {
	graphqlName  string
	functionName string
	typ          enttype.FieldType
	args         []testArg
}

type testArg struct {
	name string
	typ  enttype.FieldType
}

func TestCustomUserFields(t *testing.T) {
	result := getCustomGraphQLDefinitions(t)
	items := result["User"]

	assert.Len(t, items, 2)

	expectedItems := []testParsedItem{
		testParsedItem{
			graphqlName:  "userFoo",
			functionName: "GetUserFoo",
			typ:          &enttype.StringType{},
		},
		testParsedItem{
			graphqlName:  "baz",
			functionName: "Baz",
			typ:          &enttype.NullableFloatType{},
		},
	}
	validateExpectedItems(t, expectedItems, items)
}

func TestCustomContactFields(t *testing.T) {
	result := getCustomGraphQLDefinitions(t)
	items := result["Contact"]

	assert.Len(t, items, 2)

	expectedItems := []testParsedItem{
		testParsedItem{
			graphqlName:  "contactFoo",
			functionName: "GetContactFoo",
			typ:          &enttype.StringType{},
		},
		testParsedItem{
			graphqlName:  "contactBar",
			functionName: "GetContactBar",
			typ:          &enttype.IntegerType{},
			args: []testArg{
				testArg{
					name: "foo",
					typ:  &enttype.IntegerType{},
				},
			},
		},
	}
	validateExpectedItems(t, expectedItems, items)
}

func TestCustomSources(t *testing.T) {
	sources := make(map[string]string)

	// let's fake generated file here...
	sources["user_gen.go"] = getFakeGeneratedFile()

	// custom function here.
	sources["user.go"] = `
	package models

	// GetFoo blah blah blah
  // @graphql
func (user *User) GetFoo() string {
	return "foo"
}

`

	result, err := getCustomGraphQLDefinitionsWithOverlays(t, sources)
	assert.Nil(t, err)
	assert.Len(t, result, 1)

	validateExpectedItems(
		t,
		[]testParsedItem{
			testParsedItem{
				graphqlName:  "foo",
				functionName: "GetFoo",
				typ:          &enttype.StringType{},
			},
		},
		result["User"],
	)
}

func TestInvalidReceiver(t *testing.T) {
	sources := make(map[string]string)

	// let's fake generated file here...
	sources["user_gen.go"] = getFakeGeneratedFile()

	// custom function here.
	sources["user.go"] = `
	package models

	// GetFoo blah blah blah
  // @graphql
func (user *User) GetFoo() string {
	return "foo"
}

type Bar struct {}

// GetFoo does crap
// @graphql
func (b Bar) GetFoo() string {
	return "foo 2.0"
}

`
	result, err := getCustomGraphQLDefinitionsWithOverlays(t, sources)
	assert.EqualError(t, err, "invalid type Bar should not have @graphql decoration")
	assert.Nil(t, result)
}

func getFakeGeneratedFile() string {
	return `
	package models

	import (
		"github.com/lolopinto/ent/ent"
		"github.com/lolopinto/ent/ent/privacy"
	)

	type User struct {
		ent.Node
		privacy.AlwaysDenyPrivacyPolicy
	}
`
}

func validateExpectedItems(t *testing.T, expectedItems []testParsedItem, items []schemaparser.ParsedItem) {
	assert.Equal(t, len(expectedItems), len(items))

	for idx, expItem := range expectedItems {
		item := items[idx]

		assert.Equal(t, expItem.graphqlName, item.GraphQLName)
		assert.Equal(t, expItem.functionName, item.FunctionName)

		assert.Equal(t, expItem.typ, item.Type)

		assert.Len(t, item.Args, len(expItem.args))

		for j, expArg := range expItem.args {
			arg := item.Args[j]

			assert.Equal(t, expArg.name, arg.Name)
			assert.Equal(t, expArg.typ, arg.Type)
		}
	}
}

var r *testsync.RunOnce
var once sync.Once

func getRunOnce() *testsync.RunOnce {
	once.Do(func() {
		r = testsync.NewRunOnce(func(t *testing.T, _ string) interface{} {
			result, err := schemaparser.ParseCustomGraphQLDefinitions(
				&schemaparser.ConfigSchemaParser{
					AbsRootPath: "../test_schema/models",
				},
				validTypes(),
			)

			// verifies we have results and that the results are expected
			assert.Nil(t, err)
			return result
		})
	})
	return r
}

func getCustomGraphQLDefinitions(t *testing.T) map[string][]schemaparser.ParsedItem {
	return getRunOnce().Get(t, "").(map[string][]schemaparser.ParsedItem)
}

func getCustomGraphQLDefinitionsWithOverlays(t *testing.T, sources map[string]string) (map[string][]schemaparser.ParsedItem, error) {
	return schemaparser.ParseCustomGraphQLDefinitions(
		&schemaparser.SourceSchemaParser{
			Sources:     sources,
			PackageName: "models",
		},
		validTypes(),
	)
}