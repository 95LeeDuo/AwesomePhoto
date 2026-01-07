const BALLS = Array.from({ length: 100 }, (_, i) => {
  const size = Math.random() * 100 + 30;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * -8;
  const hue = Math.random() * 80 + 220;
  const moveX = Math.random() * 400 - 200;
  const moveY = Math.random() * 400 - 200;

  return {
    id: i,
    size,
    left,
    top,
    duration,
    delay,
    hue,
    moveX,
    moveY,
  };
});

const BackgroundBalls = () => {
  return (
    <section className="absolute inset-0 overflow-hidden pointer-events-none">
      {BALLS.map((ball) => (
        <div
          key={ball.id}
          className="absolute rounded-full blur-lg animate-ball-float"
          style={
            {
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              left: `${ball.left}%`,
              top: `${ball.top}%`,
              background: `radial-gradient(circle, hsl(${ball.hue}, 80%, 65%, 0.25), transparent 70%)`,
              animationDuration: `${ball.duration}s`,
              animationDelay: `${ball.delay}s`,
              "--move-x": `${ball.moveX}px`,
              "--move-y": `${ball.moveY}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </section>
  );
};

export default BackgroundBalls;
