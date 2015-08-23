
window.onload = () ->

    document.body.style.background = "black"
    canvas = document.createElement 'canvas'
    canvas.style.position = "absolute"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    document.body.appendChild(canvas)
    resizeCanvas(canvas)

    window.onresize = () -> resizeCanvas canvas

    ctx = canvas.getContext('2d')

    tw = 16
    level = window.level = randomLevel(16, 16)
    level = window.level = {
        width: 16
        height: 16
        data:[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,0,0,0,0,0,0,0,0,0,0,0,0,0,0,true,true,0,true,true,true,true,true,0,true,0,true,true,true,true,0,true,true,false,false,false,false,false,0,0,true,false,true,true,true,true,0,true,true,false,true,true,true,true,true,false,true,false,true,true,true,true,0,true,true,false,false,0,false,0,false,false,true,false,false,0,false,false,0,true,true,true,true,0,true,true,true,false,true,true,true,true,true,true,false,true,true,false,false,0,false,false,false,false,0,0,false,0,0,false,false,true,true,false,true,0,true,true,true,false,true,0,true,true,true,true,false,true,true,false,false,0,false,0,false,false,true,0,false,0,0,false,0,true,true,true,true,0,true,true,true,false,true,0,true,true,true,true,true,true,true,false,false,false,false,false,true,false,0,0,0,0,0,false,0,true,true,0,true,true,true,false,true,0,true,true,true,true,true,true,0,true,true,0,0,false,true,false,true,false,true,true,0,0,0,true,0,true,true,true,true,0,0,false,true,false,false,false,false,true,false,false,0,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,null,null,null,null,null,null,null,true,true,true,true,true]
    }

    player = {x: 7, y: 7}

    victims = []
    for x in [0...7]
        victims.push randomVictim(victims, level)

    update = () ->
        paths = pathSearch player, level
        i = 0
        while i < victims.length
            victim = victims[i]
            if paths[victim.y * level.width + victim.x] < 8
                pt = escapeRoute(level, paths, victim)
                {x:victim.x, y:victim.y} = pt if pt? and not isColliding(pt, victims, level)
            i += 1
        
    updatePlayer = () ->
        paths = pathSearch {x:Math.floor(mouse.x*tw), y:Math.floor(mouse.y*tw)}, level
        pt = chaseRoute(level, paths, player)
        {x:player.x, y:player.y} = pt if pt? and not isColliding(pt, [], level)
        i = 0
        while i < victims.length
            victim = victims[i]
            if player.x == victim.x and player.y == victim.y
                victims.splice(i, 1)
                continue
            i += 1

    mouse = {x: 0, y: 0, down:false}
    canvas.onmousemove = (ev) ->
        rect = canvas.getBoundingClientRect()
        x = ev.clientX - rect.left
        y = ev.clientY - rect.top
        if rect.width < rect.height
            mouse.x = x / rect.width
            mouse.y = (y - (rect.height - rect.width) / 2.0) / rect.width
        else
            mouse.x = (x - (rect.width - rect.height) / 2.0) / rect.height
            mouse.y = y / rect.height

        if mouse.down
            x = Math.floor(mouse.x * tw)
            y = Math.floor(mouse.y * tw)
            level.data[y * tw + x] = not ev.shiftKey

        #player.x = Math.min(Math.max(Math.floor(mouse.x * tw), 0), tw-1)
        #player.y = Math.min(Math.max(Math.floor(mouse.y * tw), 0), tw-1)

    canvas.onmousedown = () ->
        mouse.down = true

    canvas.onmouseup = () ->
        mouse.down = false

    draw = () ->
        aspect = canvas.width / canvas.height
        ctx.fillStyle = 'white'
        ctx.clearRect 0, 0, canvas.width, canvas.height
        ctx.save()
        if canvas.width < canvas.height
            ctx.translate(0.0, (canvas.height - canvas.width) / 2.0)
            ctx.scale(canvas.width, canvas.width)
        else
            ctx.translate((canvas.width - canvas.height) / 2.0, 0.0)
            ctx.scale(canvas.height, canvas.height)

        ctx.fillStyle = '#111'
        for x in [0...tw]
            for y in [0...tw]
                if level.data[y * tw + x]
                    ctx.fillRect x/tw, y/tw, 1/tw, 1/tw

        if debugPathSearch?
            paths = pathSearch player, level
            for x in [0...tw]
                for y in [0...tw]
                    if paths[y * tw + x] != null
                        ctx.fillStyle = "rgb(0, 0, #{Math.floor paths[y * tw + x]*10})"
                        ctx.fillRect x/tw, y/tw, 1/tw, 1/tw

        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc((player.x+0.5)/tw, (player.y+0.5)/tw, 0.25/tw, 0, Math.PI*2, true)
        ctx.fill()

        ctx.fillStyle = 'yellow'
        for victim in victims
            {x, y} = victim
            ctx.beginPath()
            ctx.arc((x+0.5)/tw, (y+0.5)/tw, 0.25/2/tw, 0, Math.PI*2, true)
            ctx.fill()
            
        ctx.fillStyle = 'white'

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 0.05/tw, 0, Math.PI*2, false)
        ctx.fill()

        ctx.restore()
        requestAnimationFrame draw
    setInterval update, 1000/6.0
    setInterval updatePlayer, 1000/8.0
    draw()

    window.canvas = canvas
    window.ctx = ctx

