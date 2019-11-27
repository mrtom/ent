package action

import (
	"fmt"
	"go/ast"
	"regexp"
	"strconv"

	"github.com/iancoleman/strcase"
	"github.com/lolopinto/ent/ent"

	"github.com/lolopinto/ent/internal/codegen"
	"github.com/lolopinto/ent/internal/edge"

	"github.com/lolopinto/ent/internal/astparser"
	"github.com/lolopinto/ent/internal/field"
	"github.com/lolopinto/ent/internal/util"
)

type NonEntField struct {
	FieldName string
	FieldType field.FieldType
	Flag      string
	NodeType  string
}

func (f *NonEntField) GetGraphQLName() string {
	return strcase.ToLowerCamel(f.FieldName)
}

type Action interface {
	GetFields() []*field.Field
	// TODO make this a generic abstraction. have run into this in other places
	GetNonEntFields() []*NonEntField
	GetEdges() []*edge.AssociationEdge
	GetActionName() string
	ExposedToGraphQL() bool
	GetGraphQLName() string
	MutatingExistingObject() bool // whether to add User, Note etc params
	GetNodeInfo() codegen.NodeInfo
	GetOperation() ent.ActionOperation
	IsDeletingNode() bool
}

type ActionInfo struct {
	Actions          []Action
	graphQLActionMap map[string]Action
	actionMap        map[string]Action
	// CreateAction     *Action
	// EditAction       *Action
	// DeleteAction     *Action
}

func NewActionInfo() *ActionInfo {
	ret := &ActionInfo{}
	ret.graphQLActionMap = make(map[string]Action)
	ret.actionMap = make(map[string]Action)
	return ret
}

func (info *ActionInfo) GetByGraphQLName(name string) Action {
	return info.graphQLActionMap[name]
}

func (info *ActionInfo) GetByName(name string) Action {
	return info.actionMap[name]
}

func (info *ActionInfo) addActions(actions ...Action) {
	for _, action := range actions {
		info.Actions = append(info.Actions, action)
		actionName := action.GetActionName()
		_, ok := info.actionMap[actionName]
		if ok {
			panic(
				fmt.Errorf("action with name %s already exists. cannot have multiple actions with the same name", actionName),
			)
		}
		info.actionMap[actionName] = action

		if !action.ExposedToGraphQL() {
			continue
		}
		graphQLActionName := action.GetGraphQLName()
		_, ok = info.graphQLActionMap[graphQLActionName]
		if ok {
			panic(
				fmt.Errorf("graphql action with name %s already exists. cannot have multiple actions with the same name", graphQLActionName),
			)
		}
		info.graphQLActionMap[graphQLActionName] = action
	}
}

type commonActionInfo struct {
	ActionName      string
	ExposeToGraphQL bool
	GraphQLName     string
	Fields          []*field.Field
	NonEntFields    []*NonEntField
	Edges           []*edge.AssociationEdge // for edge actions for now but eventually other actions
	Operation       ent.ActionOperation
	codegen.NodeInfo
}

func (action *commonActionInfo) GetActionName() string {
	return action.ActionName
}

func (action *commonActionInfo) ExposedToGraphQL() bool {
	return action.ExposeToGraphQL
}

func (action *commonActionInfo) GetGraphQLName() string {
	return action.GraphQLName
}

func (action *commonActionInfo) GetFields() []*field.Field {
	return action.Fields
}

func (action *commonActionInfo) GetEdges() []*edge.AssociationEdge {
	return action.Edges
}

func (action *commonActionInfo) GetNonEntFields() []*NonEntField {
	return action.NonEntFields
}

func (action *commonActionInfo) GetNodeInfo() codegen.NodeInfo {
	return action.NodeInfo
}

func (action *commonActionInfo) GetOperation() ent.ActionOperation {
	return action.Operation
}

func (action *commonActionInfo) IsDeletingNode() bool {
	return action.Operation == ent.DeleteAction
}

type CreateAction struct {
	commonActionInfo
}

type mutationExistingObjAction struct {
	commonActionInfo
}

func (action *mutationExistingObjAction) MutatingExistingObject() bool {
	return true
}

func (action *CreateAction) MutatingExistingObject() bool {
	return false
}

type EditAction struct {
	commonActionInfo
	mutationExistingObjAction
}

type DeleteAction struct {
	commonActionInfo
	mutationExistingObjAction
}

type AddEdgeAction struct {
	commonActionInfo
	mutationExistingObjAction
}

type RemoveEdgeAction struct {
	commonActionInfo
	mutationExistingObjAction
}

type EdgeGroupAction struct {
	commonActionInfo
	mutationExistingObjAction
}

