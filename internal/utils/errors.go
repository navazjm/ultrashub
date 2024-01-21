package utils

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrEditConflict   = errors.New("edit conflict")
	ErrDuplicateEmail = errors.New("duplicate email")
)

func LogError(logger *slog.Logger, r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	logger.Error(err.Error(), "method", method, "uri", uri)
}

func ErrorResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request, status int, message any) {
	env := Envelope{"error": message}

	err := WriteJSON(w, status, env, nil)
	if err != nil {
		LogError(logger, r, err)
		w.WriteHeader(500)
	}
}

func ServerErrorResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request, err error) {
	LogError(logger, r, err)

	message := "the server encountered a problem and could not process your request"
	ErrorResponse(logger, w, r, http.StatusInternalServerError, message)
}

func NotFoundResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := "the requested resource could not be found"
	ErrorResponse(logger, w, r, http.StatusNotFound, message)
}

func MethodNotAllowedResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := fmt.Sprintf("the %s method is not supported for this resource", r.Method)
	ErrorResponse(logger, w, r, http.StatusMethodNotAllowed, message)
}

func BadRequestResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request, err error) {
	ErrorResponse(logger, w, r, http.StatusBadRequest, err.Error())
}

func FailedValidationResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request, errors map[string]string) {
	ErrorResponse(logger, w, r, http.StatusUnprocessableEntity, errors)
}

func EditConflictResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := "unable to update the record due to an edit conflict, please try again"
	ErrorResponse(logger, w, r, http.StatusConflict, message)
}

func RateLimitExceededResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := "rate limit exceeded"
	ErrorResponse(logger, w, r, http.StatusTooManyRequests, message)
}

func InvalidCredentialsResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := "invalid authentication credentials"
	ErrorResponse(logger, w, r, http.StatusUnauthorized, message)
}

func InvalidAuthenticationTokenResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	w.Header().Set("WWW-Authenticate", "Bearer")

	message := "invalid or missing authentication token"
	ErrorResponse(logger, w, r, http.StatusUnauthorized, message)
}

func AuthenticationRequiredResponse(logger *slog.Logger, w http.ResponseWriter, r *http.Request) {
	message := "you must be authenticated to access this resource"
	ErrorResponse(logger, w, r, http.StatusUnauthorized, message)
}
