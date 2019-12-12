package file

import (
	"bytes"
	"fmt"
	"text/template"

	intimports "github.com/lolopinto/ent/internal/imports"
	"github.com/lolopinto/ent/internal/schemaparser"
	"github.com/lolopinto/ent/internal/util"
	"golang.org/x/tools/imports"
)

type TemplatedBasedFileWriter struct {
	Data               interface{}
	AbsPathToTemplate  string
	TemplateName       string
	PathToFile         string
	CreateDirIfNeeded  bool
	CheckForManualCode bool
	FormatSource       bool
	FuncMap            template.FuncMap
	PackageName        string
	//	manualImports      bool
	Imports *intimports.Imports
}

func (fw *TemplatedBasedFileWriter) createDirIfNeeded() bool {
	return fw.CreateDirIfNeeded
}

func (fw *TemplatedBasedFileWriter) getPathToFile() string {
	return fw.PathToFile
}

func (fw *TemplatedBasedFileWriter) generateBytes() []byte {
	// parse existing file to see what we need to keep in the rewrite
	var config *schemaparser.AstConfig

	// no real reason this only applies for just privacy.tmpl
	// but it's the only one where we care about this for now so limiting to just that
	// in the future, this should apply for all
	if fw.CheckForManualCode {
		config = schemaparser.ParseFileForManualCode(fw.PathToFile)
	}

	// generate the new AST we want for the file
	buf := fw.generateNewAst()

	// better flag needed. but basically not go code and we can bounce
	if !fw.FormatSource {
		return buf.Bytes()
	}

	var b []byte
	var err error
	if fw.Imports != nil {
		buf = fw.handleManualImports(buf)
	}

	b, err = imports.Process(
		fw.PathToFile,
		buf.Bytes(),
		&imports.Options{
			FormatOnly: false,
			Comments:   true,
			TabIndent:  true,
			TabWidth:   8,
		},
	)
	if err != nil {
		fmt.Println(string(buf.Bytes()))
		util.Die(err)
	}

	// if fw.formatSource {
	// 	b, err = format.Source(buf.Bytes())

	// 	if err != nil {
	// 		fmt.Println(buf.String())
	// 	}
	// 	util.Die(err)
	// }

	if config != nil {
		b = schemaparser.RewriteAstWithConfig(config, b)
	}
	return b
}

// TODO rename this since this is just parse template that's non-AST
// generate new AST for the given file from the template
func (fw *TemplatedBasedFileWriter) generateNewAst() *bytes.Buffer {
	path := []string{fw.AbsPathToTemplate}
	t := template.New(fw.TemplateName).Funcs(fw.FuncMap)
	t, err := t.ParseFiles(path...)
	util.Die(err)

	var buffer bytes.Buffer

	// execute the template and store in buffer
	err = t.Execute(&buffer, fw.Data)
	util.Die(err)
	//err = t.Execute(os.Stdout, nodeData)
	//fmt.Println(buffer)
	//	fmt.Println(buffer.String())

	return &buffer
}

func (fw *TemplatedBasedFileWriter) handleManualImports(buf *bytes.Buffer) *bytes.Buffer {
	var result bytes.Buffer
	result.WriteString("// Code generated by github.com/lolopinto/ent/ent, DO NOT EDIT.\n\n")

	result.WriteString("package ")
	result.WriteString(fw.PackageName)
	result.WriteString("\n\n")
	result.WriteString("import (\n")
	result.WriteString(fw.Imports.String())
	result.WriteString(")\n")
	_, err := buf.WriteTo(&result)

	util.Die((err))

	return &result
}

func (fw *TemplatedBasedFileWriter) Write() {
	writeFile(fw)
}