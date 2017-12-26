let ajax = function({
    url,
    method = 'GET',
    data = {}
}) {
    return new Promise(function(resolve, reject) {
        let xml = new XMLHttpRequest();
        xml.open(method, url, true);
        xml.onreadystatechange = function() {
            if (xml.readyState == 4) {
                if (xml.status == 200) {
                    resolve(xml.responseText)
                } else {
                    reject(xml.responseText)
                }
            }
        }
        xml.send(data)
    })
}

function $(obj) {
    return document.querySelector(obj)
}

function a(obj) {
    return document.querySelectorAll(obj)
}

// 监听数据变化
function watch(obj, prop, value, fn) {
    Object.defineProperty(obj, prop, {
        enumerable: true,
        configurable: true,
        get: function getter() {
            return value
        },
        set: function setter(newVal) {
            if (newVal != value) {
                value = newVal
                fn ? fn(value) : null;
            }
        }
    })
}

// 
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return Number.parseInt(obj.currentStyle[attr]); //for ie   
    } else {
        return Number.parseInt(getComputedStyle(obj, false)[attr]); // for ff  
    }
}

// 点击事件

function _click(objs, type, fn) {
    for (i of[...objs]) {
        i.addEventListener(type, function() {
            fn(this)
        })
    }
}

//class 操作
function classAction(option) {
    let obj = option.obj;
    let cla = option.class;
    obj.classList.toggle(cla);
    obj.innerText = option.text;
    setTimeout(() => {
        obj.classList.toggle(cla);
    }, 1000)
}