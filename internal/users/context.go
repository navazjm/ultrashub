package users

import (
	"context"
	"net/http"
)

type contextKey string

const userIDContextKey = contextKey("uid")

func ContextSetUserID(r *http.Request, uid *string) *http.Request {
	ctx := context.WithValue(r.Context(), userIDContextKey, uid)
	return r.WithContext(ctx)
}

func ContextGetUserID(r *http.Request) *string {
	uid, ok := r.Context().Value(userIDContextKey).(*string)
	if !ok {
		panic("missing user id in request context")
	}

	return uid
}
