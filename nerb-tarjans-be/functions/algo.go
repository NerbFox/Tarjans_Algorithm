package functions
// package main	// for testing purposes

import (
	"fmt"
	// "strings"
)

// func Hello that returns a string "Hello, World!"
func Hello() string {
	return "Hello, World!"
}

type Graph struct {
	nodes      map[string]bool
	vertices   int
	adjList    map[string][]string
	time       int
	discovery  map[string]int
	lowLink    map[string]int
	onStack    map[string]bool
	stack      []string
	sccs       [][]string
	bridges    [][]string
}

type GraphBridges struct {
	nodes     map[string]bool
	adjList   map[string][]string
	discovery map[string]int
	lowLink   map[string]int
	bridges   [][]string
	time      int
}

func TarjansSCC(edges [][]string) ([][]string, [][]string) {
	fmt.Println("\nTarjansSCC()")
	graph := Graph{
		nodes:      make(map[string]bool), // nodes in the graph
		vertices:   0, // number of vertices in the graph
		adjList:    make(map[string][]string), // adjacency list representation of the graph
		time:       0,	// time counter for discovery and lowLink
		discovery:  make(map[string]int), // discovery time for each vertex
		lowLink:    make(map[string]int), // lowLink for each vertex 
		// lowLink is the smallest discovery time of any vertex reachable from the current vertex
		onStack:    make(map[string]bool), // whether a vertex is on the stack or not
		stack:      []string{}, // stack of vertices
		sccs:       [][]string{}, // strongly connected components
		bridges:    [][]string{}, // bridges
	}
	
	// Build the graph from the given edges
	for _, edge := range edges {
		from, to := edge[0], edge[1]
		if _, ok := graph.adjList[from]; !ok {
			graph.adjList[from] = []string{}
			graph.vertices++
		}
		graph.adjList[from] = append(graph.adjList[from], to)
	}
	// fmt.Println("graph.adjList:" , graph.adjList)
	// fmt.Println("graph.vertices:" , graph.vertices)

	// Run Tarjan's algorithm for each vertex in the graph
	for vertex := range graph.adjList {
		if graph.discovery[vertex] == 0 { // vertex has not been visited yet
			graph.tarjan(vertex) // run Tarjan's algorithm
		}
	}
	graph.findBridges(edges)
	fmt.Println("graph.bridges:", graph.bridges)
	fmt.Println("graph.sccs:", graph.sccs)
	return graph.sccs, graph.bridges
}

func (g *Graph) tarjan(u string) {
	// increment the time
	g.time++
	// fmt.Println("\nu:", u)
	// fmt.Println("g.time:", g.time)

	// set the discovery and lowLink with the current time for vertex u
	g.discovery[u] = g.time 
	g.lowLink[u] = g.time
	// fmt.Println("g.lowLink:", g.lowLink)
	// fmt.Println("g.discovery:", g.discovery)
	
	// push u to the stack and set onStack to true
	g.stack = append(g.stack, u)
	// set onStack for vertex u to true
	g.onStack[u] = true
	
	// for each neighbor v of vertex u
	for _, v := range g.adjList[u] { 
		if g.discovery[v] == 0 { // if v has not been visited yet
			g.tarjan(v) // run Tarjan's algorithm for v
			// update lowLink[u] with the minimum of lowLink u and lowLink v
			g.lowLink[u] = min(g.lowLink[u], g.lowLink[v]) 
			// Check if the edge (u, v) is a bridge
			// if g.lowLink[v] > g.discovery[u] {
			// 	g.bridges = append(g.bridges, []string{u, v})
			// }
		} else if g.onStack[v] { // if v is on the stack
			// update lowLink[u] with the minimum of lowLink u and discovery v
			g.lowLink[u] = min(g.lowLink[u], g.discovery[v]) 
		}
	}

	// If u is a root node of an SCC
	if g.lowLink[u] == g.discovery[u] { // if lowLink u is equal to discovery u
		scc := []string{}
		// pop nodes off the stack until u is reached
		for {
			node := g.stack[len(g.stack)-1]
			g.stack = g.stack[:len(g.stack)-1]
			g.onStack[node] = false
			scc = append(scc, node)
			if node == u {
				break
			}
		}
		// reverse the order of the strongly connected component
		for i, j := 0, len(scc)-1; i < j; i, j = i+1, j-1 {
			scc[i], scc[j] = scc[j], scc[i]
		}
		// append first node to the end of the slice
		scc = append(scc, scc[0])
		// append the strongly connected component to the graph
		g.sccs = append(g.sccs, scc)
	}
}

