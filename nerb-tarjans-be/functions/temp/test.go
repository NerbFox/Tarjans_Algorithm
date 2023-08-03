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
