Unminify.org
Unminify JS, Beautify CSS, Format HTML and XML Code
Paste JS, CSS, HTML or XML Code to unminify/format

! function($) {
    var instances = {},
        globalID = 0,
        userAgent = navigator.userAgent.toLowerCase(),
        scripts = document.getElementsByTagName("script"),
        myScript = scripts[scripts.length - 1].src.split("/");
    myScript.pop();
    var pluginJSURL = myScript.join("/") + "/";
    myScript.pop();
    var pluginRootURL = myScript.join("/") + "/",
        touchDevice = userAgent.indexOf("ipad") > -1 || userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipod") > -1 || userAgent.indexOf("android") > -1,
        _browser = {};
    if (_browser.ie = userAgent.indexOf("msie") > -1 ? {} : !1, _browser.ie && (_browser.ie.old = null !== navigator.userAgent.match(/MSIE [6-8]/)), _browser.firefox = userAgent.indexOf("firefox") > -1, String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        }), touchDevice) var mouseCoords = function(t) {
        return t.touches[0] ? {
            x: t.touches[0].pageX,
            y: t.touches[0].pageY
        } : {
            x: t.changedTouches[0].pageX,
            y: t.changedTouches[0].pageY
        }
    };
    else var mouseCoords = function(t) {
        return t.pageX ? {
            x: t.pageX,
            y: t.pageY
        } : {
            x: t.clientX + $("html").scrollLeft(),
            y: t.clientY + $("html").scrollTop()
        }
    };
    var CBK = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472],
        CEK = [.7111111111111111, 1.4222222222222223, 2.8444444444444446, 5.688888888888889, 11.377777777777778, 22.755555555555556, 45.51111111111111, 91.02222222222223, 182.04444444444445, 364.0888888888889, 728.1777777777778, 1456.3555555555556, 2912.711111111111, 5825.422222222222, 11650.844444444445, 23301.68888888889, 46603.37777777778, 93206.75555555556, 186413.51111111112, 372827.02222222224, 745654.0444444445, 1491308.088888889, 2982616.177777778, 5965232.355555556, 11930464.711111112, 23860929.422222223, 47721858.844444446, 95443717.68888889, 190887435.37777779, 381774870.75555557, 763549741.5111111],
        CFK = [40.74366543152521, 81.48733086305042, 162.97466172610083, 325.94932345220167, 651.8986469044033, 1303.7972938088067, 2607.5945876176133, 5215.189175235227, 10430.378350470453, 20860.756700940907, 41721.51340188181, 83443.02680376363, 166886.05360752725, 333772.1072150545, 667544.214430109, 1335088.428860218, 2670176.857720436, 5340353.715440872, 10680707.430881744, 21361414.86176349, 42722829.72352698, 85445659.44705395, 170891318.8941079, 341782637.7882158, 683565275.5764316, 1367130551.1528633, 2734261102.3057265, 5468522204.611453, 10937044409.222906, 21874088818.445812, 43748177636.891624],
        defaults = {
            keepSourceStyles: !1,
            loadingText: "Loading map...",
            colors: {
                background: "#eeeeee",
                selected: 5,
                hover: 2
            },
            regions: {},
            viewBox: [],
            cursor: "default",
            scale: 1,
            tooltipsMode: "hover",
            tooltips: {
                show: "hover",
                mode: "names"
            },
            onClick: null,
            mouseOver: null,
            mouseOut: null,
            disableAll: !1,
            hideAll: !1,
            marks: null,
            hover_mode: "brightness",
            selected_mode: "brightness",
            hover_brightness: 1,
            selected_brightness: 5,
            pan: !1,
            panLimit: !0,
            panBackground: !1,
            zoom: !1,
            popover: {
                width: "auto",
                height: "auto"
            },
            buttons: !0,
            zoomLimit: [0, 5],
            zoomDelta: 1.2,
            zoomButtons: {
                show: !0,
                location: "right"
            },
            multiSelect: !1
        },
        markOptions = {
            attrs: {
                cursor: "pointer",
                src: pluginRootURL + "markers/_pin_default.png"
            }
        },
        mapSVG = function mapSVG(elem, options) {
            var _data;
            this.methods = {
                destroy: function() {
                    return delete instances[_data.$map.attr("id")], _data.$map.empty(), _this
                },
                getData: function() {
                    return _data
                },
                getScale: function() {
                    var t, a, e = _data.svgDefault.width / _data.svgDefault.height,
                        o = _data.options.width / _data.options.height,
                        i = _data.options.responsive ? [_data.$map.width(), _data.$map.height()] : [_data.options.width, _data.options.height];
                    return e > o ? (t = _data.svgDefault.width / _data.svgDefault.viewBox[2], a = i[0] / _data.viewBox[2]) : (t = _data.svgDefault.height / _data.svgDefault.viewBox[3], a = i[1] / _data.viewBox[3]), 1 - (t - a)
                },
                fluidResize: function(t, a) {
                    t && a || (t = _data.$map.width(), a = _data.$map.height()), _data.R.setSize(t, a), _data.scale = _this.getScale(), _this.marksAdjustPosition()
                },
                getViewBox: function() {
                    return _data.viewBox
                },
                get_coords: function(t) {
                    var a = _data.R.getById(t).getBBox();
                    return a
                },
                setViewBox: function(t) {
                    if ("string" == typeof t) {
                        var a = _data.R.getById(t).getBBox();
                        _data.viewBox = [a.x - 80, a.y - 80, a.width + 100, a.height + 100];
                        var e = !0
                    } else {
                        var o = t && 4 == t.length ? t : _data.svgDefault.viewBox,
                            e = parseInt(o[2]) != _data.viewBox[2] || parseInt(o[3]) != _data.viewBox[3];
                        _data.viewBox = [parseFloat(o[0]), parseFloat(o[1]), parseFloat(o[2]), parseFloat(o[3])]
                    }
                    return _data.R || console.log("no data.R!!"), _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], !0), e && (_data.scale = _this.getScale(), _this.marksAdjustPosition(), (_browser.ie && !_browser.ie.old || _browser.firefox) && _this.mapAdjustStrokes()), !0
                },
                viewBoxSetBySize: function(t, a) {
                    return _data._viewBox = _this.viewBoxGetBySize(t, a), _data.viewBox = $.extend([], _data._viewBox), _data.scale = _this.getScale(), _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], !0), _this.marksAdjustPosition(), _data.viewBox
                },
                viewBoxGetBySize: function(t, a) {
                    var e = t / a,
                        o = _data.svgDefault.viewBox[2] / _data.svgDefault.viewBox[3],
                        i = $.extend([], _data.svgDefault.viewBox);
                    return e != o && (i[2] = t * _data.svgDefault.viewBox[2] / _data.svgDefault.width, i[3] = a * _data.svgDefault.viewBox[3] / _data.svgDefault.height), i
                },
                viewBoxReset: function() {
                    _this.setViewBox()
                },
                mapAdjustStrokes: function() {
                    _data.R.forEach(function(t) {
                        t.default_attr && t.default_attr["stroke-width"] && t.attr({
                            "stroke-width": t.default_attr["stroke-width"] / _data.scale
                        })
                    })
                },
                zoomIn: function() {
                    _this.zoom(1)
                },
                zoomOut: function() {
                    _this.zoom(-1)
                },
                touchZoomStart: function(t) {
                    function a() {
                        return t.apply(this, arguments)
                    }
                    return a.toString = function() {
                        return t.toString()
                    }, a
                }(function() {
                    touchZoomStart = _data._scale, _data.scale = _data.scale * zoom_k, zoom = _data._scale, _data._scale = _data._scale * zoom_k;
                    var t = _data.viewBox[2],
                        a = _data.viewBox[3],
                        e = [];
                    e[2] = _data._viewBox[2] / _data._scale, e[3] = _data._viewBox[3] / _data._scale, e[0] = _data.viewBox[0] + (t - e[2]) / 2, e[1] = viewBox[1] + (a - e[3]) / 2, _this.setViewBox(e, !0)
                }),
                touchZoomMove: function() {},
                touchZoomEnd: function() {},
                zoom: function(t, a) {
                    var e = _data.viewBox[2],
                        o = _data.viewBox[3],
                        i = [];
                    if (a) _data._scale = a, i[2] = _data.touchZoomStartViewBox[2] / _data._scale, i[3] = _data.touchZoomStartViewBox[3] / _data._scale;
                    else {
                        var s = t > 0 ? 1 : -1;
                        if (_data._zoomLevel = _data.zoomLevel, _data._zoomLevel += s, _data._zoomLevel > _data.options.zoomLimit[1] || _data._zoomLevel < _data.options.zoomLimit[0]) return !1;
                        _data.zoomLevel = _data._zoomLevel;
                        var r = s * _data.options.zoomDelta;
                        1 > r && (r = -1 / r), _data._scale = _data._scale * r, i[2] = _data._viewBox[2] / _data._scale, i[3] = _data._viewBox[3] / _data._scale
                    }
                    i[0] = _data.viewBox[0] + (e - i[2]) / 2, i[1] = _data.viewBox[1] + (o - i[3]) / 2, _this.setViewBox(i, !0)
                },
                markUpdate: function(t, a) {
                    "" == a.attrs.src && delete a.attrs.src, "" == a.attrs.href && delete a.attrs.href;
                    var e = new Image;
                    e.onload = function() {
                        a.data.width = this.width, a.data.height = this.height, a.attrs.width = parseFloat(a.data.width / _data.scale).toFixed(2), a.attrs.height = parseFloat(a.data.height / _data.scale).toFixed(2), _data.options.editMode && a.attrs.href ? (t.data("href", a.attrs.href), delete a.attrs.href) : _data.options.editMode && !a.attrs.href && t.removeData("href"), t.data(a.data), t.attr(a.attrs)
                    }, e.src = a.attrs.src
                },
                markDelete: function(t) {
                    _data.RMarks.pop(t)
                },
                markAdd: function(t, a) {
                    var e = $.extend(!0, {}, markOptions, t);
                    if (e.width && e.height) return _this.markAddFinalStep(e, a);
                    var o = new Image;
                    return o.onload = function() {
                        return e.width = this.width, e.height = this.height, _this.markAddFinalStep(e, a)
                    }, o.src = e.attrs.src, e
                },
                markAddFinalStep: function(t, a) {
                    var e = $.extend(!0, {}, t.attrs),
                        o = parseFloat(t.width / _data.scale).toFixed(2),
                        i = parseFloat(t.height / _data.scale).toFixed(2),
                        s = t.xy ? t.xy : t.attrs.x ? [t.attrs.x, t.attrs.y] : t.c ? _this.ll2px(t) : !1;
                    if (!s) return !1;
                    a && (s[0] = s[0] / _data.scale - t.width / (2 * _data.scale) + (_data.viewBox[0] - _data._viewBox[0]), s[1] = (s[1] - t.height) / _data.scale + (_data.viewBox[1] - _data._viewBox[1]), s = _this.markGetDefaultCoords(s[0], s[1], t.width, t.height, this.getScale())), s[0] = parseFloat(s[0]).toFixed(4), s[1] = parseFloat(s[1]).toFixed(4), _data.options.editMode && e.href && (t.href = e.href, delete e.href), delete e.width, delete e.height;
                    var r = _data.R.image(t.attrs.src, s[0], s[1], o, i).attr(e).data(t);
                    return r.mapsvg_type = "mark", t.id && (r.node.id = t.id), _data.options.editMode || (touchDevice ? r.touchstart(function(t) {
                        return this.attrs.href ? window.location.href = this.attrs.href : this.data("popover") && _this.showPopover(t, this.data("popover")), _data.options.onClick ? _data.options.onClick.call(this, t, _this) : void 0
                    }) : (r.mousedown(function(t) {
                        return this.data("popover") && _this.showPopover(t, this.data("popover")), _data.options.onClick ? _data.options.onClick.call(this, t, _this) : void 0
                    }), _data.options.mouseOver && r.mouseover(function(t) {
                        return _data.options.mouseOver.call(this, t, _this)
                    }), _data.options.mouseOut && r.mouseout(function(t) {
                        return _data.options.mouseOver.call(this, t, _this)
                    }))), _this.markEventHandlersSet(_data.options.editMode, r), _data.RMarks.push(r), a && _data.options.marksEditHandler.call(r), _this.markAdjustPosition(r), r
                },
                marksAdjustPosition: function(t) {
                    if (!t && (!_data.RMarks || _data.RMarks.length < 1)) return !1;
                    for (var a, e, o = 0; o < _data.RMarks.items.length; o++) {
                        var i = _data.RMarks.items[o].data("width"),
                            s = _data.RMarks.items[o].data("height");
                        a = i / 2 - i / (2 * _data.scale), e = s - s / _data.scale, _browser.ie && (i = parseInt(i), s = parseInt(s)), _data.RMarks.items[o].attr({
                            width: i / _data.scale,
                            height: s / _data.scale
                        }).transform("t" + a + "," + e)
                    }
                },
                markAdjustPosition: function(t) {
                    var a = t.data("width"),
                        e = t.data("height"),
                        o = a / 2 - a / (2 * _data.scale),
                        i = e - e / _data.scale;
                    t.attr({
                        width: a / _data.scale,
                        height: e / _data.scale
                    }).transform("t" + o + "," + i)
                },
                markGetDefaultCoords: function(t, a, e, o, i) {
                    return t = parseFloat(t), a = parseFloat(a), e = parseFloat(e), o = parseFloat(o), t = parseFloat(t + e / (2 * i) - e / 2).toFixed(2), a = parseFloat(a + o / i - o).toFixed(2), [t, a]
                },
                markMoveStart: function() {
                    this.data("ox", parseFloat(this.attr("x"))), this.data("oy", parseFloat(this.attr("y")))
                },
                markMove: function(t, a) {
                    t /= _data.scale, a /= _data.scale, this.attr({
                        x: this.data("ox") + t,
                        y: this.data("oy") + a
                    })
                },
                markMoveEnd: function() {
                    this.data("ox") == this.attr("x") && this.data("oy") == this.attr("y") && options.marksEditHandler.call(this)
                },
                panStart: function(t) {
                    if ("btnZoomIn" == t.target.id || "btnZoomOut" == t.target.id) return !1;
                    if (_data.options.editMode && "image" == t.target.nodeName) return !1;
                    t.preventDefault();
                    var a = t.touches && t.touches[0] ? t.touches[0] : t;
                    _data.pan = {}, _data.pan.vxi = _data.viewBox[0], _data.pan.vyi = _data.viewBox[1], _data.pan.x = a.clientX, _data.pan.y = a.clientY, _data.pan.dx = 0, _data.pan.dy = 0, _data.pan.vx = 0, _data.pan.vy = 0, touchDevice || $("body").on("mousemove", _this.panMove).on("mouseup", _this.panEnd)
                },
                panMove: function(t) {
                    t.preventDefault(), _data.isPanning = !0, _data.RMap.attr({
                        cursor: "move"
                    }), $("body").css({
                        cursor: "move"
                    });
                    var a = t.touches && t.touches[0] ? t.touches[0] : t;
                    _data.pan.dx = _data.pan.x - a.clientX, _data.pan.dy = _data.pan.y - a.clientY;
                    var e = parseInt(_data.pan.vxi + _data.pan.dx / _data.scale),
                        o = parseInt(_data.pan.vyi + _data.pan.dy / _data.scale);
                    _data.options.panLimit && (e < _data.svgDefault.viewBox[0] ? e = _data.svgDefault.viewBox[0] : _data.viewBox[2] + e > _data.svgDefault.viewBox[2] && (e = _data.svgDefault.viewBox[2] - _data.viewBox[2]), o < _data.svgDefault.viewBox[1] ? o = _data.svgDefault.viewBox[1] : _data.viewBox[3] + o > _data.svgDefault.viewBox[3] && (o = _data.svgDefault.viewBox[3] - _data.viewBox[3])), _data.pan.vx = e, _data.pan.vy = o, _this.setViewBox([_data.pan.vx, _data.pan.vy, _data.viewBox[2], _data.viewBox[3]])
                },
                panEnd: function(t) {
                    _data.isPanning = !1, Math.abs(_data.pan.dx) < 5 && Math.abs(_data.pan.dy) < 5 && (_data.options.editMode && _this.markAddClickHandler(t), _data.region_clicked && _this.regionClickHandler(t, _data.region_clicked)), $("body").css({
                        cursor: "default"
                    }), _data.RMap.attr({
                        cursor: _data.options.cursor
                    }), _data.viewBox[0] = _data.pan.vx || _data.viewBox[0], _data.viewBox[1] = _data.pan.vy || _data.viewBox[1], touchDevice || $("body").off("mousemove", _this.panMove).off("mouseup", _this.panEnd)
                },
                panRegionClickHandler: function(t, a) {
                    _data.region_clicked = a
                },
                touchStart: function(t) {
                    t.preventDefault(), _data.options.zoom && t.touches && 2 == t.touches.length ? (_data.touchZoomStartViewBox = _data.viewBox, _data.touchZoomStart = _data.scale, _data.touchZoomEnd = 1) : (_this.panStart(t), _data.isPanning = !0)
                },
                touchMove: function(t) {
                    t.preventDefault(), _data.options.zoom && t.touches && t.touches.length >= 2 ? (_this.zoom(null, t.scale), _data.isPanning = !1) : _data.isPanning && _this.panMove(t)
                },
                touchEnd: function(t) {
                    t.preventDefault(), _data.touchZoomStart ? (_data.touchZoomStart = !1, _data.touchZoomEnd = !1) : _data.isPanning && _this.panEnd(t)
                },
                marksHide: function() {
                    _data.RMarks.hide()
                },
                marksShow: function() {
                    _data.RMarks.show()
                },
                marksGet: function() {
                    var t = [];
                    return $.each(_data.RMarks, function(a, e) {
                        if (e.attrs) {
                            var o = $.extend({}, e.attrs);
                            e.data("href") && (o.href = e.data("href")), t.push({
                                attrs: o,
                                tooltip: e.data("tooltip"),
                                popover: e.data("popover"),
                                width: e.data("width"),
                                height: e.data("height"),
                                href: e.data("href")
                            })
                        }
                    }), t
                },
                getSelected: function() {
                    return _data.selected_id
                },
                selectRegion: function(t) {
                    var a = _data.R.getById(t);
                    if (!a || a.disabled) return !1;
                    if (_data.options.multiSelect) {
                        var e = $.inArray(t, _data.selected_id);
                        if (e >= 0) return a.attr({
                            fill: a.default_attr.fill
                        }), a.selected = !1, void _data.selected_id.splice(e, 1);
                        _data.selected_id.push(t), a.selected = !0
                    } else {
                        if (_data.selected_id) {
                            var o = _data.R.getById(_data.selected_id);
                            o.attr(o.default_attr), o.selected = !1, _browser.ie && !_browser.ie.old && _this.mapAdjustStrokes()
                        }
                        _data.selected_id = t, a.selected = !0
                    }
                    a.attr(a.selected_attr)
                },
                unhighlightRegion: function(t) {
                    var a = _data.R.getById(t);
                    return a.disabled || _data.options.multiSelect && $.inArray(t, _data.selected_id) >= 0 || _data.selected_id == t ? !1 : void a.attr({
                        fill: a.default_attr.fill
                    })
                },
                highlightRegion: function(t) {
                    var a = _data.R.getById(t);
                    return _data.isPanning || a.disabled || _data.options.multiSelect && $.inArray(t, _data.selected_id) >= 0 || _data.selected_id == t ? !1 : void a.attr(a.hover_attr)
                },
                ll2px: function(t) {
                    var a = t.c,
                        e = parseFloat(a[0]),
                        o = parseFloat(a[1]),
                        i = 2,
                        s = CBK[i],
                        r = Math.round(s + o * CEK[i]),
                        n = Math.sin(3.14159 * e / 180); - .9999 > n ? n = -.9999 : n > .9999 && (n = .9999);
                    var d = Math.round(s + .5 * Math.log((1 + n) / (1 - n)) * -CFK[i]),
                        _ = [r - (33.8 + t.width / 2), d - (141.7 + t.height)];
                    return _
                },
                isRegionDisabled: function(t, a) {
                    return _data.options.regions[t] && (_data.options.regions[t].disabled || "none" == a) ? !0 : void 0 != _data.options.regions[t] && !_this.parseBoolean(_data.options.regions[t].disabled) || !_data.options.disableAll && "none" != a && "labels" != t && "Labels" != t ? !1 : !0
                },
                regionClickHandler: function(t, a) {
                    return a ? (_data.region_clicked = null, _this.selectRegion(a.name), _this.showPopover(t, a.popover), _data.options.onClick ? _data.options.onClick.call(a, t, _this) : void(touchDevice && a.attrs.href && (window.location.href = a.attrs.href))) : !1
                },
                renderSVGPath: function(t, a, e) {
                    var o = _data.R.path($(t).attr("d")),
                        i = _this.initRaphaelObject(o, t, a, e);
                    _this.regionAdd(i)
                },
                renderSVGImage: function(t, a, e) {
                    var o = $(t).attr("xlink:href"),
                        i = $(t).attr("x") || 0,
                        s = $(t).attr("y") || 0,
                        r = $(t).attr("width") || 0,
                        n = $(t).attr("height") || 0;
                    if (!_this.fileExists(o)) return !1;
                    var d = _data.R.image(o, i, s, r, n);
                    return _this.initRaphaelObject(d, t, a, e), d
                },
                renderSVGPolygon: function(t, a, e) {
                    var o = t.attr("points").trim().replace(/ +(?= )/g, "").split(/\s+|,/),
                        i = o.shift(),
                        s = o.shift(),
                        r = "M" + i + "," + s + " L" + o.join(" ") + "z",
                        n = _this.initRaphaelObject(_data.R.path(r), t, a, e);
                    return _this.regionAdd(n), n
                },
                renderSVGPolyline: function(t, a, e) {
                    var o = t.attr("points").trim().replace(/ +(?= )/g, "").split(/\s+|,/),
                        i = o.shift(),
                        s = o.shift(),
                        r = "M" + i + "," + s + " L" + o.join(" "),
                        n = _this.initRaphaelObject(_data.R.path(r), t, a, e);
                    return n
                },
                renderSVGCircle: function(t, a, e) {
                    var o = $(t).attr("cx") || 0,
                        i = $(t).attr("cy") || 0;
                    r = $(t).attr("r") || 0;
                    var s = _this.initRaphaelObject(_data.R.circle(o, i, r), t, a, e);
                    return _this.regionAdd(s), s
                },
                renderSVGEllipse: function(t, a, e) {
                    var o = $(t).attr("cx") || 0,
                        i = $(t).attr("cy") || 0;
                    rx = $(t).attr("rx") || 0, ry = $(t).attr("ry") || 0;
                    var s = _this.initRaphaelObject(_data.R.ellipse(o, i, rx, ry), t, a, e);
                    return _this.regionAdd(s), s
                },
                renderSVGRect: function(t, a, e) {
                    var o = $(t).attr("x") || 0,
                        i = $(t).attr("y") || 0,
                        s = $(t).attr("width") || 0,
                        n = $(t).attr("height") || 0;
                    r = $(t).attr("rx") || $(t).attr("ry") || 0;
                    var d = _this.initRaphaelObject(_data.R.rect(o, i, s, n, r), t, a, e);
                    return _this.regionAdd(d), d
                },
                renderSVGText: function(t) {
                    var a = $(t).find("tspan"),
                        e = parseFloat($(t).attr("x")) || 0,
                        o = parseFloat($(t).attr("y")) || 0;
                    if (a.each(function(a, i) {
                            var s = _this.renderSVGTspan($(i), {
                                x: e,
                                y: o
                            });
                            s.attr(_this.styleSVG2Raphael(t)), s.attr(_this.styleSVG2Raphael($(i))), s.transform(_this.transformSVG2Raphael(t)), s.transform(_this.transformSVG2Raphael($(i)))
                        }), 0 == a.length) {
                        var i = _this.renderSVGTspan(t);
                        i.attr(_this.styleSVG2Raphael(t)), i.transform(_this.transformSVG2Raphael(t))
                    }
                    return i
                },
                renderSVGTspan: function(t, a) {
                    a = a || {
                        x: 0,
                        y: 0
                    };
                    var e = parseFloat($(t).attr("x")) || a.x,
                        o = parseFloat($(t).attr("y")) || a.y;
                    $(t).attr("dx") && (e += a.x + $(t).attr("dx")), $(t).attr("dy") && (o += a.y + $(t).attr("dy")), text = $(t).text();
                    var i = _data.R.text(e, o, text).attr({
                        "text-anchor": "start"
                    }).toFront();
                    return i.mapsvg_type = "text", $(i.node).css({
                        "-webkit-touch-callout": "none",
                        "-webkit-user-select": "none",
                        "pointer-events": "none"
                    }), i
                },
                initRaphaelObject: function(t, a, e, o) {
                    var i = e || "";
                    t.id = $(a).attr("id") || t.type + globalID++, t.node.id = t.id, t.name = t.id;
                    var s = _this.styleSVG2Raphael(a, o);
                    t.attr(s);
                    var r = _this.transformSVG2Raphael(a) + i;
                    return t.transform(r), t
                },
                styleSVG2Raphael: function(t, a) {
                    var a = a || {},
                        e = {},
                        o = $(t).get(0).attributes,
                        i = ["fill", "fill-opacity", "opacity", "font", "font-name", "font-family", "font-size", "font-weight", "stroke", "stroke-lincap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width"];
                    if ($(t).attr("style")) {
                        var s = $(t).attr("style").split(";");
                        $.each(s, function(t, a) {
                            var o = a.split(":");
                            o[0] = o[0].trim(), o[1] && (o[1] = o[1].trim()), "font-size" == o[0] && (o[1] = parseInt(o[1].replace("px", ""))), _this.isNumber(o[0]) && (o[1] = parseFloat(o[1])), e[o[0]] = o[1]
                        })
                    }
                    o && $.each(o, function(t, a) {
                        $.inArray(a.name, i) > -1 && ("font-size" == a.name && (a.value = parseInt(a.value.replace("px", ""))), e[a.name] = a.value)
                    }), e["font-size"] && (e["font-size"] = parseInt(e["font-size"])), e["font-family"] && (e["font-family"] = e["font-family"] + ", Arial");
                    var r = $.extend({}, a, e);
                    return void 0 == r.stroke && void 0 == r.fill ? (r.stroke = "none", r.fill = "#231f20") : void 0 == r.stroke ? r.stroke = "none" : void 0 == r.fill && (r.fill = "#231f20"), r
                },
                transformSVG2Raphael: function(t) {
                    var a, e = $(t).attr("transform");
                    if (e) {
                        for (var o = e.split(")"), i = [], s = 0; s < o.length; s++)
                            if ("" != o[s]) {
                                var r = o[s].split("(");
                                if ("matrix" != r[0]) r[0] = r[0].slice(0, 1).toLowerCase(), i.push(r[0] + r[1]);
                                else {
                                    a = r[1].split(-1 != r[1].indexOf(",") ? "," : " ");
                                    var n = Raphael.matrix(parseFloat(a[0]), parseFloat(a[1]), parseFloat(a[2]), parseFloat(a[3]), parseFloat(a[4]), parseFloat(a[5])).toTransformString();
                                    i.push(n)
                                }
                            }
                        return i.join()
                    }
                    return ""
                },
                getElementStyles: function(t) {
                    if (_browser.ie) {
                        var a = {};
                        if (a.getPropertyValue = function(t) {
                                return a[t] || void 0
                            }, $(t).attr("style")) {
                            var e = $(t).attr("style").split(";");
                            $.each(e, function(t, e) {
                                var o = e.split(":");
                                a[o[0]] = o[1]
                            })
                        }
                        return a
                    }
                    return t.style
                },
                fileExists: function(t) {
                    if ("data" == t.substr(0, 4)) return !0;
                    var a = new XMLHttpRequest;
                    return a.open("HEAD", t, !1), a.send(), 404 != a.status
                },
                regionAdd: function regionAdd(_item) {
                    var name = _item.name;
                    if (_item.disabled = _this.isRegionDisabled(name, _item.attr("fill")), _item.default_attr = {}, _item.default_attr.fill = _item.disabled && _data.options.colors.disabled ? _data.options.colors.disabled : _item.attr("fill") || "none", _item.default_attr.fill && "none" != _item.default_attr.fill && _data.options.colors.base && !_item.disabled && (_item.default_attr.fill = _data.options.colors.base), _item.attr("stroke") && (_item.default_attr.stroke = _item.attr("stroke")), _item.attr("stroke-width") && (_item.default_attr["stroke-width"] = parseFloat(_item.attr("stroke-width"))), _item.default_attr.stroke && "none" != _item.default_attr.stroke && _data.options.colors.stroke && (_item.default_attr.stroke = _data.options.colors.stroke), _item.default_attr["stroke-width"] && _data.options.strokeWidth && (_item.default_attr["stroke-width"] = parseFloat(_data.options.strokeWidth)), _item.selected_attr = {}, _item.hover_attr = {}, _item.disabled ? (_item.default_attr.cursor = "default", $(_item.node).css({
                            "pointer-events": "none"
                        })) : _item.default_attr.cursor = _data.options.cursor, _data.options.regions[name] && (_data.options.regions[name].attr && (_item.default_attr = $.extend(!0, {}, _item.default_attr, _data.options.regions[name].attr)), _data.options.regions[name].tooltip && (_item.tooltip = _data.options.regions[name].tooltip), _data.options.regions[name].popover && (_item.popover = _data.options.regions[name].popover), _data.options.regions[name].data))
                        if ("string" == typeof _data.options.regions[name].data)
                            if ("[" == _data.options.regions[name].data.substr(0, 1) || "{" == _data.options.regions[name].data.substr(0, 1)) try {
                                var tmp;
                                eval("tmp = " + _data.options.regions[name].data), _item._data = tmp
                            } catch (err) {
                                _item._data = _data.options.regions[name].data
                            } else _item._data = _data.options.regions[name].data;
                            else _item._data = _data.options.regions[name].data;
                    _item.selected_attr.fill = _this.isNumber(_data.options.colors.selected) ? _this.lighten(_item.default_attr.fill, parseFloat(_data.options.colors.selected)) : _data.options.colors.selected, _item.hover_attr.fill = _this.isNumber(_data.options.colors.hover) ? _this.lighten(_item.default_attr.fill, parseFloat(_data.options.colors.hover)) : _data.options.colors.hover;
                    var dash = _item.attr("stroke-dasharray");
                    dash && "none" != dash && (_item.default_attr["stroke-dasharray"] = "--"), _item.attr(_item.default_attr), _browser.ie || _browser.firefox || $(_item.node).css({
                        "vector-effect": "non-scaling-stroke"
                    }), _data.RMap.push(_item), _data.options.regions[name] && _data.options.regions[name].selected && _this.selectRegion(name)
                },
                lighten2: function(t) {
                    var a = "#" == t.charAt(0) ? t.substring(1, 7) : t,
                        e = Raphael.rgb2hsb(parseInt(a.substring(0, 2), 16), parseInt(a.substring(2, 4), 16), parseInt(a.substring(4, 6), 16));
                    return e.b += .1, Raphael.hsb(e)
                },
                lighten: function(t, a) {
                    if (!t) return !1;
                    a = .008 * parseInt(a);
                    var e = Raphael.getRGB(t),
                        o = Raphael.rgb2hsb(e.r, e.g, e.b),
                        i = o.b + a;
                    i >= 1 ? (i = 1, o.s = o.s - 1.5 * a) : 0 >= i && (i = 0);
                    var s = Raphael.hsb2rgb(o.h, o.s, i);
                    return s.hex
                },
                setPan: function(t) {
                    t ? (_data.options.pan = !0, _data.$map.on("mousedown", _this.panStart)) : (_data.options.pan && _data.$map.off("mousedown", _this.panStart), _data.options.pan = !1)
                },
                markAddClickHandler: function(t) {
                    if ($(t.target).is("image")) return !1;
                    var a = mouseCoords(t),
                        e = a.x - _data.$map.offset().left,
                        o = a.y - _data.$map.offset().top;
                    return $.isNumeric(e) && $.isNumeric(o) ? void _this.markAdd({
                        xy: [e, o]
                    }, !0) : !1
                },
                markEventHandlersSet: function(t, a) {
                    t = _this.parseBoolean(t), t ? (_data.options.editMode === !1 && a.unhover(), a.drag(_this.markMove, _this.markMoveStart, _this.markMoveEnd)) : (_data.options.editMode && a.undrag(), a.hover(function() {
                        this.data("tooltip") && (_data.mapTip.html(this.data("tooltip")), _data.mapTip.show())
                    }, function() {
                        this.data("tooltip") && _data.mapTip.hide()
                    }))
                },
                setMarksEditMode: function(t) {
                    t = _this.parseBoolean(t), _data.options.editMode = t
                },
                setZoom: function(t) {
                    if (t) {
                        if (_data.options.zoom = !0, _data.$map.bind("mousewheel.mapsvg", function(t, a) {
                                var e = a > 0 ? 1 : -1;
                                return _this.zoom(e), !1
                            }), _data.options.zoomButtons.show) {
                            var a = $("<div></div>"),
                                e = {
                                    "border-radius": "3px",
                                    display: "block",
                                    "margin-bottom": "7px"
                                },
                                o = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhElEQVR4nJWTT4rqQBDGf92pSEJWmYfgQpABb+EB1NU8DyBe5M1q5iKStTCDd/AWggElC3EQJAQxbb/NJDH+mccraEh31fdVfR8pBRBF0Uuapn+AX8CZn0MDuyAI3sfj8aeaTqcvWZZ9XFdZazmdTgC4rotS6oYpCILfkmXZ6yNwt9tFKcVyucRxnBuSNE1fNfB0TWCModlsMhwOGQwGdDod8jy/J+dJP9JsjKl9W2vvlZ3lcuyiS57ntY7FvZDgum6Zk0vN7XYbay3GGMIwLItarRbGGEQErTVxHON5XkVQAEaj0b0x6fV6tXsURRwOBxzHQd9F/CPO58o2ARARdrsds9ms9CIMQ/r9PgCLxYL1eo3rulhr2e/3dQkAnueRJElp2vF4LLskScJmsynNK8A1AqjcVUohUqVEBBGpuV+E/j63CV093/sLizIBvoDny1fHcdhut8znc5RSrFar2kQX8aV933+7ZldK0Wg0iOO4BD9YpjcF8L2R/7XOvu+/TyaTz79+UqnWsVHWHAAAAABJRU5ErkJggg==" id="btnZoomIn"/>').on("click", function(t) {
                                    t.stopPropagation(), _this.zoomIn()
                                }).css(e),
                                i = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVR4nKWTPW6DQBBG3w4RaLXSFs4puAe9fQHEReLKPgYN4gLxQei5RNytFraANNEKKwk29uum+N78SKMA2rbdO+c+gHdgYh0Bvowx57IsL6ppmr33/vNO6E+MMQfx3h+fCQM4544C7J4VADvh/s5rTG/LKoTANK37RIQ0TWMdBSEE8jwnyzLmef437L2n7/soiQLnHEVRPDR313VRIA8lVogTWGup6/pmhSRJAFBKxcAwDFhrfwuSJCGEwDiOqx2VUlF8I1h23ILw2h1EgOsLgqtorU/LI23BGHNSAD8fuemdtdbnqqou39SbTK6RdYDsAAAAAElFTkSuQmCC" id="btnZoomOut"/>').on("click", function(t) {
                                    t.stopPropagation(), _this.zoomOut()
                                }).css(e);
                            a.append(o).append(i).css({
                                position: "absolute",
                                top: "15px",
                                width: "16px",
                                cursor: "pointer"
                            }), "right" == _data.options.zoomButtons.location ? a.css({
                                right: "15px"
                            }) : "left" == _data.options.zoomButtons.location && a.css({
                                left: "15px"
                            }), _data.zoomButtons = a, _data.$map.append(_data.zoomButtons)
                        }
                    } else _data.options.zoom && _data.$map.unbind("mousewheel.mapsvg"), _data.zoomButtons && _data.zoomButtons.hide(), _data.options.zoom = !1
                },
                setSize: function(t, a, e) {
                    if (_data.options.width = parseInt(t), _data.options.height = parseInt(a), _data.options.responsive = _this.parseBoolean(e), _data.options.width || _data.options.height ? !_data.options.width && _data.options.height ? _data.options.width = parseInt(_data.options.height * _data.svgDefault.width / _data.svgDefault.height) : _data.options.width && !_data.options.height && (_data.options.height = parseInt(_data.options.width * _data.svgDefault.height / _data.svgDefault.width)) : (_data.options.width = _data.svgDefault.width, _data.options.height = _data.svgDefault.height), _data.options.responsive) {
                        var o = _data.options.width,
                            i = _data.options.height;
                        _data.options.width = _data.svgDefault.width, _data.options.height = _data.svgDefault.height
                    }
                    return _data.whRatio = _data.options.width / _data.options.height, _data.scale = _this.getScale(), _data.options.responsive ? (_data.$map.css({
                        "max-width": o + "px",
                        "max-height": i + "px",
                        width: "auto",
                        height: "auto",
                        position: "relative"
                    }).height(_data.$map.width() / _data.whRatio), $(window).bind("resize.mapsvg", function() {
                        _data.$map.height(_data.$map.width() / _data.whRatio)
                    })) : (_data.$map.css({
                        width: _data.options.width + "px",
                        height: _data.options.height + "px",
                        "max-width": "none",
                        "max-height": "none",
                        position: "relative"
                    }), $(window).unbind("resize.mapsvg")), !_data.options.responsive && _data.R && _data.R.setSize(_data.options.width, _data.options.height), [_data.options.width, _data.options.height]
                },
                setMarks: function(t) {
                    if (t) {
                        var a = [];
                        return $.each(t, function(t, e) {
                            a.push(_this.markAdd(e))
                        }), a
                    }
                },
                showTip: function() {},
                showPopover: function() {},
                hideTip: function() {
                    _data.mapTip.hide(), _data.mapTip.html("")
                },
                setTooltip: function() {
                    _data.mapTip = $('<div class="map_tooltip"></div>'), $("body").append(_data.mapTip), _data.mapTip.css({
                        "font-weight": "normal",
                        "font-size": "12px",
                        color: "#000000",
                        position: "absolute",
                        "border-radius": "4px",
                        "-moz-border-radius": "4px",
                        "-webkit-border-radius": "4px",
                        top: "0",
                        left: "0",
                        "z-index": "1000",
                        display: "none",
                        "background-color": "white",
                        border: "1px solid #eee",
                        padding: "4px 7px",
                        "max-width": "600px"
                    }), "hover" == _data.options.tooltips.show && _data.$map.mousemove(function(t) {
                        _data.mapTip.css("left", t.clientX + $(window).scrollLeft()).css("top", t.clientY + $(window).scrollTop() + 30)
                    }), _this.showTip = "custom" == _data.options.tooltipsMode ? function(t) {
                        var a = _data.R.getById(t);
                        a.tooltip && (_data.mapTip.html(a.tooltip), _data.mapTip.show())
                    } : "names" == _data.options.tooltipsMode ? function(t) {
                        var a = _data.R.getById(t);
                        return a.disabled ? !1 : (_data.mapTip.html(t.replace(/_/g, " ")), void _data.mapTip.show())
                    } : "combined" == _data.options.tooltipsMode ? function(t) {
                        var a = _data.R.getById(t);
                        if (a.tooltip) _data.mapTip.html(a.tooltip), _data.mapTip.show();
                        else {
                            if (a.disabled) return !1;
                            _data.mapTip.html(t.replace(/_/g, " ")), _data.mapTip.show()
                        }
                    } : function() {}
                },
                setPopover: function(t) {
                    if (!t) return !1;
                    $("body").prepend('<div class="map_popover"><div class="map_popover_content"></div><div class="map_popover_close">x</div></div>'), _data.mapPopover = $(".map_popover");
                    var a = _data.mapPopover.find(".map_popover_close");
                    _data.mapPopover.css({
                        "font-weight": "normal",
                        "font-size": "12px",
                        color: "#000000",
                        position: "absolute",
                        "border-radius": "4px",
                        "-moz-border-radius": "4px",
                        "-webkit-border-radius": "4px",
                        top: "0",
                        left: "0",
                        "z-index": "1000",
                        width: _data.options.popover.width + ("auto" == _data.options.popover.width ? "" : "px"),
                        height: _data.options.popover.height + ("auto" == _data.options.popover.height ? "" : "px"),
                        display: "none",
                        "background-color": "white",
                        border: "1px solid #ccc",
                        padding: "12px",
                        "-webkit-box-shadow": "5px 5px 5px 0px rgba(0, 0, 0, 0.2)",
                        "box-shadow": "5px 5px 5px 0px rgba(0, 0, 0, 0.2)"
                    }), a.css({
                        position: "absolute",
                        top: "0",
                        right: "5px",
                        cursor: "pointer",
                        color: "#aaa",
                        "z-index": "1200"
                    }), _this.showPopover = function(t, a, e) {
                        if (e && 2 == e.length) {
                            var o = _this.getScale();
                            e[0] = _data.$map.offset().left + e[0] * o, e[1] = _data.$map.offset().top + e[1] * o
                        } else var i = mouseCoords(t),
                            e = [i.x, i.y];
                        if (a) {
                            _data.mapPopover.find(".map_popover_content").html(a);
                            var s = e[0] - _data.mapPopover.outerWidth(!1) / 2,
                                r = e[1] - _data.mapPopover.outerHeight(!1) - 7;
                            0 > s && (s = 0), 0 > r && (r = 0), _data.mapPopover.css("left", s).css("top", r), _data.mapPopover.show()
                        } else _this.hidePopover()
                    }, _this.hidePopover = function() {
                        _data.mapPopover.find(".map_popover_content").html(""), _data.mapPopover.hide(0, function() {
                            $("body").off("mousedown", _this.popoverOffHandler), _data.options.onPopoverClose && _data.options.onPopoverClose.call(_this)
                        })
                    }, a.on("click", _this.hidePopover)
                },
                popoverOffHandler: function(t) {
                    var a = $(t.target).attr("id");
                    return $(t.target).closest(".map_popover").length || _data.options.regions[a] && !_data.options.regions[a].disabled ? !1 : void _this.hidePopover()
                },
                isNumber: function(t) {
                    return !isNaN(parseFloat(t)) && isFinite(t)
                },
                parseBoolean: function(t) {
                    switch (String(t).toLowerCase()) {
                        case "true":
                        case "1":
                        case "yes":
                        case "y":
                            return !0;
                        case "false":
                        case "0":
                        case "no":
                        case "n":
                            return !1;
                        default:
                            return void 0
                    }
                },
                mouseOverHandler: function() {},
                mouseOutHandler: function() {},
                mouseDownHandler: function() {},
                init: function(t, a) {
                    if (!t.source) return alert("mapSVG Error: Please provide a map URL"), !1;
                    t.beforeLoad && t.beforeLoad.call(_this), (0 == t.source.indexOf("http://") || 0 == t.source.indexOf("https://")) && (t.source = "//" + t.source.split("://").pop()), t.pan = _this.parseBoolean(t.pan), t.zoom = _this.parseBoolean(t.zoom), t.responsive = _this.parseBoolean(t.responsive), t.disableAll = _this.parseBoolean(t.disableAll), t.multiSelect = _this.parseBoolean(t.multiSelect), t.viewBox && "string" == typeof t.viewBox && (t.viewBoxFind = t.viewBox, delete t.viewBox), _data = {}, _data.options = $.extend(!0, {}, defaults, t), _data.map = a, _data.$map = $(a), _data.whRatio = 0, _data.isPanning = !1, _data.markOptions = {}, _data.svgDefault = {}, _data.mouseDownHandler, _data.refLength = 0, _data.scale = 1, _data._scale = 1, _data.selected_id = _data.options.multiSelect ? [] : 0, _data.mapData = {}, _data.marks = [], _data._viewBox = [], _data.viewBox = [], _data.viewBoxZoom = [], _data.viewBoxFind = void 0, _data.zoomLevel = 0, _data.pan = {}, _data.zoom, _data.touchZoomStart, _data.touchZoomStartViewBox, _data.touchZoomEnd, _data.$map.css({
                        background: _data.options.colors.background,
                        height: "100px",
                        position: "relative"
                    });
                    var e = $("<div>" + _data.options.loadingText + "</div>").css({
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        "z-index": 1,
                        padding: "7px 10px",
                        "border-radius": "5px",
                        "-webkit-border-radius": "5px",
                        "-moz-border-radius": "5px",
                        "-ms-border-radius": "5px",
                        "-o-border-radius": "5px",
                        border: "1px solid #ccc",
                        background: "#f5f5f2",
                        color: "#999"
                    });
                    return _data.$map.append(e), e.css({
                        "margin-left": function() {
                            return -($(this).outerWidth(!1) / 2) + "px"
                        },
                        "margin-top": function() {
                            return -($(this).outerHeight(!1) / 2) + "px"
                        }
                    }), $.ajax({
                        async: !0,
                        cache: !0,
                        url: _data.options.source,
                        success: function(t) {
                            $data = $(t);
                            var a = $data.find("svg");
                            _data.svgDefault.width = parseFloat(a.attr("width").replace(/px/g, "")), _data.svgDefault.height = parseFloat(a.attr("height").replace(/px/g, "")), _data.svgDefault.viewBox = a.attr("viewBox") ? a.attr("viewBox").split(" ") : [0, 0, _data.svgDefault.width, _data.svgDefault.height], $.each(_data.svgDefault.viewBox, function(t, a) {
                                _data.svgDefault.viewBox[t] = parseInt(a)
                            }), _data._viewBox = 4 == _data.options.viewBox.length ? _data.options.viewBox : _data.svgDefault.viewBox, $.each(_data._viewBox, function(t, a) {
                                _data._viewBox[t] = parseInt(a)
                            }), _this.setSize(_data.options.width, _data.options.height, _data.options.responsive), _browser.ie && _browser.ie.old ? (_data.R = Raphael(_data.$map.attr("id"), _data.options.width, _data.options.height), _data.scale = _this.getScale(), _data.options.responsive && $(window).on("resize", _this.fluidResize)) : (_data.R = Raphael(_data.$map.attr("id"), "100%", "100%"), _data.options.responsive && $(window).on("resize", function() {
                                _data.scale = _this.getScale(), _this.marksAdjustPosition()
                            })), _data.options.panBackground && (_data.background = _data.R.rect(_data.svgDefault.viewBox[0], _data.svgDefault.viewBox[1], _data.svgDefault.viewBox[2], _data.svgDefault.viewBox[3]).attr({
                                fill: _data.options.colors.background
                            })), _data.RMap = _data.R.set(), _data.RMarks = _data.R.set();
                            var o = function(t, a, e) {
                                    var o = $(t).get(0).tagName;
                                    switch (o) {
                                        case "path":
                                            _this.renderSVGPath(t, a, e);
                                            break;
                                        case "polygon":
                                            _this.renderSVGPolygon(t, a, e);
                                            break;
                                        case "polyline":
                                            _this.renderSVGPolyline(t, a, e);
                                            break;
                                        case "circle":
                                            _this.renderSVGCircle(t, a, e);
                                            break;
                                        case "ellipse":
                                            _this.renderSVGEllipse(t, a, e);
                                            break;
                                        case "rect":
                                            _this.renderSVGRect(t, a, e);
                                            break;
                                        case "image":
                                            _this.renderSVGImage(t, a, e);
                                            break;
                                        case "text":
                                            _this.renderSVGText(t, a, e)
                                    }
                                },
                                i = function n(t, a, e) {
                                    var i = $(t).children();
                                    if (i.length) {
                                        a = a || "", a = _this.transformSVG2Raphael(t) + a, e = e || {}, $(t).children().each(function(t, o) {
                                            var i = _this.styleSVG2Raphael(o, e);
                                            n($(o), a, i)
                                        })
                                    }
                                    o($(t), a, e)
                                };
                            i($data.find("svg"));
                            var s = _data.options.viewBoxFind || _data._viewBox;
                            _this.setViewBox(s), _this.setMarks(_data.options.marks), _this.setMarksEditMode(_data.options.editMode), _this.setPan(_data.options.pan), _this.setZoom(_data.options.zoom), _this.setTooltip(_data.options.tooltips.mode), _this.setPopover(_data.options.popover), _data.options.responsive && _browser.ie && _browser.ie.old && _this.fluidResize(), (_browser.ie && !_browser.ie.old || _browser.firefox) && _this.mapAdjustStrokes();
                            var r = "";
                            touchDevice || (r = "methods.highlightRegion(this.name);", "hover" == _data.options.tooltips.show && (r += "methods.showTip(this.name);"), _data.options.mouseOver && (r += "return options.mouseOver.call(this, e, methods);"), _this.mouseOverHandler = new Function("e, methods, options", r), r = "", r += "methods.unhighlightRegion(this.name);", "hover" == _data.options.tooltips.show && (r += "methods.hideTip();"), _data.options.mouseOut && (r += "return options.mouseOut.call(this, e, methods);"), _this.mouseOutHandler = new Function("e, methods, options", r)), r = "", r = "methods.regionClickHandler.call(mapObj, e, this);", _this.mouseDownHandler = new Function("e, methods", r), touchDevice || _data.RMap.mouseover(function(t) {
                                _this.mouseOverHandler.call(this, t, _this, options)
                            }).mouseout(function(t) {
                                _this.mouseOutHandler.call(this, t, _this, options)
                            }), _data.options.pan ? touchDevice ? (_data.RMap.touchstart(function(t) {
                                _this.panRegionClickHandler.call(_this, t, this)
                            }), _data.R.canvas.addEventListener("touchstart", function(t) {
                                _this.touchStart(t)
                            }, !1), _data.R.canvas.addEventListener("touchmove", function(t) {
                                _this.touchMove(t)
                            }, !1), _data.R.canvas.addEventListener("touchend", function(t) {
                                _this.touchEnd(t)
                            }, !1)) : _data.RMap.mousedown(function(t) {
                                t.preventDefault(), _this.panRegionClickHandler.call(_this, t, this)
                            }) : touchDevice ? _data.RMap.touchstart(function(t) {
                                t.preventDefault(), _this.regionClickHandler.call(_this, t, this)
                            }) : _data.RMap.mousedown(function(t) {
                                _this.regionClickHandler.call(_this, t, this)
                            }), e.hide(), _data.options.afterLoad && _data.options.afterLoad.call(_this)
                        }
                    }), _this
                }
            };
            var _this = this.methods
        };
    $.fn.mapSvg = function(t) {
        var a = $(this).attr("id");
        return "object" == typeof t && void 0 === instances[a] ? (instances[a] = new mapSVG(this, t), instances[a].methods.init(t, this)) : instances[a] ? instances[a].methods : $(this)
    }
}(jQuery);