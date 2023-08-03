package main

import "fmt"

type GraphBridges struct {
	nodes     map[string]bool
	adjList   map[string][]string
	discovery map[string]int
	lowLink   map[string]int
	bridges   [][]string
	time      int
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

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
func contains(edges [][]string, bridge []string) bool {
	for _, edge := range edges {
		if edge[0] == bridge[0] && edge[1] == bridge[1] {
			return true
		}
	}
	return false
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

	bridges := TarjansBridges(edges)
	for _, bridge := range bridges {
		// check if the bridge is in the correct order from the edges
		if contains(edges, bridge) == false {
			fmt.Println("bridge not in edges:", bridge)
			bridge[0], bridge[1] = bridge[1], bridge[0]
		}
	}
	fmt.Println("Bridges:", bridges)
}
