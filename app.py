from flask import *
import json
import heapq
import os



app =  Flask(__name__)



with open('data/airports.json') as f :
    airports  = json.load(f)




graph = {}
for airport in airports:
    graph[airport['code']]= airport['connections']


def diskatra(graph, start ,end ):
    queue =  [(0, start, [start])]
    visited = set()

    while queue : 
        (cost,node, path) =heapq.heappop(queue)
        
        if  node in visited :
            continue
        visited.add(node) 

        if node == end :
            return{"path":path,  "distance": cost  }
        
        for neighbor, distance  in graph[node].items():
            if neighbor not in visited:
                heapq.heappush(queue,(cost + distance, neighbor ,path +[neighbor]))

    return{'path': None , "distance" : float('inf')}


# print(airports)

@app.route('/')
def index():
    return render_template('index.html', airports=airports)



@app.route('/shortest_path', methods = ['POST'])
def shortest_path():
    data = request.get_json()
    start =  data.get('start')
    end = data.get('end')


    result = diskatra(graph,start, end)
    return jsonify(result)


# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Render assigns PORT automatically
    app.run(host='0.0.0.0', port=port, debug=True)
