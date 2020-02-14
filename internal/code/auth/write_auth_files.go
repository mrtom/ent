package auth

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/lolopinto/ent/internal/astparser"
	"github.com/lolopinto/ent/internal/codegen"
	"github.com/lolopinto/ent/internal/file"
	"github.com/lolopinto/ent/internal/imports"
	"github.com/lolopinto/ent/internal/schemaparser"
	"github.com/lolopinto/ent/internal/util"
)

type authData struct {
	SigningKey            string
	IDFromPhoneNumber     string
	ValidateEmailPassword string
	IDFromEmailAddress    string
	VCFromID              string
	CodePath              *codegen.CodePath
	CreateLocalViewer     bool
	ViewerPath            string
	ViewerFunc            string
	NodeName              string
}

// Options provides configuration options to WritePhoneAuthFile or WriteEmailAuthFile
type Options struct {
	Node           string
	Field          string
	ViewerFunc     string
	ForceOverwrite bool
}

func getPhoneAuthFilePath() string {
	// for now let's keep it in graphql folder
	return fmt.Sprintf("graphql/phone_auth.go")
}

func getEmailAuthFilePath() string {
	// for now let's keep it in graphql folder
	return fmt.Sprintf("graphql/email_auth.go")
}

func defaultAuthData(codePathInfo *codegen.CodePath, options *Options) (*authData, error) {
	data := &authData{
		SigningKey:        util.GenerateRandAlphaNumericKey(63),
		NodeName:          options.Node,
		CodePath:          codePathInfo,
		CreateLocalViewer: true,
		ViewerFunc:        "generatedViewer", // this is the function generated by default
	}

	if options.ViewerFunc != "" { // time to configure...
		importPath, err := verifyFunction(codePathInfo, options.ViewerFunc)
		if err != nil {
			return nil, err
		}
		data.ViewerPath = importPath
		data.ViewerFunc = options.ViewerFunc
		data.CreateLocalViewer = false
	}
	return data, nil
}

func WritePhoneAuthFile(codePathInfo *codegen.CodePath, options *Options) error {
	data, err := defaultAuthData(codePathInfo, options)
	if err != nil {
		return err
	}
	// TODO this assumes the PhoneNumber field is indexed. we should check for this...
	idFromPhoneNumber := fmt.Sprintf("models.Load%sIDFrom%s", options.Node, options.Field)
	data.IDFromPhoneNumber = idFromPhoneNumber

	return writeFile(data, "phone_auth.gotmpl", getPhoneAuthFilePath(), options)
}

func WriteEmailAuthFile(codePathInfo *codegen.CodePath, options *Options) error {
	data, err := defaultAuthData(codePathInfo, options)
	if err != nil {
		return err
	}
	// TODO this assumes the Email field is indexed. we should check for this...
	// we don't need the password field because of how ValidateEmailPassword works. can make it
	// optional in the future if that changes
	// TODO should be ValidateUserEmailPassword. doesn't have the node
	//	validateEmailPassword := fmt.Sprintf("models.Validate%s%s", options.Field, "Password")
	// VALidate
	data.ValidateEmailPassword = "models.ValidateEmailPassword"
	data.IDFromEmailAddress = fmt.Sprintf("models.Load%sIDFrom%s", options.Node, options.Field)

	return writeFile(data, "email_auth.gotmpl", getEmailAuthFilePath(), options)
}

func writeFile(data interface{}, templateName, filePath string, options *Options) error {
	imps := imports.Imports{}

	writer := &file.TemplatedBasedFileWriter{
		Data:              data,
		AbsPathToTemplate: util.GetAbsolutePath(templateName),
		TemplateName:      templateName,
		PathToFile:        filePath,
		FormatSource:      true,
		PackageName:       "graphql", // TODO auth?
		Imports:           &imps,
		EditableCode:      true,
		FuncMap: template.FuncMap{
			// our own version of reserveImport similar to what gqlgen provides. TOOD rename
			"reserveImport": imps.Reserve,
			"lookupImport":  imps.Lookup,
		},
	}
	return file.Write(writer, file.WriteOnceMaybe(options.ForceOverwrite))

}

func verifyFunction(codePathInfo *codegen.CodePath, name string) (string, error) {
	parts := strings.Split(name, ".")
	if len(parts) < 1 || len(parts) > 2 {
		return "", fmt.Errorf("expected function of the format package.Func or Func, got %s instead", name)
	}
	var extraPath, function string
	if len(parts) == 1 {
		function = parts[0]
	} else {
		extraPath = parts[0]
		function = parts[1]
	}
	importPath := filepath.Join(codePathInfo.GetImportPathToRoot(), extraPath)
	rootPath := filepath.Join(codePathInfo.GetAbsPathToRoot(), extraPath)

	parser := &schemaparser.ConfigSchemaParser{
		AbsRootPath: rootPath,
	}
	_, fns, err := schemaparser.FindFunctionFromParser(parser, schemaparser.FunctionSearch{FnName: function})
	if err != nil {
		return "", err
	}
	fn := fns[function]
	if fn == nil {
		return "", errors.New("couldn't find function")
	}

	if fn.Recv != nil {
		return "", errors.New("expeted a function with no receiver")
	}
	if fn.Type.Results == nil || len(fn.Type.Results.List) != 2 {
		return "", errors.New("expected a function that returned 2 items")
	}
	if fn.Type.Params == nil || len(fn.Type.Params.List) != 1 {
		return "", errors.New("expected a function that took 1 argument")
	}
	param, paramErr := astparser.ParseFieldType(fn.Type.Params.List[0])
	result1, result1Err := astparser.ParseFieldType(fn.Type.Results.List[0])
	result2, result2Err := astparser.ParseFieldType(fn.Type.Results.List[1])

	if err := util.CoalesceErr(paramErr, result1Err, result2Err); err != nil {
		return "", err
	}
	if !param.IsScalarType("string") {
		return "", errors.New("expected function to take 1 string param")
	}
	if !result1.IsScalarType("viewer.ViewerContext") {
		return "", errors.New("expected function to return 2 items with 1st item being viewer.ViewerContext")
	}
	if !result2.IsScalarType("error") {
		return "", errors.New("expected function to return 2 items with 2nd item being an error")
	}
	return importPath, nil
}