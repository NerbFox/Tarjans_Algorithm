package handlers

import (
    "fmt"
    "net/http"
    "nerb-tarjans-be/functions"
    "encoding/json"
    "io/ioutil"
)


func SomeHandler(w http.ResponseWriter, r *http.Request) {
    // Your handler logic here
    fmt.Fprintln(w, "Hello from SomeHandler!")
    fmt.Fprintln(w, "This is a sample response!")
    fmt.Println("Endpoint hit: SomeHandler")
    // Call the function hello from functions/algo.go hello is a function that returns a string "Hello, World!"
    var a string = functions.Hello()
    // var b string = functions.Hello2()
    fmt.Fprintln(w, a)
    // fmt.Fprintln(w, b)
}

type InputData struct {
    Edges [][]string `json:"edges"`
}

type OutputData struct {
    Sccs    [][]string `json:"sccs"`
    Bridges [][]string `json:"bridges"`
}
// funcion TarjansHandler get a json object with the edges of a graph and returns the strongly connected components and the bridges of the graph
//  example from fe 
//  example edges
// A B
// B C
// C A
// B D
// D E
// E F
// F E
// example of input json:
// {
//     "edges": [ "A B C D E F" ] -> this is a string with the edges of the graph
// }
// output fe
// [['A', 'B', 'A'], ['B', 'C', 'A', 'B'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['D', 'E', 'F', 'D'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['G', 'H', 'I', 'G'], ['J', 'K', 'L', 'M', 'J'], ['R']]
// example of output json:
// {
    //     "sccs": [ ['A', 'B', 'A'], ['B', 'C', 'A', 'B'], ['D', 'E', 'F', 'D'], ['G', 'H', 'I', 'G'], ['J', 'K', 'L', 'M', 'J'], ['R'] ],
    //     "bridges": [ ['A', 'B'], ['B', 'C'], ['D', 'E'], ['E', 'F'], ['G', 'H'], ['H', 'I'], ['J', 'K'], ['K', 'L'], ['L', 'M'] ]
    // }
    
// func TarjansHandler is POST method

func TarjansHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    // Read the JSON input from the request body
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read request body", http.StatusInternalServerError)
        return
    }

    // Parse the JSON input into InputData struct
    var inputData InputData
    err = json.Unmarshal(body, &inputData)
    if err != nil {
        http.Error(w, "Failed to parse JSON input", http.StatusBadRequest)
        return
    }
    // Call the Tarjans function from functions/algo.go
    resultSccs, resultBridges := functions.TarjansSCC(inputData.Edges)
    // Create a new OutputData struct
    outputData := OutputData{
        Sccs: resultSccs,
        Bridges: resultBridges,
    }

    // Convert the OutputData struct into JSON
    outputJSON, err := json.Marshal(outputData)
    if err != nil {
        http.Error(w, "Failed to marshal JSON output", http.StatusInternalServerError)
        return
    }

    // Write the JSON output to the response body
    w.Header().Set("Content-Type", "application/json")
    w.Write(outputJSON)
}
