import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';
import LocomotiveScroll from 'locomotive-scroll';

const app = new modular({
    modules: modules
});

window.onload = (event) => {
    const $style = document.getElementById('main-css');

    if ($style) {
        if ($style.isLoaded) {
            init();
        } else {
            $style.addEventListener('load', (event) => {
                init();
            });
        }
    } else {
        console.warn('The "main-css" stylesheet not found');
    }


    (function() {
    document.documentElement.classList.add('is-loaded');
    document.documentElement.classList.remove('is-loading');

    setTimeout(() => {
        document.documentElement.classList.add('is-ready');
    },300)

    let options = {
        el: document.querySelector('#js-scroll'),
        smooth: true,
        getSpeed: true,
        getDirection: true
    }

    if(document.querySelector('#js-scroll').getAttribute('data-horizontal') == 'true') {
        options.direction = 'horizontal';
        options.gestureDirection = 'both';
        options.tablet = {
            smooth: true,
            direction: 'horizontal',
            horizontalGesture: true
        }
        options.smartphone = {
            smooth: false
        }
        options.reloadOnContextChange = true
    }

    setTimeout(() => {
        const scroll = new LocomotiveScroll(options);

        let dynamicBackgrounds = [];
        let dynamicColorElements = [];

        scroll.on('scroll', (instance) => {
            const progress = 360 * instance.scroll.y / instance.limit.y;

            scroll.el.style.backgroundColor = `hsl(${progress}, 11%, 81%)`;

            dynamicBackgrounds.forEach(obj => {
                obj.el.style.backgroundColor = `hsl(${progress}, 11%, 81%)`;
            });
            dynamicColorElements.forEach(obj => {
                obj.el.style.color = `hsl(${progress}, 11%, 81%)`;
            });

            document.documentElement.setAttribute('data-direction', instance.direction)

        });

        scroll.on('call', (value, way, obj) => {
            if (value === 'dynamicBackground') {
                if(way === 'enter') {
                    dynamicBackgrounds.push({
                        id: obj.id,
                        el: obj.el
                    });
                } else {
                    for (var i = 0; i < dynamicBackgrounds.length; i++) {
                        if(obj.id === dynamicBackgrounds[i].id) {
                            dynamicBackgrounds.splice(i,1);
                        }
                    }
                }
            } else if (value === 'dynamicColor') {
                if(way === 'enter') {
                    dynamicColorElements.push({
                        id: obj.id,
                        el: obj.el
                    });
                } else {
                    for (var i = 0; i < dynamicColorElements.length; i++) {
                        if(obj.id === dynamicColorElements[i].id) {
                            dynamicColorElements.splice(i,1);
                        }
                    }
                }
            }
        });

    }, 1000)

})(); 

};

function init() {
    globals();

    app.init(app);

    html.classList.add('is-loaded');
    html.classList.add('is-ready');
    html.classList.remove('is-loading');
}

