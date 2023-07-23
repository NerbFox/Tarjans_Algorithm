package main

import (
    "fmt"
    "net/http"
    "nerb-tarjans-be/routes"
)

func main() {
    const port = 5001
    r := routes.SetupRoutes()
    fmt.Println("Starting server on port ", port)
    err := http.ListenAndServe(fmt.Sprintf("127.0.0.1:%d", port), r)
    
    if err != nil {
        // Handle the error
        fmt.Println("Error starting server: ", err)
    }
    // listening on port 
    fmt.Println("Listening on port ", port)
}