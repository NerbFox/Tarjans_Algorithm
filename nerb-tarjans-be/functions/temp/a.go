package main

import "fmt"

type Graph struct {
	nodes     map[string]bool
	adjList   map[string][]string
	discovery map[string]int
	lowLink   map[string]int
	stack     []string
	sccs      [][]string
	bridges   [][]string
	time      int
}

func TarjansSCC(edges [][]string) ([][]string, [][]string) {
	// Initialize the graph
	g := Graph{
		nodes:     make(map[string]bool),
		adjList:   make(map[string][]string),
		discovery: make(map[string]int),
		lowLink:   make(map[string]int),
		stack:     make([]string, 0),
		sccs:      make([][]string, 0),
		bridges:   make([][]string, 0),
		time:      0,
	}

	// Add nodes and edges to the graph
	for _, edge := range edges {
		u, v := edge[0], edge[1]
		g.nodes[u] = true
		g.nodes[v] = true
		g.adjList[u] = append(g.adjList[u], v)
		g.adjList[v] = append(g.adjList[v], u) // For undirected graph
	}
	fmt.Println(g.adjList)

	// Perform Tarjan's algorithm on each unvisited node
	for node := range g.nodes {
		if g.discovery[node] == 0 {
			g.tarjans(node, "")
		}
	}

	return g.sccs, g.bridges
}

func (g *Graph) tarjans(u, parent string) {
	g.time++
	g.discovery[u] = g.time
	g.lowLink[u] = g.time
	g.stack = append(g.stack, u)

	for _, v := range g.adjList[u] {
		if v == parent {
			continue // Skip if v is the parent of u
		}

		if g.discovery[v] == 0 { // If v is not yet visited
			g.tarjans(v, u)
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

	// If u is a root node of SCC
	if g.lowLink[u] == g.discovery[u] {
		var scc []string
		for {
			node := g.stack[len(g.stack)-1]
			g.stack = g.stack[:len(g.stack)-1]
			scc = append(scc, node)
			g.lowLink[node] = len(g.nodes) + 1 // Reset the lowLink value for SCC root
			if node == u {
				break
			}
		}
		g.sccs = append(g.sccs, scc)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func main() {
	edges := [][]string{
		{"a", "b"},
		{"b", "c"},
		{"c", "a"},
		{"b", "d"},
		{"d", "e"},
		{"e", "f"},
		{"f", "e"},
	}

	sccs, bridges := TarjansSCC(edges)
	fmt.Println("SCCs:", sccs)
	fmt.Println("Bridges:", bridges)
}
