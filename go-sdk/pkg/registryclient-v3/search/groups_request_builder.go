package search

import (
	"context"
	iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773 "github.com/apicurio/apicurio-registry/go-sdk/v3/pkg/registryclient-v3/models"
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f "github.com/microsoft/kiota-abstractions-go"
)

// GroupsRequestBuilder search for groups in the registry.
type GroupsRequestBuilder struct {
	i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.BaseRequestBuilder
}

// GroupsRequestBuilderGetQueryParameters returns a paginated list of all groups that match the provided filter criteria.This operation can fail for the following reasons:* A server error occurred (HTTP error `500`)
type GroupsRequestBuilderGetQueryParameters struct {
	// Filter by description.
	Description *string `uriparametername:"description"`
	// Filter by group name.
	GroupId *string `uriparametername:"groupId"`
	// Filter by one or more name/value label.  Separate each name/value pair using a colon.  Forexample `labels=foo:bar` will return only artifacts with a label named `foo`and value `bar`.
	Labels []string `uriparametername:"labels"`
	// The number of artifacts to return.  Defaults to 20.
	Limit *int32 `uriparametername:"limit"`
	// The number of artifacts to skip before starting to collect the result set.  Defaults to 0.
	Offset *int32 `uriparametername:"offset"`
	// Sort order, ascending (`asc`) or descending (`desc`).
	// Deprecated: This property is deprecated, use OrderAsSortOrder instead
	Order *string `uriparametername:"order"`
	// Sort order, ascending (`asc`) or descending (`desc`).
	OrderAsSortOrder *iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.SortOrder `uriparametername:"order"`
	// The field to sort by.  Can be one of:* `name`* `createdOn`
	// Deprecated: This property is deprecated, use OrderbyAsGroupSortBy instead
	Orderby *string `uriparametername:"orderby"`
	// The field to sort by.  Can be one of:* `name`* `createdOn`
	OrderbyAsGroupSortBy *iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.GroupSortBy `uriparametername:"orderby"`
}

// GroupsRequestBuilderGetRequestConfiguration configuration for the request such as headers, query parameters, and middleware options.
type GroupsRequestBuilderGetRequestConfiguration struct {
	// Request headers
	Headers *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestHeaders
	// Request options
	Options []i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestOption
	// Request query parameters
	QueryParameters *GroupsRequestBuilderGetQueryParameters
}

// NewGroupsRequestBuilderInternal instantiates a new GroupsRequestBuilder and sets the default values.
func NewGroupsRequestBuilderInternal(pathParameters map[string]string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *GroupsRequestBuilder {
	m := &GroupsRequestBuilder{
		BaseRequestBuilder: *i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewBaseRequestBuilder(requestAdapter, "{+baseurl}/search/groups{?description*,groupId*,labels*,limit*,offset*,order*,orderby*}", pathParameters),
	}
	return m
}

// NewGroupsRequestBuilder instantiates a new GroupsRequestBuilder and sets the default values.
func NewGroupsRequestBuilder(rawUrl string, requestAdapter i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestAdapter) *GroupsRequestBuilder {
	urlParams := make(map[string]string)
	urlParams["request-raw-url"] = rawUrl
	return NewGroupsRequestBuilderInternal(urlParams, requestAdapter)
}

// Get returns a paginated list of all groups that match the provided filter criteria.This operation can fail for the following reasons:* A server error occurred (HTTP error `500`)
// returns a GroupSearchResultsable when successful
// returns a ProblemDetails error when the service returns a 500 status code
func (m *GroupsRequestBuilder) Get(ctx context.Context, requestConfiguration *GroupsRequestBuilderGetRequestConfiguration) (iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.GroupSearchResultsable, error) {
	requestInfo, err := m.ToGetRequestInformation(ctx, requestConfiguration)
	if err != nil {
		return nil, err
	}
	errorMapping := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.ErrorMappings{
		"500": iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.CreateProblemDetailsFromDiscriminatorValue,
	}
	res, err := m.BaseRequestBuilder.RequestAdapter.Send(ctx, requestInfo, iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.CreateGroupSearchResultsFromDiscriminatorValue, errorMapping)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, nil
	}
	return res.(iefa8953a3555be741841d5395d25b8cc91d8ea997e2cc98794b61191090ff773.GroupSearchResultsable), nil
}

// ToGetRequestInformation returns a paginated list of all groups that match the provided filter criteria.This operation can fail for the following reasons:* A server error occurred (HTTP error `500`)
// returns a *RequestInformation when successful
func (m *GroupsRequestBuilder) ToGetRequestInformation(ctx context.Context, requestConfiguration *GroupsRequestBuilderGetRequestConfiguration) (*i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.RequestInformation, error) {
	requestInfo := i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.NewRequestInformationWithMethodAndUrlTemplateAndPathParameters(i2ae4187f7daee263371cb1c977df639813ab50ffa529013b7437480d1ec0158f.GET, m.BaseRequestBuilder.UrlTemplate, m.BaseRequestBuilder.PathParameters)
	if requestConfiguration != nil {
		if requestConfiguration.QueryParameters != nil {
			requestInfo.AddQueryParameters(*(requestConfiguration.QueryParameters))
		}
		requestInfo.Headers.AddAll(requestConfiguration.Headers)
		requestInfo.AddRequestOptions(requestConfiguration.Options)
	}
	requestInfo.Headers.TryAdd("Accept", "application/json")
	return requestInfo, nil
}

// WithUrl returns a request builder with the provided arbitrary URL. Using this method means any other path or query parameters are ignored.
// returns a *GroupsRequestBuilder when successful
func (m *GroupsRequestBuilder) WithUrl(rawUrl string) *GroupsRequestBuilder {
	return NewGroupsRequestBuilder(rawUrl, m.BaseRequestBuilder.RequestAdapter)
}
