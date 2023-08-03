package routes

import (
    // "net/http"

    "github.com/gorilla/mux"
    "nerb-tarjans-be/handlers"
)

func SetupRoutes() *mux.Router {
    r := mux.NewRouter()
    // get all sscs, accepting input edges in json format
    r.HandleFunc("/api/tarjans", handlers.TarjansHandler).Methods("POST")
    // r.HandleFunc("/api/something", handlers.SomeHandler).Methods("GET")
    // Add more routes here

    return r
};