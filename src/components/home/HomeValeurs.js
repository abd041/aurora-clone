'use client';

import { useEffect, useRef } from 'react';
import HomeTitle from '@/components/home/HomeTitle';
import useIsMobile from '@/hooks/useIsMobile';
import { sharedUi } from '@/data/content';

const PHYSICS_ITEMS = [
  { src: '/images/physics/1.png', sizePercent: 20 },
  { src: '/images/physics/2.png', sizePercent: 15 },
  { src: '/images/physics/3.png', sizePercent: 8 },
  { src: '/images/physics/4.png', sizePercent: 20 },
  { src: '/images/physics/5.png', sizePercent: 7 },
  { src: '/images/physics/6.png', sizePercent: 6 },
  { src: '/images/physics/7.png', sizePercent: 25 },
  { src: '/images/physics/8.png', sizePercent: 9 },
  { src: '/images/physics/9.png', sizePercent: 6 },
];

export default function HomeValeurs() {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let started = false;
    let observer;
    let Matter;
    let engine;
    let render;
    let runner;
    let walls;
    let resizeHandler;

    const cleanup = () => {
      observer?.disconnect();
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (Matter && render) {
        Matter.Render.stop(render);
        render.canvas?.remove();
      }
      if (Matter && runner) Matter.Runner.stop(runner);
      if (Matter && engine) {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
    };

    const initPhysics = async () => {
      Matter = (await import('matter-js')).default;
      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Events, Body } =
        Matter;

      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      engine = Engine.create();
      render = Render.create({
        element: container,
        engine,
        options: {
          width,
          height,
          wireframes: false,
          background: 'transparent',
          pixelRatio: window.devicePixelRatio,
        },
      });

      const bodies = [];

      await Promise.all(
        PHYSICS_ITEMS.map(
          (item, index) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                const x = (width / (PHYSICS_ITEMS.length + 1)) * (index + 1);
                const y = -100 - index * 60;
                const targetWidth = (width * item.sizePercent) / 100;
                const scale = targetWidth / img.width;
                const w = targetWidth;
                const h = img.height * scale;

                bodies.push(
                  Bodies.rectangle(x, y, w, h, {
                    restitution: 0.6,
                    friction: 0.1,
                    density: 0.001,
                    render: {
                      sprite: {
                        texture: item.src,
                        xScale: scale,
                        yScale: scale,
                      },
                    },
                  })
                );
                resolve();
              };
              img.onerror = () => resolve();
              img.src = item.src;
            })
        )
      );

      World.add(engine.world, bodies);

      const wallThickness = 50;
      walls = [
        Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
          isStatic: true,
          render: { visible: false },
        }),
        Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
          isStatic: true,
          render: { visible: false },
        }),
        Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
          isStatic: true,
          render: { visible: false },
        }),
      ];
      World.add(engine.world, walls);

      if (!isMobile) {
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.3,
            angularStiffness: 0,
            damping: 0.5,
            render: { visible: false },
          },
        });
        World.add(engine.world, mouseConstraint);
        render.mouse = mouse;
      }

      render.canvas.style.touchAction = 'pan-y';
      render.canvas.style.userSelect = 'none';
      render.canvas.style.webkitUserSelect = 'none';

      Events.on(engine, 'beforeUpdate', () => {
        engine.world.bodies.forEach((body) => {
          if (!body.isStatic) {
            const speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
            if (speed > 25) {
              const factor = 25 / speed;
              Body.setVelocity(body, {
                x: body.velocity.x * factor,
                y: body.velocity.y * factor,
              });
            }
            const maxAngular = 0.3;
            if (Math.abs(body.angularVelocity) > maxAngular) {
              Body.setAngularVelocity(body, Math.sign(body.angularVelocity) * maxAngular);
            }
          }
        });
      });

      if (!isMobile) {
        resizeHandler = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          render.canvas.width = w;
          render.canvas.height = h;
          render.options.width = w;
          render.options.height = h;
          render.bounds.max.x = w;
          render.bounds.max.y = h;
          Body.setPosition(walls[0], { x: w / 2, y: h + wallThickness / 2 });
          Body.setPosition(walls[1], { x: -wallThickness / 2, y: h / 2 });
          Body.setPosition(walls[2], { x: w + wallThickness / 2, y: h / 2 });
          Body.setVertices(
            walls[0],
            Bodies.rectangle(w / 2, h + wallThickness / 2, w, wallThickness).vertices
          );
          Body.setVertices(
            walls[1],
            Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h).vertices
          );
          Body.setVertices(
            walls[2],
            Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h).vertices
          );
        };
        window.addEventListener('resize', resizeHandler);
      }

      runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            observer.disconnect();
            initPhysics();
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px 0px -100px 0px' }
    );

    if (rootRef.current) observer.observe(rootRef.current);

    return cleanup;
  }, [isMobile]);

  return (
    <section className="home-valeurs" ref={rootRef}>
      <div className="valeurs-grid">
        <div className="valeurs-text">
          <HomeTitle tag="h2" className="valeurs-title" delay={0.5}>
            <span dangerouslySetInnerHTML={{ __html: sharedUi.valeursTitle }} />
          </HomeTitle>
          <p className="valeurs-desc">{sharedUi.valeursDesc}</p>
        </div>
        <div className="valeurs-container" ref={containerRef} />
      </div>
    </section>
  );
}
