package server

import "github.com/navazjm/ultrashub/internal/webapp/core"

type Server struct {
	Application *core.Application
}

func New() *Server {
	return &Server{
		Application: core.New(),
	}
}
