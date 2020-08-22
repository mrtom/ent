package enum

type Enum struct {
	Name   string
	Values []Data
}

type GQLEnum struct {
	Name   string // Name is the name of the enum
	Type   string // type of the enum e.g. nullable or not
	Values []Data
}

type Data struct {
	Name        string
	Value       string
	Comment     string
	PackagePath string
}
