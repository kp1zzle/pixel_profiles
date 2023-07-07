import p5 from 'p5'
import p5Svg from "p5.js-svg"
import Matter from 'matter-js'

p5Svg(p5);

let CANVAS_WIDTH = window.innerWidth
let CANVAS_HEIGHT = window.innerHeight
const COLORS = [
    [248,145,3],
    [255,237,2],
    [255,5,5],
    [255,52,203],
    [76,17,48]
]
const NUM_LINES = 100
let checkeredBg = false
let img
let objects = []

let sketch = (s) => {


    s.setup = () => {
        s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
        s.angleMode(s.RADIANS)
        // Set up physics
        s.engine = Matter.Engine.create()

        s.floorPlane = Matter.Bodies.rectangle(CANVAS_WIDTH/2, CANVAS_HEIGHT, CANVAS_WIDTH, 5, {
            isStatic: true,
            friction: 0.5,
        })
        s.leftPlane = Matter.Bodies.rectangle(CANVAS_WIDTH, CANVAS_HEIGHT/2, 5, CANVAS_HEIGHT, {
            isStatic: true,
            friction: 0.2,
        })
        s.rightPlane = Matter.Bodies.rectangle(0, CANVAS_HEIGHT/2, 5, CANVAS_HEIGHT, {
            isStatic: true,
            friction: 0.2,
        })

        Matter.Composite.add(s.engine.world, [
            s.floorPlane,
            s.leftPlane,
            s.rightPlane,
        ])

        objects = [
            new Computer(s.engine.world, CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
        ]


        // Uncomment to debug physics
        var render = Matter.Render.create({
            element: document.body,
            engine: s.engine,
            options: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                showVelocity: true
            }
        });
        Matter.Render.run(render);
    }

    s.draw = () => {
        // s.noLoop()
        Matter.Engine.update(s.engine, 1000 / 60);

        s.background('#000000');
        if (checkeredBg){
            // // Checkered background
            // s.background('#9899CC');
            let pxWidth = 10
            s.noStroke()
            s.fill('#8384b6')
            for (let i = 0; i < CANVAS_WIDTH/pxWidth; i++) {
                for (let j = 0; j < CANVAS_HEIGHT/pxWidth; j++) {
                    s.fill(s.lerpColor(
                        s.color('#7e9dad'),
                        s.color('#063C20'),
                        i/(CANVAS_WIDTH/pxWidth),
                    ))
                    if ((i%2 === 0 && j%2 !== 0) || (i%2 !== 0 && j%2 === 0)) {
                        s.rect(i * pxWidth, j*pxWidth, pxWidth, pxWidth)
                    }
                }
            }
        }


        for (let object of objects) {
            object.draw(s)
        }

        s.noFill()
        s.stroke('#000000')
        // s.circle(CANVAS_WIDTH/2, CANVAS_WIDTH/2, CANVAS_WIDTH)


    }

    s.keyPressed = () => {
        if (s.key === 's') {
            s.export()
        }
        if (s.key === 'b') {
            checkeredBg = !checkeredBg
        }
    }

    s.export = () => {
        let filename = (new Date).toISOString()
        s.save(filename.concat(".png"))
        // s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, s.SVG)
        // s.draw()
        // s.save(filename.concat(".svg"))
        // s.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
        // s.draw()
    }
}

class Computer {
   constructor(world, x, y) {
       this.world = world
       this.screenPhysicsBox = Matter.Bodies.rectangle(x, y, 350, 260, {
           restitution: 2,
           density: 1,
       })
       this.computerPhysicsBox = Matter.Bodies.rectangle(x, y+260+1, 400, 90, {
           restitution: 2,
           density: 1,
       })
       Matter.Composite.add(this.world, [
           this.screenPhysicsBox,
           this.computerPhysicsBox,
       ])
   }

   draw = (s) => {
       s.push()
       s.rotate(this.screenPhysicsBox.angle)
       this.drawScreen(s, this.screenPhysicsBox.position.x - 350/2, this.screenPhysicsBox.position.y - 260/2)
       s.pop()
       s.push()
       s.rotate(this.computerPhysicsBox.angle)
       this.drawComputer(s, this.computerPhysicsBox.position.x - 400/2, this.computerPhysicsBox.position.y - 90/2, 400, 90)
       s.pop()
   }

    drawScreen = (s, x, y) => {
        s.push()
        s.translate(x, y)
        s.stroke('#000000')
        s.fill('#E8E3DF')
        s.rect(0, 0, 350, 260, 5)
        s.fill('#000000')
        s.rect(40, 25, 270, 210, 0)
        this.fillScreen(s,50, 35, 250, 190,)
        s.pop()
    }

    fillScreen = (s, x, y, w, h) => {
        s.push()
        s.translate(x, y)
        // s.image(img, 70, 60, 210 140)
        let pg = s.createGraphics(w, h)
        // pg.image(img, -20, 0)
        pg.noFill()
        pg.translate(61, 0)
        for (let i = 0; i < NUM_LINES; i++) {
            // s.stroke(COLORS[i % 5])
            pg.stroke(s.lerpColor(
                s.color('#fd9200'),
                s.color('#bc43ff'),
                i/NUM_LINES,
            ))
            pg.strokeWeight(0.5 **s.sin(0.2*i + 4) + 0.3)
            pg.beginShape();
            pg.vertex(0,0)
            pg.vertex(0,0)
            pg.curveVertex(3+0.1*i,0.3*h)
            pg.curveVertex(40-(NUM_LINES - i),0.6*h)
            // curveVertex(-5*i,500-i)
            // curveVertex(100-2*i,1000-i)
            pg.vertex(0,h)
            pg.vertex(0,h)
            pg.endShape();
            pg.translate(1.5, 0)
        }
        s.image(pg, 0, 0,)

        s.pop()
    }

    drawComputer = (s, x, y, w, h) => {
        s.push()
        s.translate(x, y)
        s.stroke('#000000')
        s.fill('#E8E3DF')
        s.rect(0, 0, w, h, 5)
        // CD drive
        s.rect(0.05*w, 0.2*h, 0.3*w, 0.2*h)
        // Plastic markings
        s.rect(0, 0.9*h, w, 0.05*h)
        s.rect(0, 0.8*h, 0.35*w, 0.05*h)
        s.rect(0, 0.7*h, 0.3*w, 0.05*h)
        // power button
        s.rect(w-0.13*w, 0.55*h, 0.03*w, 0.03*w)
        // floppy
        s.fill('#000000')
        s.rect(w - 0.32*w, 0.4*h, 0.22*w, 0.065*h)
        // lights
        s.fill('#b60000')
        s.rect(0.8*w, 0.55*h, 0.015*w, 0.015*w)
        s.fill('#00b624')
        s.rect(0.8*w, 0.65*h, 0.015*w, 0.015*w)
        s.fill('#b69e00')
        s.rect(0.825*w, 0.55*h, 0.015*w, 0.015*w)

        s.pop()
    }
}

const P5 = new p5(sketch);