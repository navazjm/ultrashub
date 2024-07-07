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
)

func LogError(r *http.Request, logger *slog.Logger, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
	)

	logger.Error(err.Error(), "method", method, "uri", uri)
}

func ErrorResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger, status int, message any) {
	env := Envelope{"error": message}

	err := WriteJSON(w, status, env, nil)
	if err != nil {
		LogError(r, logger, err)
		w.WriteHeader(500)
	}
}

func ServerErrorResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger, err error) {
	LogError(r, logger, err)

	message := "the server encountered a problem and could not process your request"
	ErrorResponse(w, r, logger, http.StatusInternalServerError, message)
}

func NotFoundResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	message := "the requested resource could not be found"
	ErrorResponse(w, r, logger, http.StatusNotFound, message)
}

func MethodNotAllowedResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	message := fmt.Sprintf("the %s method is not supported for this resource", r.Method)
	ErrorResponse(w, r, logger, http.StatusMethodNotAllowed, message)
}

func BadRequestResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger, err error) {
	ErrorResponse(w, r, logger, http.StatusBadRequest, err.Error())
}

func FailedValidationResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger, errors map[string]string) {
	ErrorResponse(w, r, logger, http.StatusUnprocessableEntity, errors)
}

func EditConflictResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	message := "unable to update the record due to an edit conflict, please try again"
	ErrorResponse(w, r, logger, http.StatusConflict, message)
}

func RateLimitExceededResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	message := "rate limit exceeded"
	ErrorResponse(w, r, logger, http.StatusTooManyRequests, message)
}

func InvalidAuthenticationTokenResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	w.Header().Set("WWW-Authenticate", "Bearer")

	message := "invalid or missing authentication token"
	ErrorResponse(w, r, logger, http.StatusUnauthorized, message)
}

func AuthenticationRequiredResponse(w http.ResponseWriter, r *http.Request, logger *slog.Logger) {
	message := "you must be authenticated to access this resource"
	ErrorResponse(w, r, logger, http.StatusUnauthorized, message)
}
