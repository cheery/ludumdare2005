// Generated by CoffeeScript 1.6.3
(function() {
  var chaseRoute, escapeRoute, isColliding, pathSearch, randomLevel, randomVictim, resizeCanvas, selectRoute;

  window.onload = function() {
    var canvas, ctx, draw, level, mouse, player, tw, update, updatePlayer, victims, x, _i;
    document.body.style.background = "black";
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    document.body.appendChild(canvas);
    resizeCanvas(canvas);
    window.onresize = function() {
      return resizeCanvas(canvas);
    };
    ctx = canvas.getContext('2d');
    tw = 16;
    level = window.level = randomLevel(16, 16);
    level = window.level = {
      width: 16,
      height: 16,
      data: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, true, 0, true, true, true, true, true, 0, true, 0, true, true, true, true, 0, true, true, false, false, false, false, false, 0, 0, true, false, true, true, true, true, 0, true, true, false, true, true, true, true, true, false, true, false, true, true, true, true, 0, true, true, false, false, 0, false, 0, false, false, true, false, false, 0, false, false, 0, true, true, true, true, 0, true, true, true, false, true, true, true, true, true, true, false, true, true, false, false, 0, false, false, false, false, 0, 0, false, 0, 0, false, false, true, true, false, true, 0, true, true, true, false, true, 0, true, true, true, true, false, true, true, false, false, 0, false, 0, false, false, true, 0, false, 0, 0, false, 0, true, true, true, true, 0, true, true, true, false, true, 0, true, true, true, true, true, true, true, false, false, false, false, false, true, false, 0, 0, 0, 0, 0, false, 0, true, true, 0, true, true, true, false, true, 0, true, true, true, true, true, true, 0, true, true, 0, 0, false, true, false, true, false, true, true, 0, 0, 0, true, 0, true, true, true, true, 0, 0, false, true, false, false, false, false, true, false, false, 0, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, null, null, null, null, null, null, null, true, true, true, true, true]
    };
    player = {
      x: 7,
      y: 7
    };
    victims = [];
    for (x = _i = 0; _i < 7; x = ++_i) {
      victims.push(randomVictim(victims, level));
    }
    update = function() {
      var i, paths, pt, victim, _results;
      paths = pathSearch(player, level);
      i = 0;
      _results = [];
      while (i < victims.length) {
        victim = victims[i];
        if (paths[victim.y * level.width + victim.x] < 8) {
          pt = escapeRoute(level, paths, victim);
          if ((pt != null) && !isColliding(pt, victims, level)) {
            victim.x = pt.x, victim.y = pt.y;
          }
        }
        _results.push(i += 1);
      }
      return _results;
    };
    updatePlayer = function() {
      var i, paths, pt, victim, _results;
      paths = pathSearch({
        x: Math.floor(mouse.x * tw),
        y: Math.floor(mouse.y * tw)
      }, level);
      pt = chaseRoute(level, paths, player);
      if ((pt != null) && !isColliding(pt, [], level)) {
        player.x = pt.x, player.y = pt.y;
      }
      i = 0;
      _results = [];
      while (i < victims.length) {
        victim = victims[i];
        if (player.x === victim.x && player.y === victim.y) {
          victims.splice(i, 1);
          continue;
        }
        _results.push(i += 1);
      }
      return _results;
    };
    mouse = {
      x: 0,
      y: 0,
      down: false
    };
    canvas.onmousemove = function(ev) {
      var rect, y;
      rect = canvas.getBoundingClientRect();
      x = ev.clientX - rect.left;
      y = ev.clientY - rect.top;
      if (rect.width < rect.height) {
        mouse.x = x / rect.width;
        mouse.y = (y - (rect.height - rect.width) / 2.0) / rect.width;
      } else {
        mouse.x = (x - (rect.width - rect.height) / 2.0) / rect.height;
        mouse.y = y / rect.height;
      }
      if (mouse.down) {
        x = Math.floor(mouse.x * tw);
        y = Math.floor(mouse.y * tw);
        return level.data[y * tw + x] = !ev.shiftKey;
      }
    };
    canvas.onmousedown = function() {
      return mouse.down = true;
    };
    canvas.onmouseup = function() {
      return mouse.down = false;
    };
    draw = function() {
      var aspect, paths, victim, y, _j, _k, _l, _len, _m, _n;
      aspect = canvas.width / canvas.height;
      ctx.fillStyle = 'white';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (canvas.width < canvas.height) {
        ctx.translate(0.0, (canvas.height - canvas.width) / 2.0);
        ctx.scale(canvas.width, canvas.width);
      } else {
        ctx.translate((canvas.width - canvas.height) / 2.0, 0.0);
        ctx.scale(canvas.height, canvas.height);
      }
      ctx.fillStyle = '#111';
      for (x = _j = 0; 0 <= tw ? _j < tw : _j > tw; x = 0 <= tw ? ++_j : --_j) {
        for (y = _k = 0; 0 <= tw ? _k < tw : _k > tw; y = 0 <= tw ? ++_k : --_k) {
          if (level.data[y * tw + x]) {
            ctx.fillRect(x / tw, y / tw, 1 / tw, 1 / tw);
          }
        }
      }
      if (typeof debugPathSearch !== "undefined" && debugPathSearch !== null) {
        paths = pathSearch(player, level);
        for (x = _l = 0; 0 <= tw ? _l < tw : _l > tw; x = 0 <= tw ? ++_l : --_l) {
          for (y = _m = 0; 0 <= tw ? _m < tw : _m > tw; y = 0 <= tw ? ++_m : --_m) {
            if (paths[y * tw + x] !== null) {
              ctx.fillStyle = "rgb(0, 0, " + (Math.floor(paths[y * tw + x] * 10)) + ")";
              ctx.fillRect(x / tw, y / tw, 1 / tw, 1 / tw);
            }
          }
        }
      }
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc((player.x + 0.5) / tw, (player.y + 0.5) / tw, 0.25 / tw, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.fillStyle = 'yellow';
      for (_n = 0, _len = victims.length; _n < _len; _n++) {
        victim = victims[_n];
        x = victim.x, y = victim.y;
        ctx.beginPath();
        ctx.arc((x + 0.5) / tw, (y + 0.5) / tw, 0.25 / 2 / tw, 0, Math.PI * 2, true);
        ctx.fill();
      }
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 0.05 / tw, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
      return requestAnimationFrame(draw);
    };
    setInterval(update, 1000 / 6.0);
    setInterval(updatePlayer, 1000 / 8.0);
    draw();
    window.canvas = canvas;
    return window.ctx = ctx;
  };

  resizeCanvas = function(canvas) {
    var rect;
    rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    return canvas.height = rect.height;
  };

  randomLevel = function(width, height) {
    var o, x, y, _i, _j;
    o = [];
    for (x = _i = 0; 0 <= width ? _i < width : _i > width; x = 0 <= width ? ++_i : --_i) {
      for (y = _j = 0; 0 <= height ? _j < height : _j > height; y = 0 <= height ? ++_j : --_j) {
        o.push((Math.random() > 0.7) * 1);
      }
    }
    return {
      width: width,
      height: height,
      data: o
    };
  };

  randomVictim = function(victims, level) {
    var x, y;
    x = y = 0;
    while (isColliding({
        x: x,
        y: y
      }, victims, level)) {
      x = Math.floor(Math.random() * level.width);
      y = Math.floor(Math.random() * level.height);
    }
    return {
      x: x,
      y: y
    };
  };

  isColliding = function(point, victims, level) {
    var victim, _i, _len;
    for (_i = 0, _len = victims.length; _i < _len; _i++) {
      victim = victims[_i];
      if (victim.x === point.x && victim.y === point.y) {
        return true;
      }
    }
    return level.data[point.y * level.width + point.x];
  };

  pathSearch = function(point, level) {
    var coord, i, o, queue, visit;
    o = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = level.width * level.height; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(null);
      }
      return _results;
    })();
    coord = function(x, y) {
      return y * level.width + x;
    };
    o[coord(point.x, point.y)] = 0.0;
    queue = [
      {
        x: point.x,
        y: point.y,
        d: 0.0
      }
    ];
    visit = function(x, y, d) {
      if (x < 0 || level.width <= x || y < 0 || level.height <= y) {
        return;
      }
      if (!((o[coord(x, y)] != null) || level.data[coord(x, y)])) {
        o[coord(x, y)] = d;
        return queue.push({
          x: x,
          y: y,
          d: d
        });
      }
    };
    while (queue.length > 0) {
      point = queue.shift();
      visit(point.x + 1, point.y + 0, point.d + 1.0);
      visit(point.x - 1, point.y + 0, point.d + 1.0);
      visit(point.x + 0, point.y + 1, point.d + 1.0);
      visit(point.x + 0, point.y - 1, point.d + 1.0);
      queue.sort(function(a, b) {
        return a.d - b.d;
      });
    }
    return o;
  };

  chaseRoute = function(level, paths, point) {
    var edges;
    edges = selectRoute(level, paths, point, function(coord, d) {
      return paths[coord(point.x, point.y)] > d;
    });
    edges.sort(function(a, b) {
      return a.d - b.d;
    });
    return edges[0];
  };

  escapeRoute = function(level, paths, point) {
    var edges;
    edges = selectRoute(level, paths, point, function(coord, d) {
      return paths[coord(point.x, point.y)] < d;
    });
    return edges[Math.floor(Math.random() * edges.length)];
  };

  selectRoute = function(level, paths, point, fn) {
    var coord, edges, visit;
    edges = [];
    coord = function(x, y) {
      return y * level.width + x;
    };
    visit = function(x, y) {
      var d;
      if (x < 0 || level.width <= x || y < 0 || level.height <= y) {
        return;
      }
      if (paths[coord(x, y)] != null) {
        d = paths[coord(x, y)];
        if (fn(coord, d)) {
          return edges.push({
            x: x,
            y: y,
            d: d
          });
        }
      }
    };
    visit(point.x - 1, point.y + 0);
    visit(point.x + 1, point.y + 0);
    visit(point.x + 0, point.y + 1);
    visit(point.x + 0, point.y - 1);
    return edges;
  };

}).call(this);