func (g *Graph) findBridges(edges [][]string) {
	
	fmt.Println("\nfindBridges()\n")
	bridges := TarjansBridges(edges)
	for _, bridge := range bridges {
		if !contains(edges, bridge) {
			fmt.Println("bridge not in g.bridges:", bridge)
			bridge[0], bridge[1] = bridge[1], bridge[0]
		}
	}
	g.bridges = append(g.bridges, bridges...)
}

func TarjansBridges(edges [][]string) [][]string {
	// Initialize the graphBridges
	g := GraphBridges{
		nodes:     make(map[string]bool),
		adjList:   make(map[string][]string),
		discovery: make(map[string]int),
		lowLink:   make(map[string]int),
		bridges:   make([][]string, 0),
		time:      0,
	}

	// Add nodes and edges to the graphBridges
	for _, edge := range edges {
		u, v := edge[0], edge[1]
		g.nodes[u] = true
		g.nodes[v] = true
		g.adjList[u] = append(g.adjList[u], v)
		g.adjList[v] = append(g.adjList[v], u) // For undirected graphBridges
	}

	// Perform Tarjan's algorithm to find bridges
	for node := range g.nodes {
		if g.discovery[node] == 0 {
			g.tarjans_b(node, "")
		}
	}

	return g.bridges
}

func (g *GraphBridges) tarjans_b(u, parent string) {
	g.time++
	g.discovery[u] = g.time
	g.lowLink[u] = g.time

	for _, v := range g.adjList[u] {
		if v == parent {
			continue // Skip if v is the parent of u
		}

		if g.discovery[v] == 0 { // If v is not yet visited
			g.tarjans_b(v, u)
			g.lowLink[u] = min(g.lowLink[u], g.lowLink[v])

			// Check if the edge (u, v) is a bridge
			if g.lowLink[v] > g.discovery[u] {
				g.bridges = append(g.bridges, []string{u, v})
			}
		} else {
			// Update lowLink of u for back edge
			g.lowLink[u] = min(g.lowLink[u], g.discovery[v])
		}
	}
}

func contains(edges [][]string, bridge []string) bool {
	for _, edge := range edges {
		if edge[0] == bridge[0] && edge[1] == bridge[1] {
			return true
		}
	}
	return false
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// func main() {
// 	edges := [][]string{
// 		{"a", "b"},
// 		{"b", "c"},
// 		{"c", "a"},
// 		{"b", "d"},
// 		{"d", "e"},
// 		{"e", "f"},
// 		{"f", "e"},
// 	}

// 	TarjansSCC(edges)

// }
// fmt.Println("Strongly Connected Components (SCCs):")
// for _, scc := range sccs {
// 	fmt.Println(scc)
// }

// fmt.Println("Bridges:")
// for _, bridge := range bridges {
// 	fmt.Println(bridge)
// }


// convert edges to array of edges, each edge is an array of two nodes
// make an array of one element with split " "
// edgesA := strings.Fields(edges)

// edgesArray := make([][]string, len(edges)/2)
// j := 0
// for i := 0; i < len(edges)/2; i++ {
// 	edgesArray[i] = []string{string(edges[j]), string(edges[j+1])}
// 	j += 2
// }
	
// for /

// // convert edges to a graph
// graph := make(map[string][]string)
// for _, edge := range edges {
// 	// split the edge into two nodes
// 	nodes := strings.Split(edge, " ")
// 	// add the nodes to the graph
// 	graph[nodes[0]] = append(graph[nodes[0]], nodes[1])
// }
