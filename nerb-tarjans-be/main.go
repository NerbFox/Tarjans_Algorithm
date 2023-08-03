package main

import (
	"fmt"
	"nerb-tarjans-be/routes"
	"net/http"
    "github.com/rs/cors"
	// "strings"
)

func main() {
    const port = 5001
    r := routes.SetupRoutes()
    // cors
    c := cors.Default().Handler(r)

    fmt.Println("Starting server on port ", port)
    err := http.ListenAndServe(fmt.Sprintf("127.0.0.1:%d", port), c)
    
    if err != nil {
        // Handle the error
        fmt.Println("Error starting server: ", err)
    }
    // listening on port 
    fmt.Println("Listening on port ", port)
}

// import (
// 	"fmt"
// 	"strings"
// )

// func main() {

//     a := "A B C D Efg a8u*     F"
//     arrA := strings.Fields(a)
//     for i := 0; i < len(arrA); i++ {
//         arrA[i] += "a"
//         fmt.Println(arrA[i])
//     }
// }
