package server

import "github.com/navazjm/ultrashub/internal/server/core"

type Server struct {
	Application *core.Application
}

func New() *Server {
	return &Server{
		Application: core.New(),
	}
}
