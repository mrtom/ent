package graphql

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/iancoleman/strcase"
	"github.com/lolopinto/ent/internal/codegen"
	"github.com/lolopinto/ent/internal/codegen/codegenapi"
	"github.com/lolopinto/ent/internal/codegen/nodeinfo"
	"github.com/lolopinto/ent/internal/edge"
	"github.com/lolopinto/ent/internal/schema"
	"github.com/lolopinto/ent/internal/schema/enum"
	"github.com/lolopinto/ent/internal/tsimport"
)

type processCustomRoot interface {
	process(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error
	getFilePath(*codegen.Processor, string) string
	getArgObject(cd *CustomData, arg CustomItem) *CustomObject
	getFields(cd *CustomData) []CustomField
	buildFieldConfig(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error)
}

type customMutationsProcesser struct {
}

func (cm *customMutationsProcesser) process(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	arr, err := processFields(processor, cd, s, cm)
	if err != nil {
		return err
	}

	if len(arr) > 0 {
		// flag this appropriately
		s.hasMutations = true
		s.customMutations = arr
	}

	return nil
}

func (cm *customMutationsProcesser) getFilePath(p *codegen.Processor, gqlName string) string {
	return getFilePathForCustomMutation(p.Config, gqlName)
}

func (cm *customMutationsProcesser) getArgObject(cd *CustomData, arg CustomItem) *CustomObject {
	return cd.Inputs[arg.Type]
}

func (cm *customMutationsProcesser) getFields(cd *CustomData) []CustomField {
	return cd.Mutations
}

func (cm *customMutationsProcesser) buildFieldConfig(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error) {
	b := &mutationFieldConfigBuilder{
		field:     field,
		filePath:  cm.getFilePath(processor, field.GraphQLName),
		cd:        cd,
		processor: processor,
	}

	for _, arg := range field.Args {
		if arg.IsContextArg {
			continue
		}
		if arg.Name == "input" {
			b.inputArg = &arg
		}
	}
	return b.build(processor, cd, s, field)
}

type customQueriesProcesser struct {
}

func (cq *customQueriesProcesser) process(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	arr, err := processFields(processor, cd, s, cq)
	s.customQueries = arr

	return err
}

func (cq *customQueriesProcesser) getFilePath(processor *codegen.Processor, gqlName string) string {
	return getFilePathForCustomQuery(processor.Config, gqlName)
}

func (cq *customQueriesProcesser) getArgObject(cd *CustomData, arg CustomItem) *CustomObject {
	return cd.Args[arg.Type]
}

func (cq *customQueriesProcesser) getFields(cd *CustomData) []CustomField {
	return cd.Queries
}

func (cq *customQueriesProcesser) buildFieldConfig(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error) {
	b := &queryFieldConfigBuilder{
		field,
		cq.getFilePath(processor, field.GraphQLName),
		processor,
	}
	return b.build(processor, cd, s, field)
}

func processFields(processor *codegen.Processor, cd *CustomData, s *gqlSchema, cr processCustomRoot) ([]*gqlNode, error) {
	var result []*gqlNode
	fields := cr.getFields(cd)

	for idx := range fields {
		// field having weird issues unless broken down like this
		field := fields[idx]
		nodeName := field.Node

		if field.Node != "" {
			class := cd.Classes[nodeName]
			if class == nil {
				return nil, fmt.Errorf("mutation/query %s with class %s not found", field.GraphQLName, nodeName)
			}

			if !class.Exported {
				return nil, fmt.Errorf("resolver class %s needs to be exported", class.Name)
			}
		} else if field.FunctionContents == "" {
			return nil, fmt.Errorf("cannot have a field %s with no NodeName and no inline function contents", field.GraphQLName)

		}

		var objTypes []*objectType

		// TODO we want an option for namespace for folders but for now ignore
		filePath := cr.getFilePath(processor, field.GraphQLName)

		// let's try and make this generic enough to work for input type and standard args...
		// and have graphql complain if not valid types at the end here

		// should we build an interface for this custom object?
		createInterface := false
		intType := &interfaceType{
			Name: strcase.ToCamel(field.GraphQLName) + "Args",
		}
		for _, arg := range field.Args {
			// nothing to do with context args yet
			if arg.IsContextArg {
				continue
			}

			// need to build input type
			// TODO for now we assume inputtype is 1:1, that's not going to remain the same forever...
			argObj := cr.getArgObject(cd, arg)
			typ := knownTsTypes[arg.Type]
			// TODO use input.Field.GetEntType()
			if typ == "" {
				typ = "any"
			} else {
				if arg.Connection {
					typ = "any"
				} else {
					if arg.List {
						typ = typ + "[]"
					}
					if arg.Nullable == NullableTrue {
						typ = typ + " | null"
					}
				}
			}
			if argObj == nil {
				createInterface = true
				intType.Fields = append(intType.Fields, &interfaceField{
					Name: arg.Name,
					Type: typ,
					//
					// arg.TSType + add to import so we can useImport
					//					UseImport: true,
				})
				continue
			}
			// not always going to be GraphQLInputObjectType (for queries)
			argType, err := buildObjectType(processor, cd, s, arg, argObj, filePath, "GraphQLInputObjectType")
			if err != nil {
				return nil, err
			}
			objTypes = append(objTypes, argType)
		}

		for _, result := range field.Results {
			// 0 -1 allowed...
			object := cd.Objects[result.Type]
			if object == nil {
				continue
			}

			payloadType, err := buildObjectType(processor, cd, s, result, object, filePath, "GraphQLObjectType")
			if err != nil {
				return nil, err
			}

			cls := cd.Classes[field.Node]
			if cls != nil {
				importPath, err := getRelativeImportPath(processor, filePath, cls.Path)
				if err != nil {
					return nil, err
				}
				if cls.DefaultExport {
					payloadType.DefaultImports = append(payloadType.DefaultImports, &tsimport.ImportPath{
						ImportPath: importPath,
						Import:     field.Node,
					})
				} else {
					payloadType.Imports = append(payloadType.Imports, &tsimport.ImportPath{
						ImportPath: importPath,
						Import:     field.Node,
					})
				}
			}
			objTypes = append(objTypes, payloadType)
		}

		fieldConfig, err := cr.buildFieldConfig(processor, cd, s, field)
		if err != nil {
			return nil, err
		}
		// take connection here and add to result...
		var connections []*gqlConnection
		if fieldConfig.connection != nil {
			connections = append(connections, fieldConfig.connection)
		}

		var interfaces []*interfaceType
		if createInterface {
			interfaces = append(interfaces, intType)
		}
		result = append(result, &gqlNode{
			ObjData: &gqlobjectData{
				interfaces: interfaces,
				// TODO kill node and NodeInstance they don't make sense here...
				Node:         field.Node,
				NodeInstance: "obj",
				GQLNodes:     objTypes,
				FieldConfig:  fieldConfig,
				Package:      processor.Config.GetImportPackage(),
			},
			FilePath:    filePath,
			Field:       &field,
			connections: connections,
		})
	}

	return result, nil
}

type fieldConfigBuilder interface {
	build(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error)
	getArg() string
	getName() string
	getResolveMethodArg() string
	getTypeImports(processor *codegen.Processor, s *gqlSchema) []*tsimport.ImportPath
	getArgs(s *gqlSchema) []*fieldConfigArg
	getReturnTypeHint() string
	getArgMap(cd *CustomData) map[string]*CustomObject
	getFilePath() string
}

type mutationFieldConfigBuilder struct {
	field     CustomField
	filePath  string
	cd        *CustomData
	inputArg  *CustomItem
	processor *codegen.Processor
}

func (mfcg *mutationFieldConfigBuilder) getName() string {
	return fmt.Sprintf("%sType", strcase.ToCamel(mfcg.field.GraphQLName))
}

func (mfcg *mutationFieldConfigBuilder) build(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error) {
	return buildFieldConfigFrom(mfcg, processor, s, cd, field)
}

func (mfcg *mutationFieldConfigBuilder) getFilePath() string {
	return mfcg.filePath
}

func (mfcg *mutationFieldConfigBuilder) getArg() string {
	// for input object type, type it
	if mfcg.inputArg != nil {
		return fmt.Sprintf("{ [input: string]: %s}", mfcg.inputArg.Type)
	}

	return mfcg.field.getArg()
}

func (mfcg *mutationFieldConfigBuilder) getResolveMethodArg() string {
	if mfcg.inputArg != nil {
		return "{ input }"
	}

	return mfcg.field.getResolveMethodArg()
}

func (mfcg *mutationFieldConfigBuilder) getTypeImports(processor *codegen.Processor, s *gqlSchema) []*tsimport.ImportPath {
	if len(mfcg.field.Results) != 1 {
		panic(fmt.Errorf("invalid number of results for custom field %s", mfcg.field.FunctionName))
	}
	r := mfcg.field.Results[0]
	// use the initialized imports to seed this
	// TODO use s.getImports and make these be consistent
	// https://github.com/lolopinto/ent/issues/240
	if err := r.initialize(); err != nil {
		panic(err)
	}
	var ret = r.imports[:]

	imp := s.getImportFor(processor, r.Type, true)
	if imp != nil {
		ret = append(ret, imp)
	} else {

		prefix := strcase.ToCamel(mfcg.field.GraphQLName)

		ret = append(ret, &tsimport.ImportPath{
			// TODO we should pass this in instead of automatically doing this
			Import:     fmt.Sprintf("%sPayloadType", prefix),
			ImportPath: "",
		})
	}

	return ret
}

func (mfcg *mutationFieldConfigBuilder) getArgs(s *gqlSchema) []*fieldConfigArg {
	if mfcg.inputArg != nil {
		prefix := strcase.ToCamel(mfcg.field.GraphQLName)
		return []*fieldConfigArg{
			{
				Name: "input",
				Imports: []*tsimport.ImportPath{
					tsimport.NewGQLClassImportPath("GraphQLNonNull"),
					// same for this about passing it in
					{
						Import: fmt.Sprintf("%sInputType", prefix),
					},
				},
			},
		}
	}
	return getFieldConfigArgs(mfcg.processor, mfcg.field, s, true)
}

func (mfcg *mutationFieldConfigBuilder) getReturnTypeHint() string {
	if mfcg.inputArg != nil {
		prefix := strcase.ToCamel(mfcg.field.GraphQLName)
		return fmt.Sprintf("Promise<%sPayload>", prefix)
	}
	return ""
}

func (mfcg *mutationFieldConfigBuilder) getArgMap(cd *CustomData) map[string]*CustomObject {
	return cd.Inputs
}

type queryFieldConfigBuilder struct {
	field     CustomField
	filePath  string
	processor *codegen.Processor
}

func (qfcg *queryFieldConfigBuilder) getName() string {
	return fmt.Sprintf("%sQueryType", strcase.ToCamel(qfcg.field.GraphQLName))
}

func (qfcg *queryFieldConfigBuilder) build(processor *codegen.Processor, cd *CustomData, s *gqlSchema, field CustomField) (*fieldConfig, error) {
	return buildFieldConfigFrom(qfcg, processor, s, cd, field)
}

func (qfcg *queryFieldConfigBuilder) getFilePath() string {
	return qfcg.filePath
}

func (qfcg *queryFieldConfigBuilder) getArg() string {
	return qfcg.field.getArg()
}

func (qfcg *queryFieldConfigBuilder) getResolveMethodArg() string {
	return qfcg.field.getResolveMethodArg()
}

func (qfcg *queryFieldConfigBuilder) getTypeImports(processor *codegen.Processor, s *gqlSchema) []*tsimport.ImportPath {
	if len(qfcg.field.Results) != 1 {
		panic("invalid number of results for custom field")
	}

	if qfcg.field.Connection {
		return getGQLFileImports(getRootGQLEdge(processor.Config, qfcg.field).GetTSGraphQLTypeImports(), false)
	}
	r := qfcg.field.Results[0]

	// use the initialized imports to seed this
	// TODO use s.getImports and make these be consistent
	// https://github.com/lolopinto/ent/issues/240
	if err := r.initialize(); err != nil {
		panic(err)
	}
	var ret = r.imports[:]

	imp := s.getImportFor(processor, r.Type, false)
	if imp != nil {
		ret = append(ret, imp)
	} else {
		// new type
		ret = append(ret, &tsimport.ImportPath{
			Import: fmt.Sprintf("%sType", r.Type),
			//		ImportPath is local here
		})
	}

	return ret
}

func getFieldConfigArgs(processor *codegen.Processor, field CustomField, s *gqlSchema, mutation bool) []*fieldConfigArg {
	return getFieldConfigArgsFrom(processor, field.Args, s, mutation)
}

// if s is nil, we only check knownTypes to see if arg.Type
// matches, otherwise, no type given for that...
func getFieldConfigArgsFrom(processor *codegen.Processor, args []CustomItem, s *gqlSchema, mutation bool) []*fieldConfigArg {
	var ret []*fieldConfigArg
	for _, arg := range args {
		if arg.IsContextArg {
			continue
		}

		// use the initialized imports to seed this
		// TODO use s.getImports and make these be consistent
		// https://github.com/lolopinto/ent/issues/240
		if err := arg.initialize(); err != nil {
			panic(err)
		}

		var imp *tsimport.ImportPath

		if s != nil {
			imp = s.getImportFor(processor, arg.Type, mutation)
			if imp == nil {
				// local
				imp = &tsimport.ImportPath{
					Import: arg.Type,
				}
			}
		} else {
			imp = knownTypes[arg.Type]
		}

		var imports []*tsimport.ImportPath
		if imp != nil {
			imports = arg.imports[:]
			imports = append(imports, imp)
		}

		ret = append(ret, &fieldConfigArg{
			// need flag of arg passed to function
			Name:    arg.Name,
			Imports: imports,
		})
	}
	return ret
}

func (qfcg *queryFieldConfigBuilder) getArgs(s *gqlSchema) []*fieldConfigArg {
	return getFieldConfigArgs(qfcg.processor, qfcg.field, s, false)
}

func (qfcg *queryFieldConfigBuilder) getReturnTypeHint() string {
	// no type hint for now
	return ""
}

func (qfcg *queryFieldConfigBuilder) getArgMap(cd *CustomData) map[string]*CustomObject {
	return cd.Args
}

func buildFieldConfigFrom(builder fieldConfigBuilder, processor *codegen.Processor, s *gqlSchema, cd *CustomData, field CustomField) (*fieldConfig, error) {
	var argImports []*tsimport.ImportPath

	if field.Connection {
		argImports = append(argImports, tsimport.NewEntGraphQLImportPath("GraphQLEdgeConnection"))
	}

	// args that "useImport" should be called on
	// assumes they're reserved somewhere else...

	addToArgImport := func(typ string) error {
		cls := cd.Classes[typ]
		if cls != nil && cls.Exported {
			path, err := getRelativeImportPath(processor, builder.getFilePath(), cls.Path)
			if err != nil {
				return err
			}
			argImports = append(argImports, &tsimport.ImportPath{
				Import:     typ,
				ImportPath: path,
			})
		}
		return nil
	}
	for _, arg := range field.Args {
		if arg.IsContextArg {
			continue
		}
		if err := addToArgImport(arg.Type); err != nil {
			return nil, err
		}
	}

	inlineContents := field.FunctionContents != ""

	if field.Node != "" {
		if err := addToArgImport(field.Node); err != nil {
			return nil, err
		}
	}

	// only add return type if we have a type hint
	if builder.getReturnTypeHint() != "" {
		for _, result := range field.Results {
			if err := addToArgImport(result.Type); err != nil {
				return nil, err
			}
		}
	}

	var conn *gqlConnection

	var functionContents []string
	argMap := builder.getArgMap(cd)

	getConnection := func(s string) (*gqlConnection, string) {
		// nodeName is root or something...
		customEdge := getRootGQLEdge(processor.Config, field)
		// RootQuery?
		conn := getGqlConnection("root", customEdge, processor)

		return conn, fmt.Sprintf(
			"return new GraphQLEdgeConnection(context.getViewer(), (v) => %s, args);",
			s,
		)
	}

	if inlineContents {
		contents := field.FunctionContents
		for _, arg := range field.Args {
			argType := argMap[arg.Type]
			if argType == nil {
				contents, imps := arg.renderArg(processor.Config, s)
				defaultArg := arg.defaultArg()
				if contents != defaultArg {
					// arg changed, so assign new value before inline contents
					// so we don't have to change the generated code
					functionContents = append(functionContents,
						fmt.Sprintf("%s=%s;", defaultArg, contents),
					)
				}
				argImports = append(argImports, imps...)
			}
		}
		if field.Connection {
			conn2, call := getConnection(fmt.Sprintf("{%s}", contents))
			conn = conn2

			functionContents = append(
				functionContents,
				call,
			)
		} else {
			functionContents = append(functionContents, contents)
		}
	} else {
		var argContents []string
		for _, arg := range field.Args {
			if arg.GraphQLOnlyArg {
				continue
			}
			if arg.IsContextArg {
				argContents = append(argContents, "context")
				continue
			}
			argType := argMap[arg.Type]
			if argType == nil {
				contents, imps := arg.renderArg(processor.Config, s)
				argContents = append(argContents, contents)
				argImports = append(argImports, imps...)
			} else {
				fields, ok := cd.Fields[arg.Type]
				if !ok {
					return nil, fmt.Errorf("type %s has no fields", arg.Type)
				}
				args := make([]string, len(fields))

				for idx, f := range fields {
					// input.foo
					args[idx] = fmt.Sprintf("%s:%s.%s", f.GraphQLName, arg.Name, f.GraphQLName)
				}
				argContents = append(argContents, fmt.Sprintf("{%s},", strings.Join(args, ",")))
			}
		}
		functionCall := fmt.Sprintf("r.%s(%s)", field.FunctionName, strings.Join(argContents, ","))

		functionContents = []string{
			fmt.Sprintf("const r = new %s();", field.Node),
		}

		if field.Connection {
			conn2, call := getConnection(functionCall)
			conn = conn2

			functionContents = append(
				functionContents,
				call,
			)
		} else {
			functionContents = append(functionContents, fmt.Sprintf("return %s;", functionCall))
		}
	}

	// fieldConfig can have connection
	result := &fieldConfig{
		Exported:         true,
		Name:             builder.getName(),
		Arg:              builder.getArg(),
		ResolveMethodArg: builder.getResolveMethodArg(),
		TypeImports:      builder.getTypeImports(processor, s),
		ArgImports:       argImports,
		// reserve and use them. no questions asked
		ReserveAndUseImports: field.ExtraImports,
		Args:                 builder.getArgs(s),
		ReturnTypeHint:       builder.getReturnTypeHint(),
		connection:           conn,
		FunctionContents:     functionContents,
	}

	return result, nil
}

func buildObjectType(processor *codegen.Processor, cd *CustomData, s *gqlSchema, item CustomItem, obj *CustomObject, destPath, gqlType string) (*objectType, error) {
	// TODO right now it depends on custom inputs and outputs being FooInput and FooPayload to work
	// we shouldn't do that and we should be smarter
	// maybe add PayloadType if no Payload suffix otherwise Payload. Same for InputType and Input
	typ := &objectType{
		Type:     fmt.Sprintf("%sType", item.Type),
		Node:     obj.NodeName,
		TSType:   item.Type,
		Exported: true,
		// input or object type
		GQLType: gqlType,
	}

	fields, ok := cd.Fields[item.Type]
	if !ok {
		return nil, fmt.Errorf("type %s has no fields", item.Type)
	}

	for _, f := range fields {
		// maybe we'll care for input vs Payload here at some point
		gqlField, err := getCustomGQLField(processor, cd, f, s, "obj")
		if err != nil {
			return nil, err
		}
		typ.Fields = append(typ.Fields, gqlField)
		typ.Imports = append(typ.Imports, gqlField.FieldImports...)
	}

	cls := cd.Classes[item.Type]
	createInterface := true
	if cls != nil {
		importPath, err := getRelativeImportPath(processor, destPath, cls.Path)
		if err != nil {
			return nil, err
		}
		if cls.DefaultExport {

			// exported, we need to import it
			typ.DefaultImports = append(typ.DefaultImports, &tsimport.ImportPath{
				ImportPath: importPath,
				Import:     item.Type,
			})
			createInterface = false
		} else if cls.Exported {
			typ.Imports = append(typ.Imports, &tsimport.ImportPath{
				ImportPath: importPath,
				Import:     item.Type,
			})
			createInterface = false
		}
	}

	if createInterface {
		// need to create an interface for it
		customInt := &interfaceType{
			Exported: false,
			Name:     item.Type,
		}
		fields, ok := cd.Fields[item.Type]
		if !ok {
			return nil, fmt.Errorf("type %s has no fields", item.Type)

		}
		for _, field := range fields {
			newInt := &interfaceField{
				Name: field.GraphQLName,
				Type: field.Results[0].Type,
				// TODO getGraphQLImportsForField???
				// here we grab import from classessss
				// but then later we need class
				UseImport: false,
				// TODO need to convert to number etc...
				// need to convert from graphql type to TS type :(
			}

			if len(field.Results) == 1 {
				result := field.Results[0]
				// check for imported paths that are being used
				if result.TSType != "" {
					newInt.Type = result.TSType
					if cls != nil {
						file := cd.Files[cls.Path]
						if file != nil {
							imp := file.Imports[newInt.Type]
							if imp != nil {
								fImp := &tsimport.ImportPath{
									Import: newInt.Type,
									// TODO this needs to be resolved to be relative...
									// for now assuming tsconfig.json paths being used
									ImportPath: imp.Path,
								}
								if imp.DefaultImport {
									typ.DefaultImports = append(typ.DefaultImports, fImp)
								} else {
									typ.Imports = append(typ.Imports, fImp)
								}
								newInt.UseImport = true
							}
						}
					}
				}
			}

			customInt.Fields = append(customInt.Fields, newInt)
		}
		typ.TSInterfaces = []*interfaceType{customInt}
	}
	return typ, nil
}

func getRelativeImportPath(processor *codegen.Processor, basepath, targetpath string) (string, error) {
	// we get absolute paths now
	// BONUS: instead of this, we should use the nice paths in tsconfig...

	// need to do any relative imports from the directory not from the file itself
	dir := filepath.Dir(basepath)
	rel, err := filepath.Rel(dir, targetpath)
	if err != nil {
		return "", err
	}

	return strings.TrimSuffix(rel, ".ts"), nil
}

func processCustomFields(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	for nodeName, fields := range cd.Fields {
		if cd.Inputs[nodeName] != nil {
			continue
		}

		if cd.Objects[nodeName] != nil {
			continue
		}

		nodeInfo := s.nodes[nodeName]
		customEdge := s.edgeNames[nodeName]

		var obj *objectType
		var instance string
		var nodeData *schema.NodeData
		if nodeInfo != nil {
			objData := nodeInfo.ObjData
			nodeData = objData.NodeData
			// always has a node for now
			obj = objData.GQLNodes[0]
			instance = nodeData.NodeInstance
		} else if customEdge {
			// create new obj
			obj = &objectType{
				GQLType: "GraphQLObjectType",
				// needed to reference the edge
				TSType: fmt.Sprintf("GraphQLEdge<%s>", nodeName),
				Node:   nodeName,
			}
			s.customEdges[nodeName] = obj
			// the edge property of GraphQLEdge is where the processor is
			instance = "edge.edge"
		} else {
			return fmt.Errorf("can't find %s node that has custom fields", nodeName)
		}

		for _, field := range fields {
			if field.Connection {
				customEdge := getGQLEdge(processor.Config, field, nodeName)
				nodeInfo.connections = append(nodeInfo.connections, getGqlConnection(nodeData.PackageName, customEdge, processor))
				addConnection(processor, nodeData, customEdge, &obj.Fields, nodeData.NodeInstance, &field)
				continue
			}

			gqlField, err := getCustomGQLField(processor, cd, field, s, instance)
			if err != nil {
				return err
			}
			// append the field
			obj.Fields = append(obj.Fields, gqlField)
			for _, imp := range gqlField.FieldImports {
				imported := false
				// TODO change this to allow multiple imports and the reserveImport system handles this
				// this is just a temporary fix...
				for _, obImp := range obj.Imports {
					if imp.Import == obImp.Import {
						imported = true
						break
					}
				}
				if !imported {
					obj.Imports = append(obj.Imports, imp)
				}
			}
			//			obj.Imports = append(obj.Imports, gqlField.FieldImports...)

			// check if we have a new custom field to add
			// because we're currently adding to current file, it can get lost
			for _, result := range field.Results {

				customObj := cd.Objects[result.Type]
				if customObj == nil {
					continue
				}

				if nodeInfo == nil {
					return fmt.Errorf("custom objects not referenced in top level queries and mutations can only be referenced in ent nodes")
				}

				objType, err := buildObjectType(processor, cd, s, result, customObj, nodeInfo.FilePath, "GraphQLObjectType")
				if err != nil {
					return err
				}

				nodeInfo.ObjData.GQLNodes = append(nodeInfo.ObjData.GQLNodes, objType)
			}
		}
	}
	return nil
}

func isConnection(field *CustomField) bool {
	if len(field.Results) != 1 {
		return false
	}
	return field.Results[0].Connection
}

func getCustomGQLField(processor *codegen.Processor, cd *CustomData, field CustomField, s *gqlSchema, instance string) (*fieldType, error) {
	if field.Connection {
		return nil, fmt.Errorf("field is a connection. this should be handled elsewhere")
	}
	imports, err := getGraphQLImportsForField(processor, cd, field, s)
	if err != nil {
		return nil, err
	}
	gqlField := &fieldType{
		Name:               field.GraphQLName,
		HasResolveFunction: false,
		FieldImports:       imports,
		Description:        field.Description,
	}

	var args []string
	for _, arg := range field.Args {
		if arg.IsContextArg {
			args = append(args, "context")
			continue
		}
		args = append(args, fmt.Sprintf("args.%s", arg.Name))

		cfgArg := &fieldConfigArg{
			Name: arg.Name,
		}

		imps, err := arg.getImports(processor, s, cd)
		if err != nil {
			return nil, err
		}
		cfgArg.Imports = append(cfgArg.Imports, imps...)

		gqlField.Args = append(gqlField.Args, cfgArg)
	}

	switch field.FieldType {
	case Accessor, Field:
		// for an accessor or field, we only add a resolve function if named differently
		// or if the instance is something like edge.edge
		if field.GraphQLName != field.FunctionName || strings.Contains(instance, ".") {
			gqlField.HasResolveFunction = true
			gqlField.FunctionContents = []string{
				fmt.Sprintf("return %s.%s;", instance, field.FunctionName),
			}
		}

	case Function, AsyncFunction:
		gqlField.HasAsyncModifier = field.FieldType == AsyncFunction
		gqlField.HasResolveFunction = true
		gqlField.FunctionContents = []string{
			fmt.Sprintf("return %s.%s(%s);", instance, field.FunctionName, strings.Join(args, ",")),
		}
	}

	return gqlField, nil
}

func processCustomMutations(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	cm := &customMutationsProcesser{}
	return cm.process(processor, cd, s)
}

func processCustomQueries(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	cq := &customQueriesProcesser{}
	return cq.process(processor, cd, s)
}

func processCusomTypes(processor *codegen.Processor, cd *CustomData, s *gqlSchema) error {
	for _, typ := range cd.CustomTypes {
		if len(typ.EnumMap) == 0 {
			continue
		}

		// todo type tstype empty
		tsType := typ.TSType
		if tsType == "" {
			tsType = typ.Type
		}

		_, gql := enum.GetEnums(&enum.Input{
			EnumMap:            typ.EnumMap,
			TSName:             tsType,
			GQLName:            typ.Type,
			GQLType:            typ.Type + "Type",
			DisableUnknownType: true,
		})
		if s.enums[gql.Type] != nil {
			return fmt.Errorf("enum name %s already exists", gql.Type)
		}

		path := getFilePathForEnum(processor.Config, gql.Name)
		if typ.InputType {
			path = getFilePathForEnumInputFile(processor.Config, gql.Type)

		}
		s.enums[gql.Type] = &gqlEnum{
			Type:     gql.Type,
			Enum:     gql,
			FilePath: path,
		}
	}
	return nil
}

func getGraphQLImportsForField(processor *codegen.Processor, cd *CustomData, f CustomField, s *gqlSchema) ([]*tsimport.ImportPath, error) {
	var imports []*tsimport.ImportPath

	for _, result := range f.Results {

		imps, err := result.getImports(processor, s, cd)
		if err != nil {
			return nil, err
		}
		imports = append(imports, imps...)
	}
	return imports, nil
}

type customGraphQLEdge interface {
	isCustomEdge() bool
}

type CustomEdge struct {
	SourceNodeName string
	EdgeName       string
	graphqlName    string
	Type           string
}

func (e *CustomEdge) isCustomEdge() bool {
	return true
}

func (e *CustomEdge) GetEdgeName() string {
	return e.EdgeName
}

func (e *CustomEdge) GetNodeInfo() nodeinfo.NodeInfo {
	return nodeinfo.GetNodeInfo(e.Type)
}

func (e *CustomEdge) GetEntConfig() *edge.EntConfigInfo {
	return edge.GetEntConfigFromName(e.Type)
}

func (e *CustomEdge) GraphQLEdgeName() string {
	return e.graphqlName
}

func (e *CustomEdge) CamelCaseEdgeName() string {
	return strcase.ToCamel(e.EdgeName)

}

func (e *CustomEdge) HideFromGraphQL() bool {
	return false
}

func (e *CustomEdge) GetTSGraphQLTypeImports() []*tsimport.ImportPath {
	return []*tsimport.ImportPath{
		tsimport.NewGQLClassImportPath("GraphQLNonNull"),
		tsimport.NewLocalEntConnectionImportPath(e.GetGraphQLConnectionName()),
	}
}

func (e *CustomEdge) PolymorphicEdge() bool {
	return false
}

func (e *CustomEdge) GetSourceNodeName() string {
	return strcase.ToCamel(e.SourceNodeName)
}

func (e *CustomEdge) GetGraphQLEdgePrefix() string {
	return fmt.Sprintf("%sTo%s", strcase.ToCamel(e.SourceNodeName), strcase.ToCamel(e.EdgeName))

}

func (e *CustomEdge) GetGraphQLConnectionName() string {
	return fmt.Sprintf("%sTo%sConnection", strcase.ToCamel(e.SourceNodeName), strcase.ToCamel(e.EdgeName))
}

func (e *CustomEdge) GetGraphQLConnectionType() string {
	return fmt.Sprintf("%sTo%sConnectionType", strcase.ToCamel(e.SourceNodeName), strcase.ToCamel(e.EdgeName))
}

func (e *CustomEdge) TsEdgeQueryEdgeName() string {
	// For CustomEdge, we only use this with GraphQLConnectionType and the EdgeType is "Data"
	return "Data"
}

func (e *CustomEdge) TsEdgeQueryName() string {
	return fmt.Sprintf("%sTo%sQuery", strcase.ToCamel(e.SourceNodeName), strcase.ToCamel(e.EdgeName))
}

func (e *CustomEdge) UniqueEdge() bool {
	return false
}

var _ edge.Edge = &CustomEdge{}
var _ edge.ConnectionEdge = &CustomEdge{}

func getGQLEdge(cfg codegenapi.Config, field CustomField, nodeName string) *CustomEdge {
	edgeName := field.GraphQLName
	if field.EdgeName != "" {
		edgeName = field.EdgeName
	}
	return &CustomEdge{
		SourceNodeName: nodeName,
		Type:           field.Results[0].Type,
		graphqlName:    codegenapi.GraphQLName(cfg, field.GraphQLName),
		EdgeName:       edgeName,
	}
}

func getRootGQLEdge(cfg codegenapi.Config, field CustomField) *CustomEdge {
	return getGQLEdge(cfg, field, "root")
}