resizeCanvas = (canvas) ->
    rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

randomLevel = (width, height) ->
    o = []
    for x in [0...width]
        for y in [0...height]
            o.push (Math.random() > 0.7)*1
    return {width, height, data:o}

randomVictim = (victims, level) ->
    x = y = 0
    while isColliding({x, y}, victims, level)
        x = Math.floor(Math.random()*level.width)
        y = Math.floor(Math.random()*level.height)
    return {x, y}

isColliding = (point, victims, level) ->
    for victim in victims
        return true if victim.x == point.x and victim.y == point.y
    return level.data[point.y * level.width + point.x]

pathSearch = (point, level) ->
    o = (null for i in [0...level.width*level.height])
    coord = (x, y) -> y * level.width + x

    o[coord point.x, point.y] = 0.0
    queue = [{x:point.x, y:point.y, d:0.0}]
    visit = (x, y, d) ->
        return if x < 0 or level.width <= x or y < 0 or level.height <= y
        unless o[coord x, y]? or level.data[coord x, y]
            o[coord x, y] = d
            queue.push {x, y, d}
    while queue.length > 0
        point = queue.shift()
        visit(point.x+1, point.y+0, point.d+1.0)
        visit(point.x-1, point.y+0, point.d+1.0)
        visit(point.x+0, point.y+1, point.d+1.0)
        visit(point.x+0, point.y-1, point.d+1.0)
        queue.sort((a, b) -> a.d - b.d)
    return o

chaseRoute = (level, paths, point) ->
    edges = selectRoute level, paths, point, (coord, d) ->
        return paths[coord point.x, point.y] > d
    edges.sort (a, b) -> a.d - b.d
    return edges[0]

escapeRoute = (level, paths, point) ->
    edges = selectRoute level, paths, point, (coord, d) ->
        return paths[coord point.x, point.y] < d
    return edges[Math.floor(Math.random()*edges.length)]

selectRoute = (level, paths, point, fn) ->
    edges = []
    coord = (x, y) -> y * level.width + x
    visit = (x, y) ->
        return if x < 0 or level.width <= x or y < 0 or level.height <= y
        if paths[coord x, y]?
            d = paths[coord x, y]
            edges.push {x, y, d} if fn(coord, d)
    visit(point.x-1, point.y+0)
    visit(point.x+1, point.y+0)
    visit(point.x+0, point.y+1)
    visit(point.x+0, point.y-1)
    return edges
