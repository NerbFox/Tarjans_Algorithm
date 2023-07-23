package handlers

import (
    "fmt"
    "net/http"
    "nerb-tarjans-be/functions"
)

func SomeHandler(w http.ResponseWriter, r *http.Request) {
    // Your handler logic here
    fmt.Fprintln(w, "Hello from SomeHandler!")
    fmt.Fprintln(w, "This is a sample response!")
    fmt.Println("Endpoint hit: SomeHandler")
    // Call the function hello from functions/algo.go hello is a function that returns a string "Hello, World!"
    var a string = functions.Hello()
    var b string = functions.Hello2()
    fmt.Fprintln(w, a)
    fmt.Fprintln(w, b)
}