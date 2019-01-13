package models

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/lolopinto/jarvis/data"
)

// local to this package
type loadSingleNode func(db *sqlx.DB) (stmt *sqlx.Stmt, err error)

// we can codegen this so it's fine...
func loadNode(id string, entity interface{}, sqlQuery loadSingleNode) (interface{}, error) {
	if entity == nil {
		// TODO handle this better later. maybe have custom error
		// return nil, err
		panic("nil entity passed to loadNode")
	}
	// ok, so now we need a way to map from struct to fields
	db, err := data.DBConn()
	if err != nil {
		fmt.Println("error connecting to db ", err)
		return nil, err
	}

	defer db.Close()

	stmt, err := sqlQuery(db)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer stmt.Close()

	var output interface{}
	output = nil

	switch v := entity.(type) {
	case *User:
		fmt.Println("*User")
		var user User
		err = stmt.Get(&user, id)
		fmt.Println("scanned user", user)
		output = user
	case User:
		fmt.Println("User")
		var user User
		err = stmt.Get(user, id)
		entity = user

	default:
		panic(fmt.Sprint("unknown type", v))
	}
	if err != nil {
		fmt.Println(err)
	}
	return output, err
}
