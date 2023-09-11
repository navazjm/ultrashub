package server

import "github.com/navazjm/ultrashub/internal/server/core"

type Server struct {
	Application *core.Application
}

func NewServer() *Server {
	return &Server{
		Application: core.New(),
	}
}
