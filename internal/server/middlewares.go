package server

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"golang.org/x/time/rate"

	"github.com/navazjm/ultrashub/internal/users"
	"github.com/navazjm/ultrashub/internal/utils"
)

func (srv *Server) secureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", "default-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com; img-src * data:; script-src 'self' https://cdn.usefathom.com")
		w.Header().Set("Cross-Origin-Opener-Policy", "same-origin")
		w.Header().Set("Cross-Origin-Resource-Policy", "same-origin")
		w.Header().Set("Origin-Agent-Cluster", "?1")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Strict-Transport-Security", "max-age=15552000; includeSubDomains")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-DNS-Prefetch-Control", "off")
		w.Header().Set("X-Download-Options", "noopen")
		w.Header().Set("X-Frame-Options", "deny")
		w.Header().Set("X-Permitted-Cross-Domain-Policies", "none")
		w.Header().Set("X-XSS-Protection", "0")

		next.ServeHTTP(w, r)
	})
}

func (srv *Server) logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		srv.Logger.Info(fmt.Sprintf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI()))

		next.ServeHTTP(w, r)
	})
}

func (srv *Server) recoverPanic(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				w.Header().Set("Connection", "close")
				utils.ServerErrorResponse(w, r, srv.Logger, fmt.Errorf("%s", err))
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// only really needed in dev mode, if running both frontend and backend seperately.
// not needed for production since we embed react frontend into the go binary
func (srv *Server) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")
		w.Header().Add("Vary", "Access-Control-Request-Method")
		origin := r.Header.Get("Origin")
		if origin != "" {
			for i := range srv.Config.Cors.TrustedOrigins {
				if origin != srv.Config.Cors.TrustedOrigins[i] {
					continue
				}
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				if r.Method == http.MethodOptions && r.Header.Get("Access-Control-Request-Method") != "" {
					w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, PUT, PATCH, DELETE")
					w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

					w.WriteHeader(http.StatusOK)
					return
				}
				break
			}
		}
		next.ServeHTTP(w, r)
	})

}

func (srv *Server) rateLimit(next http.Handler) http.Handler {
	// Initialize a new rate limiter which allows an average of 2 requests per second,
	// with a maximum of 8 requests in a single ‘burst’.
	limiter := rate.NewLimiter(2, 8)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow() {
			utils.RateLimitExceededResponse(w, r, srv.Logger)
			return
		}

		next.ServeHTTP(w, r)
	})
}
func (srv *Server) authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authorizationHeader := r.Header.Get("Authorization")

		if authorizationHeader == "" {
			users.ContextSetUserID(r, nil)
			next.ServeHTTP(w, r)
			return
		}

		headerParts := strings.Split(authorizationHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			utils.InvalidAuthenticationTokenResponse(w, r, srv.Logger)
			return
		}

		token := headerParts[1]

		// Verify Firebase token
		client, err := srv.UsersService.FirebaseApp.Auth(context.Background())
		if err != nil {
			utils.ServerErrorResponse(w, r, srv.Logger, err)
			return
		}

		firebaseToken, err := client.VerifyIDToken(context.Background(), token)
		if err != nil {
			utils.InvalidAuthenticationTokenResponse(w, r, srv.Logger)
			return
		}

		// Get user from token
		uid := firebaseToken.UID
		r = users.ContextSetUserID(r, &uid)
		next.ServeHTTP(w, r)
	})
}

func (srv *Server) requireAuthenticatedUser(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := users.ContextGetUserID(r)

		if userID == nil {
			utils.AuthenticationRequiredResponse(w, r, srv.Logger)
			return
		}

		next.ServeHTTP(w, r)
	})
}