func ParseActions(nodeName string, fn *ast.FuncDecl, fieldInfo *field.FieldInfo, edgeInfo *edge.EdgeInfo) *ActionInfo {
	// get the actions in the function
	elts := astparser.GetEltsInFunc(fn)

	actionInfo := NewActionInfo()

	for _, expr := range elts {
		// hardcode to unary expressions for now but this may not be what we want

		compositeLit := astparser.GetComposeLitInUnaryExpr(expr)
		typeName := astparser.GetTypeNameFromExpr(compositeLit.Type)

		if typeName != "ent.ActionConfig" {
			util.Die(
				fmt.Errorf("expected the type to be ent.ActionConfig, got %s instead", typeName),
			)
		}

		actionInfo.addActions(parseActions(nodeName, compositeLit, fieldInfo)...)
	}

	if edgeInfo != nil {
		for _, assocEdge := range edgeInfo.Associations {
			if assocEdge.EdgeAction == nil {
				continue
			}
			actionInfo.addActions(processEdgeAction(nodeName, assocEdge))

		}

		for _, assocGroup := range edgeInfo.AssocGroups {
			if assocGroup.EdgeAction == nil {
				continue
			}
			actionInfo.addActions(processEdgeGroupAction(nodeName, assocGroup))

		}
	}

	return actionInfo
}

// FieldActionTemplateInfo is passed to codegeneration template (both action and graphql) to generate
// the code needed for actions
type FieldActionTemplateInfo struct {
	SetterMethodName         string
	NullableSetterMethodName string
	GetterMethodName         string
	InstanceName             string
	InstanceType             string
	FieldKey                 string
	FieldName                string
	QuotedFieldName          string
	QuotedDBName             string
	InverseEdge              *edge.AssociationEdge
	IsStatusEnum             bool
	IsGroupID                bool
	NodeType                 string
	Field                    *field.Field
}

func GetActionMethodName(action Action) string {
	r := regexp.MustCompile(`(\w+)Action`)

	// TODO need to verify that any name ends with Action or EntAction.
	match := r.FindStringSubmatch(action.GetActionName())
	if len(match) != 2 {
		panic("invalid action name which should have been caught in validation. action names should end with Action or EntAction")
	}
	return match[1]
}

func GetFields(action Action) []FieldActionTemplateInfo {
	return GetFieldsFromFields(action.GetFields())
}

// TODO abstract this out somewhere else...
func GetFieldsFromFields(fields []*field.Field) []FieldActionTemplateInfo {
	var result []FieldActionTemplateInfo

	for _, f := range fields {

		result = append(result, FieldActionTemplateInfo{
			SetterMethodName:         "Set" + f.FieldName,
			NullableSetterMethodName: "SetNilable" + f.FieldName,
			GetterMethodName:         "Get" + f.FieldName,
			InstanceName:             strcase.ToLowerCamel(f.FieldName),
			InstanceType:             field.GetNonNilableType(f),
			FieldName:                f.FieldName,
			QuotedFieldName:          strconv.Quote(f.FieldName),
			QuotedDBName:             f.GetQuotedDBColName(),
			InverseEdge:              f.InverseEdge,
			Field:                    f,
		})
	}
	return result
}

func GetNonEntFields(action Action) []FieldActionTemplateInfo {
	var fields []FieldActionTemplateInfo

	for _, f := range action.GetNonEntFields() {

		fields = append(fields, FieldActionTemplateInfo{
			SetterMethodName: "Add" + f.FieldName,
			InstanceName:     strcase.ToLowerCamel(f.FieldName),
			InstanceType:     "string", // TODO this needs to work for other
			FieldName:        f.FieldName,
			IsStatusEnum:     f.Flag == "Enum", // TODO best way?
			IsGroupID:        f.Flag == "ID",
			NodeType:         f.NodeType,
		})
	}
	return fields
}

type EdgeActionTemplateInfo struct {
	AddMethodName    string
	RemoveMethodName string
	EdgeName         string
	InstanceName     string
	InstanceType     string
	//	AssocEdge    *edge.AssociationEdge
	EdgeConst string
	NodeType  string
	Node      string
	NodeID    string
}

func GetEdges(action Action) []EdgeActionTemplateInfo {
	return GetEdgesFromEdges(action.GetEdges())
}

// ALso TODO...
func GetEdgesFromEdges(edges []*edge.AssociationEdge) []EdgeActionTemplateInfo {
	var result []EdgeActionTemplateInfo

	for _, edge := range edges {
		edgeName := edge.GetEdgeName()

		result = append(result, EdgeActionTemplateInfo{
			Node: edge.NodeInfo.Node,
			// TODO this needs to be updated for actions
			AddMethodName:    "Add" + edge.EdgeName,
			RemoveMethodName: "Remove" + edge.EdgeName,
			EdgeName:         edgeName,
			InstanceName:     edge.NodeInfo.NodeInstance,
			InstanceType:     fmt.Sprintf("*models.%s", edge.NodeInfo.Node),
			EdgeConst:        edge.EdgeConst,
			//AssocEdge:    edge,
			NodeType: edge.NodeInfo.NodeType,
			// matches what we do in processAction
			NodeID: fmt.Sprintf("%sID", edge.EdgeName),
		})
	}

	return result
}

func IsRequiredField(action Action, field *field.Field) bool {
	// for non-create actions, not required
	if action.GetOperation() != ent.CreateAction {
		return false
	}
	// for a nullable field or something with a default value, don't make it required...
	if field.Nullable() || field.DefaultValue() != nil {
		return false
	}
	return true
}